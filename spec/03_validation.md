# Feature Spec：產線設備與佈線警示
# CR-03

**所屬階段：** Phase 1（Error）/ Phase 2（Warning）
**依賴：** CR-01（設備狀態）、CR-02（管線連接狀態）
**文件版本：** v0.1

---

## 1. 功能定位

警示模組持續監聽畫布狀態，偵測設備擺放與管線佈線的合法性問題，分 Error 與 Warning 兩級回饋給使用者。警示狀態同時影響 CR-04 流量估算的計算範圍（有 Error 的節點略過）。

---

## 2. 功能詳細描述

### 2.1 警示觸發時機

以下任一狀態變更後，自動重新執行全局驗證：
- 設備擺放、移動、刪除、旋轉
- 管線新增、刪除、修改
- 設備配方變更

驗證採同步計算，結果即時更新至 store，不需使用者手動觸發。

### 2.2 警示等級定義

#### Error（阻斷估算）
有 Error 的設備或管線會被 CR-04 流量估算略過，不參與計算。

| 代碼 | 名稱 | 觸發條件 |
|------|------|----------|
| E001 | 設備重疊 | 兩台（含）以上設備佔用相同格子 |
| E002 | 接口 Type 不符 | 傳送帶接口與水管接口互連 |
| E003 | 配方不符 | 接口輸入的品項與設備當前配方所需品項不符 |
| E004 | 佈線違法 | 管線路徑穿越設備佔用的格子（非物流橋） |
| E005 | 接口重複連接 | 單一輸出接口連接超過一條管線（未經分流器） |
| E006 | 未在供電範圍內 | 設備所有佔用格子均不在任何供電樁的覆蓋範圍內 |

**供電範圍計算方式：** 取所有已擺放供電樁的 n×n 覆蓋格子聯集（n 由 `devices.json` 定義），設備任一格在聯集內即視為供電成功。基地模式下不允許擺放中繼器，供電覆蓋僅由供電樁決定。

#### Warning（不阻斷估算）
Warning 不影響流量估算，僅提醒使用者注意潛在問題。

| 代碼 | 名稱 | 觸發條件 |
|------|------|----------|
| W001 | 輸入缺失 | 設備有輸入接口但無任何管線連入 |
| W002 | 輸出未接 | 設備有輸出接口但無任何管線接出 |
| W003 | 堵塞風險 | 某管線的輸入速率持續超過輸出速率上限 |
| W004 | 效率不足 | 設備因上游供料不足，估算效率低於 50% |
| W005 | 總耗電超載 | 整區所有設備總耗電量超過總供電量上限 |

### 2.3 畫布視覺警示

#### 設備層級
- **Error**：設備邊框顯示紅色，並在角落顯示 ⚠️ 圖示
- **Warning**：設備邊框顯示黃色，並在角落顯示 ⚠️ 圖示
- 同時有 Error 與 Warning 時，以 Error 樣式優先顯示

#### 管線層級
- **Error**：管線顯示紅色閃爍邊框
- **Warning**：管線顯示黃色邊框
- 懸停管線時 tooltip 顯示警示代碼與說明

### 2.4 右側警示列表

右側統計面板包含獨立的警示列表區塊，依 Error → Warning 排序：

```
⛔ Errors (3)
  [E001] 設備重疊：精煉爐 #3 與配件機 #1
  [E003] 配方不符：混合機 #2 輸入接口 (input_0) 品項不符
  [E004] 佈線違法：管線 #7 穿越精煉爐 #1

⚠️ Warnings (2)
  [W001] 輸入缺失：電驅礦機 #2 無輸出管線
  [W003] 堵塞風險：管線 #4 輸入速率超載
```

**點選任一警示項目：**
- 畫布自動導覽（Pan + Zoom）至相應設備或管線
- 相應元素閃爍高亮 1.5 秒

---

## 3. 狀態管理（Pinia Store）

### `useValidationStore`

```typescript
{
  alerts: Alert[]
}

// Alert
{
  uid: string,
  level: 'error' | 'warning',
  code: string,              // E001, W003 等
  message: string,           // 人類可讀說明
  relatedDeviceUids: string[],
  relatedConnectionUids: string[]
}
```

**Getter：**
```typescript
errorsByDevice: (deviceUid: string) => Alert[]
warningsByDevice: (deviceUid: string) => Alert[]
hasBlockingError: (deviceUid: string) => boolean  // 供 CR-04 查詢
```

---

## 4. 實作範例

### 4.1 驗證主流程

```typescript
// 監聽相關 store 變動，觸發重新驗證
watch(
  [() => placedDeviceStore.devices, () => pipelineStore.connections],
  () => runValidation(),
  { deep: true }
)

const runValidation = () => {
  const alerts: Alert[] = []
  alerts.push(...checkDeviceOverlap())    // E001
  alerts.push(...checkPortTypeMismatch()) // E002
  alerts.push(...checkRecipeMismatch())   // E003
  alerts.push(...checkIllegalRouting())   // E004
  alerts.push(...checkDuplicateOutput())  // E005
  alerts.push(...checkPowerCoverage())    // E006
  // Phase 2:
  // alerts.push(...checkMissingInput())       // W001
  // alerts.push(...checkUnconnectedOutput())  // W002
  // alerts.push(...checkBackpressure())       // W003
  // alerts.push(...checkLowEfficiency())      // W004
  // alerts.push(...checkTotalPowerExceeded()) // W005
  validationStore.alerts = alerts
}
```

