# V10-F1 — 8/30 驗收、品質閘與 PR

**對應工項：** V10-F1  
**狀態：** `[ ]` 未開始  
**依賴：** B1、C1 定稿、D1 全綠、E1 演示頁  
**最後更新：** 2026-08-26  
**正式依據：** [W0823-A1](../../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md) §5–§8、[R-A2](../../../roadmap/detail/A2_grid_and_port_alignment.md) §9

---

## 1. 驗收口徑（決策 3：從嚴）

**8/30 以下列三證據為準：**

| # | 證據 | 產出者 |
|---|------|--------|
| 1 | 兩份測試通過輸出（`machineGeometry`＋`dataConsistency`），**全綠無 skip** | [B1](./B1_machine_geometry_tests.md)＋[D1](./D1_fix_data_codegen.md) |
| 2 | 錯機清單（欄位齊、`fault=data` 全標已修） | [C1](./C1_defect_list.md) |
| 3 | `/dev` 截圖：拓樸頁或擺放演示頁，至少一台常用加工機佔格與 JSON 一致 | [E1](./E1_dev_placement_demo.md) |

**主畫布目視＝加分。** 主畫布若顯示不符，**不影響門檻判定**，一律登記為 `fault=render` 列（owner：待佈局層落地後轉單）。理由：本週不改 canvas，且 `FlowNodeOverlay` 已排 9 月廢除。

---

## 2. 驗收步驟

| 步驟 | 動作 |
|------|------|
| 1 | `pnpm test` → 截兩份測試通過輸出 |
| 2 | `pnpm dev` → 開 `/dev/placement-demo`：選粉碎機（3×3）→ 點格放下 → 佔格正確 |
| 3 | 再選一台非方形機（例 6×4）→ 旋轉 → 寬高對調、埠換邊正確 |
| 4 | 開 `/dev/flow-engine` 拓樸區交叉對照同一台的 `side`／`offset` |
| 5 | **加分：** 開主編輯畫布放一台對照；不符 → C1 加 `fault=render` 列，**不改 canvas** |
| 6 | 截圖／短錄影附 PR |

---

## 3. 品質閘

```bash
pnpm type-check
pnpm lint-check
pnpm format-check
pnpm test
```

四項全過才算 DoD。

---

## 4. PR 必寫段落

```text
## Summary
- V10 / W0823-A1：佔格與 port 對資料（R-A2）
- 新增 machineGeometry.test.ts + dataConsistency.test.ts（R-E1 8/30 檢查點）
- 錯機清單 A2_port_grid_defect_list.md：fault=data 全部已修
- /dev/placement-demo：M1 演示備援（L1 除錯頁，不接 store）
- detail/A2 過期欄位名／驗收面已回寫

## 下游消費者（下週起）
- B1 工具列佔格文字、B2 擺放預覽 → 必須讀同一份 getMachine／getOccupiedCells
- C1 port hit、D2 E001 重疊 → 依賴本週修正後的 width×height／port 合法性
- 渲染側 fault=render 列 → 佈局層落地後轉單，不在本 PR 改 canvas
- toby W0823-T1（InspectorPanel）→ 顯示選取設備 width×height

## Test plan
- [ ] pnpm type-check / lint-check / format-check / test（全綠、無 skip）
- [ ] /dev 截圖：常用機佔格正確；非方形機旋轉正確
- [ ] 錯機清單欄位齊、Discord 已丟初稿連結
```

review_gate：dernoson（合入／是否算過門檻）。

---

## 5. 回報時點

| 時機 | 動作 |
|------|------|
| 清單初稿 | Discord 丟連結 |
| 卡住（codegen／合入／門檻判定／§6 待確認） | dernoson |
| 完成 | PR＋回寫 A2 §11；週日會演示 §2 腳本 |

---

## 6. 需主編確認的項目（僅在觸發時才問）

| # | 項目 | 觸發條件 | 建議處置 |
|---|------|----------|----------|
| 1 | 遊戲原始數值有疑義 | 某機的 `width`／`height` 或埠語意無可靠來源可核，導致「全綠」需靠猜 | 以幾何合法性為判準先修，語意存疑列清單 `note`；PR 標為待核 |
| 2 | 工具函式 bug 阻擋全綠 | 錯在 `geometryUtils`／`portUtils` 而非資料 | 本週唯讀原則 vs 全綠標準衝突 → 當日上報，二擇一 |
| 3 | codegen stub 需改腳本 | stub 幾何／埠不合法 | 最小改值、不動 schema；PR 標明 |
| 4 | `/dev` 演示頁的性質歸屬 | 若主編認為 `.vue` 新頁違反「一週一塊」 | 已限定唯讀、不接 store（[A1](./A1_scope_decision.md) §2.4）；若不接受則撤頁，演示退回拓樸頁截圖 |

**其餘一律不上升。** 本週工項的範圍、優先序、驗收口徑已由 8/26 決策定案。

---

## 7. 非目標

- 本 PR 不改 canvas／Pinia／L3 正式樣式
- 不處理 `fault=render`
- 不要求 shirone W0823-S1／toby W0823-T1 同 PR 合入

---

## 8. DoD

- [ ] 三證據齊備並附 PR
- [ ] 四項品質閘通過
- [ ] PR 含下游消費者段落
- [ ] C1 定稿已鏈結
- [ ] A2 §11 已回寫（併 [G1](./G1_upstream_doc_sync.md) 一起做）
- [ ] todolist_v10 DoD 可全勾

---

## 9. 開發日誌

### 2026-08-26

- 建立細項（原 E1 改編號為 F1；`/dev` 演示頁接手 E1）
- 決策 3 落版：三證據從嚴、主畫布目視降為加分
- 新增 §6 需主編確認清單（僅觸發時上升）
