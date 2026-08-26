# A2 佔格／port 錯機清單

| meta | value |
|------|-------|
| 對應 | [R-A2](./A2_grid_and_port_alignment.md)、[W0823-A1](../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md) |
| 來源 | V10-B1 首跑（2026-08-26）：351 過／25 失敗；詳見 [B1 §6](../../aaaaa/dev/dev_v10/B1_machine_geometry_tests.md) |
| 狀態 | **初稿**（分責已填；`fault=data` 待 D1／utils 裁決後定稿） |
| 最後更新 | 2026-08-26 |

欄位凍結見 A2 §4.1。`expected_size`＝頂層 `width×height`。

---

## 0. 摘要

| 項 | 結論 |
|----|------|
| `dataConsistency` | 全綠（JSON↔src 一致） |
| 佔格格數／四角落 | 全綠（全機器 × 四 rotation） |
| 埠合法性 | 25 紅；**全部為 rotation∈{1,2,3}**；**rotation=0 零失敗** |
| 初判 | 靜態埠在未旋轉時合法 → **非**單純 JSON offset 越界；高度懷疑 `rotatePortOffset`（非方形機多步旋轉） |
| 本週處置 | utils **唯讀**（另開單）；**勿為這批失敗改 JSON** 除非裁決改為 data。若 utils 擋全綠 → 上報 dernoson（見 V10-D1 §4） |

---

## 1. 紀錄列（非待修資料）

| machine_id | expected_size | observed | port_mismatch | fault | owner | note |
|------------|---------------|----------|---------------|-------|-------|------|
| `_meta_coord_space` | — | — | — | — | 已由渲染層決議解決 | 舊：`useValidation.buildContext` 像素 vs `getOccupiedCells` 格子假設；**8/25 佈局視角自建已統一為格子座標**；本週不修 |
| `_meta_rotatePortOffset` | — | 旋轉後 offset 越界／負值（測試會 clamp） | 見 §2 各機；典型 `→ …@-1` | — | 另開單（utils） | 嫌疑：`src/utils/portUtils.ts` `rotatePortOffset` 非方形機多步旋轉。影響機見 §2。V10 本週**不改** utils。若確認 → 9 月／另單；測試綠化路徑見 D1 §4 |

---

## 2. machineGeometry 埠失敗明細（初稿）

每台一列（同機多 rotation 合併）。`fault` 初填：因測試紅且 A2 枚舉僅 `data|render|both`，暫標 **`data`**，但 **`note` 覆寫初判＝utils**——D1 **禁止**據此改 JSON。

| machine_id | expected_size | observed | port_mismatch | fault | owner | note |
|------------|---------------|----------|---------------|-------|-------|------|
| `filling_machine` | 6×4 | rot0 合法；rot2／3 旋轉後 offset 越界 | `base_mode` out[4] `bottom@4`；rot=2→`top@-1`；rot=3→`right@-1` | data | aaaaa | **初判 utils**（`_meta_rotatePortOffset`）。rot0 過。D1 勿改 JSON。灌裝機另有 `gas_liquid_mode` 本批未紅 |
| `packaging_machine` | 6×4 | 同上 | `default` out[4] `bottom@4`；rot=2→`top@-1`；rot=3→`right@-1` | data | aaaaa | **初判 utils**。rot0 過。D1 勿改 JSON |
| `grinder` | 6×4 | 同上 | `default` out[4] `bottom@4`；rot=2→`top@-1`；rot=3→`right@-1` | data | aaaaa | **初判 utils**。rot0 過。D1 勿改 JSON |
| `equipment_parts_machine` | 4×6 | rot0 合法；rot1–3 越界 | `default` out[4] `right@4`（rot1→`bottom@-1`；rot2→`left@-1`）；in[0] `left@0` rot3→`bottom@-2` | data | aaaaa | **初判 utils**。rot0 過。D1 勿改 JSON |
| `disassembler` | 6×4 | rot0 合法；rot1–3 越界 | `default` out[0] `right@1`；rot1→`bottom@4`（display 4×6 底邊 max=3）；rot2→`left@4`；rot3→`top@-1` | data | aaaaa | **初判 utils**。rot0 過。D1 勿改 JSON |
| `multi_conduit_inlet` | 3×5 | rot0 合法；rot3 越界 | `default` in[0] `left@1`；rot3→`bottom@-1`（display 5×3） | data | aaaaa | **初判 utils**。僅 rot=3。D1 勿改 JSON |
| `multi_conduit_outlet` | 3×5 | rot0 合法；rot1–3 越界 | `default` out[1] `right@3`；rot1→`bottom@-1`；rot2→`left@-1`；rot3→`top@5`（display 5×3 頂邊 max=4） | data | aaaaa | **初判 utils**。D1 勿改 JSON |
| `material_source` | 1×3 | rot0 合法；rot1–3 越界 | `solid_belt` out[0] `right@1`；rot1→`bottom@-1`；rot2→`left@-1`；rot3→`top@3`（display 3×1 頂邊 max=2） | data | aaaaa | **初判 utils**。JSON 內機。`fluid_pipe` 本批未紅。D1 勿改 JSON |
| `item_source` | 1×3 | 同 material_source 型 | `default` out[0] `right@1`；rot1–3 同上型 | data | aaaaa | **codegen stub**（`SOURCE_SINK_STUBS`）。初判同 utils；若改值見 A1 §2.3 最小改腳本。D1 勿先改 JSON |
| `item_sink` | 1×3 | 同上 | `default` in[0] `right@1`；rot1–3 同上型 | data | aaaaa | **codegen stub**。同上 |

---

## 3. 佔格／一致性（本批無列）

| 檢查 | 結果 |
|------|------|
| `getOccupiedCells` 格數＝旋轉後 W×H | 全過 → 無佔格錯機列 |
| JSON ↔ `src/data`（排除 stub） | 全過 → 無分歧列 |
| 無頂層 ports／WxH 正整數／materials.form／tags | 全過 |

---

## 4. `fault=render`（本週加分目視；初稿尚無）

主畫布目視差異依 8/26 決策 3 為加分，發現後補列；`owner`＝待佈局層落地後轉單。  
**初稿時尚無 render 列**（未做主畫布抽查；E1／F1 階段可補）。

---

## 5. 定稿檢查清單（D1／F1 前）

- [ ] `_meta_rotatePortOffset` 是否改判為 data（若否：§2 各列 fault／owner 改記「紀錄／另開單」，自 data 待修池移除）
- [ ] 若維持 utils：測試全綠路徑＝修 utils（另單）或 dernoson 裁量（D1 §4）
- [ ] Discord 丟本檔連結（下游預覽）
- [ ] 主畫布／`/dev` 抽查後補 render 列（若有）

---

## 6. 開發日誌

### 2026-08-26

- V10-C1 初稿：依 B1 §6 建檔；10 台埠旋轉失敗＋2 筆 meta 紀錄列
- 明確標註：rot0 全過 → 初判 utils，D1 勿據 §2 改 JSON
