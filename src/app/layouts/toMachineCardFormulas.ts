/**
 * 機器配方 → MachineCard「可用配方一覽」的轉接（L2）
 *
 * 純函式，不讀 store；MainLayout 選中設備後呼叫。
 */

import type { Formula } from '@/app/MachineCard/types';
import { getRecipesForMachine } from '@/data/products';
import { getMachineMode, type Machine } from '@/types/machine';

/**
 * 取得機器在目前型態下的可用配方，轉成 MachineCard 的 `Formula`。
 *
 * 配方只篩型態、不篩環境：卡片是「這台機器能做什麼」的總覽，環境限制由引擎在計算時判斷。
 * 物品沒有圖示資料，`image` 不給，交給 FormulaItem 的預設圖示。
 *
 * @param machine 機器定義
 * @param machineMode 設備型態；缺省依 `modes[0]` 解釋（與引擎一致）
 * @returns 依資料原順序排列的配方；沒有配方的機型（如物流元件）回傳空陣列
 */
export function toMachineCardFormulas(
    machine: Machine,
    machineMode: string | undefined,
): Formula[] {
    const modeId = machine.modes.length > 0 ? getMachineMode(machine, machineMode).id : undefined;
    return getRecipesForMachine(machine.name, modeId).map((recipe) => ({
        duration: recipe.timeSeconds,
        input: recipe.inputs.map((item) => ({ name: item.itemId, amount: item.quantity })),
        output: recipe.outputs.map((item) => ({ name: item.itemId, amount: item.quantity })),
    }));
}
