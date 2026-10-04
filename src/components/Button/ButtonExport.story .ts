import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PowerSummary from './ButtonExport.vue';

const meta = {
    title: 'L3/Button/ButtonExport',
    component: ButtonExport,
} satisfies Meta<typeof ButtonExport>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 供電充足：盈餘以綠色呈現 */
export const Surplus: Story = {
    name: '供電盈餘',
    args: {
        totalDemandKw: 320,
        totalSupplyKw: 500,
        deviceCount: 18,
        deviceErrorCount: 0,
        connectionCount: 16,
    },
};