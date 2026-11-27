# 步驟 02｜確認正式警示資料來源

- **目標** ：確認正式畫布上的操作會更新 `validationStore.alerts`。
- **檔案** ：先唯讀追查 `ProductionStats.vue`、`useValidation.ts` 和 dev 驗證頁。若正式註冊缺漏且可在工單範圍內補齊，`ProductionStats.vue` 的總覽分支是既有 detector 的註冊候選點。
- **操作與限制** ：核對 E001、E005 是否在既有驗證 watcher 首次執行前完成註冊。沿用格子拓撲及既有 detector。核對 `level`、`message` 和 `relatedDeviceUids`，設備 ID 使用拓撲保留的 `device.id`。
- **驗收** ：在正式頁造成設備重疊及缺輸出，分別觀察到 E001、E005。修正配置後對應警示消失。
- **下一步** ：資料來源確認後，檢查[右欄與畫布的接線條件](./W1109-T1_alerts_step_03_ui.md)。

已執行既有的正式拓撲接線、`useValidation`、`validationStore`、E001 與 E005 測試，共 5 個測試檔、69 案通過。程式碼檢查確認目前 E001、E005 只在 dev 頁掛上。正式頁的 Tips 與畫布接線受阻，先保留正式註冊現況，避免設備被既有 FlowEngine 規則排除時，使用者看不到原因。
