# V12-D1 — ／dev store 演示（週會必要）

**對應工項：** V12-D1  
**狀態：** `[x]` 完成（2026-09-11；互動強化）  
**日期：** 2026-09-11  
**依賴：** [C1](./C1_layout_store.md)  
**正式依據：** 負責人 2026-09-11 定案「dev 演示頁仍需要，作為週會報告」＋互動強化（真實機器／點格／自動 belt）

---

## 1. 背景

V11 `/dev/layout-l1-preview` 只切 fixture，與初版 V12 頁面同構。  
強化後 V12 **經 layoutStore 讀寫**：真實 toolbar 機器、預設點／點格放置、移動刪除、兩機自動拉 belt。

---

## 2. 技術決策（已落地）

| 項 | 選擇 |
|----|------|
| 路由 | `/dev/layout-store-preview`（dev-only） |
| 機器資料 | `toolbarMachines.ts`（**不**改 `ToolbarPanel.vue`） |
| 放置 | 預設游標按鈕＋點空格；`addDevice` → `PlacementResult` |
| 選取／移動／刪除 | 點設備選取；方向鈕 `moveDevice`；刪除 `removeDevice` |
| belt | 點兩台 → `bestBeltAnchors`＋L 形路徑 → `addPipeline` |
| fixture | 一鍵載入 connected／broken（備援） |
| 禁止 | 未 import `editorStore`；未改 GridCanvas／ToolbarPanel |

---

## 3. 檔案計畫（已落地）

| 動作 | 檔案 |
|------|------|
| 新建／強化 | `src/app/dev/LayoutStorePreview.vue` |
| 新建 | `src/app/dev/layoutStorePreviewUtils.ts` |
| 新建 | `src/__tests__/app/layoutStorePreviewUtils.test.ts` |
| 修改 | `src/router/index.ts`、`src/app/dev/DevLayout.vue` |

---

## 4. 個人驗收（約 1 分鐘）

```text
1. pnpm dev → /dev/layout-store-preview
2. 選分類＋真實機器 →「放到預設點」→ 格上出現設備；紫條計數增加
3. 點空格再放一台；重疊同格應顯示 last=overlap
4. 點第一台（藍）再點第二台（紫）→「自動拉 belt」→ 綠線／connections 非 null
5. 一鍵 fixture「斷線」仍可用；未接 editorStore
```

---

## 5. DoD

- [x] 路由可開；真實機器＋預設／點格放置
- [x] 兩機自動 belt；PlacementResult 可見
- [x] 資料路徑經 layoutStore
- [x] 步驟寫入 [V12_acceptance_guide](./V12_acceptance_guide.md)
- [x] type-check／utils 測綠

---

## 6. 開發日誌

### 2026-09-11

- 初版：fixture 切換經 store（與 V11 視覺同構）
- 強化：toolbarMachines＋預設點／點格／移動刪除／bestBeltAnchors 自動 belt；utils 測 4 綠
