# Feature Spec：配方流程設計（Flow Chart 視角）
# CR-05

**所屬階段：** Phase 1（視角切換 + 基礎 Flow Chart）/ Phase 2（新增流程、中間產物選擇、一鍵導入）
**依賴：** CR-01（設備與配方資料）、CR-04（流量估算結果）
**文件版本：** v0.2

---

## 1. 功能定位

流程視角是模擬器的核心賣點之一，讓使用者可以在抽象的「產物流向圖」與具體的「設備擺放藍圖」之間自由切換，兩者共用同一份產線資料。使用者可在流程視角進行高層次的配方規劃，再一鍵轉換為藍圖中的具體設備配置。

---

## 2. 視角模式

主畫面提供視角切換控項（工具列按鈕或快捷鍵），支援三種模式：

| 模式 | 說明 |
|------|------|
| **藍圖視角** | 完整格子畫布，設備擺放與管線操作（CR-01、CR-02 的主操作介面） |
| **流程視角** | Flow Chart 呈現產物節點、設備節點、連線效率與配比 |
| **並列視角** | 藍圖與流程並排顯示，支援左右並排或上下並排，兩側同步聯動 |

三種視角共用同一份 Pinia store 資料，切換時不需重新載入。

---

## 3. 功能詳細描述

### 3.1 流程視角 — Flow Chart 呈現

Flow Chart 的節點與邊定義：

**節點類型：**
- **原料節點**：產線的輸入來源（礦機採集的原物料、倉庫直取的品項），顯示供給速率
- **設備節點**：執行配方的設備，顯示設備名稱、當前配方、效率（%）
- **產物節點**：中間產物或最終產物，顯示當前產出速率
- **倉庫節點**：標示該品項從倉庫直接取用，不經過產線生產

**邊：**
- 從原料節點 / 產物節點指向設備節點（輸入）
- 從設備節點指向產物節點（輸出）
- 邊上顯示品項名稱與流量（個/min）

**視覺佈局：**
- 自左向右排列（原料 → 設備 → 產物），可自動佈局
- 最終產物（無下游）顯示於最右側，底部標示對應調度券兌換量
- 節點顏色對應效率（同 CR-04 的顏色編碼：綠 / 黃 / 橘 / 灰）

### 3.2 並列視角 — 聯動行為

#### Phase 1：點選導覽聯動
- 點選任一側的設備或產物節點，另一側自動導覽（Pan + Zoom）至相應位置並高亮
- 點選藍圖側設備 → 流程側對應設備節點高亮
- 點選流程側設備節點 → 藍圖側對應設備高亮並居中

#### Phase 2：編輯聯動
- 在藍圖側新增 / 刪除設備或管線，流程側即時更新 Flow Chart
- 在流程側新增配方（見 3.3），藍圖側即時顯示「待導入」提示
- 兩側的配方選擇、中間產物設定保持同步

### 3.3 流程視角編輯功能（Phase 2）

#### 新增流程配方
使用者可在流程視角直接新增一個尚未在藍圖中存在的配方節點：
1. 點選「+ 新增配方」，選擇目標產物
2. 系統列出可生產該產物的所有配方供選擇
3. 確認後在 Flow Chart 中插入對應的設備節點與連線
4. 右上角出現「**切換視角以導入**」按鈕提示

#### 切換視角以導入
1. 使用者點選「切換視角以導入」，畫面切換至藍圖視角
2. 滑鼠自動拖曳一組對應設備（預設配置），跟隨游標移動
3. 使用者移動至目標位置後點選確認擺放
4. 擺放完成後，管線接口的預設連接建議以虛線高亮顯示，使用者確認或忽略

#### 中間產物選擇
在流程視角中，每個中間產物節點右鍵可選擇：
- **使用產線生產**：保留現有配方節點
- **從倉庫直取**：將該節點替換為倉庫節點，上游配方節點從 Flow Chart 移除（但藍圖中的設備不自動刪除，僅解除連線關係並顯示 Warning）

---

## 4. 狀態管理（Pinia Store）

### `useViewStore`
```typescript
{
  currentView: 'blueprint' | 'flow' | 'split',
  splitDirection: 'horizontal' | 'vertical',  // horizontal = 左右並排，vertical = 上下並排
  splitRatio: number  // 並列比例，預設 0.5
}
```

