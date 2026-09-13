import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { edgeHarness } from '../../../.storybook/vueFlowHarness';
import FlowEdge from './FlowEdge.vue';

/** 本元件實際吃的是 Vue Flow `EdgeProps` 的 `data`；story 只需要餵這一塊 */
type FlowEdgeArgs = {
    data: { itemName: string; ratePerMin: number; highlighted?: boolean };
};

const meta: Meta<FlowEdgeArgs> = {
    title: 'L3/FlowChart/FlowEdge',
    render: edgeHarness(FlowEdge, 'sb-flow-edge'),
    argTypes: {
        data: { description: '邊資料：品項名、每分鐘流量與是否高亮' },
    },
    parameters: {
        docs: {
            description: {
                component:
                    '流程連線。路徑由 `getBezierPath` 依兩端座標算出，標籤渲染在曲線中點。' +
                    '兩端節點與座標由畫布提供，見 `.storybook/vueFlowHarness.ts`。',
            },
        },
    },
};

export default meta;
type Story = StoryObj<FlowEdgeArgs>;

/** 一般情形：灰線 */
export const Default: Story = {
    name: '一般連線',
    args: { data: { itemName: '鐵礦砂', ratePerMin: 60, highlighted: false } },
};

/** 高亮：點擊節點時相連的線轉藍並加上光暈 */
export const Highlighted: Story = {
    name: '高亮連線',
    args: { data: { itemName: '鐵錠', ratePerMin: 30, highlighted: true } },
};

/** 邊界：流量為 0，標籤仍應完整渲染 */
export const ZeroRate: Story = {
    name: '邊界：流量為零',
    args: { data: { itemName: '汙水', ratePerMin: 0, highlighted: false } },
};
