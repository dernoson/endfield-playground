# V10-C1 — 錯機清單（A2 defect list）

**對應工項：** V10-C1  
**狀態：** `[ ]` 未開始  
**依賴：** B1（失敗案例來源）  
**最後更新：** 2026-08-26  
**正式依據：** [R-A2](../../../roadmap/detail/A2_grid_and_port_alignment.md) §4.1、[W0823-A1](../../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md) §4–§6

---

## 1. 目標

新建 `docs/roadmap/detail/A2_port_grid_defect_list.md`，作為 8/30 三證據之二（見 [F1](./F1_acceptance_and_pr.md)）。

| 階段 | 時機 | 產出 |
|------|------|------|
| 初稿 | B1 跑完後（約 → 8/27） | 失敗案例列進表；`fault` 可暫標 `data?` |
| 定稿 | → 8/30 前 | 每列填齊全部欄位；`fault=data` 全部標「已修」 |

初稿產出後在 Discord 丟連結（下游可預覽 render 列）。

---

## 2. 凍結欄位（A2 §4.1）

| 欄 | 說明 |
|----|------|
| `machine_id` | snake_case 英文 id（codegen 後的 `id`，非中文 name） |
| `expected_size` | `width×height`（例 `3×3`；勿寫舊稱 `size`） |
| `observed` | 測試／拓樸實際：格數，或「port offset 越界／需 clamp」描述 |
| `port_mismatch` | 哪個 mode 的哪個 port（side／offset／rotation）不符 |
| `fault` | `data`｜`render`｜`both` |
| `owner` | 見 §2.1 |
| `note` | 例「僅 rotation=1」「V10-D1 已修」「座標落差已決議」 |

### 2.1 owner 填法（8/25 更新）

| fault | owner |
|-------|-------|
| `data` | `aaaaa`（本週全修，見 [D1](./D1_fix_data_codegen.md)） |
| `render` | **待佈局層落地後轉單**（不要指名本週 L2／toby；`FlowNodeOverlay` 已排廢除） |
| `both` | 資料半邊 `aaaaa`；渲染半邊同上；`note` 拆清楚 |

---

## 3. 建議表頭範本

```markdown
# A2 佔格／port 錯機清單

| machine_id | expected_size | observed | port_mismatch | fault | owner | note |
|------------|---------------|----------|---------------|-------|-------|------|
| … | … | … | … | … | … | … |
```

### 3.1 必留紀錄列（即使無測試失敗）

| machine_id | note 重點 |
|------------|-----------|
| `_meta_coord_space`（或同等） | 舊：`useValidation.buildContext` 像素 vs `getOccupiedCells` 格子假設；**已由 8/25 渲染層決議解決**；owner＝已由渲染層決議解決；本週不修 |

### 3.2 全綠後清單長什麼樣

決策 1 要求資料側本週全綠，因此定稿時清單應只剩三類列：

| 類別 | 狀態 |
|------|------|
| 原 `fault=data` | 每列 `note` 標「V10-D1 已修」——清單是**修過的紀錄**，不是待辦 |
| `fault=render` | 待轉單（本週不修） |
| 紀錄列（座標落差、工具函式 bug、stub 例外、遊戲數值待核） | 保留供 9 月查 |

**清單本身即交付物**，即使「零 `fault=data`」也要交（那就是一份「資料側無誤」的證明）。

---

## 4. 分責規則

| 來源 | 判定 |
|------|------|
| `machineGeometry`／`dataConsistency` 紅 | `fault=data`（資料側不一致） |
| 測試綠但 `/dev` 拓樸或主畫布目視錯 | `fault=render`；**只記錄、不改 canvas** |
| 兩者都有 | `both` |

主畫布目視差異依決策 3 屬**加分**，但發現的 render 列一律登記。

常用機抽查建議：粉碎機 `crusher`、塑型機 `shaping_machine`、灌裝機（多 mode）各至少一次（步驟見 [F1](./F1_acceptance_and_pr.md) §2）。

---

## 5. 非目標

- 本檔不替代測試；清單是人讀分責表
- 不在清單 PR 裡改渲染層
- 不把「待修」列留到 9/6（決策 1：`fault=data` 本週修完）

---

## 6. DoD

- [ ] `A2_port_grid_defect_list.md` 存在
- [ ] 每列具備 §2 全部欄位（定稿時）
- [ ] 含 §3.1 座標落差紀錄列
- [ ] 所有 `fault=data` 列標「已修」
- [ ] 初稿產出後已在 Discord 丟連結

---

## 7. 開發日誌

### 2026-08-26

- 建立細項；凍結欄位與 8/25 owner 填法
- 決策 1／3 落版：新增 §3.2 全綠後清單形態；主畫布目視改為加分但仍登記 render 列
