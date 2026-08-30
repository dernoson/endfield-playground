/**
 * 管線幾何工具單元測試
 * 測試對象：src/utils/layout/pipelineGeometry.ts
 *
 * 管線只在 xy 平面行走，所在層由媒質固定，因此不再有 z 軸位移與高維度案例。
 */

import { describe, it, expect } from 'vitest';
import { absToRelPath, getPipelineOccupiedCells } from '@/utils/layout/pipelineGeometry';

describe('absToRelPath', () => {
    it('情況 1:基本 2D 位移（X 軸、Y 軸交替移動）', () => {
        const points = [
            { x: 1, y: 2, z: 0 },
            { x: 1, y: 4, z: 0 },
            { x: 3, y: 4, z: 0 },
            { x: 3, y: 0, z: 0 },
        ];

        const result = absToRelPath(points);

        expect(result).toEqual({
            start: { x: 1, y: 2, z: 0 },
            moves: [
                /** Y 軸 +2 */
                { axis: 'y', delta: 2 },
                /** X 軸 +2 */
                { axis: 'x', delta: 2 },
                /** Y 軸 -4 */
                { axis: 'y', delta: -4 },
            ],
        });
    });

    it('情況 2:包含負向位移與回折 (2D)', () => {
        const points = [
            { x: 5, y: 5, z: 0 },
            { x: 5, y: 10, z: 0 },
            { x: 2, y: 10, z: 0 },
            { x: 2, y: 0, z: 0 },
        ];

        const result = absToRelPath(points);

        expect(result).toEqual({
            start: { x: 5, y: 5, z: 0 },
            moves: [
                /** Y 軸 +5 */
                { axis: 'y', delta: 5 },
                /** X 軸 -3 */
                { axis: 'x', delta: -3 },
                /** Y 軸 -10 */
                { axis: 'y', delta: -10 },
            ],
        });
    });

    it('情況 4:只有一個起點 (單點邊界情況)', () => {
        const points = [{ x: 10, y: 20, z: 1 }];

        const result = absToRelPath(points);

        expect(result).toEqual({ start: { x: 10, y: 20, z: 1 }, moves: [] });
    });

    it('情況 5:包含連續相同座標點 (無位移點)', () => {
        const points = [
            { x: 1, y: 2, z: 0 },
            /** 原地不變 */
            { x: 1, y: 2, z: 0 },
            { x: 1, y: 5, z: 0 },
        ];

        const result = absToRelPath(points);

        expect(result).toEqual({
            start: { x: 1, y: 2, z: 0 },
            moves: [
                /** 自動忽略 0 位移，僅保留有效移動 */
                { axis: 'y', delta: 3 },
            ],
        });
    });

    it('情況 7:傳入空陣列 (空邊界情況)', () => {
        const result = absToRelPath([]);
        expect(result).toEqual({ start: null, moves: [] });
    });
});

describe('getPipelineOccupiedCells', () => {
    it('水平直線路徑逐格展開，含頭尾兩端', () => {
        const cells = getPipelineOccupiedCells({
            id: 'p_line',
            waypoints: [
                { x: 2, y: 0, z: 0 },
                { x: 4, y: 0, z: 0 },
            ],
            depth: 1,
        });

        expect(cells).toEqual([
            { x: 2, y: 0, z: 0 },
            { x: 3, y: 0, z: 0 },
            { x: 4, y: 0, z: 0 },
        ]);
    });

    it('L 形路徑在轉角處只佔用一格，不重複計算', () => {
        const cells = getPipelineOccupiedCells({
            id: 'p_corner',
            waypoints: [
                { x: 0, y: 0, z: 0 },
                { x: 2, y: 0, z: 0 },
                { x: 2, y: 2, z: 0 },
            ],
            depth: 1,
        });

        expect(cells).toEqual([
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 2, y: 0, z: 0 },
            { x: 2, y: 1, z: 0 },
            { x: 2, y: 2, z: 0 },
        ]);
    });

    it('單點路徑只佔用起點那一格', () => {
        const cells = getPipelineOccupiedCells({
            id: 'p_dot',
            waypoints: [{ x: 3, y: 4, z: 1 }],
            depth: 1,
        });

        expect(cells).toEqual([{ x: 3, y: 4, z: 1 }]);
    });

    it('空路徑不佔用任何格子', () => {
        const cells = getPipelineOccupiedCells({
            id: 'p_empty',
            waypoints: [],
            depth: 1,
        });

        expect(cells).toEqual([]);
    });

    it('終點座標小於起點時仍逐格展開（負方向位移）', () => {
        const cells = getPipelineOccupiedCells({
            id: 'p_back',
            waypoints: [
                { x: 2, y: 2, z: 0 },
                { x: 0, y: 2, z: 0 },
            ],
            depth: 1,
        });

        expect(cells).toEqual([
            { x: 2, y: 2, z: 0 },
            { x: 1, y: 2, z: 0 },
            { x: 0, y: 2, z: 0 },
        ]);
    });

    it('depth 為 2 時同一 (x, y) 自起始層向上展開兩層', () => {
        const cells = getPipelineOccupiedCells({
            id: 'p_thick',
            waypoints: [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
            ],
            depth: 2,
        });

        expect(cells).toEqual([
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 1, y: 0, z: 0 },
            { x: 1, y: 0, z: 1 },
        ]);
    });
});
