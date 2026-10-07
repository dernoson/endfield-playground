import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ButtonSettings from './ButtonSettings.vue';

const meta = {
    title: 'L3/Button/ButtonSettings',
    component: ButtonSettings,
} satisfies Meta<typeof ButtonSettings>;

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
