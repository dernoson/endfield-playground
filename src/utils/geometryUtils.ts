/**
 * 基地邊界幾何工具
 *
 * 判定設備是否落在當前基地的可建造框線內（CR-03 的 E003）。  \
 * 佔格展開本身由 `@/utils/layout/deviceOccupancy` 提供，本檔只做範圍比對。
 */

import type { FactoryNode } from '@/types/graph';
import type { Machine } from '@/types/machine';
import type { BaseRegion } from '@/store/canvasStore';
import { BASE_REGION_SIZES } from '@/store/canvasStore';
import { getDeviceOccupiedCells } from '@/utils/layout/deviceOccupancy';

/**
 * 檢查格子座標是否在基地範圍內。
 *
 * @param x 格子 x 座標
 * @param y 格子 y 座標
 * @param baseRegion 基地類型
 * @returns true 表示在範圍內；null 基地（自由畫布）永遠回傳 true
 * @example
 * isWithinBaseRegion(10, 10, 'wuling'); // true
 */
export function isWithinBaseRegion(x: number, y: number, baseRegion: BaseRegion): boolean {
    /** null 基地（自由畫布）無邊界限制 */
    if (baseRegion === null) {
        return true;
    }

    const size = BASE_REGION_SIZES[baseRegion];

    return x >= 0 && x < size.w && y >= 0 && y < size.h;
}

/**
 * 檢查設備的所有佔格是否都在基地範圍內。
 *
 * @param device 已部署的設備節點；position 為格子座標
 * @param def 設備靜態定義
 * @param baseRegion 基地類型
 * @returns true 表示設備完全在基地範圍內
 * @example
 * if (!isDeviceWithinBaseRegion(device, def, baseRegion)) {
 *     // 觸發 E003
 * }
 */
export function isDeviceWithinBaseRegion(
    device: FactoryNode,
    def: Machine,
    baseRegion: BaseRegion,
): boolean {
    const cells = getDeviceOccupiedCells({
        id: device.id,
        position: { x: device.position.x, y: device.position.y, z: 0 },
        rotation: device.data?.rotation ?? 0,
        size: { x: def.width, y: def.height, z: 1 },
    });

    return cells.every((cell) => isWithinBaseRegion(cell.x, cell.y, baseRegion));
}
