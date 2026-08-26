# R-A2 — 佔格與 port 對資料

| meta | value |
|------|-------|
| 對應大綱 | [ROADMAP_OUTLINE.md](../ROADMAP_OUTLINE.md) §3 |
| 里程碑 | M1（2026-08-30） |
| 擋門檻 | **是**（8/30 唯一關鍵技術項，無備援 Owner） |
| 建議主責／備援 | aaaaa／無 |
| 性質 | 資料／純函式 |
| 依賴 | — |
| 狀態 | `[~]` 實作完成、待合入／8/30 驗收（V10） |
| 最後更新 | 2026-08-26 |

---

## 1. 背景與動機

主編 10 步的第 2 步「滑鼠拉出設備擺放」現況是**可以放，但形狀不對**：佔格數與 JSON 的頂層 `width`／`height` 對不上，port 出現在錯誤的邊。這條錯誤會一路污染後面三個月——9 月的資訊面板會顯示錯佔格、10 月的 port 對 port 連線會連到不存在的埠、11 月的重疊偵測會用錯格子集合判定。

問題可能出在兩個地方，必須先分責再修：

| 錯在哪 | 症狀 | 修的人 |
|--------|------|--------|
| 資料 | JSON `width`／`height` 或 `modes[].input_ports`／`output_ports` 本身寫錯 | aaaaa（本項） |
| 渲染 | 資料正確但畫布用了別的尺寸來源或忽略 rotation | **待佈局層落地後轉單**（本項只負責**記錄**，不改 canvas） |

V9 已完成 modes-only 埠遷移（外層 `input_ports`／`output_ports` 已移除，埠只存在 `modes[].input_ports`／`output_ports`），因此本項的檢查基準是明確的：**畫布與資料必須讀同一份 `getMachine`／`getMachineById`，並經同一套 `getOccupiedCells` 換算。**

## 2. 使用者看得到什麼

中央畫布放下的設備，格子數看起來不是錯尺寸；至少一種常用加工機的佔格與 JSON 完全一致。

## 3. 現況盤點

| 對象 | 路徑 | 現況 |
|------|------|------|
| 機器資料 | `docs/aaaaa/data/machines.json` → `src/data/machines.ts` | modes-only；JSON **44** 筆；`machineList` **46** 筆（含兩筆 codegen stub：`item_source`／`item_sink`） |
| 查詢入口 | `getMachine(name)`／`getMachineById(id)`／`getMachinesByTag(tag)` | 已存在 |
| 佔格換算 | `src/utils/geometryUtils.ts` `getOccupiedCells(device, def)` | 已存在，V5 交付 |
| 埠旋轉 | `src/utils/portUtils.ts` `rotatePort`／`rotatePortSide`／`rotatePortOffset` | 已存在；V10-I1 改 pad-to-square |
| 畫布渲染 | `FactoryCanvas.vue`、`FlowNodeOverlay.vue`、`MachineShape.vue` | **已排 9 月廢除／換址；本週不改**。驗證基準改 `/dev`（`DevTopologySvg`、`placement-demo`） |
| Dev 驗證頁 | `DevTopologySvg.vue`、`/dev/placement-demo` | 比對基準（L1 除錯／演示） |

## 4. 技術決策

### 4.1 錯機清單的欄位（凍結）

清單是本項的主要交付物，後續三個月都會回頭查，欄位固定：

| 欄 | 說明 |
|----|------|
| `machine_id` | snake_case 英文 id（非中文 name） |
| `expected_size` | 頂層 `width`×`height` |
| `observed` | 測試結果，或 `/dev` 拓樸／擺放演示頁實際佔格（overlay 不再是基準） |
| `port_mismatch` | 哪個 mode 的哪個 port 的 side／offset 不符 |
| `fault` | `data` ｜ `render` ｜ `both` |
| `owner` | `data` → aaaaa；`render` → **待佈局層落地後轉單**（不指名本週 L2） |
| `note` | 例如「僅 rotation=1 時錯」「V10-I1 已修（utils）」 |

清單路徑：[A2_port_grid_defect_list.md](./A2_port_grid_defect_list.md)。

### 4.2 方案比較：怎麼產出清單

| 方案 | 作法 | 優點 | 缺點 | 採用 |
|------|------|------|------|------|
| A. 手動目視 | 開畫布逐台放 | 不需寫碼 | 慢、無回歸、rotation 組合漏測 | 否 |
| B. 純測試比對 | 對每台機器跑 `getOccupiedCells` 與 `width`×`height` 一致性斷言 | 有回歸、CI 可跑 | 只驗資料側，抓不到渲染錯 | 部分 |
| **C. B ＋ `/dev` 目視抽查** | 測試涵蓋資料側；`/dev` 拓樸／演示頁抽查 | 分責清楚 | 需兩處 | **是** |

採 C：資料側錯誤由測試釘死，渲染側錯誤寫進清單轉單，本項**不改** canvas 互動。

### 4.3 判定規則

