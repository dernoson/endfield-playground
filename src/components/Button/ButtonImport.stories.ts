import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ButtonImport from './ButtonImport.vue';

const meta = {
    title: 'L3/Button/ButtonImport',
    component: ButtonImport,
} satisfies Meta<typeof ButtonImport>;

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
