import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { userEvent, within } from 'storybook/test';
import ButtonExport from './ButtonExport.vue';

const meta = {
    title: 'L3/Button/ButtonExport',
    component: ButtonExport,
} satisfies Meta<typeof ButtonExport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotHovered: Story = {};

export const Hovered: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.hover(canvas.getByRole('button', { name: 'Export' }));
    },
};