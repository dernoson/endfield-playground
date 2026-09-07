# W0907-V1｜avery｜ToolButton（L3 小元件）

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | 加分 |
| 窗口 | 現在 → **9/14**，約 5 小時；9/14 起亞運不派 |
| 要做的檔 | **只有兩個**：`src/components/ToolButton/Index.vue`、`src/components/ToolButton/Index.stories.ts` |
| 教學檔 | [GUIDE_checklist.md](./GUIDE_checklist.md)（環境、分支、PR 一步一步） |
| 帶你的人 | dernoson（Discord 直接問，本週名額留給你） |

---

## 0. 白話目標

做一個工具列風格的小按鈕元件，並用 Storybook 展示「選中／沒選中」。

這週的重點是**把開發迴路跑通**：環境 → 分支 → 改指定檔 → 推 → 開 PR。做到一半卡住就貼一句「卡在第幾步」，比硬撐有用。

---

## 1. 做什麼

一個「圖示＋文字」按鈕，有選中／沒選中兩種樣子。Storybook 裡至少兩個 story（Default／Active）。

icon 素材跟 paper 要（他本週會整理命名與可用圖層）；紙還沒給之前，先用空 slot 或簡單占位 SVG 也行。

**不接資料、不接畫布、不接任何邏輯。**

---

## 2. 逐項 checklist

- [ ] **① 回一句**：Discord 貼「V1 收到，本週做」
- [ ] **② 環境**：照 [GUIDE §1](./GUIDE_checklist.md#1-環境)，跑到 `pnpm storybook` 能打開
- [ ] **③ 開分支**：`git switch -c dev/avery0907`（照 [GUIDE §2](./GUIDE_checklist.md#2-分支)）
- [ ] **④ 建檔**：`src/components/ToolButton/Index.vue`，內容照 [GUIDE §3](./GUIDE_checklist.md#3-元件骨架)
- [ ] **⑤ 建 story**：`src/components/ToolButton/Index.stories.ts`，照 [GUIDE §4](./GUIDE_checklist.md#4-story)
- [ ] **⑥ 自查**：`pnpm type-check`、`pnpm lint-check`
- [ ] **⑦ 推**：`git push -u origin dev/avery0907`
- [ ] **⑧ 開 PR**：標題 `W0907-V1 ToolButton`
- [ ] **⑨ 回報**：Discord 貼 PR 連結

**做到第幾項就停在第幾項，然後貼「我卡在 ⑤」。**

---

## 3. 硬規則（踩到就不會合入）

| 不要 | 為什麼 |
|------|--------|
| **GitHub 網頁「Add file」上傳** | 會蓋掉別人的檔 |
| **檔名／路徑出現看不見的字元** | 上週 `FactoryLayout.vue` 檔名混進 `U+2060`，別人開不了。**檔名只准英文字母** |
| 檔案丟在專案根目錄 | 路徑就是上面那兩個，不要別的 |
| import store、動 `src/editor/*`、動 `src/data/*` | 本週有別人在改 |
| 自己手算 icon 路徑座標 | 有素材就原樣貼；沒有就先占位 |

---

## 4. DoD

- [ ] 兩個檔在 `src/components/ToolButton/`，檔名純英文
- [ ] `pnpm storybook` 看得到選中／沒選中
- [ ] 有分支、有 PR 連結
- [ ] 未用網頁 Upload

---

## 5. 未交頂替

不計失敗。這塊沒有下游依賴，不影響 09/27。
