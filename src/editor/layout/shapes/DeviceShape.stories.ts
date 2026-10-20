import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DeviceShape from './DeviceShape.vue';

const meta = {
    title: 'L3/Layout/DeviceShape',
    component: DeviceShape,
    decorators: [
        (story) => ({
            components: { story },
            template: `
                <svg width="320" height="280" style="background:#1f1f1f">
                    <story />
                </svg>`,
        }),
    ],
    args: { width: 225, height: 225 },
} satisfies Meta<typeof DeviceShape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: '設備方塊',
    args: {},
};

export const Labeled: Story = {
    name: '含設備名稱',
    args: { label: '設備名稱' },
};

export const Dragging: Story = {
    name: '拖曳中',
    args: { label: '設備名稱', dragging: true },
};
