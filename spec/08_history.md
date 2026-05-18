# Feature Spec：操作歷史
# CR-08

**所屬階段：** Phase 1
**依賴：** CR-01（設備擺放操作）、CR-02（管線操作）、CR-05（流程視角操作）
**文件版本：** v0.1

---

## 1. 功能定位

操作歷史模組以 Command Pattern 統一管理所有藍圖狀態變更，提供無限制的復原 / 取消復原功能。CR-01、CR-02、CR-05 的所有操作均透過本模組提交，任何視角下的 Ctrl+Z / Ctrl+Y 均作用於同一歷史佇列。Session 結束後歷史清空，不持久化至 localStorage。

---

## 2. 功能詳細描述

### 2.1 復原 / 取消復原

- **Ctrl+Z**：復原上一步操作，還原 Pinia store 至操作前狀態
- **Ctrl+Y**：取消復原，重新套用已復原的操作
- 無步驟數限制
- 在任何視角（藍圖 / 流程 / 並列）均可觸發，作用於同一歷史佇列
- 執行新操作後，取消復原佇列清空（標準行為）

### 2.2 納入歷史的操作範圍

以下操作均須透過 `useHistoryStore.execute()` 提交：

**CR-01 設備擺放：**
- 擺放設備
- 移動設備
- 旋轉設備
- 刪除設備
- 複製貼上（整組設備＋管線視為單一操作）
- 設備配方變更

**CR-02 管線連接：**
- 新增管線（含自動生成的分流器 / 匯流器 / 物流橋）
- 刪除管線
- 修改管線彎折點

**CR-05 流程視角：**
- 新增流程配方節點
- 刪除流程配方節點
- 中間產物設定變更（生產 / 倉庫直取）

### 2.3 不納入歷史的操作

以下操作不進入歷史佇列（屬於視圖操作，非資料操作）：
- 畫布縮放 / 平移
- 視角切換（藍圖 / 流程 / 並列）
- 選取 / 框選
- 左側面板展開 / 收合
- Flow Chart 節點位置調整（純視覺排版）

### 2.4 複合操作（Macro Command）

部分操作由多個子操作組成，應視為單一歷史項目，一次 Ctrl+Z 全部復原：

| 複合操作 | 包含的子操作 |
|----------|-------------|
| 複製貼上 | 擺放多台設備 + 新增多條管線 |
| 新增管線（含自動節點）| 新增管線 + 插入分流器 / 匯流器 / 物流橋 |
| 從流程視角導入設備 | 擺放多台設備 + 新增預設管線建議 |

---

## 3. 狀態管理（Pinia Store）

### `useHistoryStore`

```typescript
{
  undoStack: Command[],   // 已執行的操作，最新的在最後
  redoStack: Command[],   // 已復原的操作，最新的在最後
}

// Command 介面
interface Command {
  label: string           // 操作描述，供 debug 使用（如 "擺放精煉爐"）
  execute: () => void     // 執行操作（套用至 store）
  undo: () => void        // 復原操作（還原 store）
}
```

**Actions：**
```typescript
// 提交並執行一個操作
execute(command: Command): void

// 復原上一步
undo(): void

// 取消復原
redo(): void

// 清空所有歷史（Session 結束或手動清除）
clear(): void
```

**Getters：**
```typescript
canUndo: boolean   // undoStack.length > 0
canRedo: boolean   // redoStack.length > 0
```

---

## 4. 實作範例

### 4.1 Command Pattern 基礎結構

```typescript
// useHistoryStore.ts
export const useHistoryStore = defineStore('history', () => {
  const undoStack = ref<Command[]>([])
  const redoStack = ref<Command[]>([])

  const execute = (command: Command) => {
    command.execute()
    undoStack.value.push(command)
    redoStack.value = []  // 執行新操作後清空 redo 佇列
  }

  const undo = () => {
    const command = undoStack.value.pop()
    if (!command) return
    command.undo()
    redoStack.value.push(command)
  }

  const redo = () => {
    const command = redoStack.value.pop()
    if (!command) return
    command.execute()
    undoStack.value.push(command)
  }

  const clear = () => {
    undoStack.value = []
    redoStack.value = []
  }

  return {
    undoStack, redoStack,
    canUndo: computed(() => undoStack.value.length > 0),
    canRedo: computed(() => redoStack.value.length > 0),
    execute, undo, redo, clear
  }
})
```

### 4.2 單一操作範例：擺放設備

