# V18-C1 — M3 引擎讀驗收步驟（W1018-A0 ②A）

**對應工項：** V18-C1
**狀態：** `[x]` 完成（2026-10-25｜步驟落版；本機兩測檔 8 passed）
**日期：** 2026-10-25
**依賴：** [B1](./B1_v17_residue_close.md) `[x]`（#74 路徑已在 master）
**正式工單：** [W1018-A0 §1](../../../work_dispatch/aaaaa/1018/W1018-A0_m3_engine_lab.md)、[WEEK §0.2 V2](../../../work_dispatch/WEEK_20261018.md)
**開發分支：** `dev/aaaaa1018`
**釘死產線（#74）：** `material_source`（源礦 30/min）→ `crusher` → `item_sink`

> **與 D1 皆交：** 本項＝②A（必做）。Lab 見 [D1](./D1_l1_lab_pr.md)。  
> **本檔即 W1018-A0 ②A 短文。** 正式頁尚無源素材下拉；M3 證明以**單元測試重跑**為準，手動 API／dev 頁為輔。

---

## 1. 背景

M3 公開 **V2**：源設備設 `primaryOutput` 後，經引擎／拓樸可測到產出。  
寫入＝[#72](https://github.com/dernoson/endfield-playground/pull/72)；讀取＝經 `toTopology`＋[#74](https://github.com/dernoson/endfield-playground/pull/74)。

| 層 | API／檔 | 角色 |
|----|---------|------|
| 寫入 | `layoutStore.setDevicePrimaryOutput(uid, itemId \| null, ratePerMin?)` | 寫 `primaryOutput`／`sourceRatePerMin`；進歷史 |
| Adapter | `toTopology(devices, pipelines, connections)` | layout → 引擎 nodes／edges |
| 讀取證明 | `src/__tests__/flowEngine.topology.layout.test.ts` | 源→粉碎→sink **30/min** |

---

## 2. 最快驗收（建議｜彩排用）

在 repo 根目錄（已對齊含 #72／#74 的 `master` 或本分支）：

```bash
pnpm exec vitest run src/__tests__/store/layoutStore.primaryOutput.test.ts src/__tests__/flowEngine.topology.layout.test.ts
```

| 檔 | 證明什麼 | 過關長相 |
|----|----------|----------|
| `layoutStore.primaryOutput.test.ts` | **寫入端 #72** | 設 `源礦` → `primaryOutput`＋速率 **30**；可 Undo；未知 uid 不進歷史 |
| `flowEngine.topology.layout.test.ts` | **讀取端 #74** | 英文 id 快照 → `toTopology` → 引擎；源礦／源石粉末產耗各 **30/min** |

**2026-10-25 本機：** 2 files／**8 tests passed**。

缺 `primaryOutput` 的對照測亦在同檔第二則：源仍是 source，但 **outputRates 為空**、邊無流量。

---

## 3. 逐步說明（對照測試在做什麼）

### 3.1 放源設備並設定產出（對齊 #72）

概念步驟（正式頁無 UI；契約測／日後左面板同簽章）：

1. `layoutStore.addDevice({ id, machineType: 'material_source', position, rotation, machineMode: 'solid_belt', ... })`  
   （契約測為省事用過 `splitter` 只驗寫欄；**產線證明請用 `material_source`**。）
2. `layoutStore.setDevicePrimaryOutput(uid, '源礦')`  
   - 省略速率 → **`sourceRatePerMin = 30`**  
   - `null` → 清除兩欄  
   - 未知／重複 uid → **靜默 no-op，不進歷史**
3. 預期：`devices` 上有 `primaryOutput: '源礦'`、`sourceRatePerMin: 30`；`historyStore.undoDepth`＋1

### 3.2 經 `toTopology` 餵引擎看速率（對齊 #74）

最小產線（與測試一字對齊）：

| 設備 id | `machineType` | 關鍵欄位 |
|---------|---------------|----------|
| `src` | `material_source` | `primaryOutput: '源礦'`，`sourceRatePerMin: 30`，`machineMode: 'solid_belt'` |
| `crusher` | `crusher` | `machineMode: 'default'` |
| `sink` | `item_sink` | — |

兩條 belt `Connection`：`src.output[0]`→`crusher.input[0]`；`crusher.output[0]`→`sink.input[0]`。

```text
toTopology(devices, pipelines, connections)
  → buildGraph → validateChains → topologicalSort → propagateFlows → calcItemSummary
```

過關數字：

| 檢查點 | 預期 |
|--------|------|
| `nodes[0].data.primaryOutput` | `'源礦'` |
| `graph.nodes.get('src').outputRates.get('源礦')` | **30** |
| crusher 入源礦／出源石粉末；sink 入源石粉末 | 各 **30** |
| 邊 `p-src-crusher`／`p-crusher-sink` | rate **30** |

### 3.3 可選：瀏覽器輔助（不擋 V2）

| 路徑 | 用途 | 限制 |
|------|------|------|
| `/dev/layout-l1-preview` | 看 fixture → `toTopology` 節點／邊摘要 | **不跑**流量傳播；摘要未必列出 `primaryOutput` |
| `/dev/flow-engine` | 舊模型 preset 看產線數字 | 掛 **editorStore**；**不是** #74 layout 路徑 |
| `/dev/l1-contract-lab`（V18-D1） | 契約可視化（V16／V17 分頁） | 已在本週分支；合 master 另裁 PR |

**公開 V2 不以這兩頁為準**；以 §2 測試綠為準。

---

## 4. 失敗時看哪裡

| 現象 | 先查 |
|------|------|
| 源沒有產出數字 | 是否設了 `primaryOutput`？（缺欄＝引擎不產，見測試第二則） |
| `toTopology` 後機型／配方全空 | `machineType` 是否英文 id（`material_source`）？查表是否走 `resolveMachineDef`（#74） |
| 寫入沒進歷史／欄位沒變 | uid 是否存在且唯一？`setDevicePrimaryOutput` 對未知／重複 uid 為 no-op |
| 速率不是 30 | 是否傳了第三參 `ratePerMin`？省略才預設 30 |
| 正式頁看不到下拉 | **預期**——本週不做表單；用 §2 測試證明 |
| `/dev/flow-engine` 數字與 layout 無關 | 該頁仍吃舊 store；請改跑 `flowEngine.topology.layout.test.ts` |

相關碼：

- `src/store/layoutStore.ts` → `setDevicePrimaryOutput`
- `src/utils/layout/toTopology.ts`
- `src/data/machines.ts` → `resolveMachineDef`／`material_source`
- 細項：[V16-C1](../dev_v16/C1_set_device_primary_output.md)、[V17-F1](../dev_v17/F1_engine_topology_slice.md)

---

## 5. 對照公開 V2

| WEEK V2 句 | 本檔落點 |
|------------|----------|
| 源設備設 `primaryOutput` | §3.1／`layoutStore.primaryOutput.test.ts` |
| 經引擎／拓樸可測到產出 | §2／§3.2／`flowEngine.topology.layout.test.ts`（30/min） |
| 有簡短驗收步驟 | **本檔** |

---

## 6. DoD

- [x] §2–§4 可讓非作者跟做（先跑 §2 指令即可）
- [x] 對照公開 V2 句可勾（§5）
- [x] 未改 C1 鎖檔／`editorStore`（本項僅文件）
- [x] 本機重跑兩測檔通過（2026-10-25）

---

## 7. 開發日誌

### 2026-10-25｜完成

- 落版最快指令＋寫入／讀取步驟＋失敗表
- `vitest run` 兩檔 8 passed；下一＝D1 lab（PR 時機另裁）

### 2026-10-25

- 開版建檔
