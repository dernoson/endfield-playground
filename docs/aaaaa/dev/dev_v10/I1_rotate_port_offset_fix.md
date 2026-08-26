# V10-I1 — L1／utils：`rotatePortOffset` 釐清與修正

**對應工項：** V10-I1  
**狀態：** `[x]` 完成（2026-08-26）  
**負責人：** aaaaa（V4-B1 原作者）  
**性質：** L1 純函式（utils）  
**最後更新：** 2026-08-26  
**觸發：** V10-B1／C1 — `machineGeometry` 埠斷言 25 紅，皆 `rotation≠0`；rot0 全過

---

## 1. 問題

舊 `rotatePortOffset` 以「原圖 W／H + 邊對邊 remap」逐步翻轉 offset。正方形正確；**非方形**在單步或多步後會算出越界／負值（例 6×4 `bottom@4` rot2 → `-1`）。

靜態 JSON 埠在 rot0 合法 → **不是機器參數寫錯**，是轉換演算法錯。

詳見 [A2_port_grid_defect_list](../../../roadmap/detail/A2_port_grid_defect_list.md) `_meta_rotatePortOffset`。

---

## 2. 定案演算法（pad-to-square）

提出者：aaaaa（2026-08-26）

| 步驟 | 作法 |
|------|------|
| 1 | `S = max(w, h)`，對稱 pad 短邊，機器置中於 S×S tmp |
| 2 | 埠 → 格邊中心點，移入 tmp 座標 |
| 3 | 繞 `(S/2, S/2)` 順時針轉 `rotation` 步（**螢幕 y 向下**：`(dx,dy)→(−dy,dx)`） |
| 4 | 依旋轉後 `displayW×displayH` 裁回，投影為 `side`／`offset` |

正方形：pad 為 0，退化为繞中心旋轉。長方形：與「先擴成正方形再轉」等價於繞機器中心轉（對稱 pad 時中心重合）。

**API：**

- 新增 `rotatePort(...)` → `{ side, offset }`（權威）
- `rotatePortOffset` 委派 `rotatePort().offset`（相容既有呼叫）
- `rotatePortSide` 不變（純方位循環）

---

## 3. 檔案計畫

| 動作 | 檔案 |
|------|------|
| 改 | `src/utils/portUtils.ts` |
| 改 | `src/__tests__/utils/portUtils.test.ts` |
| 回歸 | `src/__tests__/data/machineGeometry.test.ts` 埠段全綠 |
| 演示 | `/dev/placement-demo`（V10-E1） |
| 回寫 | 錯機清單 `_meta_rotatePortOffset` 標已修 |

**不碰：** `FactoryCanvas`／Pinia／L3；不改 `machines.json`。

---

## 4. DoD

- [x] `rotatePort`／`rotatePortOffset` 採 pad-to-square；JSDoc 更新
- [x] `portUtils.test.ts` 含正方形、2×4、6×4、1×3 與舊 bug 案例
- [x] `machineGeometry` 埠斷言全綠（無 skip）— 與 consistency 合計 **388 過**
- [x] `/dev/placement-demo` 可演示非方形機旋轉埠
- [x] 錯機清單 meta／歷史列更新；todolist 反映本項

---

## 5. 開發日誌

### 2026-08-26

- 開單；定案 pad-to-square；確認 rot0 合法 → 非 JSON 問題
- 實作 `rotatePort`；更新測試；掛載 PlacementDemo；清單回寫；DoD 全勾
