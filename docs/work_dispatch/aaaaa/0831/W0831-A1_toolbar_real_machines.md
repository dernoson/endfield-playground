# W0831-A1｜aaaaa｜工具列接真實機器資料（R-B1｜**次優先**）

| meta | value |
|------|-------|
| 週次 | 2026-08-31 → 2026-09-06 |
| 對應 roadmap | [R-B1](../../../roadmap/detail/B1_toolbar_real_machines.md) §6 切片「09/06」 |
| 等級 | **確定** |
| 優先級 | **次於 [A0 L1 打底](./W0831-A0_layout_l1_foundation.md)**（時數衝突時先 A0） |
| 擋 9/27 門檻 | **是**（本週＝9/6 可演示切片；整包門檻在 9/27） |
| 性質 | 資料 → 工具列容器 |
| 預估時數 | 在 A0 之後能做多少算多少；目標仍盡力 9/6 可截圖 |
| review_gate | dernoson |
| 工單風格 | 目標＋邊界＋契約（自帶流程；不附 Vue 教學） |
| 狀態 | `[x]` 已交付（V11-H1）；PR [#43](https://github.com/dernoson/endfield-playground/pull/43) 待 review_gate 合入 |

---

## 0. 目標

下方工具列**至少一個分類**列出真實機器名稱與佔格。資料來自既有查詢 API，不重寫資料層。

### 0.1 優先序（8/31 定案）

| 優先 | 單 |
|------|-----|
| **① 最優** | [A0 佈局 L1 打底](./W0831-A0_layout_l1_foundation.md)（SVG 自建） |
| **② 次優** | **本單 B1** |

定案全文：[EARLY_START](../../../aaaaa/LAYOUT_REWRITE_EARLY_START_0831.md)（已定案）。

---

## 1. 邊界

| 欄 | 內容 |
|----|------|
| **畫面** | ≥1 個分類 Tab（或等價篩選）；點開後見真實機器名＋佔格（例：「粉碎機」「3×3」、「分流器」「1×1」） |
| **交哪個檔** | 主改 `src/editor/toolbar/ToolbarPanel.vue`；薄適配可加同目錄小檔（建議純 TS selector） |
| **不要碰** | `EquipmentType`／`armPlacement`／`setSelectedEquipment`／`dataTransfer` key（見 §2）、`FactoryCanvas`／`FlowNodeOverlay`、detector、`MachineCard` 視覺、全員派工長文 |
| **卡住找誰** | dernoson（合入／分層）；tag 缺漏自修 JSON＋codegen（[E1](../../../roadmap/detail/E1_data_codegen_ops.md)） |
| **若契約不可行** | 回報後改，不要自己開新查詢 API、不要順手改 store 簽名 |

---

## 1.1 現況先看：為什麼「只加不改」

`ToolbarPanel.vue` 現在的五顆按鈕綁在封閉聯集 `EquipmentType`（`'smelter' | 'crusher' | 'assembler' | 'conveyor-node' | 'power-node'`），並且：

- 點擊 → `editorStore.armPlacement(equipment)`
- 拖曳 → `editorStore.setSelectedEquipment(equipment)` ＋ `dataTransfer.setData('application/x-endfield-equipment', equipment)`
- 畫布 drop 端按同一個 key 與型別解讀

**真實機器 id（如 `shaping_machine`）不在該聯集內。** 若要讓真實機器直接走現有落子路徑，就得同時改 `EquipmentType`、store 簽名與畫布型別守衛——那是 9 月 B1 整包＋[B2](../../../roadmap/detail/B2_placement_chain.md) 的範圍，本週塞不進去。

**本週定案（不需你選）：**

| 做 | 不做 |
|----|------|
| **新增**一塊真實機器分類列表，與現有五顆按鈕**並存** | 刪除或改寫現有五顆按鈕 |
| 點選＝本地選取態（highlight）或 `console`，PR 註明 | 呼叫 `armPlacement`／寫 `dataTransfer` |
| 需要時加同目錄純 TS selector（例如 `toolbarMachines.ts`） | 改 `EquipmentType`、store 簽名、畫布守衛 |

落子鏈保持現況可用；真實機器落子留給 B2 解封後處理。

**分層說明（你的 `must_not` 仍然有效）：** 本項只做「讀資料 → 渲染列表」，層級等同你已交付的 `/dev/placement-demo` 與 `src/app/dev/MachineCatalogPanel.vue`；**事件接 store 不在本項**，故未觸及 DENY 的「Pinia action／Vue 事件」。

---

## 2. 契約（以程式為準，文檔欄位名次之）

| API | 簽章 | 用途 |
|-----|------|------|
| `getMachinesByTag` | `(tag: MachineCategory \| 'all' \| 'untagged') => Machine[]` | 分類列表 |
| `getAllMachines` | `() => Machine[]` | 全量（本週不必一次上齊） |
| `MACHINE_TAGS` | `readonly MachineCategory[]` | Tab 順序；先做 1–2 類即可（建議「基礎生產」） |
| 佔格文字 | `` `${machine.width}×${machine.height}` `` | JSON／codegen 是 `width`／`height`，**不是**文檔裡的 `size` |
| 分類 | `machine.tags: string[]` | 文檔若寫 `tag` 單數，以複數陣列為準 |

現況抽查值（可直接當測試對照）：粉碎機 `crusher` 3×3、塑型機 `shaping_machine` 3×3、灌裝機 6×4、分流器 1×1。`MACHINE_TAGS` 實際為「物流設備／倉庫存取／基礎生產／合成製造／電力」——**本週建議只上「基礎生產」一類**。

卡片若未就緒：容器內暫時列表即可。列表可讀 `src/data/*`；**L3 卡片不得** import `src/data/*`。

點選機器：本地選取態或 `console`，PR 註明。**不呼叫 store、不接 B2 落子**（理由見 §1.1）。

參考（只當契約實例，不複製 UI）：`src/app/dev/MachineCatalogPanel.vue`。

---

## 3. 下游消費者（PR 必寫）

| 誰會用 | 怎麼用 |
|--------|--------|
| 9/6 演示 | 截工具列證明真實機器名＋佔格 |
| [W0831-S1](../../shirone/0831/W0831-S1_machine_card.md) | 吃你攤好的 `id`／`name`／`sizeText`；**未交你用列表頂替，演示仍算你的** |
| B2（封鎖） | 本週不接落子；只留「要放這台」的意圖即可 |
| goodmorning G1 | **只做工具列視覺**（`PaperFigBottomBar`）；與你的資料列表分開，互不擋 |
| E001 | **不需等 shirone 交接文**；主編近日 PR 已寫現況；本週不實作 detector |

---

## 4. 本週不做

正式 icon、搜尋、拖放落子、全 tag 一次上齊、新 detector 實作、`EquipmentType` 擴張。

---

## 5. DoD

- [x] ≥1 分類列出真實機器（名稱＋佔格）
- [x] 佔格文字與 `width`×`height` 一致（抽查 3 台，例：粉碎機 3×3）
- [x] 點選有明確下一步（本地 highlight＋console；未呼叫 store）
- [x] **現有五顆按鈕的落子與拖曳仍可用**（未動 `EquipmentType`／store 簽名／`dataTransfer` key）
- [x] 未讓 L3 卡片自己讀 `src/data/*`（經 `toolbarMachines` 攤平）
- [x] PR 寫下游消費者（見 §7 與 H1 PR body）
- [x] `pnpm type-check`／toolbar 單元測通過

## 6. 未交頂替

無。延誤須週日會改期並寫進大綱 §8。

---

## 7. 驗收指南（review_gate／週日會 V3）

**總表：** [V11_acceptance_guide.md](../../../aaaaa/dev/dev_v11/V11_acceptance_guide.md) §2  
**證據：** [H1_acceptance.md](../../../aaaaa/dev/dev_v11/evidence/H1_acceptance.md)

### 7.1 自動化（必跑）

```bash
pnpm type-check
pnpm test src/__tests__/editor/toolbarMachines.test.ts
```

預期：**4 tests** 全綠。佔格對照：粉碎機 3×3、塑型機 3×3、灌裝機 6×4、分流器 1×1。

### 7.2 視覺 — 主編輯器 `/`（必看｜9/6 演示截圖）

**注意：** 本單**無** `/dev` 專頁、**無** Storybook（`ToolbarPanel` 在 L2 `src/editor/`）。

```text
1. pnpm dev → http://localhost:5173/（主編輯器，不是 /dev）
2. 畫面下方工具列：
   - 上半：既有五顆（精煉爐、粉碎機…）
   - 下半：分類 Tab ＋ 橫向機器列表（名稱 ＋ 佔格，如「粉碎機」「3×3」）
3. 預設 Tab「基礎生產」：應見多台真實機器
4. 切「合成製造」→ 灌裝機 6×4；切「物流設備」→ 分流器 1×1
5. 點一台真實機器 → 卡片高亮；Console 出現
   [toolbar] real machine selected (no store / no place) { id, name, sizeText, tag }
6. 點上半「粉碎機」→ 仍可進入放置模式；拖曳到畫布仍可落子
7. 點真實機器後畫布不應進入放置模式
```

### 7.3 硬約束（合入前勾選）

- [x] 未改 `EquipmentType`／`armPlacement`／`setSelectedEquipment`／`dataTransfer` key
- [x] 未改 `FactoryCanvas`／`FlowNodeOverlay`／`editorStore` 簽名
- [x] 真實機器列表與五顆按鈕**並存**（未刪改舊按鈕）
- [x] L3 未直接 import `src/data/*`

### 7.4 下游消費者（PR body 必含）

| 誰 | 怎麼用 |
|----|--------|
| 9/6 演示 | 主 app 底部工具列截圖 |
| W0831-S1 | 吃 `ToolbarMachineRow`：`id`／`name`／`sizeText` |
| B2 | 本 PR **不接**落子 |
| goodmorning G1 | PaperFigBottomBar 視覺；與資料列表分開 |
