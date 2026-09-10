/**
 * toolbarMachines selector 單元測試（V11-H1）
 */

import { describe, it, expect } from 'vitest';
import {
    DEFAULT_TOOLBAR_MACHINE_TAG,
    formatMachineSizeText,
    listToolbarMachines,
} from '@/editor/toolbar/toolbarMachines';

describe('toolbarMachines', () => {
    it('預設分類為基礎生產且含粉碎機 3×3', () => {
        expect(DEFAULT_TOOLBAR_MACHINE_TAG).toBe('基礎生產');
        const rows = listToolbarMachines();
        const crusher = rows.find((r) => r.id === 'crusher');
        expect(crusher).toMatchObject({
            name: '粉碎機',
            sizeText: '3×3',
            width: 3,
            height: 3,
        });
    });

    it('塑型機／灌裝機佔格文字與 width×height 一致', () => {
        expect(
            listToolbarMachines('基礎生產').find((r) => r.id === 'shaping_machine')?.sizeText,
        ).toBe('3×3');
        expect(
            listToolbarMachines('合成製造').find((r) => r.id === 'filling_machine')?.sizeText,
        ).toBe('6×4');
    });

    it('物流設備含分流器 1×1', () => {
        const rows = listToolbarMachines('物流設備');
        expect(rows.find((r) => r.id === 'splitter')).toMatchObject({
            name: '分流器',
            sizeText: '1×1',
        });
    });

    it('formatMachineSizeText', () => {
        expect(formatMachineSizeText({ width: 2, height: 4 })).toBe('2×4');
    });
});
