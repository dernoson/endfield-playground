# Factory Planner – 產能統計演算法規格（Flow Statistics）

本文件從 `spec/plan_phase1.md` 延伸：Phase 1 **刻意不做**產線計算；本文描述 **Phase 2+** 應實作的「依機台配方與牽線（水管／傳送帶）推算穩態流量與瓶頸」之**資料模型、數學形式、演算流程與 codebase 對接**，供後續實作逐步 follow。

---

## 1. 文件範圍與目標

### 1.1 目標輸出（使用者可見結果）

在給定：

- 畫布上的**機器集合**與每台機器選定的**配方**（或可由規則自動選配）；
- 機器之間以**邊**連接，邊型別為**水管 P** 或**傳送帶 S**，並各有每秒容量上限 **P_w**、**S_w**；

希望得到：

| 輸出類別 | 說明 |
|----------|------|
| **每台機器的產能情形** | 例如：當前配方下的**循環速率**（cycles/s）、各**輸入物實際進料速率**、各**輸出物實際出料速率**（受上下游與邊容量限制後的可行解） |
| **整體輸入需求量／輸出量** | 對整張圖：需從**外部供給**的各物品總速率（sources）；以及對**外部輸出／終端 sink** 的各物品總速率（若未定義 sink，則為「未被下游吃掉的盈餘」需在報表中標示） |
| **邊（牽線）結果** | 各邊上的**物品種類**（若一邊只傳一種物）與**實際流量**（items/s），以及是否**觸發容量束縛**（作為「產線錯誤／警告」資料來源，對齊 `spec/ui/layout.md` 診斷區） |

### 1.2 不在第一版求解器硬性涵蓋（可列 backlog）

- **電力、機台效率百分比、停工／緩衝庫存動態**：先做**連續時間穩態（steady-state）**，不做離散事件模擬。
- **傳送帶路徑幾何重疊**：屬編輯器／合法性檢查；可由另一規格描述，本文僅保留「若標記為非法則不進入主求解」的接口。
- **一台機器同時多配方並行**：預設**每台機器啟用單一配方**；多配方並行為擴充項（見 §7）。

---

## 2. 與現行 codebase 的對接

### 2.1 現狀

- **圖結構**：`src/types/graph.ts` 定義 `FactoryNode`、`FactoryEdge`，`FactoryNodeData` 目前有 `label`、`machineType`。
- **狀態**：`editorStore` 持有 Vue Flow 的 `nodes`、`edges`。
- **統計 UI**：`ProductionStats.vue` 目前為節點數／邊數等**編輯器度量**，與真實產能無關。

### 2.2 建議新增模組（與 UI / Store 解耦）

```
src/
├─ domain/
│   ├─ production/
│   │   ├─ types.ts              # Recipe、MachineSpec、TransportEdgeSpec、FlowProblem、FlowSolution
│   │   ├─ catalog.ts            # 由 machineType → 可用配方列表（靜態或日後載入）
│   │   ├─ graphAdapter.ts       # FactoryNode/FactoryEdge → 語義圖（SemanticGraph）
│   │   ├─ validateGraph.ts      # 結構／物品相容／邊型別檢查
│   │   └─ solveSteadyState.ts   # 核心求解入口（見 §6）
│   └─ ...
└─ composables/
    └─ useProductionInsight.ts   # 選擇性：響應式封裝，餵給右側 Tab
```

**原則**：`solveSteadyState(...)` 為**純函式**（輸入快照 → 輸出結果），便於單元測試與 Web Worker 搬移。

### 2.3 節點／邊資料如何延伸（對 Vue Flow）

需在 `FactoryNodeData`（或平行結構）能表達：

| 欄位概念 | 用途 |
|----------|------|
| `machineTypeId` | 對應機器目錄（沿用現有 `machineType` 字串或改為 id） |
| `activeRecipeId` | 目前啟用配方（若未指定則由策略決定，見 §5） |
| （選填）`targetThroughput` | 使用者指定「希望跑到多少 cycles/s」作為邊界條件 |

需在 `FactoryEdge` 的 `data`（Vue Flow Edge 支援泛型）或約定 `label`／自訂欄位表達：

| 欄位概念 | 用途 |
|----------|------|
| `transportKind` | `'pipe' \| 'conveyor'`（對應 P／S） |
| `maxThroughput` | 該邊 **P_w** 或 **S_w**（items/s，語意見 §4.3） |
| `itemId`（選填） | 若要求「一邊一物」可強制標記；否則由上游輸出推斷 |

**銜接點**：`graphAdapter.ts` **只依賴**這些欄位與 catalog，不把 Pinia 拉進 domain。

### 2.4 Store 建議

- **`productionInsightStore`（新建）**  
  - `lastResult: FlowSolution \| null`  
  - `issues: DiagnosticIssue[]`（堵塞、供量不足、邊超限等）  
  - `recompute()`：讀取 `editorStore` 的 nodes/edges 快照 → 呼叫 `solveSteadyState` → 更新結果。
