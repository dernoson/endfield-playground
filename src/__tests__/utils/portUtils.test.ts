/**
 * Port 旋轉工具單元測試
 *
 * 測試對象：src/utils/portUtils.ts
 * V10：pad-to-square 中心旋轉（正方形／長方形共用）。
 */

import { describe, it, expect } from 'vitest';
import { rotatePortSide, rotatePortOffset, rotatePort } from '@/utils/portUtils';
import type { PortSide } from '@/types/machine';
import { clampPortOffset, resolveDisplayGrid } from '@/app/dev/topologyPortUtils';

// ─── rotatePortSide ──────────────────────────────────────────────────────────

describe('rotatePortSide()', () => {
    it('rotation = 0 時方位不變', () => {
        for (const side of ['top', 'right', 'bottom', 'left'] as PortSide[]) {
            expect(rotatePortSide(side, 0)).toBe(side);
        }
    });

    it('順時針 90°（rotation = 1）：top → right → bottom → left → top', () => {
        expect(rotatePortSide('top', 1)).toBe('right');
        expect(rotatePortSide('right', 1)).toBe('bottom');
        expect(rotatePortSide('bottom', 1)).toBe('left');
        expect(rotatePortSide('left', 1)).toBe('top');
    });

    it('順時針 180°（rotation = 2）：相對方位翻轉', () => {
        expect(rotatePortSide('top', 2)).toBe('bottom');
        expect(rotatePortSide('bottom', 2)).toBe('top');
        expect(rotatePortSide('left', 2)).toBe('right');
        expect(rotatePortSide('right', 2)).toBe('left');
    });

    it('順時針 270°（rotation = 3）= 逆時針 90°', () => {
        expect(rotatePortSide('top', 3)).toBe('left');
        expect(rotatePortSide('left', 3)).toBe('bottom');
        expect(rotatePortSide('bottom', 3)).toBe('right');
        expect(rotatePortSide('right', 3)).toBe('top');
    });
});

// ─── rotatePort / rotatePortOffset ───────────────────────────────────────────

describe('rotatePort() / rotatePortOffset()', () => {
    it('rotation = 0 時 side／offset 不變', () => {
        expect(rotatePort('top', 2, 3, 3, 0)).toEqual({ side: 'top', offset: 2 });
        expect(rotatePortOffset('left', 1, 5, 7, 0)).toBe(1);
    });

    it('方形機器（3×3）：與 side 循環一致', () => {
        expect(rotatePort('top', 2, 3, 3, 1)).toEqual({ side: 'right', offset: 2 });
        expect(rotatePort('right', 0, 3, 3, 1)).toEqual({ side: 'bottom', offset: 2 });
        expect(rotatePort('bottom', 1, 3, 3, 1)).toEqual({ side: 'left', offset: 1 });
        expect(rotatePort('left', 0, 3, 3, 1)).toEqual({ side: 'top', offset: 2 });
    });

    it('非方形（2×4）：left@0 旋轉 1 步 → top@3', () => {
        expect(rotatePort('left', 0, 2, 4, 1)).toEqual({ side: 'top', offset: 3 });
        expect(rotatePortOffset('left', 0, 2, 4, 1)).toBe(3);
    });

    it('非方形（2×4）：left@0 旋轉 2 步 → right@3', () => {
        expect(rotatePort('left', 0, 2, 4, 2)).toEqual({ side: 'right', offset: 3 });
        expect(rotatePortOffset('left', 0, 2, 4, 2)).toBe(3);
    });

    it('非方形（6×4）：bottom@4 旋轉後皆合法（舊演算法 rot2 得 -1）', () => {
        expect(rotatePort('bottom', 4, 6, 4, 1)).toEqual({ side: 'left', offset: 4 });
        expect(rotatePort('bottom', 4, 6, 4, 2)).toEqual({ side: 'top', offset: 1 });
        expect(rotatePort('bottom', 4, 6, 4, 3)).toEqual({ side: 'right', offset: 1 });
    });

    it('非方形（6×4）：right@1 旋轉 1 步 → bottom@2（舊演算法得 bottom@4 越界）', () => {
        expect(rotatePort('right', 1, 6, 4, 1)).toEqual({ side: 'bottom', offset: 2 });
    });

    it('非方形（1×3）：right@1 四種 rotation 皆不需 clamp', () => {
        for (const rot of [0, 1, 2, 3] as const) {
            const { side, offset } = rotatePort('right', 1, 1, 3, rot);
            const display = resolveDisplayGrid(1, 3, rot);
            const { wasClamped } = clampPortOffset(side, offset, display.widthCells, display.heightCells);
            expect(wasClamped, `rot=${rot} ${side}@${offset}`).toBe(false);
        }
    });

    it('rotatePortOffset 與 rotatePort().offset 一致', () => {
        const samples: Array<[PortSide, number, number, number, 0 | 1 | 2 | 3]> = [
            ['top', 0, 3, 3, 1],
            ['bottom', 4, 6, 4, 2],
            ['right', 3, 3, 5, 3],
            ['left', 0, 4, 6, 1],
        ];
        for (const [side, offset, w, h, rot] of samples) {
            expect(rotatePortOffset(side, offset, w, h, rot)).toBe(
                rotatePort(side, offset, w, h, rot).offset,
            );
        }
    });
});
