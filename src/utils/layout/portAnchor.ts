import type { PortSide } from '@/types/machine';

/**
 * 算出某個埠在設備外側的錨點格。
 *
 * 錨點刻意取在設備佔格「之外」相鄰的一格：管線路徑若以設備自身的格子  \
 * 為端點，每條連線都會與它的來源與目標設備同格，導致全面誤報。
 *
 * @param originX 設備佔格左上角的 x 格索引
 * @param originY 設備佔格左上角的 y 格索引
 * @param displayWidth 旋轉後的佔格寬（格）
 * @param displayHeight 旋轉後的佔格高（格）
 * @param side 旋轉後的埠所在邊
 * @param offset 沿該邊的格偏移，0-indexed
 * @returns 設備外側相鄰一格的平面座標
 * @example
 * resolvePortAnchorCell(10, 10, 3, 2, 'right', 0); // { x: 13, y: 10 }
 */
export function resolvePortAnchorCell(
    originX: number,
    originY: number,
    displayWidth: number,
    displayHeight: number,
    side: PortSide,
    offset: number,
): { x: number; y: number } {
    switch (side) {
        case 'top':
            return { x: originX + offset, y: originY - 1 };
        case 'bottom':
            return { x: originX + offset, y: originY + displayHeight };
        case 'left':
            return { x: originX - 1, y: originY + offset };
        case 'right':
            return { x: originX + displayWidth, y: originY + offset };
    }
}
