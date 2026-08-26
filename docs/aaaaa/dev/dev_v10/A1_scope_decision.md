# V10-A1 — 範圍與定案

**對應工項：** V10-A1  
**狀態：** `[ ]` 規劃完成、待勾選定案確認  
**日期：** 2026-08-26  
**開發分支：** `dev/aaaaa0826`（base＝`docs/public-roadmap-dispatch-0825`）  
**正式依據：** [W0823-A1](../../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md)、[R-A2](../../../roadmap/detail/A2_grid_and_port_alignment.md)

> **範圍宣告：** 本版只處理**本週 aaaaa 被分派、且需在 8/30 驗收**的工項。人力／備援／渲染層排程屬決策層，不在本版展開。

---

## 1. 背景

主編 10 步第 2 步「滑鼠拉出設備擺放」現況：**可以放，但形狀／埠可能不對**。錯誤會污染後續三個月（Inspector 佔格、port hit、E001 重疊）。

問題必先分責：

| 錯在哪 | 症狀 | 本版處置 |
|--------|------|----------|
| 資料 | JSON `width`／`height` 或 `modes[]` 埠寫錯 | **本週全修**＋測試釘死 |
| 渲染 | 資料正確但畫面用別的尺寸來源 | **只記錄**；owner＝待佈局層落地後轉單 |

V9 已完成 modes-only：外層 ports 已移除；埠只在 `modes[].input_ports`／`output_ports`。檢查基準：**讀同一份 `getMachine`，經同一套 `getOccupiedCells`／埠旋轉函式**。

8/25 佈局視角改自建渲染層：本版**交付物不變**（資料、測試、清單）；即將廢除的 `FactoryCanvas`／`FlowNodeOverlay` 本週**全員不改**。

---

## 2. 最終決策

| 決策項 | 結論 |
|--------|------|
| 版本號 | **V10**（承接 V9；執行 W0823-A1） |
| 門檻日 | **2026-08-30**；A2 部分無備援 Owner |
| 權威來源 | `docs/aaaaa/data/machines.json`；`src/data/machines.ts` 為 codegen 產物、禁止手改 |
| 欄位名 | 見 §2.2「文檔 vs 程式碼」；**以程式碼為準** |
| 測試 | `src/__tests__/data/machineGeometry.test.ts`＋`dataConsistency.test.ts` |
| 清單 | 新建 `docs/roadmap/detail/A2_port_grid_defect_list.md` |
| geometryUtils | 本週**唯讀**；9 月渲染層換址時測試再跟改 |
| 座標落差 | 像素 vs 格子已由渲染層決議解決；清單留紀錄列 |

### 2.1 2026-08-26 六項決策（本版新增）

| # | 決策 | 落點 |
|---|------|------|
| 1 | **資料本週全部對齊 → 測試全綠。** 不採「修不完排 9/6」；不得留 skip／todo／allowlist | [D1](./D1_fix_data_codegen.md)、[B1](./B1_machine_geometry_tests.md) |
| 2 | **回寫 `detail/A2_*.md` 過期處**（欄位名、台數、驗收面、owner、風險條款） | [G1](./G1_upstream_doc_sync.md) |
| 3 | **8/30 驗收從嚴：** 以測試＋錯機清單＋`/dev` 拓樸截圖為準；**主畫布目視為加分**，只用來記 `fault=render` | [F1](./F1_acceptance_and_pr.md) |
| 4 | **R-E1「8/30 一致性測試上線」併入 V10-B1** | [B1](./B1_machine_geometry_tests.md) §3 |
| 5 | **R-A4 由 aaaaa 主撰、與主編 dernoson 共同驗收**；產出交主編確認後生效 | [H1](./H1_weekly_cadence_gate.md) |
| 6 | **M1 至少做到「從下方拖一台」**；為避免 toby W0823-T1 未交導致無法演示，`/dev` 新增最小擺放演示頁 | [E1](./E1_dev_placement_demo.md) |

### 2.2 文檔用語 ↔ 程式碼現況

