/**
 * 源設備可選基礎材料（W1026-H1／C5）
 *
 * 依輸出埠媒質過濾，避免使用者在 belt 埠選到液體、事後才被引擎判為媒質不符。
 */

import type { MaterialDef } from '@/types/flow';
import type { Machine } from '@/types/machine';
import { getAllMaterials, getMaterialPortMedia } from '@/data/materials';
import { getMachinePortMedia } from '@/utils/layout/portMedia';

/**
 * 取得源設備在指定型態下可選的基礎材料。
 *
 * @param machine 機器定義
 * @param machineMode 設備型態；缺省依 `modes[0]` 解釋（與引擎一致）
 * @returns 非源設備回傳空陣列；查不到輸出埠媒質時不過濾，回傳全部基礎材料
 */
export function sourceMaterialOptions(
    machine: Machine,
    machineMode: string | undefined,
): MaterialDef[] {
    if (!machine.is_source) return [];

    const media = getMachinePortMedia(machine.id, machineMode, 'output', 0, () => machine);
    const materials = getAllMaterials();
    if (!media) return materials;

    return materials.filter((m) => getMaterialPortMedia(m.name) === media);
}
