import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useHistoryStore } from '@/store/historyStore';
import { useLayoutStore } from '@/store/layoutStore';
import { getMockLayoutScenario, toLayoutSnapshot } from '@/data/mockLayout';
import type { PlacedDevice } from '@/types/layout';
import { canPlaceDevice, DRAFT_ID } from '@/utils/layout/placementCheck';

/**
 * 建立使用真實機器定義的測試設備。
 *
 * @param id 設備實例 id
 * @param x 水平格點
 * @returns 可交給 layoutStore 的設備
 */
function makeSplitter(id: string, x: number): PlacedDevice {
    return {
        id,
        machineType: 'splitter',
        position: { x, y: 0, z: 0 },
        rotation: 0,
    };
}

describe('canPlaceDevice', () => {
    beforeEach(() => setActivePinia(createPinia()));

    it('預檢不寫入 store 或 history，空格可放', () => {
        const layout = useLayoutStore();
        const history = useHistoryStore();
        const result = canPlaceDevice(
            { machineType: 'splitter', position: { x: 0, y: 0, z: 0 }, rotation: 0 },
            { devices: layout.devices, pipelines: layout.pipelines },
        );

        expect(result).toEqual({ ok: true });
        expect(layout.devices).toHaveLength(0);
        expect(history.undoDepth).toBe(0);
    });

    it('重疊時以保留 id 回報新設備，且與 addDevice 一致', () => {
        const layout = useLayoutStore();
        const history = useHistoryStore();
        expect(layout.addDevice(makeSplitter('existing', 0))).toEqual({ ok: true });
        const beforeDepth = history.undoDepth;

        const result = canPlaceDevice(
            { machineType: 'splitter', position: { x: 0, y: 0, z: 0 }, rotation: 0 },
            { devices: layout.devices, pipelines: layout.pipelines },
        );
        expect(result.ok).toBe(false);
        if (result.ok || result.reason !== 'overlap') return;
        expect(result.conflicts).toContainEqual(['existing', DRAFT_ID]);
        expect(history.undoDepth).toBe(beforeDepth);

        const added = layout.addDevice(makeSplitter('actual', 0));
        expect(added.ok).toBe(false);
        if (added.ok || added.reason !== 'overlap') return;
        expect(added.conflicts).toContainEqual(['existing', 'actual']);
        expect(layout.devices).toHaveLength(1);
        expect(history.undoDepth).toBe(beforeDepth);
    });

    it('未知機型與非有限座標回 invalid；既有無關問題不阻止其他空格', () => {
        const existing = makeSplitter('existing', 0);
        const layout = { devices: [existing], pipelines: [] };
        expect(
            canPlaceDevice(
                { machineType: 'missing_machine', position: { x: 5, y: 0, z: 0 }, rotation: 0 },
                layout,
            ),
        ).toEqual({ ok: false, reason: 'invalid', invalidIds: [DRAFT_ID] });
        expect(
            canPlaceDevice(
                { machineType: 'splitter', position: { x: NaN, y: 0, z: 0 }, rotation: 0 },
                layout,
            ),
        ).toEqual({ ok: false, reason: 'invalid', invalidIds: [DRAFT_ID] });

        expect(
            canPlaceDevice(
                { machineType: 'splitter', position: { x: 5, y: 0, z: 0 }, rotation: 0 },
                { devices: [{ ...existing, machineType: 'missing_machine' }], pipelines: [] },
            ),
        ).toEqual({ ok: true });
    });

    it('設備與既有管線佔同一格時，預檢與實際新增都拒絕', () => {
        const layout = useLayoutStore();
        layout.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('connected')));

        const draft = {
            machineType: 'splitter',
            position: { x: 2, y: 0, z: 0 },
            rotation: 0,
        } as const;
        const result = canPlaceDevice(draft, {
            devices: layout.devices,
            pipelines: layout.pipelines,
        });
        expect(result.ok).toBe(false);
        if (result.ok || result.reason !== 'overlap') return;
        expect(result.conflicts.some(([a, b]) => a === 'pipe-ok' || b === 'pipe-ok')).toBe(true);
        expect(result.conflicts.some(([a, b]) => a === DRAFT_ID || b === DRAFT_ID)).toBe(true);

        const added = layout.addDevice(makeSplitter('actual', 2));
        expect(added.ok).toBe(false);
        if (added.ok) return;
        expect(added.reason).toBe('overlap');
    });
});
