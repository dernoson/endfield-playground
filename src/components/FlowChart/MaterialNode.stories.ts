import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { nodeHarness } from '../../../.storybook/vueFlowHarness';
import MaterialNode from './MaterialNode.vue';

/** 本元件實際吃的是 Vue Flow `NodeProps` 的 `data`；story 只需要餵這一塊 */
type MaterialNodeArgs = {
    data: { label: string; ratePerMin: number };
    selected?: boolean;
};

const meta: Meta<MaterialNodeArgs> = {
    title: 'L3/FlowChart/MaterialNode',
    render: nodeHarness(MaterialNode, 'sb-material-node'),
    argTypes: {
        data: { description: '節點資料：材料名與每分鐘供給量' },
        selected: { description: '是否被畫布選取，選取時外框轉藍' },
    },
    parameters: {
        docs: {
            description: {
                component:
                    '材料來源節點，只有輸出端。節點的其餘 `NodeProps` 由畫布在渲染時填入，見 `.storybook/vueFlowHarness.ts`。',
            },
        },
    },
};

export default meta;
type Story = StoryObj<MaterialNodeArgs>;

/** 一般情形 */
export const Default: Story = {
    name: '一般供給',
    args: { data: { label: '鐵礦砂', ratePerMin: 60 } },
};

/** 邊界：供給為 0，節點仍應完整渲染 */
export const ZeroRate: Story = {
    name: '邊界：供給為零',
    args: { data: { label: '沉積酸', ratePerMin: 0 } },
};

/** 選取狀態 */
export const Selected: Story = {
    name: '選取中',
    args: { data: { label: '鐵礦砂', ratePerMin: 60 }, selected: true },
};
