import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3-vite';
import ui from '@nuxt/ui/vue-plugin';

/** 全域樣式：Tailwind 與 Nuxt UI 的樣式層都由這一份帶入 */
import '../src/style.css';
/** Vue Flow 的節點與邊在沒有這兩份樣式時會失去版面 */
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

/**
 * 重現 `src/main.ts` 掛載 app 前的外掛註冊。
 *
 * 目前只有 Nuxt UI 一項：Pinia 不註冊，因為 L3 元件不得 import store，
 * 註冊了反而會讓違規的元件看起來能動。
 */
setup((app) => {
    app.use(ui);
});

/**
 * Storybook 預覽設定
 *
 * 每個 story 掛載前共用的全域設定。元件的執行期前置（樣式與外掛註冊）
 * 對齊 `src/main.ts`，否則 story 裡看到的外觀與主編輯器不一致。
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
