# W0831-G1｜goodmorning｜MachineCard 單檔（DL 9/4）

| meta | value |
|------|-------|
| 週次 | 2026-08-31 → 2026-09-06 |
| 對應 roadmap | [R-B1](../../../roadmap/detail/B1_toolbar_real_machines.md) L3 卡片 |
| 等級 | **加分** |
| 擋門檻 | **否**（未交→aaaaa 用暫時列表） |
| 性質 | 純畫面 |
| 預估時數 | **3–5h** |
| **硬 deadline** | **2026-09-04（五）23:59** |
| **設計基線** | **凍結且不依賴 `.fig`**：照 GUIDE 樣板即可；paper 本週改稿**不必跟**，驗收不看稿 |
| review_gate | dernoson（可代搬路徑／代合入） |
| mentor | 書面＋週中 Discord（pair 名額給 toby） |
| **完整樣板** | [GUIDE_machine_card_template](./GUIDE_machine_card_template.md)（整份 `.vue` 複製即用） |
| 工單風格 | 一張單、一個檔、改這幾行、deadline 寫死 |
| 狀態 | `[ ]` 未開始 |

---

## 0. 一句話

只交 `src/components/MachineCard/Index.vue`：別人傳名稱與佔格進來，你顯示出來；點一下對外喊「選了這台」。

**Deadline：9/4（五）23:59。** 做到哪就先推分支。逾時本單關閉，不計失敗。

上週沒交，主因是稿在變。**這週稿已凍結**，照 GUIDE 貼上就能交。

---

## 1. 四欄

| 欄 | 內容 |
|----|------|
| **畫面** | 卡片上看見名稱＋佔格（例如「粉碎機」「3×3」）；點一下有反應 |
| **交哪個檔** | **只准這一個：** `src/components/MachineCard/Index.vue` |
| **不要碰** | store、`ToolbarPanel`、GitHub 網頁 Upload、根目錄亂放、一次做很多張卡 |
| **卡住找誰** | dernoson（路徑／怎麼交）。樣式不確定就用 GUIDE 原樣。**週中會問你一句進度** |

---

## 2. 這幾個詞

| 詞 | 白話 | 本週 |
|----|------|------|
| **props** | 別人傳進來的字 | 必做：`id`、`name`、`sizeText`；可選：`tag`、`iconUrl` |
| **emit** | 對外喊一聲 | 點卡片：`emit('pick', id)` |
| **store** | 專案的狀態倉庫 | **禁止** import |

對照（只看結構）：`src/components/BaseRegionSelector/Index.vue`。

---

## 3. 開工

- [ ] 確認路徑：`src/components/MachineCard/Index.vue`
- [ ] 打開 GUIDE，整份貼上
- [ ] Discord 回：「G1 開始了，deadline 9/4」

---

## 4. 交檔（禁止 Upload）

見 [GUIDE §4](./GUIDE_machine_card_template.md)。三選一：本機 git／貼 Discord 代推／ZIP。

**禁止：** GitHub「Add file」、檔丟根目錄、檔名加日期。

---

## 5. DoD

- [ ] 檔在指定路徑
- [ ] props／emit 齊；無 store／`src/data/*`
- [ ] 9/4 23:59 前有交付痕跡（分支、PR 或 Discord）
- [ ] 未用網頁 Upload

## 6. 未交頂替

Toolbar 維持暫時列表；不計失敗。
