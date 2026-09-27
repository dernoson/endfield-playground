import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import ToolbarPanel from './ToolbarPanel.vue';

/**
 * ToolbarPanel 是受控元件：是否有設備或視角被「選取」完全由外部傳入的
 * `selectedEquipment` 與 `selectedView` prop 決定，
 * 元件本身點擊卡片與按鈕時只會 emit 事件，不會自己記錄選取狀態。
 */
const meta = {
    title: 'L3/Editor/ToolbarPanel',
    component: ToolbarPanel,
    args: {
        // 捕捉元件發出的事件並印在 Storybook 的 Actions 面板（或 Console）中
        'onEquip-click': (equipmentId: string) => {
            console.log('[ToolbarPanel] equip-click:', equipmentId);
        },
        'onEquip-dragstart': (_event: DragEvent, equipmentId: string) => {
            console.log('[ToolbarPanel] equip-dragstart:', equipmentId);
        },
        'onView-click': (viewId: string) => {
            console.log('[ToolbarPanel] view-click:', viewId);
        },
    },
} satisfies Meta<typeof ToolbarPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 預設狀態：面板展開、預設在佈局視角且尚未選取任何設備 */
export const Default: Story = {
    name: '預設：未選取設備 (佈局視角)',
    args: {
        selectedEquipment: null,
        selectedView: 'layout',
    },
};

/** 邊界狀態：傳送帶被選取，且切換至流程視角，檢查 UI 高光狀態 */
export const Selected: Story = {
    name: '邊界：已選取設備 (流程視角)',
    args: {
        selectedEquipment: 'conveyor',
        selectedView: 'process',
    },
};

/**
 * 互動示範：外層用本地 ref 接住 `equip-click` 與 `view-click`，
 * 點擊卡片或左上角視角分頁時，對應的按鈕背景應該立即跟著切換。
 */
export const Interactive: Story = {
    name: '互動：點擊切換選取與視角（模擬父元件）',
    // 嚴格型別寫法：鍵為字串，值為 unknown
    render: (args: Record<string, unknown>) => ({
        components: { ToolbarPanel },
        setup() {
            // 從 args 提領數值時，使用 as 斷言告知 TypeScript 預期的型別
            const selectedEquip = ref((args.selectedEquipment as string | null) ?? null);
            const currentView = ref((args.selectedView as string | null) ?? 'layout');

            function handleEquipClick(equipmentId: string) {
                selectedEquip.value = equipmentId;
                (args['onEquip-click'] as (id: string) => void)?.(equipmentId);
            }

            function handleViewClick(viewId: string) {
                currentView.value = viewId;
                (args['onView-click'] as (id: string) => void)?.(viewId);
            }

            return { selectedEquip, currentView, handleEquipClick, handleViewClick, args };
        },
        template: `
            <ToolbarPanel
                :selectedEquipment="selectedEquip"
                :selectedView="currentView"
                @equip-click="handleEquipClick"
                @equip-dragstart="args['onEquip-dragstart']"
                @view-click="handleViewClick"
            />
        `,
    }),
    args: {
        selectedEquipment: null,
        selectedView: 'layout',
    },
};
