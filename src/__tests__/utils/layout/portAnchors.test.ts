/**
 * 埠錨點格單元測試
 *
 * 測試對象：src/utils/layout/portAnchors.ts
 * 重點：錨點必須落在設備佔格「之外」相鄰的一格，否則每條連線都會與自己的
 * 來源與目標設備同格而全面誤報。
 */

import { describe, it, expect } from 'vitest';
import { resolvePortAnchorCell } from '@/utils/layout/portAnchors';

describe('resolvePortAnchorCell', () => {
    /** 左上角在 (10, 10) 的 3x2 設備，佔格為 x: 10..12、y: 10..11 */
    const origin = { x: 10, y: 10 };
    const size = { width: 3, height: 2 };

    it('top 側錨點在設備上緣之上一格', () => {
        expect(
            resolvePortAnchorCell(origin.x, origin.y, size.width, size.height, 'top', 0),
        ).toEqual({ x: 10, y: 9 });
    });

    it('bottom 側錨點在設備下緣之下一格', () => {
        expect(
            resolvePortAnchorCell(origin.x, origin.y, size.width, size.height, 'bottom', 2),
        ).toEqual({ x: 12, y: 12 });
    });

    it('left 側錨點在設備左緣之左一格', () => {
        expect(
            resolvePortAnchorCell(origin.x, origin.y, size.width, size.height, 'left', 1),
        ).toEqual({ x: 9, y: 11 });
    });

    it('right 側錨點在設備右緣之右一格', () => {
        expect(
            resolvePortAnchorCell(origin.x, origin.y, size.width, size.height, 'right', 0),
        ).toEqual({ x: 13, y: 10 });
    });

    it('旋轉後寬高對調時錨點跟著移動', () => {
        // 3x2 旋轉 90 度變 2x3，佔格為 x: 10..11、y: 10..12
        expect(resolvePortAnchorCell(origin.x, origin.y, 2, 3, 'right', 0)).toEqual({
            x: 12,
            y: 10,
        });
        expect(resolvePortAnchorCell(origin.x, origin.y, 2, 3, 'bottom', 0)).toEqual({
            x: 10,
            y: 13,
        });
    });

    it('錨點永遠不落在設備佔格之內', () => {
        const cells = [
            resolvePortAnchorCell(origin.x, origin.y, size.width, size.height, 'top', 1),
            resolvePortAnchorCell(origin.x, origin.y, size.width, size.height, 'bottom', 1),
            resolvePortAnchorCell(origin.x, origin.y, size.width, size.height, 'left', 0),
            resolvePortAnchorCell(origin.x, origin.y, size.width, size.height, 'right', 1),
        ];

        for (const cell of cells) {
            const insideX = cell.x >= origin.x && cell.x < origin.x + size.width;
            const insideY = cell.y >= origin.y && cell.y < origin.y + size.height;
            expect(insideX && insideY).toBe(false);
        }
    });
});
