import type { Position } from '@/types/euclideanSpace';
import type { DeviceFootprint } from '@/types/footprint';

/**
 * 展開單一設備佔用的所有格點。
 *
 * 旋轉 1 與 3（90 度與 270 度）時佔格的寬高對調，佔用深度不受旋轉影響。  \
 * 第三軸自 `position.z` 起連續展開 `size.z` 層，這正是 (z, d) 佔用層模型  \
 * `occupiedLayers = { z … z+d-1 }` 的展開結果，因此不需要額外的層別判斷。
 *
 * @param device 設備的佔格描述
 * @returns 該設備佔用的所有格點座標
 * @example
 * getDeviceOccupiedCells({
 *     id: 'm1',
 *     position: { x: 0, y: 0, z: 0 },
 *     rotation: 0,
 *     size: { x: 2, y: 1, z: 1 },
 * });
 * // [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }]
 */
export function getDeviceOccupiedCells(device: DeviceFootprint): Position[] {
    const { x, y, z } = device.position;

    /** 旋轉後的實際佔格尺寸；90 度與 270 度時寬高對調 */
    const rotated = device.rotation === 1 || device.rotation === 3;
    const width = rotated ? device.size.y : device.size.x;
    const height = rotated ? device.size.x : device.size.y;
    const depth = device.size.z;

    const cells: Position[] = [];

    for (let dx = 0; dx < width; dx++) {
        for (let dy = 0; dy < height; dy++) {
            for (let dz = 0; dz < depth; dz++) {
                cells.push({ x: x + dx, y: y + dy, z: z + dz });
            }
        }
    }

    return cells;
}
