import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import ToolbarPanel from './ToolbarPanel.vue';

/**
 * ToolbarPanel 是受控元件：是否有設備被「選取」完全由外部傳入的
 * `selectedEquipment` prop 決定，元件本身點擊卡片時只會 emit
 * `equip-click` / `equip-dragstart`，不會自己記錄選取狀態。
 *
 * 因此下面的 story 分成兩種：
 * - 用 args 直接指定 selectedEquipment，靜態呈現「選了 / 沒選」兩種畫面
 * - 用 render 搭配一個本地 ref，實際示範外層接住 emit 事件後更新 prop，
 *   讓你在 Canvas 裡點擊卡片能看到深色背景真的跟著切換
 *
 * 注意：這個專案的 emit 事件型別是照字面產生的（'equip-click' -> 'onEquip-click'，
 * 沒有轉成 camelCase 的 onEquipClick），所以 args 裡要用 bracket notation
 * 的字串鍵，而不是一般常見的 onEquipClick 寫法。
 */
const meta = {
    title: 'L3/Editor/ToolbarPanel',
    component: ToolbarPanel,
    args: {
        'onEquip-click': (equipmentId: string) => {
            console.log('[ToolbarPanel] equip-click:', equipmentId);
        },
        'onEquip-dragstart': (_event: DragEvent, equipmentId: string) => {
            console.log('[ToolbarPanel] equip-dragstart:', equipmentId);
        },
    },
} satisfies Meta<typeof ToolbarPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 預設狀態：面板展開、尚未選取任何設備 */
export const Default: Story = {
    name: '預設：未選取設備',
    args: {
        selectedEquipment: null,
    },
};

/** 邊界狀態：某個設備已經被選取，深色背景與黃色底線發光應該同時出現 */
export const Selected: Story = {
    name: '邊界：已選取設備（傳送帶）',
    args: {
        selectedEquipment: 'conveyor',
    },
};

/**
 * 互動示範：外層用一個本地 ref 接住 `equip-click`，
 * 再把新的值傳回 selectedEquipment，模擬真實父元件的用法。
 * 點擊任一張卡片，深色背景應該立即跟著切換到該卡片上。
 */
export const Interactive: Story = {
    name: '互動：點擊即可切換選取（模擬父元件接線）',
    render: (args) => ({
        components: { ToolbarPanel },
        setup() {
            const selected = ref<string | null>(args.selectedEquipment ?? null);
            function handleEquipClick(equipmentId: string) {
                selected.value = equipmentId;
                (args['onEquip-click'] as (id: string) => void)?.(equipmentId);
            }
            return { selected, handleEquipClick, args };
        },
        template: `
            <ToolbarPanel
                :selectedEquipment="selected"
                @equip-click="handleEquipClick"
                @equip-dragstart="args['onEquip-dragstart']"
            />
        `,
    }),
    args: {
        selectedEquipment: null,
    },
};
