# W0823-T1 Inspector 設備資訊工作摘要

## 基本資料

- 日期：2026-08-28
- 分支：`dev/toby`
- 工單：`docs/work_dispatch/toby/W0823-T1_placement_footprint_size.md`
- 實作目標：在 Inspector 唯讀顯示單一選取設備的名稱、佔格與耗電

## 完成內容

修改 `src/editor/inspector/InspectorPanel.vue`：

- 唯讀取得 `selectionStore.selectedNodeIds`。
- 僅在恰好選取一台設備時，從 `editorStore.nodes` 找出對應節點。
- 使用節點的 `data.machineType` 呼叫 `getMachine()` 取得機器定義。
- 在 Inspector 新增「設備資訊」區塊。
- 顯示機器名稱、`寬×高` 佔格及耗電值。
- 未選取、多選、節點不存在或查無機器資料時顯示「未選取設備」。
- 沒有新增任何 store mutation、Command 或資料檔修改。

## 自證結果

曾以暫時測試將既有 mock 節點 `furnace-A` 寫入 SelectionStore，驗證與
Inspector 相同的唯讀 computed 資料鏈。

單選結果：

```text
selectedNodeIds: ["furnace-A"]
名稱: 精煉爐
佔格: 3×3
耗電: 5
```

空選與多選均成功回到空狀態。暫時的自動選取、ID 顯示、測試檔和瀏覽器資料已全部移除，
未留在正式交付內容。

## 驗證結果

- `pnpm type-check`：通過
- `pnpm lint-check`：通過
- `pnpm test`：30 個測試檔、677 項測試全部通過
- `InspectorPanel.vue` ESLint：通過
- `InspectorPanel.vue` Prettier：通過
- Vite 正式頁面 smoke test：HTTP 200

全專案 `pnpm format-check` 仍會因基準分支既有 72 個其他檔案格式不符而失敗；
`InspectorPanel.vue` 不在失敗清單，本次未越界格式化其他檔案。

## 已知上游限制

### 單點選取未同步 SelectionStore

畫布單點設備時，`handleNodeClick()` 目前只更新 `rotateTargetUid`，沒有將節點 ID 寫入
`selectionStore`。因此 Inspector 的資料讀取端已完成，但一般單點操作仍可能維持空狀態。

依工單限制，本次沒有修改 `FactoryCanvas.vue`。後續應由畫布側工單補上選取同步。

### 新放置設備的 machineType 契約不同

`getMachine()` 使用機器中文名稱查詢，但 FactoryCanvas 新放置設備目前可能把英文
`EquipmentType` 寫入 `data.machineType`。既有 mock 節點可正常查詢，新放置設備可能查無資料。

此問題同樣屬於畫布與節點資料契約，不在本次 Inspector 單檔工單範圍。

## 正式交付狀態

- Inspector 功能程式只修改 `src/editor/inspector/InspectorPanel.vue`。
- 沒有修改 `FactoryCanvas.vue`、`FlowNodeOverlay.vue` 或 stores。
- 沒有保留任何自證用程式碼。
- 尚未 push 或建立 PR。
