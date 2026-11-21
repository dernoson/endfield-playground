# 步驟 03｜接右側 Tips 與設備格子

- **目標** ：兩處使用同一份 alerts，使用者能讀到原因並找到設備。
- **檔案** ：`ProductionStats.vue` 負責映射資料，`AttentionPanel.vue` 顯示 `tips`，`GridCanvas.vue` 只調整設備 `<rect>` 顏色 class。
- **操作與限制** ：用 `alert.level` 和 `alert.message` 產生 Tips，沒有警示時提供空陣列。彙整所有 `relatedDeviceUids`，以設備 ID 決定格子顏色。展示元件透過 props 接收資料。
- **接線現況** ：上游的 `StatsPanel/Index.vue` 尚未轉交總覽 Tips，`LayoutView.vue` 尚未傳入警示設備 ID。使用者已排除這兩個檔案。本步暫停於資料傳遞，保留[分析中的程式碼證據](./W1109-T1_alerts_analysis.md#現有資料流與接線阻礙)。
- **驗收與下一步** ：正式頁的警示與受影響格子同步增減後，進入[手動驗收](./W1109-T1_alerts_step_04_verification.md)。
