# V10-B1 — 幾何／埠測試＋資料一致性測試

**對應工項：** V10-B1  
**狀態：** `[x]` 測試骨架完成（首跑已匯出失敗；綠化屬 D1）  
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

- [x] `machineGeometry.test.ts` 存在且涵蓋全機器 × 四 rotation，兩類斷言齊備
- [x] `dataConsistency.test.ts` 存在且涵蓋 §3 五項（第 1 項排除 stub）
- [x] 失敗訊息含足夠欄位，可直接轉錄成清單列
- [x] 本步**不**為了讓測試綠而改資料
- [x] 測試檔內**不留** `skip`／`todo`／allowlist（全綠由 D1 達成）

---

## 6. 首跑結果（2026-08-26）

```text
Test Files  1 failed | 1 passed (2)
Tests       25 failed | 351 passed (376)
```

| 套件 | 結果 |
|------|------|
| `dataConsistency.test.ts` | **全綠**（JSON↔src、modes-only、WxH、materials.form、tags） |
| `machineGeometry` 佔格格數／四角落 | **全綠**（全機器 × 四 rotation） |
| `machineGeometry` 埠合法性 | **25 紅**；**無任何 rotation=0 失敗** |

### 6.1 失敗機器（供 C1 初稿）

| machine_id | 失敗 rotation | 典型訊息 |
|------------|---------------|----------|
| `filling_machine` | 2、3 | `base_mode out[4] bottom@4 → …@-1` |
| `packaging_machine` | 2、3 | `default out[4] bottom@4 → …@-1` |
| `grinder` | 2、3 | `default out[4] bottom@4 → …@-1` |
| `equipment_parts_machine` | 1、2、3 | `out[4] right@4`／`in[0] left@0 → bottom@-2` |
| `disassembler` | 1、2、3 | `out[0] right@1 → bottom@4`（display 越界） |
| `multi_conduit_inlet` | 3 | `in[0] left@1 → bottom@-1` |
| `multi_conduit_outlet` | 1、2、3 | `out[1] right@3` |
| `material_source` | 1、2、3 | `solid_belt out[0] right@1` |
| `item_source` | 1、2、3 | stub；`right@1` |
| `item_sink` | 1、2、3 | stub；`right@1` |

### 6.2 初步判定（給 C1／D1，本步不修）

- **rotation=0 全過** → 靜態 JSON 埠在未旋轉時皆落在合法邊長內；本批紅燈**不像**單純「offset 寫超出 width／height」的資料錯。
- 旋轉後出現 `offset=-1`／超出 display 邊 → 高度懷疑 **`rotatePortOffset` 在非方形機的多步旋轉**（A1：utils 本週唯讀 → 清單 `note` 記 utils 嫌疑＋另開單；**不在本步改 utils／不改 JSON**）。
- stub（`item_source`／`item_sink`）同型失敗；若最終判定為資料／stub 值問題，依 A1 §2.3 最小改 `generate-src-data.mjs`。

完整 assertion 原文見本機測試輸出；C1 建清單時可直接抄 §6.1 表。

---

## 7. 開發日誌

### 2026-08-26

- 建立細項；對齊 W0823-A1 §4.1 與 V9-C2 埠格規則
- 決策 4 落版：R-E1 8/30 一致性測試併入本項，新增 §3
- 補 §3.1 codegen diff 等價驗法、§3.2 stub 排除規則
- **實作完成：** 新增兩測試檔；首跑 351 過／25 失敗；§6 匯出給 C1；未改 JSON／utils