/**
 * toMachineCardFormulas — 機器配方轉成 MachineCard 可用配方一覽
 */
import { describe, it, expect } from 'vitest';
import { getMachineById } from '@/data/machines';
import { getRecipesForMachine } from '@/data/products';
import { toMachineCardFormulas } from '@/app/layouts/toMachineCardFormulas';
import type { Machine } from '@/types/machine';

/** 取機器定義；測試資料缺漏時直接失敗 */
function machineOf(id: string): Machine {
    const machine = getMachineById(id);
    if (!machine) throw new Error(`找不到機器：${id}`);
    return machine;
}

describe('toMachineCardFormulas', () => {
    it('粉碎機：配方數與資料一致，欄位對應週期／輸入／輸出', () => {
        const crusher = machineOf('crusher');
        const formulas = toMachineCardFormulas(crusher, undefined);
        const recipes = getRecipesForMachine(crusher.name, crusher.modes[0]?.id);
        expect(formulas.length).toBe(recipes.length);
        expect(formulas.length).toBeGreaterThan(0);
        expect(formulas[0]).toEqual({
            duration: recipes[0].timeSeconds,
            input: recipes[0].inputs.map((i) => ({ name: i.itemId, amount: i.quantity })),
            output: recipes[0].outputs.map((o) => ({ name: o.itemId, amount: o.quantity })),
        });
    });

    it('沒有配方的物流元件回傳空陣列', () => {
        expect(toMachineCardFormulas(machineOf('splitter'), undefined)).toEqual([]);
    });
});
