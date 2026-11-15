import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Electric from './Electric.vue';

/**
 * Electric 輸出的是 SVG `<g>`，需要放在 `<svg>` 中才能顯示。
 * 畫布提供深色背景與格線，方便檢視供電樁外框與圖示。
 */
const svgStage = () => ({
    template: `
        <svg width="180" height="140" style="background:#1f1f1f">
            <defs>
                <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#3a3a3a" stroke-width="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <g transform="translate(28 28)"><story /></g>
        </svg>`,
});

const meta = {
    title: 'L3/Editor/Electric',
    component: Electric,
    args: { gridSize: 28, selected: false, dragging: false },
    argTypes: {
        gridSize: { control: { type: 'range', min: 12, max: 72, step: 2 } },
        selected: { control: 'boolean', description: '被單擊選取' },
        dragging: { control: 'boolean', description: '拖曳中' },
    },
    decorators: [svgStage],
} satisfies Meta<typeof Electric>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 放下後：淡黃色圓形外框與電力圖示 */
export const Placed: Story = {
    name: '放下',
};

/** 選取後：外框與圖示改為藍色 */
export const Selected: Story = {
    name: '選取',
    args: { selected: true },
};

/** 拖曳中：外框透明度降低，圖示維持原樣 */
export const Dragging: Story = {
    name: '拖曳中',
    args: { dragging: true },
};
