import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TestStatsPanel from './Index.vue';
import type { CapacityEstimateRow, TipItem } from './types';

const meta = {
    title: 'L3/test_StatsPanel',
    component: TestStatsPanel,
    decorators: [
        () => ({
            template: `
                <div style="width: 320px; height: 1024px; position: relative; margin: 20px auto; padding-left: 40px;">
                    <story />
                </div>
            `,
        }),
    ],
} satisfies Meta<typeof TestStatsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleProductions: CapacityEstimateRow[] = [
    {
        itemId: '1',
        name: '紫晶纖維',
        produced: 406,
        consumed: 0,
        net: 406,
        isExpanded: true,
    },
    {
        itemId: '2',
        name: '紫晶纖維',
        produced: 0,
        consumed: 799,
        net: -799,
        isExpanded: true,
    },
];

const sampleTips: TipItem[] = [
    {
        id: 'tip-1',
        type: 'error',
        message: '碎紙機單元*1位置重疊',
    },
    {
        id: 'tip-2',
        type: 'warning',
        message: '貓毛貓範圍總sb超載',
    },
];

/** 一般情形：展示完整欄位與對齊 Figma 設計稿樣式 */
export const Default: Story = {
    name: '一般情形（設計稿樣式）',
    args: {
        totalDemandKw: 120,
        totalSupplyKw: 180,
        capacityRows: sampleProductions,
        ticketPerHour: 799325,
        tips: sampleTips,
    },
};

/** 邊界：不傳入 props，驗證無資料時不使用 placeholder，乾淨呈現 */
export const MinimalProps: Story = {
    name: '邊界：最小 props (無資料狀態)',
    args: {
        totalDemandKw: 0,
        totalSupplyKw: 0,
        capacityRows: [],
        ticketPerHour: 0,
        tips: [],
    },
};

/** 邊界：電力過載（耗電量大於供電量，進度條滿格不超界） */
export const OverloadPower: Story = {
    name: '邊界：電力過載',
    args: {
        totalDemandKw: 350,
        totalSupplyKw: 180,
        capacityRows: sampleProductions,
        ticketPerHour: 50000,
        tips: [
            {
                id: 'overload-tip',
                type: 'error',
                message: '電網負載超載，請儘速擴建發電機',
            },
        ],
    },
};

/** 邊界：零供電零耗電狀態（驗證除以零保護） */
export const ZeroSupplyPower: Story = {
    name: '邊界：零供電零耗電',
    args: {
        totalDemandKw: 0,
        totalSupplyKw: 0,
        capacityRows: [],
        ticketPerHour: 0,
        tips: [],
    },
};

const overflowProductions: CapacityEstimateRow[] = [
    { itemId: 'p-1', name: '粗製紫晶', produced: 500, consumed: 200, net: 300, isExpanded: true },
    { itemId: 'p-2', name: '纖維原料', produced: 300, consumed: 450, net: -150, isExpanded: true },
    { itemId: 'p-3', name: '高純藍鐵', produced: 120, consumed: 80, net: 40, isExpanded: true },
    { itemId: 'p-4', name: '超導凝膠', produced: 60, consumed: 120, net: -60, isExpanded: false },
    { itemId: 'p-5', name: '活性催化劑', produced: 240, consumed: 100, net: 140, isExpanded: true },
    { itemId: 'p-6', name: '結構基板', produced: 180, consumed: 180, net: 0, isExpanded: false },
    { itemId: 'p-7', name: '精煉原油', produced: 600, consumed: 800, net: -200, isExpanded: true },
    { itemId: 'p-8', name: '特級合成樹脂', produced: 90, consumed: 30, net: 60, isExpanded: false },
    { itemId: 'p-9', name: '超精密電路', produced: 40, consumed: 60, net: -20, isExpanded: true },
    { itemId: 'p-10', name: '重合聚合物', produced: 150, consumed: 90, net: 60, isExpanded: true },
];

/** 邊界：多筆產能清單，驗證縱向隱藏式滾動與不擠壓調度券兌換效率區塊 */
export const ManyProductionsOverflow: Story = {
    name: '邊界：多筆產能滾動排版',
    args: {
        totalDemandKw: 150,
        totalSupplyKw: 200,
        capacityRows: overflowProductions,
        ticketPerHour: 1250000,
        tips: sampleTips,
    },
};

const overflowTips: TipItem[] = [
    { id: 't-1', type: 'error', message: '碎紙機單元*1位置重疊' },
    { id: 't-2', type: 'warning', message: '貓毛貓範圍總sb超載' },
    { id: 't-3', type: 'error', message: '高壓變電所負荷過高(120%)' },
    { id: 't-4', type: 'warning', message: '主幹傳送帶物料堵塞' },
    { id: 't-5', type: 'error', message: '水泵未連接水源管道' },
    { id: 't-6', type: 'warning', message: '產能利用率低於 30%' },
    { id: 't-7', type: 'error', message: '排汙管道壓力超出臨界值' },
    { id: 't-8', type: 'warning', message: '無人機集散中心電池不足' },
];

/** 邊界：多筆警示 Tips，驗證 Attention 下半部區域縱向滾動排版 */
export const ManyTipsOverflow: Story = {
    name: '邊界：多筆警示 Tips 滾動',
    args: {
        totalDemandKw: 80,
        totalSupplyKw: 120,
        capacityRows: sampleProductions,
        ticketPerHour: 34000,
        tips: overflowTips,
    },
};

/** 邊界：超長文字名稱、巨大數值與超長警示訊息排版 */
export const LongTextOverflow: Story = {
    name: '邊界：超長文字與極大數值',
    args: {
        totalDemandKw: 999999,
        totalSupplyKw: 1200000,
        capacityRows: [
            {
                itemId: 'long-1',
                name: '又想听那个故事了？真是没办法呀',
                produced: 9999999,
                consumed: 8888888,
                net: 1111111,
                isExpanded: true,
            },
        ],
        ticketPerHour: 99999999999,
        tips: [
            {
                id: 'long-tip-1',
                type: 'error',
                message:
                    '茈發動前的41秒內，新宿再次響起了五條悟的吟唱。“九綱”“偏光”“烏與聲明”“表裏之間”、宿儺明白自己再也沒有任何機會阻止茈的誕生了，無限制的虛式如同核爆一般在新宿亮起沖天的光芒，魔虛羅的輪盤在茈中灰飛煙滅，廢墟之中，全力護住自己的宿儺無力的靠在殘破的建築上支持身體，他的左手和大腿都被這一擊吞噬殆盡，同樣傷痕累累的五條悟出現在宿儺面前，宿儺立刻強迫自己不再倚靠牆壁，堂堂正正站在五條悟面前，但是在咒力同源的影響下，五條悟所承受的傷害被大大削弱，在反轉術式的治療下五條悟的身體再次恢復，對五條悟來說，決定性的一擊遠距離“茈”只',
            },
        ],
    },
};
