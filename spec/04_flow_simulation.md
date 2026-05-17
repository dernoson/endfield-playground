# Feature Spec：流量模擬與產能估算
# CR-04

**所屬階段：** Phase 1（基礎估算）/ Phase 2（調度券效率）
**依賴：** CR-01（設備與配方定義）、CR-02（管線連接狀態）、CR-03（警示狀態，決定哪些節點略過）
**文件版本：** v0.1

---

## 1. 功能定位

FlowEngine 是模擬器的核心計算模組。每當畫布狀態變動，即時以靜態流量分析計算整條產線的穩態產能，並在畫布上與右側統計面板即時呈現結果。有 Error 的設備與管線略過計算，不影響其餘正常節點的估算。

---

## 2. 功能詳細描述

### 2.1 觸發時機

以下任一事件後，FlowEngine 自動重新計算（debounce 150ms 避免高頻觸發）：
- 設備擺放、移動、刪除、旋轉
- 管線新增、刪除、修改
- 設備配方變更
- 設備啟用 / 停用

### 2.2 計算範圍

- 所有在 `useValidationStore` 中標記為 `hasBlockingError = true` 的設備與管線**略過**計算
- 略過的節點在畫布上顯示為灰色（無流量標示）
- 其餘連通的子圖各自獨立計算

### 2.3 計算方式：靜態流量分析

採**有向圖拓撲排序**後正向傳播計算，假設穩態滿產情況：

1. 建立有向圖：節點為設備，邊為管線（含方向）
2. 拓撲排序（若偵測到環路則標記為異常，略過該子圖）
3. 從 source 節點（礦機、種植機等無輸入接口的設備）開始，依拓撲順序正向計算各邊流量
4. 限流規則：若輸入速率 < 配方需求速率，以輸入速率為上限等比縮放輸出
5. 分流器：輸入流量平均分配至各輸出（或依使用者設定的分流比例）
6. 匯流器：各輸入流量加總後輸出

**流量單位：** 個 / 分鐘（`rate_per_min`）

### 2.4 畫布即時顯示

計算完成後，在以下位置顯示流量數值：

- **管線上**：顯示當前傳輸速率（個/min），懸停時顯示詳細 tooltip
- **設備上**：顯示當前運行效率（%）
- **產線起點（source）**：顯示總輸出速率
- **產線終點（sink，取貨口）**：顯示總收入速率

**效率顏色編碼：**
- 100%：綠色
- 50%–99%：黃色
- 0%–49%：橘色
- 0%（完全無輸入）：灰色

### 2.5 右側統計面板

#### 整體統計區塊
```
總耗電量：    XXX kW
總供電量：    YYY kW
電力狀態：    ✅ 盈餘 ZZZ kW  /  ⚠️ 不足 ZZZ kW（對應 W005）

設備數量：  XX 台（含 X 台有 Error）
管線數量：  XX 條
```

#### 產出摘要表
依品項列出生產 / 消耗 / 淨產量與效率：

| 品項 | 生產（/min） | 消耗（/min） | 淨產量（/min） | 效率 |
|------|-------------|-------------|---------------|------|
| 紫晶纖維 | 4.0 | 4.0 | 0.0 | 100% |
| 工業爆炸品 | 2.0 | — | +2.0 | 100% |
| 穩定碳塊 | 1.5 | 2.0 | -0.5 | ⚠️ 75% |

- 淨產量為正：綠色（盈餘）
- 淨產量為負：紅色（不足，上游供料不足以滿足下游需求）

#### 調度券兌換效率（Phase 2）

使用者在設定區自訂各品項的調度券兌換率（個/min → 券/hr），面板顯示：

```
調度券預估產出：XXX 券/hr
  └ 工業爆炸品 × 2.0/min → YY 券/hr
  └ 穩定碳塊 × 1.5/min   → ZZ 券/hr
```

#### 倉庫填滿預估
使用者輸入協議核心倉庫容量（格數），面板顯示各淨產出品項的填滿時間：
```
倉庫預估（容量：1000 格）
  工業爆炸品：約 8.3 小時填滿
```

---

## 3. 狀態管理（Pinia Store）

### `useFlowStore`

```typescript
{
  edgeFlows: Map<string, EdgeFlow>,      // connectionUid -> 流量
  nodeEfficiencies: Map<string, number>, // deviceUid -> 效率 0~1
  itemSummary: ItemSummary[],
  totalPowerDemand: number,              // 所有設備耗電量加總（kW）
  totalPowerSupply: number,              // 所有供電樁供電量加總（kW）
  ticketRate: number | null,             // 調度券/hr，Phase 2
  lastCalculatedAt: number               // timestamp
}

// EdgeFlow
{
  connectionUid: string,
  itemId: string,
  rate: number  // 個/min
}

// ItemSummary
{
  itemId: string,
  name: string,
  produced: number,    // 個/min
  consumed: number,    // 個/min
  net: number,         // produced - consumed
  efficiency: number   // 0~1
}
```

