# V10 TODOLIST — 佔格與 port 對資料（本週 aaaaa 工項）

**版本：** V10  
**建立日期：** 2026-08-26  
**負責人：** aaaaa  
**前置：** V9 完成（modes-only 埠、WxH 拓樸預覽、基礎材料輸出點）  
**正式工單：** [W0823-A1](../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md)  
**上游 roadmap：** [R-A2](../../roadmap/detail/A2_grid_and_port_alignment.md)（主）、[R-E1](../../roadmap/detail/E1_data_codegen_ops.md)（8/30 檢查點併入本版）、[R-A4](../../roadmap/detail/A4_weekly_cadence_gate.md)（aaaaa 撰寫、主編確認）  
**門檻：** **2026-08-30（日）＝M1**  
**開發分支：** `dev/aaaaa0826`（自 `docs/public-roadmap-dispatch-0825` 切出）  
**狀態總覽：** `[x]` **完成**（2026-08-31：F1／H1 以手動完成標注；殘項不帶入 V11）

> 標記說明：`[ ]` 未開始 / `[~]` 進行中 / `[x]` 完成 / `[!]` 封鎖中（等待依賴）
>
> **範圍宣告：** 本版**只**收本週 aaaaa 被分派、且需在 8/30 驗收的工項。決策層議題（人力、備援、渲染層排程）不在本版展開。
>
> **2026-08-26 追加：** 開 [V10-I1](./dev_v10/I1_rotate_port_offset_fix.md) 修正 `rotatePortOffset`（pad-to-square）；原「utils 唯讀」對本函式開例外，因阻擋全綠且負責人即 aaaaa。

---

## 概述

### 目標

1. **資料側全綠**：全部機器 × `rotation ∈ {0,1,2,3}` 的佔格格數與埠 `side`／`offset` 合法性，測試自動斷言且**本週修到全綠**
2. **一致性測試上線**：R-E1 的 8/30 檢查點併入本版（`dataConsistency.test.ts`）
3. **錯機清單**：`fault=data` 本週全修；`fault=render` 只記錄
4. **8/30 演示不被卡**：`/dev` 新增最小擺放演示頁，確保「從下方拿一台放到格子上」可演示
5. **上游文件同步**：回寫 `detail/A2_*.md` 的過期欄位名與驗收面
6. **週節奏機制**：R-A4 文件由 aaaaa 撰寫，交主編確認並共同驗收

### 已定案（2026-08-26）

| 項 | 結論 |
|----|------|
| 版本號 | **V10**＝本週 aaaaa 執行切片 |
| 權威欄位名 | 以**程式碼現況**為準：頂層 `width`／`height`；埠在 `modes[].input_ports`／`output_ports`（A2 文檔的 `size`／`modes[].ports` 為舊稱，本版回寫） |
| **資料側標準** | **全綠。** 本週修正所有機器參數問題；測試**不得**留 skip／todo／allowlist；不採「剩餘排 9/6」 |
| **8/30 驗收（從嚴）** | 以**測試＋錯機清單＋`/dev` 拓樸截圖**為準；**主畫布目視為加分**，只用來記 `fault=render` 列 |
| **R-E1 併入** | `src/__tests__/data/dataConsistency.test.ts` 本週上線（E1 §4.3 五項）；E1 其餘月度檢查點不在本版 |
| **M1 演示備援** | `/dev` 新增最小擺放演示頁；不依賴 toby W0823-T1 與主線擺放鏈 |
| **R-A4 分工** | 文件主撰＝aaaaa；驗收＝aaaaa＋dernoson 共同；產出交主編確認後生效 |
| 清單路徑 | `docs/roadmap/detail/A2_port_grid_defect_list.md`（新建） |
| 測試路徑 | `machineGeometry.test.ts`＋`dataConsistency.test.ts`（`src/__tests__/data/`） |
| 修資料流程 | 只改 `docs/aaaaa/data/machines.json` → `pnpm generate:src-data` → 同 commit 含產物 |
| `fault=render` owner | 記「待佈局層落地後轉單」；本週不指名 L2、不改 canvas |
| 像素／格子落差 | 已由 8/25 佈局視角自建決議解決；清單保留一列紀錄即可 |
| 性質鎖 | 資料／純函式為主；`/dev` 演示頁屬 L1 除錯工具（唯讀資料、不接 `editorStore`），不視為 L2／L3 接線 |