### `useFlowChartStore`
```typescript
{
  nodes: FlowChartNode[],
  edges: FlowChartEdge[],
  pendingImports: PendingImport[]  // 待導入至藍圖的配方組
}

// FlowChartNode
{
  uid: string,
  type: 'source' | 'device' | 'product' | 'warehouse',
  label: string,
  deviceUid: string | null,      // 對應 PlacedDevice uid（若已在藍圖中）
  itemId: string | null,
  rate: number | null,           // 個/min，來自 CR-04 估算
  efficiency: number | null,     // 0~1，來自 CR-04 估算
  position: { x: number, y: number }  // Flow Chart 中的座標
}

// FlowChartEdge
{
  uid: string,
  fromNodeUid: string,
  toNodeUid: string,
  itemId: string,
  rate: number  // 個/min
}

// PendingImport
{
  recipeId: string,
  deviceCount: number,
  suggestedDevices: PlacedDevice[]  // 預設擺放位置（未確認）
}
```

### Flow Chart 自動同步

`useFlowChartStore` 的 nodes / edges 由 getter 從 `usePlacedDeviceStore` + `usePipelineStore` + `useFlowStore` 衍生計算，不獨立維護——藍圖狀態是單一來源，Flow Chart 是其衍生視圖。

```typescript
// 衍生計算：從藍圖狀態生成 Flow Chart 節點
const derivedNodes = computed(() => {
  return buildFlowChartNodes(
    placedDeviceStore.devices,
    pipelineStore.connections,
    flowStore.nodeEfficiencies,
    flowStore.edgeFlows
  )
})
```

---

## 5. UI 規格

### 5.1 視角切換控項

切換控項位於**編輯區左下角**，以三個圖示按鈕呈現三種視角狀態，按 **Tab 鍵輪替**切換：

```
╔══════════╗
║          ║
║  編輯區  ║
║          ║
║ [🗺][📊][⊞] ║  ← 左下角視角切換圖示
╚══════════╝
```

| 圖示 | 視角 |
|------|------|
| 🗺（藍圖圖示） | 藍圖視角 |
| 📊（流程圖示） | 流程視角 |
| ⊞（並列圖示） | 並列視角 |

- 目前所在視角的圖示顯示為選取狀態（高亮）
- 按 Tab 鍵依序輪替：藍圖 → 流程 → 並列 → 藍圖…
- 直接點選圖示可跳至對應視角

### 5.2 並列視角版型

並列視角支援**左右並排**與**上下並排**兩種排列方向，使用者可在並列視角中切換：

**左右並排（預設）：**
```
┌────────────────────┬────────────────────┐
│                    │                    │
│   藍圖視角         │   流程視角          │
│   （格子畫布）      │   （Flow Chart）    │
│                    │                    │
│  點選設備          │  對應節點高亮       │
│  ←──────────────── │ ─────────────────→ │
│                    │                    │
└────────────────────┴────────────────────┘
          ↔ 可拖移垂直分隔線調整比例
```

**上下並排：**
```
┌────────────────────────────────────────┐
│   藍圖視角（格子畫布）                  │
│                                        │
│  點選設備 ↕ 對應節點高亮               │
├────────────────────────────────────────┤
│   流程視角（Flow Chart）               │
│                                        │
└────────────────────────────────────────┘
          ↕ 可拖移水平分隔線調整比例
```

排列方向切換按鈕顯示於並列視角的分隔線旁。

### 5.3 Flow Chart 節點樣式

| 節點類型 | 樣式 |
|----------|------|
| 原料節點 | 圓角矩形，深灰背景，白字 |
| 設備節點 | 矩形，顏色依效率（綠 / 黃 / 橘 / 灰），顯示設備圖示 |
| 產物節點 | 橢圓，品項圖示 + 名稱 + 速率 |
| 倉庫節點 | 橢圓，倉庫圖示，虛線邊框 |
| 待導入節點 | 矩形，虛線邊框，半透明 |

---

## 6. 實作範例

### 6.1 視角切換