- 佔格：`getOccupiedCells(node, machine).size === machine.width * machine.height`，且四個角落落在預期矩形內
- 埠：對每個 `mode` 的每個 `input_ports`／`output_ports`，旋轉後 `offset` 必須落在該 `side` 的合法範圍內（不得超出顯示寬高）
- 旋轉：`rotation ∈ {0,1,2,3}` 四種都要成立；side／offset 換算走 `rotatePort`／`rotatePortSide`／`rotatePortOffset`，不得在呼叫端自己寫 switch

## 5. 檔案計畫

| 動作 | 檔案 | 說明 |
|------|------|------|
| 新建 | `docs/roadmap/detail/A2_port_grid_defect_list.md` | 錯機清單，欄位見 §4.1 |
| 新建 | `src/__tests__/data/machineGeometry.test.ts` | 佔格與埠合法性斷言（全機器） |
| 新建 | `src/__tests__/data/dataConsistency.test.ts` | R-E1 §4.3 五項（8/30 檢查點併入 V10-B1） |
| 修改 | `docs/aaaaa/data/machines.json` | 僅修真正「錯在資料」者（V10 本批無 JSON 待修） |
| 修改 | `src/utils/portUtils.ts` | V10-I1：`rotatePort` pad-to-square（阻擋全綠之例外） |
| 新建 | `src/app/dev/PlacementDemo.vue` | M1 演示備援 `/dev/placement-demo` |
| 執行 | `pnpm sync:aaaaa-data`、`pnpm generate:src-data` | 同步至 `src/data`（見 [E1](./E1_data_codegen_ops.md)） |
| 唯讀 | `src/utils/geometryUtils.ts` | 不改邏輯；若發現 bug 另開工項 |
| **不碰** | `FactoryCanvas.vue` 事件、任何 Pinia action 簽名、L3 樣式 | 渲染錯誤只記錄 |

## 6. 週切片

| 週日 | 切片 |
|------|------|
| 08/23 | 建立測試骨架，跑出第一版失敗清單（不修） |
| 08/30 | **門檻：** 清單完成並分責；**資料側全綠**（決策 1）；三證據＝測試全綠＋清單＋`/dev` 截圖（決策 3）；主畫布目視為加分 |

## 7. 不做

- 不改畫布互動、不改 overlay 的事件處理
- 不重構 `geometryUtils`（`portUtils.rotatePort*` 已由 V10-I1 修正，其餘不擴張）
- 不處理管線佔格（`getPipelineOccupiedGrids` 屬 10 月範圍）
- 不做正式機器圖像資源

## 8. 依賴與封鎖

無前置。本項是 [B1](./B1_toolbar_real_machines.md)、[B2](./B2_placement_chain.md)、[B3](./B3_rotation_90.md)、[C1](./C1_port_hit_and_draft.md) 的資料前提；下游消費者須寫進 PR 描述。

## 9. DoD

- [x] 錯機清單存在，每列具備 §4.1 全部欄位（見 [A2_port_grid_defect_list.md](./A2_port_grid_defect_list.md)）
- [x] `machineGeometry.test.ts` 涵蓋全部機器 × 四種 rotation 並通過
- [x] 「錯在資料」：本批無 JSON 待修；utils 紅燈由 V10-I1 消除；codegen 未改
- [x] 至少一台常用加工機在 **`/dev` 拓樸或擺放演示頁** 的格子數與 JSON `width`×`height` 一致（主畫布目視為加分）
- [x] `pnpm type-check`／`lint-check`／`format-check`／`test` 通過（合入前品質閘；2026-08-26 全綠）
- [ ] PR 描述寫明下游消費者：下週工具列與 canvas 讀同一份 `getMachine`

## 10. 風險與未交頂替

| 風險 | 對策 |
|------|------|
| 資料錯誤阻擋全綠 | **本週全綠**（決策 1）；不得以 skip／allowlist 假裝綠；若為 utils／codegen stub／遊戲數值存疑，依 V10-F1 §6 上升主編 |
| 渲染錯誤誘使順手改 canvas | 硬規則：本項不動 canvas；發現即記 `fault=render` 轉單 |
| 依賴 L2 合入才能證明 | 交付以清單＋測試＋`/dev` 為準；主畫布目視加分 |

**未交頂替：** 無。此項是 8/30 門檻的必要條件且無備援 Owner，若 aaaaa 不可用須立即上報主編改期。

## 11. 開發日誌

### 2026-08-22

- 建檔。基準沿用 V9 modes-only 埠決策；清單欄位見 §4.1，並補上 rotation 維度

### 2026-08-25

- 佈局／渲染層決議：像素 vs 格子座標落差已解；`FlowNodeOverlay` 等排 9 月廢除。本項驗證面改以測試＋`/dev` 為準；`fault=render` owner 改為「待佈局層落地後轉單」

### 2026-08-26

- V10（W0823-A1）執行：欄位名對齊程式碼（`width`／`height`、`modes[].input_ports`／`output_ports`）；決策落地——資料側本週全綠、三證據從嚴、R-E1 一致性測試併入、`/dev/placement-demo` 備援
- B1 首跑埠 25 紅（皆 `rotation≠0`）→ 判定 `rotatePortOffset` 舊演算法；I1 pad-to-square 修正後 **388 全綠**；本批無 JSON `fault=data`
- 清單：[A2_port_grid_defect_list.md](./A2_port_grid_defect_list.md)；上游文件依 V10-G1 回寫本檔
