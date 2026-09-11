# V12-E1 — 驗收、PR、解鎖句

**對應工項：** V12-E1  
**狀態：** `[ ]` 未開始  
**日期：** 2026-09-11  
**依賴：** [C1](./C1_layout_store.md)、[D1](./D1_dev_store_preview.md)  
**驗收集：** [V12_acceptance_guide.md](./V12_acceptance_guide.md)

---

## 1. 目標

個人與 review_gate 可依同一清單過關；PR body 含讀取面簽章與解鎖句（或「本週仍只讀」）。

---

## 2. 解鎖句規則

### 2.1 達契約（預期本週）

```text
layout-store：useLayoutStore 可讀寫 devices／pipelines；connections 為 getter；測試綠；L2 可開（本週仍只讀；擺放／選取等 9/14 整合）
```

> 「L2 可開」後面接的是**已允許範圍的澄清**，不是新開擺放。本週 toby／harry 範圍不變。

### 2.2 未達契約

```text
layout-store：尚未解鎖；缺 <具體缺項>。L2 維持只讀 props／fixture。
```

### 2.3 禁止

- 寫成「L2 可開擺放／選取／落子」而未另經主編＋aaaaa 宣告
- 暗示 B2 已解封

---

## 3. PR 檢查清單

- [ ] 標題帶 `W0907-A0`／`V12`
- [ ] 下游消費者段落（todolist 概述）
- [ ] 讀取面簽章（型別即可）
- [ ] 解鎖句或「尚未解鎖」
- [ ] 硬約束：未改 editorStore／GridCanvas／ToolbarPanel／FactoryCanvas

---

## 4. 證據

| 證據 | 路徑 |
|------|------|
| 解鎖句（達時） | `dev_v12/evidence/E1_unlock.md`（實作後建） |
| 驗收步驟 | [V12_acceptance_guide.md](./V12_acceptance_guide.md) |

---

## 5. DoD

- [ ] C1＋D1 DoD 滿足
- [ ] 驗收指南步驟可跑通
- [ ] PR 可審或已合入
- [ ] 解鎖句已貼 PR／Discord（或明寫未解鎖）

---

## 6. 開發日誌

### 2026-09-11

- 解鎖句預設帶「本週仍只讀」；禁止提前解鎖擺放
