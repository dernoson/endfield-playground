import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BaseRegionSelector from './Index.vue';

const meta = {
    title: 'L3/BaseRegionSelector',
    component: BaseRegionSelector,
} satisfies Meta<typeof BaseRegionSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 已選定基地：trigger 收合狀態，點開才看得到選項 */
export const Selected: Story = {
    name: '已選定武陵地區',
    args: {
        modelValue: 'wuling',
    },
};

/** 邊界：modelValue 為 null 代表自由畫布，沒有任何選項處於 active */
export const FreeCanvas: Story = {
    name: '邊界：自由畫布（null）',
    args: {
        modelValue: null,
    },
};
