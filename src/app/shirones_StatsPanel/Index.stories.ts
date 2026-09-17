import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ShironesStatsPanel from './Index.vue';

const meta = {
    title: 'L3/shirones_StatsPanel',
    component: ShironesStatsPanel,
    decorators: [
        () => ({
            template: `
                <div style="width: 320px; height: 1024px; position: relative; margin: 20px auto; padding-left: 40px;">
                    <story />
                </div>
            `,
        }),
    ],
} satisfies Meta<typeof ShironesStatsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 對齊 paper 設計稿（圖一）的預設展示 */
export const Default: Story = {
    name: '設計稿樣式 (圖一)',
    args: {
        power: {
            demandKw: 120,
            supplyKw: 180,
        },
        productions: [
            {
                id: '1',
                name: '紫晶纖維',
                producePerMin: 406,
                consumePerMin: 0,
                expanded: true,
            },
            {
                id: '2',
                name: '紫晶纖維',
                producePerMin: 0,
                consumePerMin: 799,
                expanded: true,
            },
        ],
        ticketPerHour: 799325,
        tips: [
            {
                id: 'tip-1',
                level: 'error',
                message: '碎紙機單元*1位置重疊',
            },
            {
                id: 'tip-2',
                level: 'warning',
                message: '貓毛貓範圍總sb超載',
            },
        ],
    },
};

/** 邊界：空資料狀態 */
export const Empty: Story = {
    name: '邊界：空資料',
    args: {
        power: { demandKw: 0, supplyKw: 0 },
        productions: [],
        ticketPerHour: 0,
        tips: [],
    },
};
