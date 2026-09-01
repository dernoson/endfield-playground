import type { Preview } from '@storybook/vue3-vite';

/**
 * Storybook 預覽設定
 *
 * 每個 story 掛載前共用的全域設定。L3 元件不得 import store，因此不需要
 * Pinia decorator；元件的執行期前置（樣式與外掛註冊）在此補齊。
 */
const preview: Preview = {
    /** 所有 story 一律產生 docs 頁，props 表來自元件的 defineProps JSDoc */
    tags: ['autodocs'],

    parameters: {
        /** 依 prop 名稱推斷控制項型別，省去逐個宣告 argTypes */
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