```typescript
// useViewStore
const VIEW_ORDER = ['blueprint', 'flow', 'split'] as const

const setView = (view: typeof VIEW_ORDER[number]) => {
  currentView.value = view
}

const cycleView = () => {
  const currentIndex = VIEW_ORDER.indexOf(currentView.value)
  const nextIndex = (currentIndex + 1) % VIEW_ORDER.length
  currentView.value = VIEW_ORDER[nextIndex]
}

const toggleSplitDirection = () => {
  splitDirection.value = splitDirection.value === 'horizontal' ? 'vertical' : 'horizontal'
}

// vueUse Tab 鍵輪替
const { tab } = useMagicKeys()
watch(tab, (pressed) => { if (pressed) viewStore.cycleView() })
```

### 6.2 Flow Chart 從藍圖衍生

```typescript
const buildFlowChartNodes = (
  devices: PlacedDevice[],
  connections: Connection[],
  efficiencies: Map<string, number>,
  edgeFlows: Map<string, EdgeFlow>
): FlowChartNode[] => {
  const nodes: FlowChartNode[] = []

  for (const device of devices) {
    const recipe = getRecipe(device.activeRecipe)
    nodes.push({
      uid: `node_${device.uid}`,
      type: 'device',
      label: getDeviceName(device.deviceId),
      deviceUid: device.uid,
      itemId: null,
      rate: null,
      efficiency: efficiencies.get(device.uid) ?? null,
      position: autoLayoutPosition(device.uid)
    })

    // 為每個輸入 / 輸出品項建立產物節點
    if (recipe) {
      for (const output of recipe.outputs) {
        if (!nodes.find(n => n.itemId === output.item)) {
          nodes.push(buildProductNode(output.item, edgeFlows))
        }
      }
    }
  }

  return nodes
}
```

### 6.3 並列視角點選導覽

```typescript
// 點選藍圖側設備，流程側對應節點高亮
const onBlueprintDeviceClick = (deviceUid: string) => {
  const flowNode = flowChartStore.nodes.find(n => n.deviceUid === deviceUid)
  if (flowNode) {
    flowChartStore.highlightNode(flowNode.uid)
    flowChartStore.panToNode(flowNode.uid)
  }
}

// 點選流程側節點，藍圖側對應設備高亮
const onFlowNodeClick = (nodeUid: string) => {
  const node = flowChartStore.nodes.find(n => n.uid === nodeUid)
  if (node?.deviceUid) {
    placedDeviceStore.selectDevice(node.deviceUid)
    canvasStore.panToDevice(node.deviceUid)
  }
}
```

---

## 7. 驗證方式

| 驗證項目 | 方法 |
|----------|------|
| Tab 鍵輪替視角 | 連按 Tab 三次，確認依序切換藍圖 → 流程 → 並列 → 藍圖 |
| 左下角圖示顯示 | 確認三個視角圖示顯示於編輯區左下角，當前視角圖示高亮 |
| 點選圖示直接切換 | 點選非當前視角的圖示，確認直接跳至對應視角 |
| 切換時資料不遺失 | 在藍圖側新增設備後切換至流程視角，確認節點出現 |
| 並列左右並排 | 進入並列視角，確認預設為左右排列，可拖移垂直分隔線 |
| 並列上下並排切換 | 點選排列方向切換按鈕，確認切換為上下排列，分隔線變水平 |
| 並列比例調整 | 拖移分隔線，確認兩側比例即時更新 |
| Flow Chart 正確呈現 | 建立簡單兩台設備產線，切至流程視角，確認節點與邊正確對應 |
| 效率顏色正確 | 製造輸入不足情況，確認設備節點顏色對應效率等級 |
| 並列視角點選導覽（Phase 1）| 點選藍圖側設備，確認流程側對應節點高亮；反向同樣測試 |
| 並列視角編輯聯動（Phase 2）| 在藍圖側新增設備，確認流程側即時更新 |
| 新增配方出現待導入按鈕（Phase 2）| 在流程視角新增配方，確認出現「切換視角以導入」提示 |
| 一鍵導入流程（Phase 2）| 點選導入，確認切換至藍圖視角且滑鼠拖曳對應設備組 |
| 中間產物倉庫直取（Phase 2）| 右鍵中間產物節點選「從倉庫直取」，確認上游節點移除，藍圖設備顯示 Warning |

---

*本文件為 CR-05 Feature Spec，系統整體架構見 `00_top_spec.md`。*
