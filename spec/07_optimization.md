# Feature Spec：多目標優化產能推導
# CR-07

**所屬階段：** Phase 3
**依賴：** CR-01（設備與配方定義）、CR-05（導入擺放視角流程）
**文件版本：** v0.1

---

## 1. 功能定位

多目標優化頁面讓使用者在不考慮具體設備擺放位置的情況下，先設定產能目標與原料限制，由系統以線性規劃（LP）推導最佳配方流量分配，再透過「切換視角以導入」將結果轉入藍圖。

---

## 2. 核心概念

### 2.1 流量單位

以**傳送帶滿載流量（30 個/min）**為基礎物流單位，簡稱「1 條」。設備台數是流量分配的衍生結果（向上取整），而非決策變數本身。

範例：赤銅礦產能 60/min = 2 條，可分配給配方 A 1.5 條 + 配方 B 0.5 條。

### 2.2 決策空間

- **決策變數**：分配給每個配方的流量（連續值，單位：個/min）
- **衍生計算**：各配方所需設備台數 = ⌈ 分配流量 / 單台設備產出速率 ⌉
- **目標函式**：最大化調度券產出（或依使用者設定的多目標權重）
- **約束條件**：原料供給上限、部分產物的硬性最低需求

---

## 3. 功能詳細描述

### 3.1 輸入設定

使用者在優化頁面設定以下三類參數：

#### 原料供給（約束上限）
列出所有可用原物料，使用者輸入每種原料的可用產能（個/min 或條數）：

```
原料設定
┌──────────────┬──────────────┬──────────────┐
│ 原料名稱     │ 可用產能      │ 單位          │
├──────────────┼──────────────┼──────────────┤
│ 赤銅礦       │ 60           │ /min（= 2 條）│
│ 源石         │ 30           │ /min（= 1 條）│
│ 純水         │ 90           │ /min（= 3 條）│
└──────────────┴──────────────┴──────────────┘
```

#### 產物硬性需求（約束下限，選填）
使用者可指定某些最終產物的最低產出速率：

```
硬性需求（選填）
┌──────────────┬──────────────┐
│ 產物名稱     │ 最低產能      │
├──────────────┼──────────────┤
│ 工業爆炸品   │ ≥ 1.0 /min   │
└──────────────┴──────────────┘
```

#### 優化目標
- 調度券產出最大化（主目標，使用者可設定各最終產物的調度券兌換率）
- 選填：設定次要目標的權重（例如同等調度券產出下，優先最小化設備總數）

### 3.2 LP 求解

**求解器：** `glpk.js`（WebAssembly 版，無後端需求）

**模型建立：**

```
最大化：Σ (recipe_i 的調度券產出率 × x_i)
約束：
  對每種原料 j：Σ (recipe_i 消耗原料 j 的速率 × x_i) ≤ 供給上限 j
  對每種硬性需求產物 k：Σ (recipe_i 生產產物 k 的速率 × x_i) ≥ 下限 k
  x_i ≥ 0（流量非負）
```

求解結果：每個配方的最佳分配流量 `x_i`（個/min）。

### 3.3 結果呈現

求解完成後，顯示以下結果：

```
優化結果
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ 配方     │ 設備     │ 分配流量  │ 設備台數  │ 效率     │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ 紫晶纖維 │ 精煉爐   │ 4.0/min  │ 2 台     │ 100%     │
│ 赤合金   │ 粉碎機   │ 1.5/min  │ 1 台     │ 75%      │
│          │ 研磨機   │ 0.75/min │ 1 台     │ 75%      │
└──────────┴──────────┴──────────┴──────────┴──────────┘

預估調度券產出：XXX 券/hr
原料使用率：
  赤銅礦  ████████░░ 80%（48/60 /min）
  源石    ██████████ 100%（30/30 /min）⚠️ 瓶頸
```

### 3.4 使用者微調

結果可進行微調，台數與流量雙向聯動：

**調整台數 → 反推流量：**
```
精煉爐：2 台 → 3 台
⟹ 分配流量自動更新為 6.0/min
⟹ 重新計算調度券產出與原料使用率
```

**調整流量 → 換算建議台數：**
```
紫晶纖維分配流量：4.0 → 5.0 /min
⟹ 建議台數：⌈5.0 / 2.0⌉ = 3 台（效率 83.3%）
⟹ 若原料不足，顯示紅色超出警示
```

微調後若違反原料上限約束，對應原料列顯示紅色超出提示（不阻擋使用者操作）。

### 3.5 導入藍圖

使用者確認結果後，點選「**切換視角以導入**」：
1. 切換至藍圖視角（或並列視角）
2. 系統依優化結果的設備清單，滑鼠拖曳一組預設設備配置
3. 使用者選擇擺放位置後確認
4. 後續管線連接由使用者在藍圖視角手動完成（或 Phase 3 自動路徑規劃輔助）

---

## 4. 狀態管理（Pinia Store）

### `useOptimizationStore`

