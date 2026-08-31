# V11-B1 — types/layout 與 Breaking 註記

**對應工項：** V11-B1  
**狀態：** `[x]` 完成（2026-08-31）  
**依賴：** A1  
**最後更新：** 2026-08-31  
**正式依據：** 評估文 §1／§4.7；A1 決策 3／4

---

## 1. 背景

佈局模型：設備與管線各自持有絕對格子座標；**連接狀態每次重算、不儲存**。  
既有 `types/footprint.ts` 已服務佔格純函式；領域模型（機器 id、mode、埠索引、管線媒質等）尚無正式 `types/layout`。

---

## 2. 技術決策

| 方案 | 作法 | 採用 |
|------|------|------|
| **A. layout 領域＋footprint 幾何** | PlacedDevice／Pipeline／Connection(derived)；轉成 DeviceFootprint／PipelineFootprint 再餵既有 utils | **是** |
| B. 合併廢除 footprint | 單一檔吃掉幾何 | 否（打散既有 4 支） |

### 2.1 落地型別

| 符號 | 檔案 | 說明 |
|------|------|------|
| `PlacedDevice`／`Pipeline`／`Connection`／`PortRef`／`LayoutSnapshot` | `src/types/layout.ts` | 領域模型；Connection 不進儲存 |
| `toDeviceFootprint`／`toPipelineFootprint` | `src/utils/layout/toFootprint.ts` | 轉 footprint |
| `resolveDeviceOccupancyDepth`／`deviceSizeFromMachine` | 同上 | `d` 尚無 JSON 欄 → 常數 stub |

`PlacedDevice` 另含可選 `label`／`recipeIndex`／`environment`／`primaryOutput`／`sourceRatePerMin`，供後續 `toTopology` adapter 對齊現有節點欄位。

### 2.2 Breaking 註記（相對現行 editorStore／藍圖）

| 舊 | 新（目標模型） | 本版狀態 |
|----|----------------|----------|
| `editorStore.nodes`／`edges` | `devices`／`pipelines`；`connections` computed | **僅型別**；不動 store |
| `addConnection`／`removeConnection` | 廢除；改管線 path actions | 註記（見 `layout.ts` 檔頭） |
| `removeDevices` 連帶刪邊 | 管線留在原地 | 註記 |
| 藍圖 JSON `nodes`／`edges` | `devices`／`pipelines` | 註記 |

### 2.3 佔用深度 stub

| 規則 | d |
|------|---|
| 預設一般設備 | 2 |
| `item_access_port`／`pipe_access_port` | 1 |
| `is_source`／`is_sink` | 1 |
| belt／pipe 管線 | 1 |

驗證期可依資料補表或改讀機器欄位。

---

## 3. 檔案計畫（已落地）

| 動作 | 檔案 |
|------|------|
| 新建 | `src/types/layout.ts` |
| 新建 | `src/utils/layout/toFootprint.ts` |
| 新建 | `src/__tests__/utils/layout/toFootprint.test.ts` |
| 不改 | `src/types/footprint.ts` |
| 不改 | `src/store/editorStore.ts` |

---

## 4. 驗證標準

- [x] `pnpm type-check` 通過
- [x] Breaking 註記寫在本檔 §2.2 與 `layout.ts` 檔頭
- [x] D1／E1 可 import `@/types/layout` 開工
- [x] `toFootprint` 單元測試 5 綠

---

## 5. 開發日誌

### 2026-08-31

- 依決策 4 落地 `types/layout`＋`toFootprint`；不動 store
- 深度 stub 依評估文；取貨口／source／sink → d=1
- 測試：`toFootprint.test.ts` 5 passed；type-check 過
