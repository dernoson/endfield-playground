/**
 * detectOverlaps 單元測試
 * 測試對象：src/utils/layout/overlapDetection.ts
 *
 * 空間模型固定為三軸格子座標，因此不再有維度一致性檢查與 n 維空間案例。
 */

import { describe, it, expect } from 'vitest';
import { detectOverlaps } from '@/utils/layout/overlapDetection';
import type { DeviceFootprint, PipelineFootprint } from '@/types/footprint';

describe('overlapDetection', () => {
    it('should return empty array when there are no overlaps', () => {
        const machines: DeviceFootprint[] = [
            {
                id: 'm1',
                position: { x: 0, y: 0, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
            {
                id: 'm2',
                position: { x: 3, y: 0, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
        ];
        const pipelines: PipelineFootprint[] = [
            {
                id: 'p1',
                waypoints: [
                    { x: 0, y: 3, z: 0 },
                    { x: 5, y: 3, z: 0 },
                ],
                depth: 1,
            },
        ];

        const result = detectOverlaps(machines, pipelines);
        expect(result).toEqual([]);
    });

    it('should detect overlap between two overlapping machines', () => {
        const machines: DeviceFootprint[] = [
            {
                id: 'm1',
                position: { x: 0, y: 0, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
            /** m2 於 (1, 0, 0) 與 (1, 1, 0) 兩格與 m1 重疊 */
            {
                id: 'm2',
                position: { x: 1, y: 0, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
        ];

        const result = detectOverlaps(machines, []);
        expect(result).toEqual([['m1', 'm2']]);
    });

    it('should consider rotation when detecting overlaps', () => {
        /** m_rot 原始 size 是 1x4x1, 旋轉 90 度 (rotation 1) 後變成 4x1x1，會佔據 x: 0..3, y: 2, z: 0 */
        const m_test: DeviceFootprint[] = [
            {
                id: 'm_rot',
                position: { x: 0, y: 2, z: 0 },
                rotation: 1,
                size: { x: 1, y: 4, z: 1 },
            },
            /** m_block 放置在 x: 3, y: 2，剛好與旋轉後的 m_rot 發生重疊 */
            {
                id: 'm_block',
                position: { x: 3, y: 2, z: 0 },
                rotation: 0,
                size: { x: 1, y: 1, z: 1 },
            },
        ];

        const result = detectOverlaps(m_test, []);
        expect(result).toEqual([['m_rot', 'm_block']]);

        /** 確保如果不旋轉的話，不會發生重疊 */
        const m_test_no_rot: DeviceFootprint[] = [
            /** 佔據 x: 0, y: 2..5 */
            {
                id: 'm_no_rot',
                position: { x: 0, y: 2, z: 0 },
                rotation: 0,
                size: { x: 1, y: 4, z: 1 },
            },
            /** 佔據 x: 3, y: 2 */
            {
                id: 'm_block',
                position: { x: 3, y: 2, z: 0 },
                rotation: 0,
                size: { x: 1, y: 1, z: 1 },
            },
        ];
        expect(detectOverlaps(m_test_no_rot, [])).toEqual([]);
    });

    it('should detect overlap between machine and pipeline', () => {
        const machines: DeviceFootprint[] = [
            {
                id: 'm1',
                position: { x: 2, y: 2, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
        ];
        const pipelines: PipelineFootprint[] = [
            /** 路徑經過 (0,2,0), (1,2,0), (2,2,0), (3,2,0)，會在 (2,2,0) 與設備相撞 */
            {
                id: 'p1',
                waypoints: [
                    { x: 0, y: 2, z: 0 },
                    { x: 4, y: 2, z: 0 },
                ],
                depth: 1,
            },
        ];

        const result = detectOverlaps(machines, pipelines);
        expect(result).toEqual([['m1', 'p1']]);
    });

    it('should detect overlap between multiple pipelines', () => {
        const pipelines: PipelineFootprint[] = [
            {
                id: 'p1',
                waypoints: [
                    { x: 0, y: 2, z: 0 },
                    { x: 4, y: 2, z: 0 },
                ],
                depth: 1,
            },
            /** 兩條管線在 (2, 2, 0) 交叉相撞 */
            {
                id: 'p2',
                waypoints: [
                    { x: 2, y: 0, z: 0 },
                    { x: 2, y: 4, z: 0 },
                ],
                depth: 1,
            },
        ];

        const result = detectOverlaps([], pipelines);
        expect(result).toEqual([['p1', 'p2']]);
    });

    it('should handle 3D intersections correctly', () => {
        const machines: DeviceFootprint[] = [
            /** m_ground 在地面 (z=0) */
            {
                id: 'm_ground',
                position: { x: 0, y: 0, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
            /** m_air 在空中 (z=1)，與 m_ground x,y 座標重疊但 z 不同 */
            {
                id: 'm_air',
                position: { x: 0, y: 0, z: 1 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
        ];

        /** 因為 Z 軸不同，不應該有重疊 */
        expect(detectOverlaps(machines, [])).toEqual([]);

        /** 新增一條走在空中的管線，與空中的設備重疊 */
        const pipelines: PipelineFootprint[] = [
            {
                id: 'p_air',
                waypoints: [
                    { x: 0, y: 0, z: 1 },
                    { x: 5, y: 0, z: 1 },
                ],
                depth: 1,
            },
        ];

        expect(detectOverlaps(machines, pipelines)).toEqual([['m_air', 'p_air']]);
    });

    it('should NOT detect overlap for objects exactly touching edges (boundary test)', () => {
        const machines: DeviceFootprint[] = [
            /** m1 佔用 x:0,1, y:0,1 */
            {
                id: 'm1',
                position: { x: 0, y: 0, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
            /** m2 佔用 x:2,3, y:0,1 (在 x=2 的邊界與 m1 接觸，但不重疊) */
            {
                id: 'm2',
                position: { x: 2, y: 0, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
            /** m3 佔用 x:0,1, y:2,3 (在 y=2 的邊界與 m1 接觸) */
            {
                id: 'm3',
                position: { x: 0, y: 2, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
        ];

        const pipelines: PipelineFootprint[] = [
            /** 管線穿過 x=2, y=2..4 的區域，剛好貼在 m2 和 m3 的邊緣 */
            {
                id: 'p1',
                waypoints: [
                    { x: 2, y: 2, z: 0 },
                    { x: 2, y: 5, z: 0 },
                ],
                depth: 1,
            },
        ];

        expect(detectOverlaps(machines, pipelines)).toEqual([]);
    });

    it('should detect overlap when a pipeline self-intersects', () => {
        const pipelines: PipelineFootprint[] = [
            /** 一條像貪吃蛇一樣繞一圈撞到自己的管線；起點 (0,0,0)，終點回到 (0,0,0) */
            {
                id: 'snake_pipe',
                waypoints: [
                    { x: 0, y: 0, z: 0 },
                    { x: 2, y: 0, z: 0 },
                    { x: 2, y: 2, z: 0 },
                    { x: 0, y: 2, z: 0 },
                    { x: 0, y: 0, z: 0 },
                ],
                depth: 1,
            },
        ];

        /** 在 (0,0,0) 時會發現自己已經佔用該格子，因此回傳包含自己的 ID 配對 */
        const result = detectOverlaps([], pipelines);
        expect(result).toEqual([['snake_pipe', 'snake_pipe']]);
    });

    it('should handle complex multi-layer (3D) factory setups correctly', () => {
        const machines: DeviceFootprint[] = [
            /** 高塔設備，高度為 2 (z=0, z=1 都佔用) */
            {
                id: 'tall_machine',
                position: { x: 1, y: 1, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 2 },
            },
            /** 一般設備，高度為 1 (只佔用 z=0) */
            {
                id: 'ground_machine',
                position: { x: 4, y: 1, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            },
        ];

        const pipelines: PipelineFootprint[] = [
            /** p_safe 從 z=1 跨過 ground_machine，因為 ground_machine 只有 z=0，所以安全 */
            {
                id: 'p_safe',
                waypoints: [
                    { x: 4, y: 1, z: 1 },
                    { x: 5, y: 1, z: 1 },
                ],
                depth: 1,
            },

            /** p_collide 從 z=1 跨過 tall_machine，因為 tall_machine 高度佔用至 z=1，發生重疊 */
            {
                id: 'p_collide',
                waypoints: [
                    { x: 1, y: 1, z: 1 },
                    { x: 2, y: 1, z: 1 },
                ],
                depth: 1,
            },

            /** p_underground 走地下層 z=-1，安全 */
            {
                id: 'p_underground',
                waypoints: [
                    { x: 0, y: 1, z: -1 },
                    { x: 5, y: 1, z: -1 },
                ],
                depth: 1,
            },
        ];

        const result = detectOverlaps(machines, pipelines);
        expect(result).toEqual([['tall_machine', 'p_collide']]);
    });

    it('should gracefully handle zero-size machines or empty pipelines without crashing', () => {
        const machines: DeviceFootprint[] = [
            /** 體積為 0 的幽靈設備 */
            {
                id: 'ghost_machine',
                position: { x: 0, y: 0, z: 0 },
                rotation: 0,
                size: { x: 0, y: 0, z: 0 },
            },
        ];
        const pipelines: PipelineFootprint[] = [
            /** 沒有路徑點的管線 */
            { id: 'empty_pipe', waypoints: [], depth: 1 },
        ];

        expect(detectOverlaps(machines, pipelines)).toEqual([]);
    });

    it('should handle large amount of objects efficiently (stress test)', () => {
        const machines: DeviceFootprint[] = [];
        const TOTAL = 20000;

        /** 產生 2 萬個完全不重疊的設備 (每個佔 2x2，間隔為 3)，以 100 x 200 的網格排佈 */
        for (let i = 0; i < TOTAL; i++) {
            machines.push({
                id: `m_${i}`,
                position: { x: (i % 100) * 3, y: Math.floor(i / 100) * 3, z: 0 },
                rotation: 0,
                size: { x: 2, y: 2, z: 1 },
            });
        }

        /** 故意在遙遠的地方放兩個會重疊的設備 */
        machines.push({
            id: 'collide1',
            position: { x: 50000, y: 50000, z: 0 },
            rotation: 0,
            size: { x: 1, y: 1, z: 1 },
        });
        machines.push({
            id: 'collide2',
            position: { x: 50000, y: 50000, z: 0 },
            rotation: 0,
            size: { x: 1, y: 1, z: 1 },
        });

        const start = Date.now();
        const result = detectOverlaps(machines, []);
        const duration = Date.now() - start;

        /** 必須能正確在 2 萬個物件中找出唯一的重疊對 */
        expect(result).toEqual([['collide1', 'collide2']]);

        /** 確保效能合乎標準，2 萬個設備 (等於 8 萬個座標點) 建立格點表的耗時不應超過 1000ms */
        expect(duration).toBeLessThan(1000);
        console.log(`Stress test with ${TOTAL} objects completed in ${duration}ms`);
    });
});
