import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ButtonFiles from './ButtonFiles.vue';

const meta = {
    title: 'L3/Button/ButtonFiles',
    component: ButtonFiles,
} satisfies Meta<typeof ButtonFiles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotHovered: Story = {
    args: {
        hovered: false,
    },
};

export const Hovered: Story = {
    args: {
        hovered: true,
    },
};