/**
 * blueprintFile 純函式測試（W1109-Z1）
 *
 * 覆蓋：
 *   - round-trip（序列化再解析得到等值 LayoutSnapshot）
 *   - round-trip 帶 planId
 *   - version 1 被拒絕（專用提示）
 *   - version 3（未知版本）被拒絕
 *   - 缺 version 被拒絕
 *   - 缺 devices 被拒絕
 *   - devices 內元素缺 machineType 被拒絕
 *   - rotation 為 5（不合法）被拒絕
 *   - waypoints 只有 1 點被拒絕
 *   - media 為不合法值被拒絕
 *   - 完全不是物件（null / string / number）被拒絕
 */

import { describe, it, expect } from 'vitest';
import { serializeBlueprint, parseBlueprint } from '@/utils/layout/blueprintFile';
import type { LayoutSnapshot } from '@/types/layout';

// ─── fixture ──────────────────────────────────────────────────────────────────

const minimalSnapshot: LayoutSnapshot = {
    devices: [
        {
            id: 'dev-1',
            machineType: 'splitter',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
        },
    ],
    pipelines: [
        {
            id: 'pipe-1',
            media: 'belt',
            waypoints: [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
            ],
        },
    ],
};

const fullSnapshot: LayoutSnapshot = {
    devices: [
        {
            id: 'dev-full',
            machineType: 'shaping_machine',
            position: { x: 3, y: 4, z: 0 },
            rotation: 2,
            machineMode: 'gas_mode',
            label: '塑形機 A',
            recipeIndex: 1,
            environment: 'hot',
            primaryOutput: '銅錠',
            sourceRatePerMin: 60,
        },
    ],
    pipelines: [
        {
            id: 'pipe-full',
            media: 'pipe',
            waypoints: [
                { x: 3, y: 5, z: 1 },
                { x: 5, y: 5, z: 1 },
                { x: 5, y: 8, z: 1 },
            ],
        },
    ],
};

const emptySnapshot: LayoutSnapshot = {
    devices: [],
    pipelines: [],
};

// ─── round-trip ───────────────────────────────────────────────────────────────

describe('serializeBlueprint + parseBlueprint — round-trip', () => {
    it('最小 snapshot：序列化再解析等值', () => {
        const file = serializeBlueprint(minimalSnapshot);
        const result = parseBlueprint(file);

        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(result.snapshot).toEqual(minimalSnapshot);
    });

    it('完整欄位 snapshot：round-trip 保留所有選擇性欄位', () => {
        const file = serializeBlueprint(fullSnapshot);
        const result = parseBlueprint(file);

        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(result.snapshot).toEqual(fullSnapshot);
    });

    it('空 snapshot（無設備無管線）：round-trip 通過', () => {
        const file = serializeBlueprint(emptySnapshot);
        const result = parseBlueprint(file);

        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(result.snapshot).toEqual(emptySnapshot);
    });

    it('帶 planId 的 round-trip', () => {
        const planId = 'plan-uuid-123';
        const file = serializeBlueprint(minimalSnapshot, planId);
        const result = parseBlueprint(file);

        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(result.planId).toBe(planId);
        expect(result.snapshot).toEqual(minimalSnapshot);
    });

    it('不帶 planId 時結果也無 planId', () => {
        const file = serializeBlueprint(minimalSnapshot);
        const result = parseBlueprint(file);

        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(result).not.toHaveProperty('planId');
    });
});

// ─── serializeBlueprint ───────────────────────────────────────────────────────

describe('serializeBlueprint', () => {
    it('輸出包含 version: 2', () => {
        const file = serializeBlueprint(minimalSnapshot);
        expect(file.version).toBe(2);
    });

    it('不帶 planId 時 JSON 中無此 key', () => {
        const file = serializeBlueprint(minimalSnapshot);
        expect('planId' in file).toBe(false);
    });

    it('帶 planId 時 JSON 中有此 key', () => {
        const file = serializeBlueprint(minimalSnapshot, 'my-plan');
        expect(file.planId).toBe('my-plan');
    });
});

// ─── parseBlueprint — 拒絕 ───────────────────────────────────────────────────

describe('parseBlueprint — 版本拒絕', () => {
    it('version 1 → 專用提示文字', () => {
        const result = parseBlueprint({ version: 1, devices: [], pipelines: [] });

        expect(result.ok).toBe(false);
        if (result.ok) return;
        expect(result.error).toContain('舊版');
        expect(result.error).toContain('version 1');
    });

    it('version 3（未知版本）→ 拒絕', () => {
        const result = parseBlueprint({ version: 3, devices: [], pipelines: [] });

        expect(result.ok).toBe(false);
    });

    it('缺 version → 拒絕', () => {
        const result = parseBlueprint({ devices: [], pipelines: [] });

        expect(result.ok).toBe(false);
    });
});

describe('parseBlueprint — 欄位缺失或型別錯誤', () => {
    it('缺 devices → 拒絕', () => {
        const result = parseBlueprint({ version: 2, pipelines: [] });

        expect(result.ok).toBe(false);
    });

    it('缺 pipelines → 拒絕', () => {
        const result = parseBlueprint({ version: 2, devices: [] });

        expect(result.ok).toBe(false);
    });

    it('devices 元素缺 machineType → 拒絕', () => {
        const result = parseBlueprint({
            version: 2,
            devices: [{ id: 'd1', position: { x: 0, y: 0, z: 0 }, rotation: 0 }],
            pipelines: [],
        });

        expect(result.ok).toBe(false);
    });

    it('devices 元素 id 為空字串 → 拒絕', () => {
        const result = parseBlueprint({
            version: 2,
            devices: [
                { id: '', machineType: 'splitter', position: { x: 0, y: 0, z: 0 }, rotation: 0 },
            ],
            pipelines: [],
        });

        expect(result.ok).toBe(false);
    });

    it('rotation 為 5（不合法值）→ 拒絕', () => {
        const result = parseBlueprint({
            version: 2,
            devices: [
                {
                    id: 'd1',
                    machineType: 'splitter',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: 5,
                },
            ],
            pipelines: [],
        });

        expect(result.ok).toBe(false);
    });

    it('waypoints 只有 1 點 → 拒絕', () => {
        const result = parseBlueprint({
            version: 2,
            devices: [],
            pipelines: [{ id: 'p1', media: 'belt', waypoints: [{ x: 0, y: 0, z: 0 }] }],
        });

        expect(result.ok).toBe(false);
    });

    it('media 為 "steam"（不合法值）→ 拒絕', () => {
        const result = parseBlueprint({
            version: 2,
            devices: [],
            pipelines: [
                {
                    id: 'p1',
                    media: 'steam',
                    waypoints: [
                        { x: 0, y: 0, z: 0 },
                        { x: 1, y: 0, z: 0 },
                    ],
                },
            ],
        });

        expect(result.ok).toBe(false);
    });
});

describe('parseBlueprint — 完全不是物件', () => {
    it.each([null, undefined, 42, 'hello', true, [1, 2, 3]])(
        '輸入 %j → 拒絕',
        (input) => {
            const result = parseBlueprint(input);
            expect(result.ok).toBe(false);
        },
    );
});
