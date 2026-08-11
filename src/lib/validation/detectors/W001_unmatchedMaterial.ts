import type { Alert, Detector, ValidationContext } from '@/types/validation';
import { getMachine } from '@/data/machines';
import { getRecipesForMachine } from '@/data/products';

function getIncomingItems(
    targetId: string,
    ctx: ValidationContext,
    visited: Set<string>,
): Set<string> {
    const items = new Set<string>();
    const inEdges = ctx.connections.filter((c) => c.target === targetId);

    for (const edge of inEdges) {
        if (visited.has(edge.source)) continue;
        visited.add(edge.source);

        const sourceNode = ctx.devices.find((d) => d.id === edge.source);
        if (!sourceNode) continue;

        const machineType = sourceNode.data?.machineType ?? sourceNode.data?.label ?? sourceNode.id;
        const machineDef = getMachine(machineType);

        // 判斷是否為分流器類設備 (無配方，只是導流)
        if (machineDef && (machineDef.name === '分流器' || machineDef.name === '管道分流器')) {
            const upstreamItems = getIncomingItems(sourceNode.id, ctx, visited);
            upstreamItems.forEach((i) => items.add(i));
        } else {
            const recipes = getRecipesForMachine(machineType);
            //取得這台設備目前正在使用的配方編號，如果找不到，就預設使用第一個配方(?? 0 means 左邊null/undefined就給出右邊的0)
            const recipeIndex = sourceNode.data?.recipeIndex ?? 0;
            const recipe = recipes[recipeIndex];
            if (recipe) {
                recipe.outputs.forEach((o) => items.add(o.itemId));
            }
        }
    }
    return items;
}

export const W001_unmatchedMaterial: Detector = {
    code: 'W001',
    level: 'warning',
    run(ctx: ValidationContext): Alert[] {
        const alerts: Alert[] = [];

        for (const device of ctx.devices) {
            const machineType = device.data?.machineType ?? device.data?.label ?? device.id;
            const machineDef = getMachine(machineType);

            // 如果沒有設備定義，或是資源產出端 (沒有輸入口)，跳過
            if (!machineDef || machineDef.is_source || machineDef.input_ports.length === 0) {
                continue;
            }

            const allRecipes = getRecipesForMachine(machineType);
            // 如果這台機器本身沒有任何配方可選 (例如分流器)，跳過
            if (allRecipes.length === 0) {
                continue;
            }

            const inEdges = ctx.connections.filter((c) => c.target === device.id);
            // 若沒有任何入邊，應由 E004 負責，此處不報錯以避免重複提示
            if (inEdges.length === 0) {
                continue;
            }

            const visited = new Set<string>();
            const incomingItemIds = getIncomingItems(device.id, ctx, visited);

            // 檢查是否符合任一配方
            let matchedAny = false;
            for (const recipe of allRecipes) {
                if (recipe.inputs.length === 0) {
                    matchedAny = true; // 不需要輸入的配方視為匹配任何東西
                    break;
                }
                const isMatch = recipe.inputs.every((input) => incomingItemIds.has(input.itemId));
                if (isMatch) {
                    matchedAny = true;
                    break;
                }
            }

            if (!matchedAny) {
                alerts.push({
                    uid: crypto.randomUUID(),
                    code: 'W001',
                    level: 'warning',
                    message: `材料組合無法處理：${machineDef.name} 輸入品項不符任一配方`,
                    relatedDeviceUids: [device.id],
                    relatedConnectionUids: [],
                });
            }
        }

        return alerts;
    },
};
