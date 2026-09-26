/**
 * V14-C1 — placementCheck 單元測試（W0921-A0）
 *
 * 釘：空地可放／重疊含 DRAFT_ID／未知機型／非有限座標／移動原位可放。
 * `layoutStore.test.ts` 不得為此改動。
 */

import { describe, it, expect } from 'vitest';
import type { PlacedDevice } from '@/types/layout';
import { DRAFT_ID, canMoveDevice, canPlaceDevice } from '@/utils/layout/placementCheck';

function makeSplitter(id: string, x: number, y: number): PlacedDevice {
    return {
        id,
        machineType: 'splitter',
        position: { x, y, z: 0 },
        rotation: 0,
        label: id,
    };
}

describe('placementCheck — canPlaceDevice', () => {
    it('空地可放 → ok:true', () => {
        const result = canPlaceDevice(
            { machineType: 'splitter', position: { x: 0, y: 0, z: 0 }, rotation: 0 },
            { devices: [], pipelines: [] },
        );
        expect(result).toEqual({ ok: true });
    });

    it('重疊拒絕且 conflicts 含 DRAFT_ID', () => {
        const result = canPlaceDevice(
            { machineType: 'splitter', position: { x: 0, y: 0, z: 0 }, rotation: 0 },
            { devices: [makeSplitter('a', 0, 0)], pipelines: [] },
        );

        expect(result.ok).toBe(false);
        if (result.ok) return;
        expect(result.reason).toBe('overlap');
        if (result.reason === 'overlap') {
            expect(result.conflicts.some(([x, y]) => x === DRAFT_ID || y === DRAFT_ID)).toBe(true);
            expect(result.conflicts.some(([x, y]) => x === 'a' || y === 'a')).toBe(true);
        }
        expect(DRAFT_ID).toBe('__draft__');
    });

    it('未知機型 → invalid', () => {
        expect(
            canPlaceDevice(
                {
                    machineType: 'not_a_real_machine_zzz',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: 0,
                },
                { devices: [], pipelines: [] },
            ),
        ).toEqual({ ok: false, reason: 'invalid', invalidIds: [DRAFT_ID] });
    });

    it('非有限座標 → invalid', () => {
        expect(
            canPlaceDevice(
                {
                    machineType: 'splitter',
                    position: { x: Number.NaN, y: 0, z: 0 },
                    rotation: 0,
                },
                { devices: [], pipelines: [] },
            ),
        ).toEqual({ ok: false, reason: 'invalid', invalidIds: [DRAFT_ID] });
    });
});

describe('placementCheck — canMoveDevice', () => {
    it('移動到自己原位可放', () => {
        const device = makeSplitter('a', 2, 3);
        const result = canMoveDevice(
            'a',
            { x: 2, y: 3, z: 0 },
            {
                devices: [device],
                pipelines: [],
            },
        );
        expect(result).toEqual({ ok: true });
    });

    it('找不到 uid → invalid', () => {
        expect(
            canMoveDevice('missing', { x: 0, y: 0, z: 0 }, { devices: [], pipelines: [] }),
        ).toEqual({ ok: false, reason: 'invalid', invalidIds: ['missing'] });
    });
});