```typescript
{
  // 輸入設定
  materialConstraints: MaterialConstraint[],
  productRequirements: ProductRequirement[],
  ticketRates: TicketRate[],

  // 求解狀態
  solveStatus: 'idle' | 'solving' | 'optimal' | 'infeasible' | 'error',
  solveResult: SolveResult | null,

  // 微調狀態
  adjustments: Map<string, { flow: number, deviceCount: number }>
}

// MaterialConstraint
{
  itemId: string,
  maxRate: number  // 個/min
}

// ProductRequirement
{
  itemId: string,
  minRate: number  // 個/min
}

// SolveResult
{
  recipeAllocations: {
    recipeId: string,
    deviceId: string,
    allocatedFlow: number,   // 個/min
    deviceCount: number,     // 向上取整
    efficiency: number       // 0~1
  }[],
  totalTicketRate: number,   // 券/hr
  materialUsage: {
    itemId: string,
    used: number,
    available: number
  }[]
}
```

---

## 5. 實作範例

### 5.1 GLPK.js 求解

```typescript
import GLPK from 'glpk.js'

const solve = async (
  recipes: Recipe[],
  materials: MaterialConstraint[],
  requirements: ProductRequirement[],
  ticketRates: TicketRate[]
): Promise<SolveResult> => {
  const glpk = await GLPK()

  const lp = {
    name: 'AIC_Optimization',
    objective: {
      direction: glpk.GLP_MAX,
      name: 'ticket_output',
      vars: recipes.map(r => ({
        name: r.id,
        coef: calcTicketCoef(r, ticketRates)  // 每單位流量對應的券/hr
      }))
    },
    subjectTo: [
      // 原料上限約束
      ...materials.map(m => ({
        name: `material_${m.itemId}`,
        vars: recipes
          .filter(r => r.inputs.some(i => i.item === m.itemId))
          .map(r => ({
            name: r.id,
            coef: r.inputs.find(i => i.item === m.itemId)!.rate_per_min
          })),
        bnds: { type: glpk.GLP_UP, ub: m.maxRate, lb: 0 }
      })),
      // 產物下限約束
      ...requirements.map(req => ({
        name: `requirement_${req.itemId}`,
        vars: recipes
          .filter(r => r.outputs.some(o => o.item === req.itemId))
          .map(r => ({
            name: r.id,
            coef: r.outputs.find(o => o.item === req.itemId)!.rate_per_min
          })),
        bnds: { type: glpk.GLP_LO, lb: req.minRate, ub: Infinity }
      }))
    ],
    bounds: recipes.map(r => ({
      name: r.id,
      type: glpk.GLP_LO,
      lb: 0
    }))
  }

  const result = glpk.solve(lp)
  return parseGlpkResult(result, recipes)
}
```

### 5.2 台數與流量聯動微調

```typescript
// 使用者調整台數
const adjustDeviceCount = (recipeId: string, newCount: number) => {
  const recipe = getRecipe(recipeId)
  const singleDeviceOutput = recipe.outputs[0].rate_per_min  // 單台產出
  const newFlow = singleDeviceOutput * newCount

  optimizationStore.adjustments.set(recipeId, {
    flow: newFlow,
    deviceCount: newCount
  })
  recalcTotals()
}

// 使用者調整流量
const adjustFlow = (recipeId: string, newFlow: number) => {
  const recipe = getRecipe(recipeId)
  const singleDeviceOutput = recipe.outputs[0].rate_per_min
  const suggestedCount = Math.ceil(newFlow / singleDeviceOutput)
  const efficiency = newFlow / (singleDeviceOutput * suggestedCount)

  optimizationStore.adjustments.set(recipeId, {
    flow: newFlow,
    deviceCount: suggestedCount
  })
  recalcTotals()
}
```

---

## 6. 驗證方式

| 驗證項目 | 方法 |
|----------|------|
| 單一原料單一配方 | 設定赤銅礦 60/min，僅啟用赤銅晶配方，確認求解結果為 2 條滿效率 |
| 多配方競爭原料 | 設定一種原料，兩種消耗它的配方有不同調度券產出，確認求解優先分配高效配方 |
| 硬性需求約束 | 設定最低需求，確認求解結果滿足下限 |
| 無解情況 | 設定原料嚴重不足以滿足硬性需求，確認顯示「無法達成目標」提示 |
| 台數調整聯動 | 增加設備台數，確認流量自動更新，總票券估算即時重算 |
| 流量調整聯動 | 輸入新流量，確認建議台數更新、效率標示正確 |
| 超出原料上限警示 | 微調至超出原料限制，確認紅色警示出現但不阻擋操作 |
| 導入藍圖流程 | 確認結果後點選導入，確認切換至藍圖視角且滑鼠拖曳對應設備 |

---

*本文件為 CR-07 Feature Spec，系統整體架構見 `00_top_spec.md`。*
*本功能屬 Phase 3，實作細節可依 Phase 2 完成後的使用回饋進一步調整。*
