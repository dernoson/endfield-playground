import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ShortcutRow from './Index.vue';

/**
 * 唯一用到 Nuxt UI（`UButton` / `UKbd`）的 L3 元件。
 *
 * 它驗證的不只是自身外觀，還有 Nuxt UI 的元件解析與樣式在 Storybook 環境下
 * 是否完整——若 `ui()` plugin 沒生效，`UKbd` 會直接解析失敗。
 */
const meta = {
    title: 'L3/ShortcutRow',
    component: ShortcutRow,
} satisfies Meta<typeof ShortcutRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 一般情形：組合鍵拆成多個 UKbd 徽章 */
export const Default: Story = {
    name: '一般鍵位',
    args: {
        label: '復原',
        combo: 'Ctrl+Z',
        hasConflict: false,
        isRecording: false,
    },
};

/** 鍵位衝突：多一段橘色提示 */
export const Conflict: Story = {
    name: '鍵位衝突',
    args: {
        label: '重做',
        combo: 'Ctrl+Y',
        hasConflict: true,
        isRecording: false,
    },
};

/** 錄製中：徽章換成提示文字，設定鈕轉為 primary */
export const Recording: Story = {
    name: '錄製中',
    args: {
        label: '切換管線工具',
        combo: 'P',
        hasConflict: false,
        isRecording: true,
    },
};

/** 邊界：單鍵沒有加號可拆，只會有一個徽章 */
export const SingleKey: Story = {
    name: '邊界：單鍵',
    args: {
        label: '刪除選取',
        combo: 'Delete',
        hasConflict: false,
        isRecording: false,
    },
};

/** 邊界：空字串鍵位，comboParts 過濾後為空陣列，不該渲染任何徽章 */
export const EmptyCombo: Story = {
    name: '邊界：未綁定鍵位',
    args: {
        label: '尚未綁定的動作',
        combo: '',
        hasConflict: false,
        isRecording: false,
    },
};
