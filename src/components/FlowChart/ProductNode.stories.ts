import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { nodeHarness } from '../../../.storybook/vueFlowHarness';
import ProductNode from './ProductNode.vue';

/** 本元件實際吃的是 Vue Flow `NodeProps` 的 `data`；story 只需要餵這一塊 */
type ProductNodeArgs = {
    data: { label: string; iconUrl: string; ratePerMin: number };
    selected?: boolean;
};

const meta: Meta<ProductNodeArgs> = {
    title: 'L3/FlowChart/ProductNode',
    render: nodeHarness(ProductNode, 'sb-product-node'),
    argTypes: {
        data: { description: '節點資料：產物名、圖示與每分鐘產量' },
        selected: { description: '是否被畫布選取，選取時外框轉藍並加上 ring' },
    },
    parameters: {
        docs: {
            description: {
                component:
                    '產物節點，只有輸入端，外觀為圓角膠囊。節點的其餘 `NodeProps` 由畫布在渲染時填入，見 `.storybook/vueFlowHarness.ts`。',
            },
        },
    },
};

export default meta;
type Story = StoryObj<ProductNodeArgs>;

/** 一般情形 */
export const Default: Story = {
    name: '一般產物',
    args: { data: { label: '鐵錠', iconUrl: '🪙', ratePerMin: 30 } },
};

/** 邊界：長名稱，驗證 min-width 與換行 */
export const LongLabel: Story = {
    name: '邊界：長名稱',
    args: { data: { label: '赫銅零件（高純度精製）', iconUrl: '🔩', ratePerMin: 3.75 } },
};

/** 選取狀態 */
export const Selected: Story = {
    name: '選取中',
    args: { data: { label: '鐵錠', iconUrl: '🪙', ratePerMin: 30 }, selected: true },
};