```typescript
// 在 usePlacedDeviceStore 中
const placeDevice = (device: PlacedDevice) => {
  const historyStore = useHistoryStore()

  historyStore.execute({
    label: `擺放 ${getDeviceName(device.deviceId)}`,
    execute: () => {
      devices.value.push(device)
    },
    undo: () => {
      devices.value = devices.value.filter(d => d.uid !== device.uid)
    }
  })
}
```

### 4.3 複合操作範例：新增管線（含自動插入分流器）

```typescript
// MacroCommand：將多個 Command 組合為單一歷史項目
const createMacroCommand = (label: string, commands: Command[]): Command => ({
  label,
  execute: () => commands.forEach(c => c.execute()),
  undo: () => [...commands].reverse().forEach(c => c.undo())
})

// 新增管線時，若需插入分流器
const addConnectionWithSplitter = (
  connection: Connection,
  splitter: PlacedDevice,
  modifiedConnection: Connection
) => {
  const historyStore = useHistoryStore()

  historyStore.execute(createMacroCommand('新增管線（含分流器）', [
    {
      label: '插入分流器',
      execute: () => placedDeviceStore.devices.push(splitter),
      undo: () => placedDeviceStore.devices = placedDeviceStore.devices
        .filter(d => d.uid !== splitter.uid)
    },
    {
      label: '修改原管線',
      execute: () => pipelineStore.updateConnection(modifiedConnection),
      undo: () => pipelineStore.updateConnection(connection)
    },
    {
      label: '新增新管線',
      execute: () => pipelineStore.connections.push(connection),
      undo: () => pipelineStore.connections = pipelineStore.connections
        .filter(c => c.uid !== connection.uid)
    }
  ]))
}
```

### 4.4 快捷鍵綁定

```typescript
// 在 App.vue 或全局 composable 中
const { ctrl_z, ctrl_y } = useMagicKeys()
const historyStore = useHistoryStore()

watch(ctrl_z, (pressed) => { if (pressed) historyStore.undo() })
watch(ctrl_y, (pressed) => { if (pressed) historyStore.redo() })
```

### 4.5 複製貼上作為單一複合操作

```typescript
const pasteSelection = (
  copiedDevices: PlacedDevice[],
  copiedConnections: Connection[],
  offset: { x: number, y: number }
) => {
  const historyStore = useHistoryStore()

  // 為複製的物件產生新 uid
  const newDevices = copiedDevices.map(d => ({ ...d, uid: generateUid(), x: d.x + offset.x, y: d.y + offset.y }))
  const uidMap = new Map(copiedDevices.map((d, i) => [d.uid, newDevices[i].uid]))
  const newConnections = copiedConnections.map(c => ({
    ...c,
    uid: generateUid(),
    from: { ...c.from, device_uid: uidMap.get(c.from.device_uid)! },
    to: { ...c.to, device_uid: uidMap.get(c.to.device_uid)! }
  }))

  historyStore.execute(createMacroCommand('複製貼上', [
    ...newDevices.map(d => ({
      label: `擺放 ${getDeviceName(d.deviceId)}`,
      execute: () => placedDeviceStore.devices.push(d),
      undo: () => { placedDeviceStore.devices = placedDeviceStore.devices.filter(x => x.uid !== d.uid) }
    })),
    ...newConnections.map(c => ({
      label: '新增管線',
      execute: () => pipelineStore.connections.push(c),
      undo: () => { pipelineStore.connections = pipelineStore.connections.filter(x => x.uid !== c.uid) }
    }))
  ]))
}
```

---

## 5. 驗證方式

| 驗證項目 | 方法 |
|----------|------|
| 基本復原 | 擺放設備後 Ctrl+Z，確認設備消失 |
| 基本取消復原 | 復原後 Ctrl+Y，確認設備重新出現 |
| 多步復原 | 連續擺放 5 台設備，連續 Ctrl+Z 5 次，確認逐一消失 |
| 新操作清空 redo | 復原後執行新操作，確認 Ctrl+Y 無效 |
| 跨視角復原 | 在流程視角新增配方節點，切換至藍圖視角後 Ctrl+Z，確認節點被復原 |
| 複合操作單次復原 | 新增含分流器的管線，一次 Ctrl+Z 確認管線與分流器同時消失 |
| 複製貼上復原 | 複製貼上一組設備，Ctrl+Z 確認整組同時消失 |
| 視圖操作不進歷史 | 縮放畫布後 Ctrl+Z，確認縮放不被復原（而是復原上一個資料操作）|
| Session 清空 | 執行操作後重新整理頁面，確認 Ctrl+Z 無法復原（歷史已清空）|

---

*本文件為 CR-08 Feature Spec，系統整體架構見 `00_top_spec.md`。*
