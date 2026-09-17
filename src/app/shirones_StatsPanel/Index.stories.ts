import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ShironesStatsPanel from './Index.vue';
import type { AlertTip, ProductionItem } from './types';

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

const sampleProductions: ProductionItem[] = [
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
];

const sampleTips: AlertTip[] = [
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
];

/** 一般情形：展示完整欄位與對齊 Figma 設計稿樣式 */
export const Default: Story = {
    name: '一般情形（設計稿樣式）',
    args: {
        power: {
            demandKw: 120,
            supplyKw: 180,
        },
        productions: sampleProductions,
        ticketPerHour: 799325,
        tips: sampleTips,
    },
};

/** 邊界：不傳入 props，驗證所有欄位採用預設 fallback 與 '-' placeholder */
export const MinimalProps: Story = {
    name: '邊界：最小 props (placeholder -)',
    args: {},
};

/** 邊界：電力過載（耗電量大於供電量，進度條滿格不超界） */
export const OverloadPower: Story = {
    name: '邊界：電力過載',
    args: {
        power: {
            demandKw: 350,
            supplyKw: 180,
        },
        productions: sampleProductions,
        ticketPerHour: 50000,
        tips: [
            {
                id: 'overload-tip',
                level: 'error',
                message: '電網負載超載，請儘速擴建發電機',
            },
        ],
    },
};

/** 邊界：零供電零耗電狀態（驗證除以零保護） */
export const ZeroSupplyPower: Story = {
    name: '邊界：零供電零耗電',
    args: {
        power: {
            demandKw: 0,
            supplyKw: 0,
        },
        productions: [],
        ticketPerHour: 0,
        tips: [],
    },
};

const overflowProductions: ProductionItem[] = [
    { id: 'p-1', name: '粗製紫晶', producePerMin: 500, consumePerMin: 200, expanded: true },
    { id: 'p-2', name: '纖維原料', producePerMin: 300, consumePerMin: 450, expanded: true },
    { id: 'p-3', name: '高純藍鐵', producePerMin: 120, consumePerMin: 80, expanded: true },
    { id: 'p-4', name: '超導凝膠', producePerMin: 60, consumePerMin: 120, expanded: false },
    { id: 'p-5', name: '活性催化劑', producePerMin: 240, consumePerMin: 100, expanded: true },
    { id: 'p-6', name: '結構基板', producePerMin: 180, consumePerMin: 180, expanded: false },
    { id: 'p-7', name: '精煉原油', producePerMin: 600, consumePerMin: 800, expanded: true },
    { id: 'p-8', name: '特級合成樹脂', producePerMin: 90, consumePerMin: 30, expanded: false },
    { id: 'p-9', name: '超精密電路', producePerMin: 40, consumePerMin: 60, expanded: true },
    { id: 'p-10', name: '重合聚合物', producePerMin: 150, consumePerMin: 90, expanded: true },
];

/** 邊界：多筆產能清單，驗證縱向隱藏式滾動與不擠壓調度券兌換效率區塊 */
export const ManyProductionsOverflow: Story = {
    name: '邊界：多筆產能滾動排版',
    args: {
        power: {
            demandKw: 150,
            supplyKw: 200,
        },
        productions: overflowProductions,
        ticketPerHour: 1250000,
        tips: sampleTips,
    },
};

const overflowTips: AlertTip[] = [
    { id: 't-1', level: 'error', message: '碎紙機單元*1位置重疊' },
    { id: 't-2', level: 'warning', message: '貓毛貓範圍總sb超載' },
    { id: 't-3', level: 'error', message: '高壓變電所負荷過高(120%)' },
    { id: 't-4', level: 'warning', message: '主幹傳送帶物料堵塞' },
    { id: 't-5', level: 'error', message: '水泵未連接水源管道' },
    { id: 't-6', level: 'warning', message: '產能利用率低於 30%' },
    { id: 't-7', level: 'error', message: '排汙管道壓力超出臨界值' },
    { id: 't-8', level: 'warning', message: '無人機集散中心電池不足' },
];

/** 邊界：多筆警示 Tips，驗證 Attention 下半部區域縱向滾動排版 */
export const ManyTipsOverflow: Story = {
    name: '邊界：多筆警示 Tips 滾動',
    args: {
        power: {
            demandKw: 80,
            supplyKw: 120,
        },
        productions: sampleProductions,
        ticketPerHour: 34000,
        tips: overflowTips,
    },
};

/** 邊界：超長文字名稱、巨大數值與超長警示訊息排版 */
export const LongTextOverflow: Story = {
    name: '邊界：超長文字與極大數值',
    args: {
        power: {
            demandKw: 999999,
            supplyKw: 1200000,
        },
        productions: [
            {
                id: 'long-1',
                name: '高純度重結晶超導相轉移複合晶圓材料特級樣品',
                producePerMin: 9999999,
                consumePerMin: 8888888,
                expanded: true,
            },
        ],
        ticketPerHour: 99999999999,
        tips: [
            {
                id: 'long-tip-1',
                level: 'error',
                message: '高精密大型裝配基座超出了當前電網的負載範圍並與臨近傳送帶物理空間重疊無法運轉',
            },
        ],
    },
};
