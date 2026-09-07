# 教學｜toby｜GridCanvas 只讀渲染（W0907-T1）

| meta | value |
|------|-------|
| 對應工單 | [W0907-T1](./W0907-T1_gridcanvas_readonly.md) |
| 要改的檔 | `src/editor/layout/GridCanvas.vue`（新）、`GridCanvas.stories.ts`（新） |
| 用法 | 先讀工單 §0 白話；這裡是型別、可貼片段、指令 |

---

## 1. props 長這樣

```ts
import type { PlacedDevice, Pipeline } from '@/types/layout';

interface Props {
    devices: PlacedDevice[];
    pipelines: Pipeline[];
    /** 一格幾 px，預設 28 */
    cellSize?: number;
    /** 畫布幾格寬／高，預設 12 × 8 */
    gridWidth?: number;
    gridHeight?: number;
}
```

`PlacedDevice`／`Pipeline` 的定義在 `src/types/layout.ts`，**不要複製一份出來改**。重點只有三個欄位：

| 欄位 | 意思 |
|------|------|
| `device.position` | 佔格**左上角**的格子座標（不是 px） |
| `device.machineType` | 機器 id，用它去查寬高 |
| `pipeline.waypoints` | 折線的格子座標，依序連起來就是管線 |

**沒有 emit。** 這週不做選取，所以不需要 `defineEmits`。

---

## 2. 三個現成函式（不要自己算幾何）

```ts
import { getMachineById } from '@/data/machines';
import { getDeviceOccupiedCells } from '@/utils/layout/deviceOccupancy';
import { deviceSizeFromMachine, toDeviceFootprint } from '@/utils/layout/toFootprint';
```

一台設備佔哪些格子：

```ts
const machine = getMachineById(device.machineType);
const size = deviceSizeFromMachine(machine);          // 含旋轉前的寬高與佔用深度
const cells = getDeviceOccupiedCells(toDeviceFootprint(device, size));
// cells: { x, y, z }[]；同一個 xy 可能出現多次（不同 z 層），畫圖時去重
```

**旋轉已經算在裡面了**，你不用處理 `rotation`。

---

## 3. 可以照抄的畫法

`src/app/dev/LayoutL1Preview.vue` 已經把同一件事畫過一次（那是 aaaaa 的 L1 除錯頁）。**打開它、把 `<svg>` 裡面那三段抄過來**，改成吃 props 就好：

| 那邊的段落 | 你要的 |
|------------|--------|
| `<!-- 格線 -->` 那個 `<g stroke="#e5e7eb">` | 原樣抄 |
| `<!-- 設備佔格 -->` 的 `deviceCells` computed ＋ `<rect>` | 把 `scenario.value.devices` 換成 `props.devices` |
| `<!-- 管線 -->` 的 `pipelinePath()` ＋ `<path>` | 原樣抄；顏色先固定一種即可 |

**不要抄的部分：** 那頁的 `resolveConnections`／`toTopology`／下面兩個 `<section>` 摘要。那是除錯用的，不是畫布。管線斷不斷線本週不用分色——那要靠 store。

> 抄完記得**不要**去改 `LayoutL1Preview.vue` 本身，它是別人的檔。

---

## 4. story 長這樣

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { getMockLayoutScenario } from '@/data/mockLayout';
import GridCanvas from './GridCanvas.vue';

const meta = {
    title: 'L2/Layout/GridCanvas',
    component: GridCanvas,
} satisfies Meta<typeof GridCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

const connected = getMockLayoutScenario('connected');

/** 兩台設備＋一條接上的管線 */
export const Connected: Story = {
    name: '已連接',
    args: {
        devices: connected.devices,
        pipelines: connected.pipelines,
    },
};
```

`broken` 那組同理，把 `'connected'` 換成 `'broken'`。假資料已經寫好在 `src/data/mockLayout.ts`，**不用自己造**。

---

## 5. 指令

```bash
pnpm install
pnpm storybook          # http://localhost:6006 → L2/Layout/GridCanvas
pnpm type-check
pnpm lint-check
```

交檔：

```bash
git switch -c dev/toby0907
git add src/editor/layout/GridCanvas.vue src/editor/layout/GridCanvas.stories.ts
git commit -m "feat(layout): add read-only GridCanvas with grid, device footprints and pipelines"
git push -u origin dev/toby0907
```

然後在 GitHub 開 PR，標題帶 `W0907-T1`。

---

## 6. 自查（推之前跑一遍）

```bash
grep -nE "store|FactoryCanvas|vue-flow" src/editor/layout/GridCanvas.vue
```

**要沒有輸出。** 有的話代表範圍跑掉了，會被退回。
