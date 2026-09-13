# V11-A1 — 範圍與定案

**對應工項：** V11-A1  
**狀態：** `[x]` 定案完成（2026-08-31）  
**日期：** 2026-08-31  
**開發分支：** `dev/aaaaa0831`  
**正式依據：** [W0831-A0](../../../work_dispatch/aaaaa/0831/W0831-A0_layout_l1_foundation.md)、[W0831-A1](../../../work_dispatch/aaaaa/0831/W0831-A1_toolbar_real_machines.md)、[EARLY_START](../../LAYOUT_REWRITE_EARLY_START_0831.md)、[佈局評估](../../佈局視角渲染層自建_初步規劃與評估.md)

> **執行計畫：** 本檔所屬之 `todolist_v11`＋`dev_v11/` **即為**佈局 L1 執行計畫檔。

---

## 1. 背景

8/25 定案佈局視角自建 SVG；8/31 升定案：**L1 打底最優先**，L2 強綁等 aaaaa 書面宣告。  
`src/utils/layout/` 已有 4／6：`deviceOccupancy`／`pipelineGeometry`／`overlapDetection`／`portAnchor`。仍缺 `types/layout`、`resolveConnections`、`toTopology`（R-B2 封鎖原因）。

本週 A0 性質＝純函式／型別／契約；**不以主畫布美觀為驗收**。A1（B1 工具列）為次優，時數衝突讓位 A0。

---

## 2. 最終決策（負責人 2026-08-31）

| # | 決策 | 落點 |
|---|------|------|
| 1 | V11＝本週 A0＋A1；**A0＞A1** | 本檔／todolist |
| 2 | L2 解鎖＝**型別＋兩支純函式皆可測** | [G1](./G1_acceptance_and_unlock.md) |
| 3 | **不動 editorStore** | 全工項硬鎖 |
| 4 | layout＝領域模型；footprint＝幾何 DTO | [B1](./B1_types_layout.md) |
| 5 | `toTopology` → FlowEngine nodes／edges 形 | [E1](./E1_to_topology.md) |
| 6 | 端點格＝`resolvePortAnchorCell` → Connection；否則斷線、管線保留 | [D1](./D1_resolve_connections.md) |
| 7 | 既有 utils **改名對齊＋補測** | [C1](./C1_layout_utils_align.md) |
| 8 | `/dev` 格點演示 **本版必要** | [F1](./F1_dev_grid_preview.md) |
| 9 | V10 F1／H1 手動完成、不帶入 | todolist 概述 |
| 10 | 分支 `dev/aaaaa0831` | meta |
| 11 | V11 文件＝執行計畫檔 | 評估文狀態回寫 |

### 2.1 實作策略（API／演算法）

接手的 API 與串接面尚可能有落差。**先依原定寫法與演算法撰寫**（評估文 §1／§4.7、現有 footprint／portAnchor 契約）；**在驗證階段再逐步修正**。禁止初稿另開平行契約。

### 2.2 現況對照

| 規劃檔名 | 現況 | 本版處置 |
|----------|------|----------|
| `types/layout.ts` | 不存在 | **新建**（B1） |
| `deviceOccupancy.ts` | 已有；缺獨立單元測（幾何測經 machineGeometry） | 補測（C1） |
| `pipelineGeometry.ts` | 已有＋測 | 維持 |
| `portAnchors.ts` | 已改名＋測 | **C1 完成** |
| `overlapDetection.ts` | 已有＋測（規劃表未列但為現行 4／6） | 維持；列入六件族譜 |
| `resolveConnections.ts` | 無 | **新建**（D1） |
| `toTopology.ts` | 無 | **新建**（E1） |

`Position` 已為 `{x,y,z}`；`AxisMove` 僅 x／y——與 8/25 裁決一致，本版不重開。

---

## 3. 與既有版本／工單邊界

| 對象 | 關係 |
|------|------|
| V10 | 資料／佔格測試完成；殘項手動完成；本版不帶 |
| R-B2 | 仍 `[!]`；本版解鎖「純函式＋型別」；**store 模型仍缺**，宣告後 L2 只開允許範圍 |
| W0831-A0 | 本版最優主線 |
| W0831-A1 | 本版次優（H1） |
| FlowEngine | 經 adapter；**不改** `useFlowEngine` 本體 |
| 舊畫布 | **禁止加深** |

---

## 4. 非目標

見 [todolist_v11](../todolist_v11.md)「非目標」。補充：本版**不**產品化 GridCanvas；F1 僅 `/dev` 除錯頁。

---

## 5. DoD（本細項）

- [x] 11 項決策表已寫入 todolist 與本檔
- [x] B–H 細項可依本檔開工，無待裁決欄位名
- [x] 解鎖門檻、store 鎖、連線規則、實作策略已明示

---

## 6. 開發日誌

### 2026-08-31

- 負責人確認 11 項；建立 todolist_v11＋dev_v11 骨架
