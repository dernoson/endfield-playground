import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { nodeHarness } from '../../../.storybook/vueFlowHarness';
import WarehouseNode from './WarehouseNode.vue';

/** 本元件實際吃的是 Vue Flow `NodeProps` 的 `data`；story 只需要餵這一塊 */
type WarehouseNodeArgs = {
    data: { label: string; iconUrl: string; itemName: string };
    selected?: boolean;
};

const meta: Meta<WarehouseNodeArgs> = {
    title: 'L3/FlowChart/WarehouseNode',
    render: nodeHarness(WarehouseNode, 'sb-warehouse-node'),
    argTypes: {
        data: { description: '節點資料：倉庫名、圖示與存放品項' },
        selected: { description: '是否被畫布選取，選取時虛線外框轉為實線藍框' },
    },
    parameters: {
        docs: {
            description: {
                component:
                    '倉庫節點，以琥珀色虛線外框與其他節點區別。節點的其餘 `NodeProps` 由畫布在渲染時填入，見 `.storybook/vueFlowHarness.ts`。',
            },
        },
    },
};

export default meta;
type Story = StoryObj<WarehouseNodeArgs>;

/** 一般情形：虛線外框 */
export const Default: Story = {
    name: '一般倉庫',
    args: { data: { label: '主要倉庫', iconUrl: '📦', itemName: '鐵錠' } },
};

/** 選取狀態：虛線轉實線，是本元件唯一會變形的狀態 */
export const Selected: Story = {
    name: '選取中（虛線轉實線）',
    args: { data: { label: '主要倉庫', iconUrl: '📦', itemName: '鐵錠' }, selected: true },
};
