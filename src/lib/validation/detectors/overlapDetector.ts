import type { Position } from '@/types/euclideanSpace';
import type { shironesMachine, shironesPipeline } from '@/types/shironesinterface';
import { getOccupiedCells } from '@/utils/shirone/getMachineOccupiedGrids';
import { getPipelineOccupiedGrids } from '@/utils/shirone/getPipelineOccupiedGrids';

/**
 * 偵測設備與管線之間的空間重疊。  \
 * 把每個物件佔用的格點打進同一張格點表，同一格出現兩個以上物件即視為重疊。  \
 * 維度不限，但所有格點必須同維度，否則拋出 Dimension mismatch。
 *
 * @param machineList 要檢查的設備清單
 * @param pipelineList 要檢查的管線清單
 * @returns 所有發生重疊的物件 ID 配對清單（每對 [idA, idB] 不重複）
 * @example
 * detectOverlaps(machines, pipelines) // [['m_air', 'p_air']]
 */
export function detectOverlaps(
    machineList: shironesMachine[],
    pipelineList: shironesPipeline[],
): [string, string][] {
    /**
     * 稀疏格點表：key 為座標串接字串，value 為佔用該格子的物件 ID 清單。  \
     * 用字串 key 而非巢狀多維陣列，是因為維度在執行期才由第一個點決定，  \
     * 巢狀寫法無法靜態定型，且大座標會撐出巨大的稀疏陣列。
     */
    const gridCells = new Map<string, string[]>();

    /** 收集所有發生重疊的物件配對 */
    const overlappedPairs: [string, string][] = [];
    /** 用於配對去重的 Set */
    const seenPairKeys = new Set<string>();

    /** 以第一個點的維度為基準，後續所有點都必須一致；-1 表示尚未取得基準 */
    let expectedDimension = -1;

    /**
     * 將單一物件佔用的格點寫入 gridCells，撞到既有 ID 時把雙方記為重疊配對。
     *
     * @param points 該物件佔用的所有格點座標
     * @param id 該物件的 ID
     */
    const processPoints = (points: Position[], id: string) => {
        for (const pos of points) {
            if (expectedDimension === -1) {
                expectedDimension = pos.length;
            } else if (pos.length !== expectedDimension) {
                throw new Error(
                    `Dimension mismatch! Expected ${expectedDimension}D, but got ${pos.length}D at object ${id}`,
                );
            }

            const key = pos.join(',');
            const cell = gridCells.get(key);

            /** 空格子直接佔用，不構成重疊 */
            if (!cell) {
                gridCells.set(key, [id]);
                continue;
            }

            /** 格子已被佔用，記錄重疊的雙方配對（去重） */
            for (const existingId of cell) {
                const pairKey =
                    existingId < id
                        ? `${existingId}:::${id}`
                        : existingId > id
                          ? `${id}:::${existingId}`
                          : `${id}:::${id}`;

                if (!seenPairKeys.has(pairKey)) {
                    seenPairKeys.add(pairKey);
                    overlappedPairs.push([existingId, id]);
                }
            }
            cell.push(id);
        }
    };

    // 收集並標記所有設備佔用的空間格子
    for (const machineItem of machineList) {
        const points = getOccupiedCells(machineItem);
        processPoints(points, machineItem.id);
    }

    // 收集並標記所有管線佔用的空間格子
    for (const pipelineItem of pipelineList) {
        const points = getPipelineOccupiedGrids(pipelineItem.waypoints);
        processPoints(points, pipelineItem.id);
    }

    return overlappedPairs;
}
