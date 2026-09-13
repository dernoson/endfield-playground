import type { Position } from '@/types/euclideanSpace';
import type { DeviceFootprint, PipelineFootprint } from '@/types/footprint';
import { getDeviceOccupiedCells } from './deviceOccupancy';
import { getPipelineOccupiedCells } from './pipelineGeometry';

/**
 * 把格點座標壓成格點表的 key。
 *
 * @param cell 格點座標
 * @returns 形如 `"x,y,z"` 的 key
 * @example
 * toCellKey({ x: 1, y: 2, z: 0 }); // '1,2,0'
 */
function toCellKey(cell: Position): string {
    return `${cell.x},${cell.y},${cell.z}`;
}

/**
 * 把一組物件 ID 正規化成與順序無關的配對 key，供去重使用。
 *
 * @param a 其中一個物件 ID
 * @param b 另一個物件 ID
 * @returns 依字典序排列的配對 key
 * @example
 * toPairKey('p1', 'm1'); // 'm1:::p1'
 */
function toPairKey(a: string, b: string): string {
    return a <= b ? `${a}:::${b}` : `${b}:::${a}`;
}

/**
 * 偵測設備與管線之間的空間重疊。
 *
 * 設備與管線的重疊是同一個判定，因此共用同一張稀疏格點表：把每個物件  \
 * 佔用的格點打進表裡，同一格出現兩個以上物件即視為重疊。佔用層 (z, d)  \
 * 已在佔格展開時化為第三軸的格點，所以層別交集不需要額外判斷。  \
 * 用字串 key 而非巢狀陣列，是因為藍圖座標可為負值且分布稀疏。
 *
 * @param deviceList 要檢查的設備清單
 * @param pipelineList 要檢查的管線清單
 * @returns 發生重疊的物件 ID 配對清單；每對不重複，管線自交時兩端為同一 ID
 * @example
 * detectOverlaps(devices, pipelines); // [['m_air', 'p_air']]
 */
export function detectOverlaps(
    deviceList: DeviceFootprint[],
    pipelineList: PipelineFootprint[],
): [string, string][] {
    /** 稀疏格點表：key 為 `"x,y,z"`，value 為佔用該格的物件 ID 清單 */
    const gridCells = new Map<string, string[]>();

    /** 收集所有發生重疊的物件配對 */
    const overlappedPairs: [string, string][] = [];

    /** 已回報過的配對 key，用於去重 */
    const seenPairKeys = new Set<string>();

    /**
     * 將單一物件佔用的格點寫入格點表，撞到既有 ID 時記為重疊配對。
     *
     * @param cells 該物件佔用的所有格點座標
     * @param id 該物件的 ID
     */
    const processCells = (cells: Position[], id: string) => {
        for (const cell of cells) {
            const key = toCellKey(cell);
            const occupants = gridCells.get(key);

            /** 空格子直接佔用，不構成重疊 */
            if (!occupants) {
                gridCells.set(key, [id]);
                continue;
            }

            /** 格子已被佔用，記錄重疊的雙方配對（去重） */
            for (const existingId of occupants) {
                const pairKey = toPairKey(existingId, id);
                if (!seenPairKeys.has(pairKey)) {
                    seenPairKeys.add(pairKey);
                    overlappedPairs.push([existingId, id]);
                }
            }
            occupants.push(id);
        }
    };

    for (const device of deviceList) {
        processCells(getDeviceOccupiedCells(device), device.id);
    }

    for (const pipeline of pipelineList) {
        processCells(getPipelineOccupiedCells(pipeline), pipeline.id);
    }

    return overlappedPairs;
}
