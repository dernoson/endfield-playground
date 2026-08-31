# V11-G1 — 驗收、PR、L2 解鎖宣告

**對應工項：** V11-G1  
**狀態：** `[ ]` 未開始  
**依賴：** B1、D1、E1 可測；F1 可跑；C1 建議同批；H1 不擋  
**最後更新：** 2026-08-31  
**正式依據：** W0831-A0 §2–§3；A1 決策 2

---

## 1. 解鎖門檻（已定案＝嚴格）

須**同時**滿足：

1. `types/layout`（或等價）可編譯＋Breaking 註記  
2. `resolveConnections` 單元測試綠  
3. `toTopology` 單元測試綠  

另本版必要：`/dev` 格點演示可跑（F1）。  
**不動 store／未加深舊畫布**為硬約束。

達標後於 Discord **或** PR 留：

```text
layout-L1：types/layout + resolveConnections + toTopology 可測已推；L2 可開 <允許的下一刀>
```

例：`L2 可開最小 GridCanvas 只讀渲染（仍待 store 模型另開）`

未達 → 不得發解鎖句；改寫「尚未解鎖、缺什麼」。

---

## 2. 驗收清單

| # | 項 | 狀態 |
|---|----|------|
| 1 | B／D／E 測試輸出 | [x] 程式已綠（待 PR 附輸出） |
| 2 | C1 改名＋補測 | [x] |
| 3 | F1 `/dev` 截圖或步驟 | [x] 步驟見 [F1 §4.1](./F1_dev_grid_preview.md)；截圖待驗收 |
| 4 | Breaking 註記在 PR | [ ] |
| 5 | 下游消費者段落 | [ ] |
| 6 | 解鎖句或缺項聲明 | [ ] |
| 7 | `pnpm type-check`／`lint-check`／`format-check`／`test` | [ ] |

review_gate：dernoson（合入；不代寫）。

---

## 3. 檔案計畫

| 動作 | 說明 |
|------|------|
| PR | 自 `dev/aaaaa0831`；描述含下游消費者、Breaking、解鎖句／缺項 |
| 可選 | `dev_v11/evidence/` 測試輸出與 `/dev` 記錄 |

---

## 4. DoD

- [ ] 上表全勾或未達項已書面聲明
- [ ] todolist_v11 狀態回寫

---

## 5. 開發日誌

### 2026-08-31

- 解鎖升為三件皆可測；F1 必要併入個人驗收
