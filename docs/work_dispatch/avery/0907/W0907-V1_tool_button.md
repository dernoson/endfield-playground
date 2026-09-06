# W0907-V1｜avery｜小工具按鈕 ×3（零散 L3）

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | 加分・**可丟棄**（沒交也不會卡到任何人） |
| 窗口 | 現在 → **9/14**，約 5 小時（主編 9/06 已確認）；9/14 起亞運不派 |
| 要做的檔 | **只有兩個**：`src/components/ToolButton/Index.vue`、`src/components/ToolButton/Index.stories.ts` |
| 教學檔 | [GUIDE_checklist.md](./GUIDE_checklist.md)（環境、分支、PR 一步一步） |
| 帶你的人 | dernoson（Discord 直接問，本週名額留給你） |

---

## 0. 先說清楚

主編 9/06 的原話是「給他幾個小按鈕小 icon 讓他刻，就算沒有也沒差的那種」。

**所以這張工單的重點不是產出，是把開發迴路跑通一次**：環境跑起來 → 開分支 → 改指定的檔 → 推上去 → 開 PR。做壞了、只做一個、甚至只跑到 `pnpm storybook` 打開，都比消失好。

同一則對話裡主編也講了另一句，照實寫在這裡：**再失聯就除名。** 這週如果一個 commit、一句回覆都沒有，就會走到那一步。**做不完不會有事，不講話才會。**

---

## 1. 做什麼

一個小按鈕元件，長得像工具列上那種「圖示＋文字」的按鈕，有「選中／沒選中」兩種樣子。

然後在 Storybook 裡放三顆，分別掛上 paper 給的三個 icon。

**就這樣。** 不接資料、不接畫布、不接任何邏輯。

---

## 2. 逐項 checklist

- [ ] **① 回一句**：Discord 貼「V1 收到，本週做」
- [ ] **② 環境**：照 [GUIDE §1](./GUIDE_checklist.md#1-環境)，跑到 `pnpm storybook` 能打開
- [ ] **③ 拿素材**：跟 paper 要三個 icon 的 SVG（他 9/09 前會貼在 Discord）
- [ ] **④ 開分支**：`git switch -c dev/avery0907`（照 [GUIDE §2](./GUIDE_checklist.md#2-分支)）
- [ ] **⑤ 建檔**：`src/components/ToolButton/Index.vue`，內容照 [GUIDE §3](./GUIDE_checklist.md#3-元件骨架)
- [ ] **⑥ 建 story**：`src/components/ToolButton/Index.stories.ts`，照 [GUIDE §4](./GUIDE_checklist.md#4-story)
- [ ] **⑦ 自查**：`pnpm type-check`、`pnpm lint-check`
- [ ] **⑧ 推**：`git push -u origin dev/avery0907`
- [ ] **⑨ 開 PR**：標題 `W0907-V1 ToolButton`
- [ ] **⑩ 回報**：Discord 貼 PR 連結

**做到第幾項就停在第幾項，然後貼一句「我卡在 ⑥」。** 這比自己硬撐有用。

---

## 3. 硬規則（踩到就不會合入）

| 不要 | 為什麼 |
|------|--------|
| **GitHub 網頁「Add file」上傳** | 上週你的檔是這樣上去的，會蓋掉別人的東西 |
| **檔名／路徑出現看不見的字元** | 上週 `FactoryLayout.vue` 的檔名裡有一個 `U+2060`，別人 clone 下來開不了。**檔名只准英文字母** |
| 檔案丟在專案根目錄 | 路徑就是工單第一行寫的那兩個，不要別的 |
| import store、動 `src/editor/*`、動 `src/data/*` | 那些本週都有別人在改 |
| 自己畫 icon 的路徑座標 | 用 paper 給的 SVG **原樣貼進去**就好，不要算幾何 |

---

## 4. DoD

- [ ] 兩個檔在 `src/components/ToolButton/` 底下，檔名純英文
- [ ] `pnpm storybook` 看得到三顆按鈕，選中／沒選中兩種樣子都在
- [ ] 有分支、有 PR 連結
- [ ] 沒有用網頁上傳

---

## 5. 未交頂替

**這塊沒有下游。** 不做也不影響 09/27、不影響任何人的工項——它存在的目的就是給你一個小到不會失敗的東西。

回一句話的成本是 10 秒，請不要跳過第 ① 項。
