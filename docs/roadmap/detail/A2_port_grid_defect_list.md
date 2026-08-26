# A2 佔格／port 錯機清單

| meta | value |
|------|-------|
| 對應 | [R-A2](./A2_grid_and_port_alignment.md)、[W0823-A1](../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md) |
| 來源 | V10-B1 首跑 → V10-I1 修正 `rotatePort`（pad-to-square） |
| 狀態 | **utils 已修**；資料側埠／佔格測試全綠（2026-08-26） |
| 最後更新 | 2026-08-26 |

欄位凍結見 A2 §4.1。`expected_size`＝頂層 `width×height`。

---

## 0. 摘要

| 項 | 結論 |
|----|------|
| B1 首跑 | 佔格全綠；埠 25 紅（皆 `rotation≠0`）；rot0 零失敗 |
| 根因 | **非 JSON**；`rotatePortOffset` 舊邊對邊 remap 在非方形機出錯 |
| 修正 | [V10-I1](../../aaaaa/dev/dev_v10/I1_rotate_port_offset_fix.md)：pad-to-square 中心旋轉；`machineGeometry`＋`portUtils`＋`dataConsistency` **388 全綠** |
| 資料待修 | **無**（本批無真正 `fault=data` JSON 錯） |
| render | 初稿尚無；主畫布目視為加分 |

---

## 1. 紀錄列

| machine_id | expected_size | observed | port_mismatch | fault | owner | note |
|------------|---------------|----------|---------------|-------|-------|------|
| `_meta_coord_space` | — | — | — | — | 已由渲染層決議解決 | 像素 vs 格子；**8/25 已決議**；本週不修 |
| `_meta_rotatePortOffset` | — | 舊：旋轉後 offset 越界／負值 | 曾影響 10 台（見 §2 歷史） | — | aaaaa（V10-I1） | **2026-08-26 已修**：`rotatePort` pad-to-square；測試全綠。舊列保留供追溯 |

---

## 2. 歷史：曾失敗機台（已因 utils 修復關閉）

以下為 B1 首跑明細；`note` 一律標 **V10-I1 已修（utils）**，**未改 JSON**。

| machine_id | expected_size | observed | port_mismatch | fault | owner | note |
|------------|---------------|----------|---------------|-------|-------|------|
| `filling_machine` | 6×4 | rot0 合法；舊 rot2／3 越界 | `base_mode` out[4] `bottom@4` | data | aaaaa | **初判 utils → V10-I1 已修**；未改 JSON |
| `packaging_machine` | 6×4 | 同上 | `default` out[4] `bottom@4` | data | aaaaa | **V10-I1 已修** |
| `grinder` | 6×4 | 同上 | `default` out[4] `bottom@4` | data | aaaaa | **V10-I1 已修** |
| `equipment_parts_machine` | 4×6 | 同上 | out[4] `right@4`／in[0] `left@0` | data | aaaaa | **V10-I1 已修** |
| `disassembler` | 6×4 | 同上 | out[0] `right@1` | data | aaaaa | **V10-I1 已修** |
| `multi_conduit_inlet` | 3×5 | 同上 | in[0] `left@1` | data | aaaaa | **V10-I1 已修** |
| `multi_conduit_outlet` | 3×5 | 同上 | out[1] `right@3` | data | aaaaa | **V10-I1 已修** |
| `material_source` | 1×3 | 同上 | `solid_belt` out[0] `right@1` | data | aaaaa | **V10-I1 已修** |
| `item_source` | 1×3 | stub | out[0] `right@1` | data | aaaaa | **V10-I1 已修**（stub 同演算法） |
| `item_sink` | 1×3 | stub | in[0] `right@1` | data | aaaaa | **V10-I1 已修** |

---

## 3. 佔格／一致性

| 檢查 | 結果 |
|------|------|
| 佔格格數／四角落 | 全過 |
| JSON ↔ src（排除 stub） | 全過 |
| modes-only／WxH／form／tags | 全過 |

---

## 4. `fault=render`

初稿無。E1／F1 主畫布抽查若有差異再補；`owner`＝待佈局層落地後轉單。

---

## 5. 開發日誌

### 2026-08-26

- C1 初稿：10 台＋2 meta；初判 utils
- I1 修 `rotatePort` 後測試全綠；§2 各列標已修（utils）；無 JSON 變更
