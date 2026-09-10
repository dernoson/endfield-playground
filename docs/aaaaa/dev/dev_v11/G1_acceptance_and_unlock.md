# V11-G1 — 驗收、PR、L2 解鎖宣告

**對應工項：** V11-G1  
**狀態：** `[x]` 完成（2026-08-31）；PR #40 **已合入 master**（2026-09-01）  
**依賴：** B1、D1、E1 可測；F1 可跑；C1 建議同批；H1 不擋  
**最後更新：** 2026-09-01  
**正式依據：** W0831-A0 §2–§3；A1 決策 2  
**證據：** [evidence/G1_unlock.md](./evidence/G1_unlock.md)  
**PR：** https://github.com/dernoson/endfield-playground/pull/40

---

## 1. 解鎖門檻（已定案＝嚴格）

須**同時**滿足：

1. `types/layout`（或等價）可編譯＋Breaking 註記  
2. `resolveConnections` 單元測試綠  
3. `toTopology` 單元測試綠  

另本版必要：`/dev` 格點演示可跑（F1）。  
**不動 store／未加深舊畫布**為硬約束。

### 1.1 已發解鎖句

```text
layout-L1：types/layout + resolveConnections + toTopology 可測已推；L2 可開最小 GridCanvas 只讀渲染（仍待 store 模型另開）
```

---

## 2. 驗收清單

| # | 項 | 狀態 |
|---|----|------|
| 1 | B／D／E 測試輸出 | [x] layout＋mockLayout 59 綠（見證據） |
| 2 | C1 改名＋補測 | [x] |
| 3 | F1 `/dev` 步驟 | [x] [F1 §4.1](./F1_dev_grid_preview.md) |
| 4 | Breaking 註記在 PR | [x] 見證據 §4／PR body |
| 5 | 下游消費者段落 | [x] 見證據 §5／PR body |
| 6 | 解鎖句 | [x] §1.1 |
| 7 | type-check／lint／本範圍 format／test | [x] |

review_gate：dernoson（合入；不代寫）。

---

## 3. 檔案計畫

| 動作 | 說明 |
|------|------|
| PR | 自 `dev/aaaaa0831`；描述含下游消費者、Breaking、解鎖句 |
| 證據 | `dev_v11/evidence/G1_unlock.md` |

---

## 4. DoD

- [x] 上表全勾
- [x] todolist_v11 狀態回寫

---

## 5. 開發日誌

### 2026-08-31

- 解鎖升為三件皆可測；F1 必要併入個人驗收
- 品質閘通過；發解鎖句；PR #40 已合入 master
  - https://github.com/dernoson/endfield-playground/pull/40

### 2026-09-01

- PR #40 合入；驗收步驟彙整至 [V11_acceptance_guide.md](./V11_acceptance_guide.md)
