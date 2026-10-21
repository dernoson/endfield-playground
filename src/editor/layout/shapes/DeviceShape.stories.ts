import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DeviceShape from './DeviceShape.vue';

const meta = {
    title: 'L3/Layout/DeviceShape',
    component: DeviceShape,
    decorators: [
        (story) => ({
            components: { story },
            template: `
                <svg width="320" height="900" style="background:#1f1f1f">
                    <story />
                </svg>`,
        }),
    ],
    args: { width: 225, height: 225 },
} satisfies Meta<typeof DeviceShape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: '種植機',
    args: {},
};

export const Labeled: Story = {
    name: '含種植機',
    args: { label: '種植機' },
};

export const Dragging: Story = {
    name: '拖曳中',
    args: { label: '種植機', dragging: true },
};
