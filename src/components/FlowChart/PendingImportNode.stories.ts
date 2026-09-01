import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { nodeHarness } from '../../../.storybook/vueFlowHarness';
import PendingImportNode from './PendingImportNode.vue';

/** 本元件實際吃的是 Vue Flow `NodeProps` 的 `data`；story 只需要餵這一塊 */
type PendingImportNodeArgs = {
    data: { label: string; iconUrl: string };
    selected?: boolean;
};

const meta: Meta<PendingImportNodeArgs> = {
    title: 'L3/FlowChart/PendingImportNode',
    render: nodeHarness(PendingImportNode, 'sb-pending-import-node'),
    argTypes: {
        data: { description: '節點資料：待導入設備名與圖示' },
        selected: { description: '是否被畫布選取，選取時虛線外框轉為實線藍框' },
    },
    parameters: {
        docs: {
            description: {
                component:
                    '待導入節點，以半透明與虛線外框表達「尚未成案」。節點的其餘 `NodeProps` 由畫布在渲染時填入，見 `.storybook/vueFlowHarness.ts`。',
            },
        },
    },
};

export default meta;
type Story = StoryObj<PendingImportNodeArgs>;

/** 一般情形：半透明虛線 */
export const Default: Story = {
    name: '待導入',
    args: { data: { label: '高爐', iconUrl: '🔥' } },
};

/** 選取狀態 */
export const Selected: Story = {
    name: '選取中',
    args: { data: { label: '高爐', iconUrl: '🔥' }, selected: true },
};