### 4.2 設備重疊偵測（E001）

```typescript
const checkDeviceOverlap = (): Alert[] => {
  const alerts: Alert[] = []
  const allCells = new Map<string, string>()  // "x,y" -> deviceUid

  for (const device of placedDeviceStore.devices) {
    const cells = getOccupiedCells(device)
    for (const cell of cells) {
      const key = `${cell.x},${cell.y}`
      if (allCells.has(key)) {
        alerts.push({
          uid: generateUid(),
          level: 'error',
          code: 'E001',
          message: `設備重疊：${getDeviceName(device.uid)} 與 ${getDeviceName(allCells.get(key)!)}`,
          relatedDeviceUids: [device.uid, allCells.get(key)!],
          relatedConnectionUids: []
        })
      } else {
        allCells.set(key, device.uid)
      }
    }
  }
  return alerts
}
```

### 4.2 供電範圍偵測（E006）

```typescript
const checkPowerCoverage = (): Alert[] => {
  const alerts: Alert[] = []

  // 計算所有供電樁的覆蓋格子聯集
  const coveredCells = new Set<string>()
  const powerSupplies = placedDeviceStore.devices.filter(
    d => getDeviceDef(d.deviceId).category === '電力' &&
         getDeviceDef(d.deviceId).id !== 'relay'  // 基地模式排除中繼器
  )

  for (const supply of powerSupplies) {
    const def = getDeviceDef(supply.deviceId)
    const range = def.power_range  // n，從 devices.json 取得
    const cx = supply.x + Math.floor(def.size.w / 2)
    const cy = supply.y + Math.floor(def.size.h / 2)

    for (let dx = -Math.floor(range / 2); dx <= Math.floor(range / 2); dx++) {
      for (let dy = -Math.floor(range / 2); dy <= Math.floor(range / 2); dy++) {
        coveredCells.add(`${cx + dx},${cy + dy}`)
      }
    }
  }

  // 檢查每台設備是否至少有一格在覆蓋範圍內
  for (const device of placedDeviceStore.devices) {
    if (getDeviceDef(device.deviceId).category === '電力') continue  // 供電設備本身不需供電
    const cells = getOccupiedCells(device)
    const isPowered = cells.some(c => coveredCells.has(`${c.x},${c.y}`))

    if (!isPowered) {
      alerts.push({
        uid: generateUid(),
        level: 'error',
        code: 'E006',
        message: `未在供電範圍內：${getDeviceName(device.uid)}`,
        relatedDeviceUids: [device.uid],
        relatedConnectionUids: []
      })
    }
  }

  return alerts
}
```

### 4.3 總耗電超載偵測（W005，Phase 2）

```typescript
const checkTotalPowerExceeded = (): Alert[] => {
  const totalDemand = placedDeviceStore.devices.reduce(
    (sum, d) => sum + getDeviceDef(d.deviceId).power_cost, 0
  )
  const totalSupply = placedDeviceStore.devices
    .filter(d => getDeviceDef(d.deviceId).category === '電力')
    .reduce((sum, d) => sum + (getDeviceDef(d.deviceId).power_output ?? 0), 0)

  if (totalDemand > totalSupply) {
    return [{
      uid: generateUid(),
      level: 'warning',
      code: 'W005',
      message: `總耗電量超載：需求 ${totalDemand} kW，供給 ${totalSupply} kW`,
      relatedDeviceUids: [],
      relatedConnectionUids: []
    }]
  }
  return []
}
```

### 4.4 點選警示導覽至相應元素

```typescript
const navigateToAlert = (alert: Alert) => {
  // 計算目標中心位置
  const targetPos = getAlertCenter(alert)

  // 平移並縮放畫布至目標位置
  canvasStore.panToPosition(targetPos, { animate: true })

  // 觸發閃爍高亮
  highlightStore.flashElements({
    deviceUids: alert.relatedDeviceUids,
    connectionUids: alert.relatedConnectionUids,
    duration: 1500
  })
}
```

---

## 5. 驗證方式

| 驗證項目 | 方法 |
|----------|------|
| E001 設備重疊 | 移動設備至與另一台重疊，確認兩台均顯示紅框，警示列表出現 E001 |
| E002 Type 不符 | 連接傳送帶接口至水管接口，確認管線顯示紅色，警示列表出現 E002 |
| E003 配方不符 | 將輸出品項 A 的設備接入需要品項 B 的設備，確認出現 E003 |
| E004 佈線違法 | 手動繪製穿越設備的路徑，確認出現 E004 |
| E006 未在供電範圍 | 擺放設備但不在任何供電樁覆蓋範圍內，確認出現 E006 紅框 |
| E006 供電覆蓋聯集 | 擺放兩個供電樁覆蓋不同區域，確認兩區域的設備均不出現 E006 |
| W005 總耗電超載（Phase 2）| 耗電量超過總供電量，確認出現 W005 黃色警示 |
| Error 略過估算 | 製造 E001，確認重疊設備不出現在流量估算結果中 |
| W001 輸入缺失（Phase 2）| 擺放設備但不接任何管線，確認出現 W001 黃色邊框 |
| 點選警示導覽 | 點選警示列表項目，確認畫布平移至相應設備並閃爍 |
| 警示即時更新 | 修正重疊問題後，確認 E001 即時從列表消失 |

---

*本文件為 CR-03 Feature Spec，系統整體架構見 `00_top_spec.md`。*
