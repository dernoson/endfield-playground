# V10-B1 — 幾何／埠測試＋資料一致性測試

**對應工項：** V10-B1  
**狀態：** `[ ]` 未開始  
**依賴：** A1  
**最後更新：** 2026-08-26  
**正式依據：** [W0823-A1](../../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md) §4.1、[R-E1](../../../roadmap/detail/E1_data_codegen_ops.md) §4.3（**8/30 檢查點併入本項**）

---

## 1. 目標

兩份測試，本週皆須**全綠**（見 [D1](./D1_fix_data_codegen.md)）：

| 檔案 | 職責 |
|------|------|
| `src/__tests__/data/machineGeometry.test.ts` | 佔格格數＋埠合法性（全機器 × 四 rotation） |
| `src/__tests__/data/dataConsistency.test.ts` | R-E1 §4.3 五項資料一致性 |

風格對齊既有 `src/__tests__/data/machines.test.ts`（vitest、`@/data/machines`）。

**本步先不修 JSON**——跑紅、把失敗案例匯出給 [C1](./C1_defect_list.md) 初稿；綠化在 D1。

---

## 2. machineGeometry.test.ts

### 2.1 斷言內容

1. **佔格格數**：`getOccupiedCells(fakeNode, machine).size`
   - rotation 0／2 → `width * height`
   - rotation 1／3 → `height * width`（同值，語意寫清）
   - 另斷言四角落在預期矩形內（避免 size 對但起點錯）
2. **埠合法性**：每個 mode 的每個 `input_ports`／`output_ports`，在該 rotation 下經 `rotatePortSide`／`rotatePortOffset` 後，`offset` 落在對應邊合法範圍

### 2.2 fakeNode

```ts
// 格子座標；position 用整數即可（geometryUtils 假設已是格子）
const fakeNode = {
  id: `geo-${machine.id}`,
  position: { x: 0, y: 0 },
  data: { rotation }, // 0 | 1 | 2 | 3
} as FactoryNode; // 型別以專案 FactoryNode 為準；只填本測試用到的欄位
```

### 2.3 埠合法範圍（對齊 `topologyPortUtils`）

旋轉後顯示格：`resolveDisplayGrid(width, height, rotation)`，或等價：

| 旋轉後 side | offset 合法區間 |
|-------------|-----------------|
| top／bottom | `[0, displayWidth - 1]` |
| left／right | `[0, displayHeight - 1]` |

其中 displayWidth／Height：rotation 1／3 時為原 height／width 對調。

**資料側斷言用「不得 clamp」**：`wasClamped === true` 即失敗。Dev 預覽會 clamp 掩蓋資料錯，測試不可跟。

### 2.4 建議結構

```text
describe('machineGeometry')
  describe.each(machineList)('$id $name')
    it.each([0,1,2,3])('rotation=%s occupied cell count')
    it.each([0,1,2,3])('rotation=%s port offsets in-range')
```

失敗訊息需含 `machine.id`、`mode.id`、`side`、`offset`、`rotation`，方便直接貼進錯機清單。

### 2.5 Import（本週）

| 來源 | 用途 |
|------|------|
| `@/data/machines` | `machineList` |
| `@/utils/geometryUtils` | `getOccupiedCells`（9 月可能換址；本週不改） |
| `@/utils/portUtils` | `rotatePortSide`／`rotatePortOffset` |
| 可選 `@/app/dev/topologyPortUtils` | `resolveDisplayGrid`／範圍計算（唯讀） |

**不要**改 `geometryUtils`／`portUtils` 邏輯；若函式本身有 bug → 記 C1 `note`，另開單。

---

## 3. dataConsistency.test.ts（R-E1 併入）

涵蓋 [R-E1](../../../roadmap/detail/E1_data_codegen_ops.md) §4.3 五項：

| # | 檢查 | 實作要點 |
|---|------|----------|
| 1 | 產物與來源一致 | 讀 `docs/aaaaa/data/machines.json` 與 `@/data/machines`，逐台比對 `name`／`width`／`height`／`power`／`tags`／`modes` 埠數與 side／offset。**不在測試內跑 codegen 子程序**（見 §3.1） |
| 2 | 機器無外層 ports | `expect(m).not.toHaveProperty('input_ports')`（V9-B1 回歸保護；既有 `machines.test.ts` 已有一條，可保留不重複） |
| 3 | `width`／`height` 為正整數 | 全機器；**注意欄位是 `width`／`height`，非 `size`** |
| 4 | 每個材料有 `form` | `@/data/materials`；`form ∈ {solid, liquid, gas}` |
| 5 | tag 值在 `MACHINE_TAGS` 內 | 全機器 `tags[]` |

### 3.1 「重跑 codegen 無 diff」怎麼驗

R-E1 §4.3 第一項原文是「重跑 codegen 後 `src/data` 不應有 diff」。在 vitest 內跑 `child_process` 會讓測試變慢且依賴環境，本週採**等價驗法**：

- 測試層：JSON ↔ `src/data` 逐欄比對（上表第 1 項）——能抓到「改了 JSON 沒跑 codegen」與「手改了產物」兩種主要事故
- 流程層：PR checklist 要求「JSON 與產物同一筆 commit」（[D1](./D1_fix_data_codegen.md) §2）

真正的 `child_process` diff 檢查若要做，屬 R-E1 後續月度檢查點，不在本週。

### 3.2 codegen stub 的例外

`machineList`（46）比 JSON（44）多兩筆 `SOURCE_SINK_STUBS`。第 1 項比對須**排除** stub（依 id 白名單或 `is_source`／`is_sink` 判定），否則會誤報「產物多出兩台」。

stub 本身仍須通過第 2–5 項與 `machineGeometry` 全部斷言；若 stub 資料不合法，處置見 [A1](./A1_scope_decision.md) §2.3。

---

## 4. 非目標

- 修 `machines.json`（綠化屬 D1）
- 改 canvas／Pinia
- 管線佔格測試
- R-E1 的 9/27、10/25、11/29 月度檢查點
- 在測試內跑 codegen 子程序

---

## 5. DoD

- [ ] `machineGeometry.test.ts` 存在且涵蓋全機器 × 四 rotation，兩類斷言齊備
- [ ] `dataConsistency.test.ts` 存在且涵蓋 §3 五項（第 1 項排除 stub）
- [ ] 失敗訊息含足夠欄位，可直接轉錄成清單列
- [ ] 本步**不**為了讓測試綠而改資料
- [ ] 測試檔內**不留** `skip`／`todo`／allowlist（全綠由 D1 達成）

---

## 6. 開發日誌

### 2026-08-26

- 建立細項；對齊 W0823-A1 §4.1 與 V9-C2 埠格規則
- 決策 4 落版：R-E1 8/30 一致性測試併入本項，新增 §3
- 補 §3.1 codegen diff 等價驗法、§3.2 stub 排除規則
