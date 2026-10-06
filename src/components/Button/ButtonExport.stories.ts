import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ButtonExport from './ButtonExport.vue';

const meta = {
    title: 'L3/Button/ButtonExport',
    component: ButtonExport,
} satisfies Meta<typeof ButtonExport>;

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