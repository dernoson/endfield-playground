import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { nodeHarness } from '../../../.storybook/vueFlowHarness';
import DeviceNode from './DeviceNode.vue';

/** 本元件實際吃的是 Vue Flow `NodeProps` 的 `data`；story 只需要餵這一塊 */
type DeviceNodeArgs = {
    data: {
        label: string;
        efficiency: number | null;
        iconUrl: string;
        recipeName: string | null;
    };
    selected?: boolean;
};

const meta: Meta<DeviceNodeArgs> = {
    title: 'L3/FlowChart/DeviceNode',
    render: nodeHarness(DeviceNode, 'sb-device-node'),
    argTypes: {
        data: { description: '節點資料：顯示名、效率、圖示與配方名' },
        selected: { description: '是否被畫布選取，選取時外框轉藍' },
    },
    parameters: {
        docs: {
            description: {
                component:
                    '設備節點。背景色由 `getEfficiencyBg(data.efficiency)` 決定，效率是本元件最重要的視覺輸入。' +
                    '節點的其餘 `NodeProps`（`id`、`position`、`dimensions` 等）由畫布在渲染時填入，見 `.storybook/vueFlowHarness.ts`。',
            },
        },
    },
};

export default meta;
type Story = StoryObj<DeviceNodeArgs>;

/** 效率良好：綠底 */
export const HighEfficiency: Story = {
    name: '高效率',
    args: {
        data: { label: '電弧爐', efficiency: 1, iconUrl: '⚡', recipeName: '鐵錠配方' },
    },
};

/** 效率偏低：紅底，是使用者最需要一眼認出的狀態 */
export const LowEfficiency: Story = {
    name: '低效率',
    args: {
        data: { label: '提純機', efficiency: 0.25, iconUrl: '⚗️', recipeName: '赫銅溶液' },
    },
};

/** 邊界：效率為 null 代表尚未計算，文案走「未計算 (灰)」那一支 */
export const NotCalculated: Story = {
    name: '邊界：未計算',
    args: {
        data: { label: '反應池', efficiency: null, iconUrl: '🧪', recipeName: null },
    },
};

/** 選取狀態：外框轉藍 */
export const Selected: Story = {
    name: '選取中',
    args: {
        data: { label: '電弧爐', efficiency: 0.85, iconUrl: '⚡', recipeName: '鐵錠配方' },
        selected: true,
    },
};
