# V10-F1 — 8/30 驗收、品質閘與 PR

**對應工項：** V10-F1  
**狀態：** `[~]` 品質閘全綠、證據／A2 回寫就緒；待推 PR＋截圖附檔  
**依賴：** B1、C1、D1、E1、I1（均已完成）；G1 同批回寫  
**最後更新：** 2026-08-26  
**正式依據：** [W0823-A1](../../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md) §5–§8、[R-A2](../../../roadmap/detail/A2_grid_and_port_alignment.md) §9

---

## 1. 驗收口徑（決策 3：從嚴）

**8/30 以下列三證據為準：**

| # | 證據 | 產出者 | 本檔鏈結 |
|---|------|--------|----------|
| 1 | 兩份測試通過輸出（`machineGeometry`＋`dataConsistency`），**全綠無 skip** | B1＋I1 | [evidence/F1_test_output.md](./evidence/F1_test_output.md) |
| 2 | 錯機清單（欄位齊、data／utils 已結案） | C1 | [evidence/F1_defect_list.md](./evidence/F1_defect_list.md) → [清單](../../../roadmap/detail/A2_port_grid_defect_list.md) |
| 3 | `/dev` 截圖：拓樸頁或擺放演示頁 | E1 | [evidence/F1_dev_demo.md](./evidence/F1_dev_demo.md)（截圖待附 PR） |

**主畫布目視＝加分。** 主畫布若顯示不符，**不影響門檻判定**，一律登記為 `fault=render` 列（owner：待佈局層落地後轉單）。

---

## 2. 驗收步驟

| 步驟 | 動作 | 結果（2026-08-26） |
|------|------|-------------------|
| 1 | `pnpm test` → 截兩份測試通過輸出 | **677 passed**；見證據一 |
| 2 | `pnpm dev` → `/dev/placement-demo`：粉碎機 3×3 | 頁面已掛；截圖待附 |
| 3 | 非方形機旋轉埠 | 由 `portUtils`／`machineGeometry` 覆蓋；演示頁可目視 |
| 4 | `/dev/flow-engine` 交叉對照 | 加分／可選 |
| 5 | 主編輯畫布對照 | 加分；不符記 render |
| 6 | 截圖／短錄影附 PR | **待 aaaaa 附檔** |

---

## 3. 品質閘

```bash
pnpm type-check
pnpm lint-check
pnpm format-check
pnpm test
```

| 閘 | 結果（2026-08-26） |
|----|-------------------|
| type-check | 通過 |
| lint-check | 通過 |
| format-check | 通過 |
| test | 30 files／677 tests 通過 |

---

## 4. PR 必寫段落

```text
## Summary
- V10 / W0823-A1：佔格與 port 對資料（R-A2）
- 新增 machineGeometry.test.ts + dataConsistency.test.ts（R-E1 8/30 檢查點）
- 修正 rotatePort（pad-to-square）；錯機清單結案（本批無 JSON fault=data）
- /dev/placement-demo：M1 演示備援（L1 除錯頁，不接 store）
- detail/A2 過期欄位名／驗收面已回寫（V10-G1）

## 下游消費者（下週起）
- B1 工具列佔格文字、B2 擺放預覽 → 必須讀同一份 getMachine／getOccupiedCells
- C1 port hit、D2 E001 重疊 → 依賴本週修正後的 width×height／port 合法性
- 渲染側 fault=render 列 → 佈局層落地後轉單，不在本 PR 改 canvas
- toby W0823-T1（InspectorPanel）→ 顯示選取設備 width×height

## Test plan
- [x] pnpm type-check / lint-check / format-check / test（全綠、無 skip）
- [ ] /dev 截圖：常用機佔格正確；非方形機旋轉正確（待附）
- [ ] 錯機清單 Discord 已丟連結
```

review_gate：dernoson（合入／是否算過門檻）。

---

## 5. 回報時點

| 時機 | 動作 |
|------|------|
| 清單初稿 | Discord 丟連結（**仍待貼**） |
| 卡住 | dernoson |
| 完成 | PR＋回寫 A2 §11；週日會演示 §2 腳本 |

---

## 6. 需主編確認的項目（僅在觸發時才問）

| # | 項目 | 觸發條件 | 本週狀態 |
|---|------|----------|----------|
| 1 | 遊戲原始數值有疑義 | 無可靠來源可核 | **未觸發** |
| 2 | 工具函式 bug 阻擋全綠 | portUtils | **已自修**（V10-I1；負責人即 aaaaa） |
| 3 | codegen stub 需改腳本 | stub 不合法 | **未觸發** |
| 4 | `/dev` 演示頁性質 | 主編認為違反一週一塊 | 已限定唯讀不接 store；若拒則撤頁退拓樸截圖 |

**其餘一律不上升。**

---

## 7. 非目標

- 本 PR 不改 canvas／Pinia／L3 正式樣式
- 不處理 `fault=render`
- 不要求 shirone W0823-S1／toby W0823-T1 同 PR 合入

---

## 8. DoD

- [x] 三證據齊備並附 PR（證據三截圖待 PR 附檔）
- [x] 四項品質閘通過
- [x] PR 含下游消費者段落（開 PR 時貼入）
- [x] C1 定稿已鏈結
- [x] A2 §11 已回寫（併 G1）
- [~] todolist_v10 DoD：資料／測試／F1 相關可勾；G1 本批完成；H1／Discord／截圖仍開

---

## 9. 開發日誌

### 2026-08-26

- 建立細項（原 E1 改編號為 F1；`/dev` 演示頁接手 E1）
- 決策 3 落版：三證據從嚴、主畫布目視降為加分
- 新增 §6 需主編確認清單（僅觸發時上升）
- **開工：** 四項品質閘全綠（677 tests）；寫證據 stub；併 G1 回寫 A2／E1 §4.3；準備開 PR
