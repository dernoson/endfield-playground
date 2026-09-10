/**
 * 工具列真實機器列表 selector（V11-H1／W0831-A1）
 *
 * 只做「讀資料 → 攤平列」；不呼叫 Pinia／不接落子。  \
 * L3 MachineCard 可吃本模組產出的 `id`／`name`／`sizeText`，勿直接讀 `src/data`。
 */

import { getMachinesByTag, MACHINE_TAGS } from '@/data/machines';
import type { Machine, MachineCategory } from '@/types/machine';

/** 本週預設分類（工單建議） */
export const DEFAULT_TOOLBAR_MACHINE_TAG: MachineCategory = '基礎生產';

/** 工具列可用的分類順序（與 MACHINE_TAGS 一致） */
export const TOOLBAR_MACHINE_TAGS: readonly MachineCategory[] = MACHINE_TAGS;

/** 攤平後供工具列／下游卡片使用的列 */
export interface ToolbarMachineRow {
    /** Machine.id */
    id: string;
    /** 中文顯示名 */
    name: string;
    /** 佔格文字，例 `3×3` */
    sizeText: string;
    /** 原始寬（格） */
    width: number;
    /** 原始高（格） */
    height: number;
}

/**
 * 佔格顯示字串（權威：`width`／`height`）
 */
export function formatMachineSizeText(machine: Pick<Machine, 'width' | 'height'>): string {
    return `${machine.width}×${machine.height}`;
}

/**
 * Machine → ToolbarMachineRow
 */
export function toToolbarMachineRow(machine: Machine): ToolbarMachineRow {
    return {
        id: machine.id,
        name: machine.name,
        sizeText: formatMachineSizeText(machine),
        width: machine.width,
        height: machine.height,
    };
}

/**
 * 依分類取工具列機器列（唯讀查詢既有 API）
 *
 * @param tag 分類；預設「基礎生產」
 */
export function listToolbarMachines(
    tag: MachineCategory = DEFAULT_TOOLBAR_MACHINE_TAG,
): ToolbarMachineRow[] {
    return getMachinesByTag(tag).map(toToolbarMachineRow);
}
