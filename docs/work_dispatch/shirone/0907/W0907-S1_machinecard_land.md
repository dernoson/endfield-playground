# W0907-S1｜shirone｜MachineCard 對白紙＋拆配方素材元件

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | **確定**（本週這兩件事；不再派第三塊） |
| 擋門檻 | 否 |
| 對應 PR | [#41](https://github.com/dernoson/endfield-playground/pull/41)（延續） |
| 路徑 | **維持現況** `src/app/MachineCard/`——**不用搬** |
| 過審 | **白紙（paper）過審** |
| 產能參考 | 自報 3–5h |

---

## 1. 目標

路徑已定案：**就留在你現在這棵樹**。本週只做兩件事：

1. **MachineCard 視覺調到白紙過為止**（對稿、改細節，直到 paper 說「過」）
2. **Card 裡配方欄的素材元件**拆到 `src/components/…`，並**自己獨立一個 Storybook 頁**（不要只活在 Card 裡面）

合入前提：功能／結構合理＋**paper 過審**＋gate 綠燈。

---

## 2. 邊界

| 允許 | 不要 |
|------|------|
| 改 `src/app/MachineCard/*` 視覺與結構 | 為了「路徑好看」整包搬到別處 |
| 新建 `src/components/<你定的名字>/`＋其 `*.stories.ts` | import store／`src/data/*` |
| 調整 #41 範圍內的 stories | 碰 `ToolbarPanel`、detector、layout |

元件怎麼拆、檔名叫什麼，**你定**；工單不寫死步驟。需要對照時看已合入的 [PR #43](https://github.com/dernoson/endfield-playground/pull/43)。

---

## 3. 驗收

- MachineCard：Storybook 假 props 可展示；paper 對稿回「過」
- 配方欄素材：在 `src/components/` 下可單獨 `pnpm storybook` 打開一頁；Card 改為使用該元件
- `pnpm type-check`、`pnpm lint-check` 綠
- 路徑仍在 `src/app/MachineCard/`（外加你拆出的 `src/components/…`）

---

## 4. 分歧時

視覺或拆法若與 paper／工單衝突：**先回一句再改**，不要只靠實作表態。gate 只有一個人。

---

## 5. 未交頂替

不計失敗。工具列維持暫時列表；不影響 09/27。