詳見 [A1_scope_decision.md](./dev_v10/A1_scope_decision.md)。

### 非目標（本版不做）

- 改 `FactoryCanvas.vue`／`FlowNodeOverlay.vue` 事件、任何 Pinia action 簽名、L3 正式樣式
- 重構 `geometryUtils`（仍唯讀）；**`portUtils.rotatePort*` 已由 I1 修正**，其餘 portUtils 不擴張
- 修 `fault=render`（只記錄轉單）
- 管線佔格（`getPipelineOccupiedGrids`；屬 10 月）
- 主線擺放鏈（R-B2）、Inspector（R-B4）——`/dev` 演示頁不取代它們
- 9 月渲染層換址（測試本週仍 import 現有 `geometryUtils`；廢除時再跟改）

### 流程大綱

```text
A 定案 → B 測試 → C 錯機清單 → I 修 rotatePort（utils）→ E /dev 演示
      → D 資料修（本批無 JSON 待修）→ F 驗收＋PR
      G 上游文件同步    ┐ 與平行
      H R-A4 週節奏      ┘
```

### 週切片

| 區間 | 切片 | 對應工項 |
|------|------|----------|
| → 約 8/27 | 兩份測試骨架＋第一版失敗清單（先不修） | B1、C1 初稿 |
| → 約 8/28 | 修資料至全綠；演示頁可跑 | D1、E1 |
| → 8/30 門檻 | 清單定稿、三證據、PR、上游回寫、A4 交主編 | C1、F1、G1、H1 |

### 下游消費者（PR 必寫）

```text
下游消費者（下週起）：
- B1 工具列佔格文字、B2 擺放預覽 → 必須讀同一份 getMachine／getOccupiedCells
- C1 port hit、D2 E001 重疊 → 依賴本週修正後的 width×height／port 合法性
- 渲染側 fault=render 列 → 佈局層落地後轉單，不在本 PR 改 canvas
- toby W0823-T1（InspectorPanel）→ 顯示選取設備 width×height，為最快驗資料窗口
```

---

## V10-A｜範圍與定案

- [x] **V10-A1** 範圍、欄位對照、8/26 六項決策、與 V9／佈局改寫／W0823 邊界
  - 細項：[dev_v10/A1_scope_decision.md](./dev_v10/A1_scope_decision.md)

---

## V10-B｜測試（幾何＋資料一致性）

- [x] **V10-B1** `machineGeometry.test.ts`：全機器 × 四 rotation 佔格＋埠合法性；併 R-E1 `dataConsistency.test.ts`
  - 細項：[dev_v10/B1_machine_geometry_tests.md](./dev_v10/B1_machine_geometry_tests.md)
  - 首跑：一致性全綠；佔格全綠；埠 25 紅（皆 rotation≠0）→ 見 B1 §6，交 C1

---

## V10-C｜錯機清單

- [x] **V10-C1** `A2_port_grid_defect_list.md`（初稿→utils 結案回寫；無 JSON data 待修）
  - 細項：[dev_v10/C1_defect_list.md](./dev_v10/C1_defect_list.md)
  - 清單：[A2_port_grid_defect_list.md](../../roadmap/detail/A2_port_grid_defect_list.md)

---

## V10-D｜資料修正與 codegen

- [x] **V10-D1** 本批**無** `fault=data` JSON 待修（B1 rot0 全過；紅燈由 I1 utils 消除）；codegen 未改
  - 細項：[dev_v10/D1_fix_data_codegen.md](./dev_v10/D1_fix_data_codegen.md)
  - 若日後發現真正資料錯再重開

