# V11-G1 證據 — 品質閘與解鎖句

**日期：** 2026-08-31  
**分支：** `dev/aaaaa0831`

---

## 1. 解鎖句（正式宣告｜可複製）

```text
layout-L1：types/layout + resolveConnections + toTopology 可測已推；L2 可開最小 GridCanvas 只讀渲染（仍待 store 模型另開）
```

---

## 2. 品質閘（本工項範圍）

| 閘 | 結果 |
|----|------|
| `pnpm type-check` | 通過 |
| `pnpm lint-check` | 通過 |
| Prettier（V11 改動檔） | 通過 |
| `vitest` layout＋mockLayout | **8 files／59 tests** 通過 |

全庫 `format-check` 仍有既有債（非本單引入），不擋解鎖。

---

## 3. `/dev` 驗收步驟（F1）

見 [F1 §4.1](./F1_dev_grid_preview.md)：`/dev/layout-l1-preview` 切換 connected／broken。

---

## 4. Breaking 摘要（PR 用）

| 舊 | 新 | 本 PR |
|----|-----|-------|
| `nodes`／`edges` 為唯一藍圖形 | `devices`／`pipelines`；`connections` 衍生 | **僅型別＋純函式**；未改 `editorStore` |
| `addConnection`／`removeConnection` | 廢除（目標） | 註記 only |
| 刪設備連帶刪邊 | 管線可留、斷線 | 由 `resolveConnections` 表達 |

---

## 5. 下游消費者（PR 用）

- L2（toby／harry 等宣告後）：可開最小 GridCanvas **只讀**渲染；仍待 store 模型改寫另開
- FlowEngine：經 `toTopology` 吃 nodes／edges；本 PR 不改引擎本體
- B2 落子鏈：仍封鎖至 store 模型；本週不接落子
- W0831-A1／H1 B1 工具列：次優、不擋本解鎖