---

## 4. 實作範例

### 4.1 FlowEngine 主流程

```typescript
const runFlowEngine = () => {
  const devices = placedDeviceStore.devices
  const connections = pipelineStore.connections
  const validation = validationStore

  // 1. 過濾掉有 Error 的節點
  const validDevices = devices.filter(d => !validation.hasBlockingError(d.uid))
  const validConnections = connections.filter(c => !validation.hasBlockingError(c.uid))

  // 2. 建立有向圖
  const graph = buildGraph(validDevices, validConnections)

  // 3. 拓撲排序（偵測環路）
  const { sorted, hasCycle } = topologicalSort(graph)
  if (hasCycle) {
    console.warn('偵測到環路，略過該子圖')
  }

  // 4. 正向傳播計算流量
  const edgeFlows = new Map<string, EdgeFlow>()
  const nodeEfficiencies = new Map<string, number>()

  for (const nodeId of sorted) {
    const device = validDevices.find(d => d.uid === nodeId)!
    const inputFlows = getIncomingFlows(nodeId, edgeFlows, validConnections)
    const { outputFlows, efficiency } = calcDeviceOutput(device, inputFlows)

    nodeEfficiencies.set(nodeId, efficiency)
    for (const [connUid, flow] of outputFlows) {
      edgeFlows.set(connUid, flow)
    }
  }

  // 5. 統計品項摘要
  flowStore.edgeFlows = edgeFlows
  flowStore.nodeEfficiencies = nodeEfficiencies
  flowStore.itemSummary = calcItemSummary(edgeFlows, validDevices)
  flowStore.totalPowerDemand = validDevices.reduce(
    (sum, d) => sum + getDeviceDef(d.deviceId).power_cost, 0
  )
  flowStore.totalPowerSupply = placedDeviceStore.devices
    .filter(d => getDeviceDef(d.deviceId).category === '電力')
    .reduce((sum, d) => sum + (getDeviceDef(d.deviceId).power_output ?? 0), 0)
}
```

### 4.2 單設備輸出計算

```typescript
const calcDeviceOutput = (
  device: PlacedDevice,
  inputFlows: Map<string, number>  // itemId -> rate
): { outputFlows: Map<string, EdgeFlow>, efficiency: number } => {
  const recipe = getRecipe(device.activeRecipe)
  if (!recipe) return { outputFlows: new Map(), efficiency: 0 }

  // 計算各輸入品項的供給比例
  const ratios = recipe.inputs.map(input => {
    const supplied = inputFlows.get(input.item) ?? 0
    return supplied / input.rate_per_min
  })

  // 效率取最小比例（瓶頸輸入決定整體效率）
  const efficiency = Math.min(1, ...ratios)

  // 依效率縮放輸出
  const outputFlows = new Map<string, EdgeFlow>()
  for (const output of recipe.outputs) {
    outputFlows.set(output.item, {
      connectionUid: '',  // 由呼叫端填入
      itemId: output.item,
      rate: output.rate_per_min * efficiency
    })
  }

  return { outputFlows, efficiency }
}
```

### 4.3 debounce 觸發

```typescript
// 監聽相關 store 變動
watch(
  [() => placedDeviceStore.devices, () => pipelineStore.connections],
  useDebounceFn(runFlowEngine, 150),
  { deep: true }
)
```

---

## 5. 驗證方式

| 驗證項目 | 方法 |
|----------|------|
| 即時重算觸發 | 擺放設備後確認管線與面板數值即時更新（< 200ms） |
| Source 到 Sink 正確傳播 | 建立簡單單條產線，確認各節點流量與配方速率一致 |
| 限流縮比 | 礦機供料不足配方需求，確認效率顯示對應比例而非 100% |
| Error 節點略過 | 製造 E001 重疊，確認重疊設備不顯示流量，其下游也顯示灰色 |
| 分流器均分 | 接入分流器後確認兩側輸出各為輸入的一半 |
| 電力統計 | 擺放供電樁與耗電設備，確認右側總耗電量與總供電量數值正確，盈餘 / 不足狀態正確顯示 |
| 產出摘要表 | 確認生產 / 消耗 / 淨產量計算正確，負值顯示紅色 |
| 調度券計算（Phase 2） | 設定兌換率後確認預估券數即時更新 |

---

*本文件為 CR-04 Feature Spec，系統整體架構見 `00_top_spec.md`。*
