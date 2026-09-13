# W0831-G1｜goodmorning｜工具列視覺對齊 paper 稿（DL 9/4）

| meta | value |
|------|-------|
| 週次 | 2026-08-31 → 2026-09-06 |
| 對應 | paper 工具列稿；延續你做到一半的工具列 style |
| 等級 | **加分** |
| 擋門檻 | **否** |
| 性質 | 純畫面／樣式 |
| 預估時數 | **3–5h** |
| **硬 deadline** | **2026-09-04（五）23:59** |
| **設計基線** | 以 paper **工具列 frame** 為準（見 [P1](../../paper/0831/W0831-P1_frame_labels.md) 標號）；本週改稿須週會前公告 |
| review_gate | dernoson（可代合入） |
| mentor | 書面＋週中 Discord |
| **先讀** | [GUIDE_toolbar_style](./GUIDE_toolbar_style.md) |
| 工單風格 | 一張單、改樣式、deadline 寫死；做到哪先推 |
| 狀態 | `[ ]` 未開始 |

---

## 0. 一句話

把你做到一半的**工具列樣子**繼續調到接近白紙的稿。  
**MachineCard 改派 shirone**——你這週不做卡片元件。

**Deadline：9/4（五）23:59。** 做到哪就先推分支。逾時本單關閉，不計失敗。

本單**不強綁**佈局 L1（與 SVG 打底並行）。不要改 `ToolbarPanel` 資料邏輯。

---

## 1. 四欄

| 欄 | 內容 |
|----|------|
| **畫面** | `/dev` 上的底部工具列（搜尋／分類 Tab／設備列）看起來更像 paper 稿：色、圓角、間距、字級對得上 |
| **交哪個檔** | 主改 `src/app/dev/PaperFigBottomBar.vue`；樣式可加同目錄 CSS。**不要**改 `ToolbarPanel.vue` 的資料邏輯（aaaaa 在改） |
| **不要碰** | store、`src/data/*`、aaaaa 的真實機器列表邏輯、GitHub 網頁 Upload、根目錄亂放 |
| **卡住找誰** | dernoson（路徑／怎麼交）。對不到稿就問 paper 的 frame 標號。**週中會問你一句進度** |

---

## 2. 這幾個詞

| 詞 | 白話 | 本週 |
|----|------|------|
| **dev 頁** | 給設計對照用的臨時頁，不是正式主畫面 | 本週交付在這裡即可 |
| **ToolbarPanel** | 正式下方工具列（aaaaa 接資料） | **禁止**動它的 script／資料 |
| **store** | 專案狀態倉庫 | **禁止** import |

對照稿：`docs/paper/` 裡標了「工具列」的那張 frame（P1 補標號後）。

---

## 3. 開工

- [ ] Discord 回：「G1 工具列 style，deadline 9/4」
- [ ] 打開 GUIDE，確認改哪個檔
- [ ] 本機能開 `/dev` 看到 `PaperFigBottomBar`

---

## 4. 交檔（禁止 Upload）

見 [GUIDE §3](./GUIDE_toolbar_style.md)。做到哪就先推。

**禁止：** GitHub「Add file」、檔丟根目錄、檔名加日期。

---

## 5. DoD

- [ ] 視覺相對現況明顯更靠近 paper 工具列稿（截圖前後或對稿）
- [ ] 未改 `ToolbarPanel` 資料邏輯、未 import store
- [ ] 9/4 23:59 前有交付痕跡
- [ ] 未用網頁 Upload

## 6. 未交頂替

沿用現有 `PaperFigBottomBar`；不計失敗。正式 `ToolbarPanel` 不受影響。