| A2／舊文檔 | 程式碼現況（採此） |
|------------|-------------------|
| JSON `size` | 頂層 `width`／`height` |
| `modes[].ports` | `modes[].input_ports`／`modes[].output_ports` |
| `machine.size.width * height` | `machine.width * machine.height` |
| `expected_size` | 寫作 `width×height`（例 `3×3`） |
| 「43 台」 | JSON **44** 筆；`machineList` **46** 筆（多兩筆 codegen stub，見 §2.3） |
| `getOccupiedCells(node, machine)` | `src/utils/geometryUtils.ts`（已吃 rotation 0/1/2/3） |
| 埠旋轉 | `rotatePortSide`／`rotatePortOffset`（`src/utils/portUtils.ts`） |
| 查詢 | `getMachine`／`getMachineById`（codegen；勿手改） |

### 2.3 codegen stub 的處置（全綠決策的連帶）

`machineList` 比 JSON 多兩筆：`generate-src-data.mjs` 的 `SOURCE_SINK_STUBS`（物品輸出口／物品輸入口）。

| 情況 | 處置 |
|------|------|
| stub 幾何／埠合法 | 照常納入測試 |
| stub 資料不合法 | 修 stub 需改 `generate-src-data.mjs`（R-E1 §5 標「唯讀，除非 schema 變更」）→ **記入清單並在 PR 標明**，最小改動只修錯值、不動 schema |

### 2.4 性質鎖與 `/dev` 演示頁的關係

本週性質為**資料／純函式**。`/dev` 擺放演示頁（決策 6）刻意限定為 L1 除錯工具：

- 唯讀 `getAllMachines`／`getMachinesByTag`／`getOccupiedCells`
- 元件內 local state，**不接** `editorStore`、不呼叫任何 Pinia action
- 不改主畫布、不改 `FlowNodeOverlay`／`FactoryCanvas`

因此不視為 L2／L3 接線工項。此界線若主編另有判定，以主編為準（見 [F1](./F1_acceptance_and_pr.md) §6 待確認）。

---

## 3. 與既有版本／工單邊界

| 對象 | 關係 |
|------|------|
| V9 | 完成；本版沿用 modes-only、DevTopology WxH 格點、MACHINE_TAGS |
| V6–V8 | 不回頭；本版不改 FlowEngine 配方／速率 |
| R-E1 | 8/30 檢查點併入本版 B1；其餘月度檢查點不在本版 |
| R-A4 | 本版 H1 主撰＋主編確認 |
| W0823-D0 | dernoson 合入守門；卡住找他 |
| W0823-S1 | shirone E001；本週可平行，本版不依賴其合入 |
| W0823-T1 | toby→Inspector 顯示 width×height；**下游驗收窗口**；未交由本版 E1 頂替演示 |
| 佈局改寫 | 見 [LAYOUT_REWRITE_DISPATCH_IMPACT_0825](../../LAYOUT_REWRITE_DISPATCH_IMPACT_0825.md)；A1 判定為契約微調、交付保值 |

---

## 4. 非目標

- 主線 Vue／Pinia／L3 接線（主畫布擺放鏈屬 R-B2、9 月）
- 重構 geometry／port utils
- 修 `fault=render`
- 管線佔格、正式機器圖、CR-05
- 決策層議題（人力、備援、渲染層排程）

---

## 5. DoD（本細項）

- [ ] 本檔決策表已對齊 W0823-A1（含 8/25 更新）與 8/26 六項決策
- [ ] todolist_v10 概述與本檔一致
- [ ] B1／C1／D1／E1／F1／G1／H1 可依本檔開工，無待裁決欄位名
- [ ] §2.3 stub 處置與 §2.4 性質鎖界線已寫明

---

## 6. 開發日誌

### 2026-08-26

- 依 W0823-A1／WEEK v1.4／R-A2 建立 V10-A1
- 凍結欄位對照與驗收改自驗拓樸頁
- 分支改自 `docs/public-roadmap-dispatch-0825` 重建（勿用 master 直切）
- 落版 8/26 六項決策；補 §2.3 codegen stub 處置、§2.4 `/dev` 頁性質界線