---

## V10-E｜M1 演示備援

- [x] **V10-E1** `/dev/placement-demo`：選機／旋轉／埠表＋拓樸佔格
  - 細項：[dev_v10/E1_dev_placement_demo.md](./dev_v10/E1_dev_placement_demo.md)

---

## V10-I｜L1 utils 釐清（追加）

- [x] **V10-I1** `rotatePort` pad-to-square；`rotatePortOffset` 委派；測試全綠
  - 細項：[dev_v10/I1_rotate_port_offset_fix.md](./dev_v10/I1_rotate_port_offset_fix.md)

---

## V10-F｜驗收與合入

- [x] **V10-F1** PR #32 與個人驗收路徑已交付；**2026-08-31 手動標完成**（合入／主編 `/dev` 若仍在途，不擋 V10 結案、不帶入 V11）
  - 細項：[dev_v10/F1_acceptance_and_pr.md](./dev_v10/F1_acceptance_and_pr.md)
  - 證據：[dev_v10/evidence/](./dev_v10/evidence/)
  - PR：https://github.com/dernoson/endfield-playground/pull/32

---

## V10-G｜上游文件同步

- [x] **V10-G1** 回寫 `detail/A2_grid_and_port_alignment.md`＋E1 §4.3（與 F1 同批）
  - 細項：[dev_v10/G1_upstream_doc_sync.md](./dev_v10/G1_upstream_doc_sync.md)

---

## V10-H｜週節奏與門檻驗收機制（R-A4）

- [x] **V10-H1** R-A4 相關交付以手動完成標注（2026-08-31）；不帶入 V11
  - 細項：[dev_v10/H1_weekly_cadence_gate.md](./dev_v10/H1_weekly_cadence_gate.md)

---

## 封鎖項目追蹤

| ID | 封鎖原因 | 等待對象 | 解除條件 |
|----|---------|---------|----------|
| B1 | — | — | **已解除**（A1 定案完成） |
| C1 | — | — | **已解除**（B1 失敗表見 B1 §6） |
| D1 | — | — | **已解除**（本批無 JSON 待修；I1 解紅） |
| E1 | — | — | **已解除**（`/dev/placement-demo`） |
| I1 | — | — | **已解除**（pad-to-square；388 全綠） |
| F1 | — | — | **已解除**（2026-08-31 手動完成） |
| G1 | — | — | **已解除**（A2／E1 已回寫） |
| H1 | — | — | **已解除**（2026-08-31 手動完成） |
| — | **不**依賴 toby W0823-T1、shirone W0823-S1 | — | 演示走 `/dev`（E1） |

---

## 完成定義（Definition of Done）

### 資料與測試（硬標準）

- [x] `machineGeometry.test.ts` 涵蓋全部機器 × 四 rotation，**全綠**（I1 後）
- [x] `dataConsistency.test.ts` 涵蓋 R-E1 §4.3 五項並通過
- [x] 本批無 JSON `fault=data` 待修；utils 紅燈由 I1 消除
- [x] （資料未改則）無需 codegen commit

### 交付物

- [x] 錯機清單存在（含 utils 結案回寫）
- [x] `/dev/placement-demo` 可跑
- [x] `detail/A2_*.md` 過期處已回寫（G1）
- [x] R-A4／H1 以手動完成標注（2026-08-31）

### 8/30 三證據（從嚴）

- [x] 證據一：兩份測試通過輸出（見 `dev_v10/evidence/F1_test_output.md`；全量 677）
- [x] 證據二：錯機清單連結（Discord 已貼）
- [x] 證據三：`/dev/placement-demo` 個人驗收完畢；F1 手動結案（2026-08-31）
- [x] 主畫布目視（加分）：旋轉後 **port 牽線未跟著改** → 已登記 `fault=render`（見清單 §4）；不擋門檻

### 品質閘

