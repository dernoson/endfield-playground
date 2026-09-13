import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FlowChart from './Index.vue';

/**
 * 流程圖的組合檢視。
 *
 * 本元件自帶 `<VueFlow>` 與一組寫死的示範節點與連線，不吃 props，因此不需要
 * harness 也只有一個 story。各節點與連線的邊界情形在它們自己的 story 裡。
 *
 * 可互動：點節點會把相連的線轉為高亮，點空白處清除高亮。
 */
const meta = {
    title: 'L3/FlowChart/Index',
    component: FlowChart,
} satisfies Meta<typeof FlowChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 五種節點與兩條連線的組合，含點擊高亮互動 */
export const Default: Story = {
    name: '組合檢視',
};
