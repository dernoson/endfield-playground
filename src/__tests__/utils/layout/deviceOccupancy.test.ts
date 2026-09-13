/**
 * 設備佔格展開單元測試
 * 測試對象：src/utils/layout/deviceOccupancy.ts
 *
 * 涵蓋旋轉 0–3 的寬高對調，以及佔用深度 d／起始層 z 的立體展開。
 */

import { describe, it, expect } from 'vitest';
import type { DeviceFootprint } from '@/types/footprint';
import type { Rotation } from '@/types/editor';
import { getDeviceOccupiedCells } from '@/utils/layout/deviceOccupancy';

const ROTATIONS: Rotation[] = [0, 1, 2, 3];

function cellKey(cell: { x: number; y: number; z: number }): string {
    return `${cell.x},${cell.y},${cell.z}`;
}

describe('getDeviceOccupiedCells', () => {
    it('rotation=0：2×1×d=1 展開兩格', () => {
        const device: DeviceFootprint = {
            id: 'm1',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            size: { x: 2, y: 1, z: 1 },
        };

        expect(getDeviceOccupiedCells(device).map(cellKey).sort()).toEqual(['0,0,0', '1,0,0']);
    });

    it.each(ROTATIONS)('rotation=%s：3×2 格數＝旋轉後寬×高（d=1）', (rotation) => {
        const device: DeviceFootprint = {
            id: 'm-rot',
            position: { x: 5, y: 7, z: 0 },
            rotation,
            size: { x: 3, y: 2, z: 1 },
        };
        const swapped = rotation === 1 || rotation === 3;
        const width = swapped ? 2 : 3;
        const height = swapped ? 3 : 2;
        const cells = getDeviceOccupiedCells(device);

        expect(cells).toHaveLength(width * height);

        const keys = new Set(cells.map((c) => `${c.x},${c.y}`));
        expect(keys.has('5,7')).toBe(true);
        expect(keys.has(`${5 + width - 1},${7 + height - 1}`)).toBe(true);
        for (const c of cells) {
            expect(c.z).toBe(0);
        }
    });

    it('d=2 時同一 (x,y) 自 z 起向上展開兩層', () => {
        const device: DeviceFootprint = {
            id: 'm-d2',
            position: { x: 1, y: 2, z: 0 },
            rotation: 0,
            size: { x: 1, y: 1, z: 2 },
        };

        expect(getDeviceOccupiedCells(device).map(cellKey).sort()).toEqual(['1,2,0', '1,2,1']);
    });

    it('起始層 z=1、d=2 時佔用 {1,2}', () => {
        const device: DeviceFootprint = {
            id: 'm-z1',
            position: { x: 0, y: 0, z: 1 },
            rotation: 0,
            size: { x: 2, y: 1, z: 2 },
        };

        expect(getDeviceOccupiedCells(device).map(cellKey).sort()).toEqual([
            '0,0,1',
            '0,0,2',
            '1,0,1',
            '1,0,2',
        ]);
    });

    it('rotation=1 時寬高對調且深度不受旋轉影響', () => {
        const device: DeviceFootprint = {
            id: 'm-rot-d',
            position: { x: 0, y: 0, z: 0 },
            rotation: 1,
            size: { x: 3, y: 1, z: 2 },
        };
        const cells = getDeviceOccupiedCells(device);

        /** 旋轉後顯示 1×3，再 × d=2 → 6 格 */
        expect(cells).toHaveLength(6);
        expect(new Set(cells.map((c) => `${c.x},${c.y}`))).toEqual(new Set(['0,0', '0,1', '0,2']));
        expect(new Set(cells.map((c) => c.z))).toEqual(new Set([0, 1]));
    });
});
