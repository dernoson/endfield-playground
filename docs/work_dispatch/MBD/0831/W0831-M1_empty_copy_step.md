# W0831-M1｜MBD｜單步：確認合入＋空狀態文案

| meta | value |
|------|-------|
| 週次 | 2026-08-31 → 2026-09-06 |
| 對應 roadmap | [R-D1](../../../roadmap/detail/D1_stats_item_summary.md) |
| 等級 | **加分**（單步；**無 deadline**） |
| 擋門檻 | **否** |
| 性質 | 單一 mock 元件（**只這一步**） |
| 預估時數 | 能做多少算多少（自報約 3–5h；不可預估） |
| 交付定義 | **推到分支即算交付**；合入由 dernoson 負責 |
| review_gate | dernoson（查 props／型別） |
| mentor | 環境／型別問 dernoson（非同步） |
| **先讀** | [GUIDE_empty_copy_snippet](./GUIDE_empty_copy_snippet.md)（現況＋改哪一行＋推分支指令） |
| 接手人（cover 不來） | 本週標延壓；9/8 後再考慮 harry 接 StatsPanel |
| 工單風格 | 一步一張；白話＋可貼片段；不開「一週做完」 |
| 狀態 | `[ ]` 未開始 |

---

## 0. 先講一件事

你上週的 `ItemSummaryTable` 空狀態（8/24）**已於 8/30 合入 master（PR #37）**。  
週報填「無產出」沒關係——正式樹上已經有了。

本週**只做下一步**。做完再說。cover 不來不計失敗。

---

## 1. 本步（唯一）

| 欄 | 內容 |
|----|------|
| **畫面** | 右側統計空資料時，句子讓人看得懂「還沒擺設備」，不是壞掉 |
| **交哪個檔** | **僅** `src/components/StatsPanel/ItemSummaryTable.vue` |
| **不要碰** | store、MainLayout、`StatsPanel/Index.vue`、FlowChart、Vue Flow |
| **卡住找誰** | dernoson。**週中可能問一句**（不是質疑） |

建議文案（可改）：「尚未擺放設備——放置並連線後，產耗會顯示在這裡。」  
若你覺得舊句「目前沒有產耗資料」已經夠清楚：維持原句，PR 寫「已對過」也算本步完成。

---

## 2. 開工前（必做）

- [ ] Discord 回一句「知道上次已合入」（表情也可以）
- [ ] 若要改檔：先報「W0831-M1 我要改 `ItemSummaryTable.vue`」
- [ ] 做不動：回「這步先停」→ 結案

---

## 3. DoD（本步）

- [ ] 已回覆「知道上次已合入」
- [ ] （若有改）只動那一個檔；推上分支 → **即算交付**
- [ ] 無 store／MainLayout／Index 變更

## 4. 未交頂替

不計未交付。下一步等你回「做完了」再派。