- **觸發時機**：debounce（例如 300ms）於 nodes/edges 變更後；大量節點時改 Worker。

---

## 3. 領域資料模型（配方與機器）

### 3.1 物品與配方

- **物品**：以字串 id（例：`iron_ore`）唯一標識；數量為非負實數（允許分數單位若設計需要）。
- **配方**（單機單次循環）：

  \[
  \sum_{i=1}^{n} a_i\, X_i \;\xrightarrow{\;t\;}\; \sum_{j=1}^{m} b_j\, Y_j
  \]

  其中 \(a_i, b_j > 0\)，\(t > 0\)（秒／循環）。  

**速率形式**（對循環速率 \(\lambda\) cycles/s）：

- 輸入 \(X_i\) 消耗速率：\(\lambda\, a_i / t\)  
- 輸出 \(Y_j\) 生成速率：\(\lambda\, b_j / t\)

### 3.2 機器型號與多配方

- 每個 `machineTypeId` 對應 **配方集合** \(\mathcal{R}\)。
- **預設規則**：每台機器在求解時恰好 **啟用一個** 配方；`activeRecipeId` 必須屬於該機器型號配方集合 \(\mathcal{R}\)。

### 3.3 型別草稿（TypeScript）

下列為規格用草稿，實作時可微調命名並集中於 `domain/production/types.ts`。

```ts
export type ItemId = string;

export interface RecipePort {
  itemId: ItemId;
  amount: number; // a_i 或 b_j，> 0
}

export interface Recipe {
  id: string;
  inputs: RecipePort[];
  outputs: RecipePort[];
  cycleTimeSec: number; // t
}

export interface MachineTypeSpec {
  id: string;
  recipes: Recipe[];
}
```

---

## 4. 語義圖與傳輸邊

### 4.1 語義節點種類

為求解方便，建議將 Vue Flow 圖轉為**二部語義圖**（可選但利于清晰）：

| 種類 | 說明 |
|------|------|
| **Machine node** | 對應每台機器 |
| **Item junction（選填）** | 若允許「匯流／分叉」以物品為節點建模；或直接在機器–機器邊上約束「單邊單物」 |

**最小可行（MVP）**：機器–機器邊 **僅允許連接「上游機台的某一輸出物品」與下游機台的對應輸入槽位**（需在資料模型標記 itemId），這樣邊流量變數為純量。

若 MVP 不做槽位，則假設：

- 每台機器**任意輸出皆可經由邊送往下游**，下游只吃匹配物品 → 需在適配層做「物品匹配」或多商品流。

### 4.2 物品兼容性约束（對接錯誤報告）

- 若邊 `itemId` 與上游實際輸出不符 → **結構錯誤**，求解器回傳 `INCOMPATIBLE_LINK`。
- 若下游機器當前配方**不需要**該物品 → `UNUSED_INPUT` 或拒絕連線（產品決策）。

### 4.3 水管 P 與傳送帶 S

- 邊參數：`transportKind`、`maxThroughput = P_w 或 S_w`。
- **語意**：該邊上承載的物品流量 \(f\)（items/s）必須滿足 \(0 \le f \le \texttt{maxThroughput}\)。
- **差異化**：若遊戲規則上 P 與 S 對物品種類、連線規則有不同限制，在 `validateGraph` 分開檢查；**數學上**第一版可視為同型「容量上限邊」。

### 4.4 外部供給與終端

需在問題陳述中固定邊界，否則穩態無唯一解：

| 邊界類型 | 說明 |
|----------|------|
| **Supply nodes** | 指定物品 id → 最大可供給速率（或無限） |
| **Demand / Sink** | 指定終端需求速率（例如「終端匯流點要吃鐵板 10/s」） |
| **Free output** | 若無 sink，可視盈餘為「浪費／堆積」僅報表展示，並標記 `UNBOUNDED_OUTPUT` 警告 |

**建議**：UI 提供「全局供給／全局需求」設定面板（對齊 Phase 1 Inspector「生產目標」預留），求解時一併輸入 `FlowProblem.boundary`。

---

## 5. 問題形式化（穩態）

### 5.1 未知數

- 每台機器 \(v\)：循環速率 \(\lambda_v \ge 0\)（cycles/s）。
- 每台機器選定配方後，其輸入／輸出對物品的淨需求可由 \(\lambda_v\) 線性表達。
- 每條邊 \(e\)（假設單物品）：流量 \(f_e \ge 0\)（items/s）。

### 5.2 平衡方程式（簡化「單邊單物」）

對每個物品 \(k\)、每個「流守恒區域」（機器輸入埠／匯流點）：

\[
\text{流入速率}_k = \text{流出速率}_k + \text{機台消耗}_k
\]

對機器 \(v\) 配方固定時：

- 對輸入物品 \(X_i\)：機器消耗 \(\lambda_v\, a_i / t_v\)。
- 對輸出物品 \(Y_j\)：機器生產 \(\lambda_v\, b_j / t_v\)（作為源的注入）。

邊容量：

\[
f_e \le \texttt{maxThroughput}_e
\]