- [x] `pnpm type-check`／`lint-check`／`format-check`／`test` 通過
- [x] PR 描述含下游消費者；A2 §11 已回寫（PR #32）

---

## 未交頂替

**A2 部分無頂替**（8/30 門檻必要條件）。若無法完成，當日會前上報 dernoson＋改期，不得默默延後。

| 工項 | 未交影響 |
|------|----------|
| B1／C1／D1／F1 | **擋門檻**，無頂替 |
| E1 演示頁 | 演示改用 `/dev/flow-engine` 既有拓樸截圖（門檻仍成立，但「拖一台」無法現場演示） |
| G1 | 不擋門檻；順延 9/6（但欄位名歧義會持續誤導下游） |
| H1 | 不擋門檻（R-A4 為加分）；未交則 8/30 完成率無紀錄，須會上明記 |

---

## 本週工項檢核（對照 W0823-A1／R-A2）

| 工項 | W0823-A1 要求 | V10 狀態 | 備註 |
|------|---------------|----------|------|
| A1 定案 | 欄位對照、範圍邊界 | [x] | |
| B1 測試 | 全機×四 rotation＋consistency | [x] | I1 後全綠 |
| C1 清單 | 欄位齊、分責 | [x] | Discord 已貼 |
| D1 資料 | fault=data 全修 | [x] | 本批無 JSON；utils 已修 |
| E1 演示 | `/dev` 備援 | [x] 個人驗收 | 待主編驗收 |
| I1 utils | rotatePort | [x] | pad-to-square |
| F1 驗收 | 三證據＋品質閘＋PR | [x] | 2026-08-31 手動完成 |
| G1 回寫 | A2 過期處 | [x] | |
| H1 A4 | 週節奏交主編 | [x] | 2026-08-31 手動完成 |
| 主畫布 | 加分；render 登記 | [x] 已登記 | port 牽線→§4 render 列 |

---

## 開發日誌

### 2026-08-31

- **F1／H1 手動標完成**：V10 結案；殘項不帶入 [todolist_v11](./todolist_v11.md)

### 2026-08-26

- 依 W0823-A1／WEEK_20260823（v1.4）／R-A2 開 V10 規劃
- 納入 8/25 佈局改寫影響：交付物不變；畫布自驗；`fault=render` owner 填法調整
- 開發分支：`dev/aaaaa0826`（base＝`docs/public-roadmap-dispatch-0825`）
- **六項決策落版：** ①資料本週全綠、②回寫 A2 過期處、③8/30 三證據從嚴、④R-E1 一致性測試併入 B1、⑤R-A4 由 aaaaa 撰寫並與主編共同驗收、⑥`/dev` 新增擺放演示備援
- 工項由 A–E 擴為 A–H；範圍收斂為「本週 aaaaa 應進行與驗收」者
- **V10-A1 定案完成：** 核對 JSON／`machines.ts`／幾何 API／W0823-A1／下游 B–H；解鎖 B1
- **V10-B1 完成：** 新增 `machineGeometry.test.ts`＋`dataConsistency.test.ts`；首跑 351 過／25 失敗（埠旋轉後越界、無 rot0 紅）；解鎖 C1
- **V10-C1 初稿：** 新建 `A2_port_grid_defect_list.md`（10 台＋2 meta）；初判 utils；D1 勿改 JSON；Discord 待貼
- **V10-I1／E1：** pad-to-square 修正 `rotatePort`；`/dev/placement-demo`；portUtils＋machineGeometry＋consistency **388 全綠**；清單回寫已修；D1 本批無 JSON 變更
- **V10-F1／G1：** 四項品質閘全綠（677 tests）；A2 過期欄位／驗收面＋E1 §4.3 回寫；PR #32 已開
- **檢核收尾：** Discord 清單＋PR 已貼；`/dev/placement-demo` 個人驗收完；主編 `/dev` 驗收待；主畫布旋轉後 port 牽線未跟→清單 §4 `fault=render`（owner：R-B3／佈局層）
