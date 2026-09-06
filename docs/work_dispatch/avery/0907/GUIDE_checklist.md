# 教學｜avery｜從環境到 PR（W0907-V1）

| meta | value |
|------|-------|
| 對應工單 | [W0907-V1](./W0907-V1_tool_button.md) |
| 用法 | 一節一節照做；卡住就停在那節，Discord 貼「我卡在 §X」 |
| 問誰 | dernoson |

---

## 1. 環境

只做一次。已經裝好就跳過。

```bash
# 1. 把專案抓下來（已經有就跳過）
git clone https://github.com/dernoson/endfield-playground.git
cd endfield-playground

# 2. 裝套件（要 pnpm；沒有的話先 npm i -g pnpm）
pnpm install

# 3. 打開元件展示台
pnpm storybook
```

瀏覽器會開 `http://localhost:6006`。左邊看得到一堆元件（`L3/StatsPanel/...` 之類）就代表環境沒問題。

**這一步跑通就已經達成這張工單一半的目的了。**

---

## 2. 分支

```bash
git switch master
git pull
git switch -c dev/avery0907
```

分支名就是 `dev/avery0907`，**不要改**。

---

## 3. 元件骨架

建檔 `src/components/ToolButton/Index.vue`，整段貼進去：

```vue
<script setup lang="ts">
interface Props {
    /** 按鈕文字 */
    label: string;
    /** 是否為選中狀態 */
    active?: boolean;
}

withDefaults(defineProps<Props>(), { active: false });
</script>

<template>
    <button
        type="button"
        class="flex flex-col items-center gap-1 rounded-lg border px-3 py-2 text-xs transition-colors"
        :class="
            active
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
        "
    >
        <span class="size-5">
            <!-- icon 放這裡：把 paper 給的 <svg> 原樣貼進來 -->
            <slot name="icon" />
        </span>
        <span>{{ label }}</span>
    </button>
</template>
```

**要改的只有樣式**（顏色、圓角、間距），讓它看起來像 paper 稿裡的按鈕。`<script>` 那段不用動。

---

## 4. story

建檔 `src/components/ToolButton/Index.stories.ts`：

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToolButton from './Index.vue';

const meta = {
    title: 'L3/ToolButton',
    component: ToolButton,
} satisfies Meta<typeof meta.component>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 一般狀態 */
export const Default: Story = {
    args: { label: '刪除', active: false },
};

/** 選中狀態 */
export const Active: Story = {
    args: { label: '旋轉', active: true },
};
```

三顆 icon 的擺法：在 story 裡用 `render` 包一層，把 paper 給的 `<svg>` 貼進 `#icon` 這個插槽。這段不會寫就**先交上面兩個 story**，剩下的問 dernoson。

存檔後回瀏覽器，左邊會多出 `L3/ToolButton`。

---

## 5. 自查

```bash
pnpm type-check
pnpm lint-check
```

有錯就把錯誤訊息整段貼到 Discord，不要自己猜。

---

## 6. 交出去

```bash
git add src/components/ToolButton
git commit -m "feat(ui): add ToolButton component with icon slot and active state"
git push -u origin dev/avery0907
```

推完，終端機會印一個 GitHub 連結，點進去按 **Create pull request**，標題填：

```text
W0907-V1 ToolButton
```

然後把 PR 連結貼到 Discord。**做完了。**

---

## 7. 三個地雷（上週踩過）

1. **不要用 GitHub 網頁的「Add file → Upload files」。** 全部走上面的 `git push`。
2. **檔名不要用複製貼上產生。** 上週的 `FactoryLayout.vue` 檔名裡混進了一個看不見的字元（`U+2060`），別人 clone 下來就開不了那個檔。**手打英文檔名。**
3. **「已經寫完了」不等於「已經開 PR」。** 沒有 PR 連結，這邊看不到你的東西——上週就是這樣被記成零產出的。
