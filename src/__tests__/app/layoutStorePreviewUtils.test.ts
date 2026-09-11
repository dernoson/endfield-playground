/**
 * V12-D1 — layoutStorePreviewUtils 單元測試
 */
import { describe, it, expect } from 'vitest';
import {
    axisAlignedWaypoints,
    bestBeltAnchors,
    buildBlockedXy,
    findRoutableBeltWaypoints,
    listPortAnchors,
    pathHitsBlocked,
} from '@/app/dev/layoutStorePreviewUtils';
import type { PlacedDevice } from '@/types/layout';
import { createPinia, setActivePinia } from 'pinia';
import { useLayoutStore } from '@/store/layoutStore';

describe('axisAlignedWaypoints', () => {
    it('水平再垂直走 L 形', () => {
        expect(axisAlignedWaypoints({ x: 1, y: 0 }, { x: 3, y: 2 })).toEqual([
            { x: 1, y: 0, z: 0 },
            { x: 2, y: 0, z: 0 },
            { x: 3, y: 0, z: 0 },
            { x: 3, y: 1, z: 0 },
            { x: 3, y: 2, z: 0 },
        ]);
    });
});

describe('bestBeltAnchors (splitter)', () => {
    const splitter = (id: string, x: number, y: number): PlacedDevice => ({
        id,
        machineType: 'splitter',
        position: { x, y, z: 0 },
        rotation: 0,
    });

    it('列出右出錨點含 (1,0)', () => {
        const outs = listPortAnchors(splitter('src', 0, 0), 'output');
        expect(outs).toContainEqual({ x: 1, y: 0 });
    });

    it('兩台水平分流器挑到右出→左入', () => {
        const pair = bestBeltAnchors(splitter('src', 0, 0), splitter('dst', 4, 0));
        expect(pair).toEqual({
            from: { x: 1, y: 0 },
            to: { x: 3, y: 0 },
        });
    });
});

describe('findRoutableBeltWaypoints — shaping_machine 迴歸', () => {
    /**
     * 使用者回報：塑型機埠在上下，最短 L 形會穿過機身 → addPipeline overlap
     */
    const shaping = (id: string, x: number, y: number): PlacedDevice => ({
        id,
        machineType: 'shaping_machine',
        position: { x, y, z: 0 },
        rotation: 0,
        label: id,
    });

    it('兩台塑型機可找到不撞佔格的路徑', () => {
        const a = shaping('a', 2, 2);
        const b = shaping('b', 11, 3);
        const blocked = buildBlockedXy([a, b]);
        const path = findRoutableBeltWaypoints(a, b, blocked);

        expect(path).not.toBeNull();
        expect(path!.length).toBeGreaterThanOrEqual(2);
        expect(pathHitsBlocked(path!, blocked)).toBe(false);
    });

    it('路徑可通過 layoutStore.addPipeline', () => {
        setActivePinia(createPinia());
        const store = useLayoutStore();
        const a = shaping('a', 2, 2);
        const b = shaping('b', 11, 3);
        expect(store.addDevice(a).ok).toBe(true);
        expect(store.addDevice(b).ok).toBe(true);

        const blocked = buildBlockedXy(store.devices, store.pipelines);
        const path = findRoutableBeltWaypoints(a, b, blocked);
        expect(path).not.toBeNull();

        const result = store.addPipeline({
            id: 'belt-1',
            media: 'belt',
            waypoints: path!,
        });
        expect(result).toEqual({ ok: true });
        expect(store.pipelines).toHaveLength(1);
        expect(store.connections[0]?.from).not.toBeNull();
        expect(store.connections[0]?.to).not.toBeNull();
    });
});
