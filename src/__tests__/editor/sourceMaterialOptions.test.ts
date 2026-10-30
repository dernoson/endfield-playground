/**
 * W1026-H1／C5 — 源設備可選材料依輸出埠媒質過濾
 */
import { describe, it, expect } from 'vitest';
import { getMachineById } from '@/data/machines';
import { getMaterialForm } from '@/data/materials';
import { sourceMaterialOptions } from '@/editor/sourceOutput/sourceMaterialOptions';
import type { Machine } from '@/types/machine';

/** 取機器定義；測試資料缺漏時直接失敗，而不是讓後續斷言誤報 */
function machineOf(id: string): Machine {
    const machine = getMachineById(id);
    if (!machine) throw new Error(`找不到機器：${id}`);
    return machine;
}

describe('sourceMaterialOptions', () => {
    it('非源設備回傳空陣列', () => {
        const nonSource = machineOf('item_sink');
        expect(nonSource.is_source).toBe(false);
        expect(sourceMaterialOptions(nonSource, undefined)).toEqual([]);
    });

    it('基礎材料輸出點預設型態（belt）只列固體', () => {
        const names = sourceMaterialOptions(machineOf('material_source'), undefined).map(
            (m) => m.name,
        );
        expect(names).toHaveLength(10);
        expect(names).toContain('源礦');
        expect(names.every((n) => getMaterialForm(n) === 'solid')).toBe(true);
    });

    it('基礎材料輸出點 fluid_pipe 型態只列液體與氣體', () => {
        const names = sourceMaterialOptions(machineOf('material_source'), 'fluid_pipe').map(
            (m) => m.name,
        );
        expect(names.sort()).toEqual(['惰氣', '息壤氣', '沉積酸', '清水'].sort());
    });

    it('其他源設備（belt 埠）同樣只列固體', () => {
        for (const id of ['item_source', 'warehouse_output']) {
            const options = sourceMaterialOptions(machineOf(id), undefined);
            expect(options).toHaveLength(10);
            expect(options.every((m) => m.form === 'solid')).toBe(true);
        }
    });
});
