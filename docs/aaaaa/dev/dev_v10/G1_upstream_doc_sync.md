# V10-G1 — 上游文件同步（`detail/A2` 過期修正）

**對應工項：** V10-G1  
**狀態：** `[ ]` 未開始  
**依賴：** 無（純文件，可與 B–F 平行）  
**最後更新：** 2026-08-26  
**正式依據：** 8/26 決策 2；[R-A2](../../../roadmap/detail/A2_grid_and_port_alignment.md)

---

## 1. 問題

`docs/roadmap/detail/A2_grid_and_port_alignment.md` 最後更新為 2026-08-22，早於 8/25 佈局裁決與 8/26 本版決策，且沿用 V9 前的欄位名。下游若照該檔實作，會寫出讀不到欄位的程式。

工單 [W0823-A1](../../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md) 已在 §3 用對照表繞過，但 roadmap 細項本身仍是錯的——**兩份文件對同一件事給不同欄位名，是下週 B1／B2 最可能踩的坑。**

---

## 2. 待修清單（逐條）

| # | 位置 | 現況（錯／過期） | 改為 |
|---|------|------------------|------|
| 1 | §1 背景 | 「佔格數與 JSON 的 `size` 對不上」 | `width`／`height` |
| 2 | §1 分責表 | 「JSON `size` 或 `modes[].ports` 本身寫錯」 | `width`／`height`、`modes[].input_ports`／`output_ports` |
| 3 | §1 末段 | 「外層 ports 已移除，埠只存在 `modes[].ports`」 | `modes[].input_ports`／`output_ports` |
| 4 | §3 現況盤點 | 「modes-only；**43 台**」 | JSON **44** 筆；`machineList` **46** 筆（含兩筆 codegen stub） |
| 5 | §3 現況盤點 | 畫布渲染列含 `FactoryCanvas.vue`／`FlowNodeOverlay.vue` | 註明兩檔已排 9 月廢除、本週不改；驗證基準改 `DevTopologySvg` |
| 6 | §4.1 欄位表 | `expected_size`＝「JSON `size` 的 width×height」 | 「頂層 `width`×`height`」 |
| 7 | §4.1 欄位表 | `observed`＝「畫布或 overlay 實際佔的格數」 | 測試結果／`/dev` 拓樸與演示頁；overlay 不再是基準 |
| 8 | §4.1 欄位表 | `owner`：`render` → 記錄後轉給 L2／L3 | `render` → **待佈局層落地後轉單**（不指名本週 L2） |
| 9 | §4.3 判定規則 | `machine.size.width * machine.size.height` | `machine.width * machine.height` |
| 10 | §5 檔案計畫 | 缺一致性測試 | 新增 `src/__tests__/data/dataConsistency.test.ts`（R-E1 8/30 檢查點併入 V10-B1） |
| 11 | §6 週切片 08/30 | 「修完『錯在資料』者；至少一台常用加工機佔格正確」 | 補「資料側全綠（決策 1）」與三證據口徑（決策 3） |
| 12 | §9 DoD | 「至少一台常用加工機在畫布或 overlay 上…」 | 改為 `/dev` 拓樸或擺放演示頁；主畫布目視為加分 |
| 13 | §10 風險 | 「資料錯誤數量超出一週可修 → 剩餘排進 9/6」 | 依決策 1 改為本週全綠；保留「render 列不修」出口 |
| 14 | §11 開發日誌 | 只有 2026-08-22 | 補 2026-08-25（渲染層連帶）與 2026-08-26（本版六項決策） |
| 15 | meta 表 | 最後更新 2026-08-22、狀態 `[ ]` 未開始 | 更新日期；狀態依實際進度 |

---

## 3. 界線：哪些**不能**在本項改

依 [R-A4](../../../roadmap/detail/A4_weekly_cadence_gate.md) §4.5，以下變更需主編＋aaaaa 同意並升版本號，**不在本項自行改**：

| 不改 | 理由 |
|------|------|
| M1 必要工項清單（A1、A2） | 屬「月底門檻必要工項清單變更」 |
| ROADMAP §1.2 已定案表 | 屬「§1.2 已定案項目變更」 |
| 門檻日期 | 同上 |

本項只做**欄位名、台數、驗證面、owner 填法、風險條款、日誌**的事實同步——這些是「文件寫錯」而非「決策改變」。

**但第 11／13 條帶有判定口徑（全綠、三證據）**，屬本週決策落地；若主編認為需追認，在 8/30 會上一併確認（見 [F1](./F1_acceptance_and_pr.md) §6）。

---

## 4. 順帶檢查（發現才改，不主動擴散）

| 對象 | 檢查點 |
|------|--------|
| `ROADMAP_OUTLINE.md` §3 R-A2 一行描述 | 是否仍寫 `size`／台數 |
| `detail/E1_data_codegen_ops.md` §4.3 | 「每台機器有 `size` 且為正整數」→ `width`／`height` |
| `detail/B1`／`B3`／`C1` | 若引用 `size`／`modes[].ports`，記錄但**不在本項改**（屬 9 月各自工項） |

E1 §4.3 那條與本週 `dataConsistency.test.ts` 直接相關，建議一起修。

---

## 5. 非目標

- 改門檻定義、日期、必要工項清單
- 重寫 A2 的技術決策（方案 C 仍成立）
- 擴散修改 9–11 月的 detail 檔
- 升 ROADMAP 大版本

---

## 6. DoD

- [ ] §2 十五條全部處理（改完或標「不適用」並註明）
- [ ] §4 兩處順帶檢查已看過；E1 §4.3 `size` 已改
- [ ] A2 §11 已補 8/25、8/26 兩筆日誌
- [ ] 改動與 [F1](./F1_acceptance_and_pr.md) 的 PR 同批送審
- [ ] 未觸碰 §3 的三項禁改內容

---

## 7. 開發日誌

### 2026-08-26

- 依決策 2 建立細項；列出 A2 細項十五處過期點與三項禁改界線
