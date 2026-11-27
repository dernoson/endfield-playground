# W1109-T1 第二件｜警示接線分析

2026-11-20。依工單第二件與 Toby 開發守則 A.11 整理。本輪交付分析和執行步驟，程式實作待後續安排。 [工單](../../../work_dispatch/toby/1109/W1109-T1_pr84_and_alerts.md) · [開發守則](../../claude/AGENTS.md) · [#84 前階段摘要](../../work_summaries/2026-11-20_W1109-T1_pr84-merge.md)

## 基準與範圍

分析開始時，本機在 `dev/toby`，工作樹乾淨。#84 的遠端合併狀態與 CI 仍待確認。#84 若已可合併且仍開啟，警示可接在同一張 PR。若已合併，從合併後的基底另開警示 PR，沿用既有產耗資料流，避免與 #88 重複。

| 範圍 | 約束 |
| --- | --- |
| 工單列出的交付檔案 | `ProductionStats.vue` 的警示資料映射、`AttentionPanel.vue` 的 Tips 顯示、`GridCanvas.vue` 設備 `<rect>` 的顏色 class |
| 使用者明確排除 | `StatsPanel/Index.vue`、`LayoutView.vue` |
| 工單限制 | 11/09–11/15 不提交功能。沿用既有 detector，保留 `layoutStore` 簽名及 `MainLayout.vue`。供電樁、左欄、刪除與旋轉的新畫面都排除在範圍外。 |
| 分層 | L2 讀 store 並映射資料。展示元件使用 props。產耗沿用 #84 的接線與 FlowEngine。 |

## 現有資料流與接線阻礙

正式路由以 `ProductionStats.vue` 包住 `MainLayout.vue`。容器從佈局快照建立格子拓撲，`useValidation()` 使用拓撲執行已註冊的 detector。拓撲節點保留 `device.id`，可直接對應警示的 `relatedDeviceUids`。

| 分類 | 目前觀察 |
| --- | --- |
| 上游註冊 | E001 和 E005 已有實作。目前查到的註冊呼叫在 dev 驗證頁。正式編輯器是否有其他註冊入口，須在實作基準再確認。若補掛既有 detector，FlowEngine 會依既有規則略過有 Error 的設備，驗收須涵蓋解除後的重算。 |
| 右側 Tips | `ProductionStats.vue` 提供總覽資料，但 `StatsPanel/Index.vue` 只把自己的 `props.tips` 傳給 `AttentionPanel.vue`。將警示加入總覽資料無法經目前路徑抵達 Tips。 |
| 畫布標紅 | `LayoutView.vue` 傳入設備和出界等資料，但沒有傳入警示設備 ID。調整 `GridCanvas.vue` 的顏色 class 前缺少警示來源。 |
| 規格差異 | CR-03 涵蓋圖示、管線警示及點擊導覽。本工單驗收限於右側訊息和設備格子紅色。 |

兩個傳遞點都在使用者排除的檔案。依 A.1 的展示元件 props 契約，本範圍內目前沒有完整接線路徑，右欄與畫布先記為受阻。 [右側容器](../../../../src/editor/stats/ProductionStats.vue) · [Tips 傳入點](../../../../src/app/StatsPanel/Index.vue#L111) · [畫布傳入點](../../../../src/editor/layout/LayoutView.vue#L825) · [CR-03](../../../../spec/03_validation.md)

## 驗收目標

- 正式頁觸發 E001 或 E005 時，右側每筆警示顯示一句繁中訊息，相關設備格子標紅。
- 移開重疊設備或補接輸出後，對應提示消失。同一設備仍有其他警示時維持紅色，最後一筆解除後恢復原色。
- 沒有警示時 Tips 列表留空。已連線的正常產線仍會隨連線變更更新產耗。

[分步執行索引](./W1109-T1_alerts_steps.md)