### 5.3 配方選擇未定時的策略

若使用者未指定 `activeRecipeId`：

1. **預設**：標記為 `NEEDS_RECIPE_SELECTION`，不求解完整流量。
2. **自動（進階）**：對每台機器在離散選項上做組合最佳化（NP-hard 傾向）→ backlog；或限制為 DAG + 單一目標函數時用 MILP。

**規格建議**：第一版 **強制**每台機器有明確 `activeRecipeId`，降低模糊性。

---

## 6. 求解策略與技術選型

### 6.1 Phase A – DAG／樹狀 + 由上而下瓶颈传播（純 TS）

**適用**：圖無環、且供給與需求單調。

**作法概要**：

1. 拓撲排序。
2. 自供給端向下游傳播「可得速率」，在每條邊與每個機器輸入端取 **min**（瓶頸）。
3. 每台機器 \(\lambda\) 由最緊的輸入決定。

**優點**：無第三方相依、易 debug。  
**缺點**：無法處理一般環路（回流線）。

### 6.2 Phase B – 一般網路：線性規劃（LP）

將守恒與容量約束寫成線性系統，目標函數例如：

- **最大化**某一終端物品吞吐；或
- **最小化**外部供給總成本；或
- **可行解檢測**（可行即返回一組 \(\lambda, f\)）。

**技術選項**（擇一於實作階段評估）：

| 方案 | 說明 |
|------|------|
| **javascript-lp-solver** 或類似小型 LP | 前端bundle較小；需注意數值穩定 |
| **Wasm OR-Tools / highs** | 較重但規模大時較穩 |
| **後端服務** | 若未來圖超大或要用 MILP |

**輸出**： primal 解（各 \(\lambda_v, f_e\)）+ **對偶變數或 slack** 用於判定「哪條邊卡容量」「哪個輸入不足」（對齊診斷）。

### 6.3 環路（feedback）

若有回路（成品回流為原料）：

- Phase A **中止**並提示使用 Phase B；或
- 將環路視為「需設定開環庫存／開機存量」之動態問題 → 超出 MVP。

---

## 7. 求解結果資料結構（對 UI）

建議 `FlowSolution` 包含：

```ts
export interface MachineFlowSnapshot {
  nodeId: string;
  recipeId: string;
  cyclesPerSec: number;
  inputs: Record<ItemId, number>;  // 實際進料 items/s
  outputs: Record<ItemId, number>; // 實際出料 items/s
}

export interface EdgeFlowSnapshot {
  edgeId: string;
  itemId: ItemId;
  flowPerSec: number;
  capacityPerSec: number;
  saturation: number; // flow/capacity，供 UI 顯示「堵塞風險」
}

export interface FlowTotals {
  externalSupplyRequired: Record<ItemId, number>;
  externalSinkConsumed: Record<ItemId, number>;
  surplusUnhandled: Record<ItemId, number>;
}

export interface FlowSolution {
  machines: MachineFlowSnapshot[];
  edges: EdgeFlowSnapshot[];
  totals: FlowTotals;
}
```

**錯誤／警告**（與求解分離或附於結果）：

- `SUPPLY_SHORTAGE`：某物品所需進料 > 可供給。
- `EDGE_SATURATED`：邊達容量上限且為瓶頸。
- `IMBALANCE`：無可行穩態解。
- `MULTI_ITEM_EDGE_AMBIGUOUS`：未標記 item 的多分叉情境。

---

## 8. 單元測試建議

| 案例 | 預期 |
|------|------|
| 單機單配方、無邊 | \(\lambda\) 僅受外部供給／無限制時可由輸出需求決定 |
| 兩機串聯、邊容量小於機器產能 | \(\lambda\) 由邊瓶頸限制 |
| 分叉：一機兩輸出各接不同下游 | 守恒正確、各邊流量和等於上游分配 |
| 不合物品連線 | validate 階段失敗 |

置於 `src/domain/production/__tests__/`（Vitest 尚未加入則於 CI 前補）。

---

## 9. 與其他規格文件的關係

| 文件 | 關係 |
|------|------|
| `spec/plan_phase1.md` | Phase 1 不包含本文計算；本文標示為 Phase 2+ |
| `spec/ui/layout.md` | 右側「產線統計」「產線錯誤」Tab 的資料來源應為 `FlowSolution` + diagnostics |

---

## 10. 驗收（演算法模組）

1. 给定小型静态 catalog + 手工構造的 nodes/edges，`solveSteadyState` 能在 Phase A（DAG）回傳與手算一致的 \(\lambda\) 與邊流量。  
2. `graphAdapter` 能把現有 Vue Flow 資料映射為語義圖；缺少欄位時給出可本地化錯誤碼。  
3. `ProductionInsightStore`（或等價）能把結果餵給 UI，無需 Canvas 重繪邏輯耦合。

---

## 11. 變更紀錄

| 日期 | 摘要 |
|------|------|
| （建立） | 初版：配方時間線性速率、P/S 邊容量、DAG／LP 兩階段求解策略、與 graph/store/UI 對接 |
