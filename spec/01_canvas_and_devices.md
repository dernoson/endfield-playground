# Feature Spec：2D 格子制畫布與設備擺放
# CR-01

**所屬階段：** Phase 1
**依賴：** 無（本模組為其他所有 CR 的基礎）
**文件版本：** v0.2

---

## 1. 功能定位

本模組是模擬器的核心操作介面。使用者在此以精確格子制畫布擺放、旋轉、移動設備，建立產線的空間配置基礎。畫布狀態是所有其他模組（管線連接、流量估算、視角切換）的資料來源。

---

## 2. 功能詳細描述

### 2.1 畫布規格

- 格子單位對應遊戲原生格線，1 格 = 1 cell
- 設備依遊戲佔格數擺放（如精煉爐 3×3、配件機 3×3）
- 支援縮放（滾輪）與平移（空白鍵＋拖拉）
- 格線顯示可開關

**基地選擇（optional）：**
使用者可選擇當前規劃的基地（武陵 / 四號谷地），選擇後：
- 畫布自動對應該基地的實際格子尺寸
- 選擇武陵時，畫布邊緣額外標示液體原物料的輸入方位（標示於對應側邊）
- 未選擇基地時，畫布為自由大小，無方位標示

### 2.2 左側資訊面板

以下兩種情境觸發左側面板顯示設備資訊：

**情境 A：從工具列點選設備**
- 顯示該設備的詳細資訊：名稱、設備大小（格數）、耗電量、所有可用配方表
- 配方表列出每個配方的輸入 / 輸出品項與速率
- 此時滑鼠進入「準備擺放」狀態（見 2.3）

**情境 B：點選畫布中已部署的設備**
- 顯示同上資訊，並額外顯示當前選用的配方與運行狀態

### 2.3 設備擺放互動

#### 拿起設備

**從工具列拿起：**
1. 左鍵單擊工具列中的設備
2. 左側資訊面板更新顯示該設備資訊
3. 滑鼠進入「拿起設備」狀態，游標跟隨設備半透明預覽

**從畫布拿起（移動）：**
- 對單一設備或框選的一組設備左鍵長按，進入「拿起設備」狀態
- 同上述方式進行移動

#### 拿起狀態下的互動

| 操作 | 行為 |
|------|------|
| 滑鼠移動 | 設備預覽跟隨游標，snap 至格線 |
| 移至畫布邊緣 | 自動捲動視角（Edge Scrolling） |
| R 鍵 | 旋轉設備預覽（切換朝向） |
| Esc | 取消拿起，設備回到原位（或消失，若從工具列拿起） |

#### 放下設備

**左鍵單擊：** 以當前預覽位置與朝向放下設備

**左鍵長按 + 拖動（朝向選擇模式）：**
1. 長按畫布觸發：在設備周圍顯示菱形方向選擇框
2. 按住拖動滑鼠至四個方向之一，決定設備朝向
3. 鬆開滑鼠，以選定朝向放下設備

#### 連續擺放與複製

- **從工具列拿起後放置：** 放置後自動繼續拿起下一個相同設備，直到按 Esc 結束
- **從畫布拿起後放置（移動）：** 放置後結束操作
- **從畫布拿起後按住 Ctrl 放置：** 視為複製，原位設備保留，放下一份新複製

#### 擺放視覺回饋

- **綠色半透明預覽：** 可放置
- **紅色半透明預覽：** 與其他設備重疊（不阻擋放置，放置後顯示 Error 警示，見 CR-03）

#### 設備正對現有管線時自動連接

擺放設備後，若設備的接口正對已存在的管線端點，自動建立連接。

### 2.4 設備移動

- 對單一或已框選的一組設備左鍵長按，進入「拿起設備」狀態（見 2.3）
- 移動時，已連接的管線維持連接關係，但路徑不自動重新規劃（Phase 1）
- 放下後若產生衝突（設備重疊、管線違法），顯示對應 Error 警示，不阻擋放置

> **Phase 3 升級：** 移動設備時，已連接管線自動重新規劃路徑。

### 2.5 複製擺放

**框選後複製：**
1. 框選目標設備與管線（框選範圍內的管線一併納入）
2. 按 Ctrl+C，滑鼠立即進入「拿起設備」狀態，拖曳整組複製預覽（半透明顯示）
3. 以單擊或長按拖動選朝向的方式放置（見 2.3）
4. 放置時自動為所有複製物件產生新 uid；框選範圍外的管線端點不複製

**從畫布拿起時 Ctrl 複製：**
- 從畫布拿起設備（長按）後，按住 Ctrl 放置，原位設備保留，放下一份複製

複製貼上視為單一複合操作，一次 Ctrl+Z 整組復原（見 CR-08）。

### 2.6 基地限制

- 基地畫布（武陵 / 四號谷地）不允許擺放中繼器；中繼器從基地模式的設備面板中隱藏
- 未選擇基地時（自由畫布），中繼器可正常擺放

### 2.7 多選與批次操作

- Shift＋點選：多選設備
- 框選：拖拉空白區域框選範圍內所有設備與管線
- 批次移動：多選後拖拉
- 批次刪除：多選後按 Delete

### 2.8 操作歷史

所有藍圖狀態變更（擺放、移動、旋轉、刪除、複製、配方變更）均透過 `useHistoryStore.execute()` 提交。

- **Ctrl+Z**：無限制復原
- **Ctrl+Y**：取消復原
- 詳細實作見 CR-08 `08_history.md`

---

## 3. 設備資料庫

### 3.1 資料來源與維護

- 完整照搬遊戲內所有設備與配方
- 以 **TypeScript** 定義維護於 `/data/devices.ts`，受型別系統保護，並可為特殊設備保留自訂邏輯彈性
- 遊戲更新後由指定人員手動同步

### 3.2 型別定義與資料格式

```typescript
// /data/types.ts

export type PortType = 'conveyor' | 'pipe'
export type Direction = 'up' | 'down' | 'left' | 'right'
export type DeviceCategory = '採集' | '加工' | '種植' | '電力' | '物流' | '儲存' | '武器'

export interface PortDef {
  id: string
  x: number           // 相對於設備左上角的格子偏移
  y: number
  direction: Direction
  type: PortType
}

export interface RecipeDef {
  id: string
  name: string
  inputs: { item: string; rate_per_min: number }[]
  outputs: { item: string; rate_per_min: number }[]
  cycle_time_sec: number
}

export interface ItemDef {
  id: string
  name: string
  category: string
}

export interface DeviceDef {
  id: string
  name: string
  size: { w: number; h: number }
  category: DeviceCategory
  power_cost: number          // 耗電量（kW）
  power_output?: number       // 供電量（kW），供電類設備專用
  power_range?: number        // 供電覆蓋半徑 n（n×n 格），供電樁專用
  ports: PortDef[]
  recipes: string[]           // 對應 RecipeDef.id
  allowInBase?: boolean       // 預設 true；false 表示基地模式下隱藏（如中繼器）
  // 特殊邏輯可在此擴充，例如：
  // onPlace?: (device: PlacedDevice) => void
}
```

```typescript
// /data/devices.ts（資料範例）

import type { DeviceDef, RecipeDef, ItemDef } from './types'

export const devices: DeviceDef[] = [
  {
    id: 'refinery',
    name: '精煉爐',
    size: { w: 3, h: 3 },
    category: '加工',
    power_cost: 10,
    ports: [
      { id: 'input_0', x: 0, y: 1, direction: 'left', type: 'conveyor' },
      { id: 'output_0', x: 2, y: 0, direction: 'up', type: 'conveyor' }
    ],
    recipes: ['recipe_purple_crystal_fiber', 'recipe_stable_carbon']
  },
  {
    id: 'relay',
    name: '中繼器',
    size: { w: 1, h: 1 },
    category: '電力',
    power_cost: 0,
    ports: [],
    recipes: [],
    allowInBase: false   // 基地模式下隱藏
  }
]

export const recipes: RecipeDef[] = [
  {
    id: 'recipe_purple_crystal_fiber',
    name: '紫晶纖維',
    inputs: [{ item: 'purple_ore', rate_per_min: 4 }],
    outputs: [{ item: 'purple_fiber', rate_per_min: 2 }],
    cycle_time_sec: 15
  }
]

export const items: ItemDef[] = [
  {
    id: 'purple_ore',
    name: '紫晶礦',
    category: '原礦'
  }
]
```

**Port type 定義：**
- `conveyor`：傳送帶接口
- `pipe`：水管接口

### 3.3 設備分類

| 分類 | 代表設備 |
|------|----------|
| 採集 | 電驅礦機、採種機 |
| 加工 | 精煉爐、配件機、混合機 |
| 種植 | 種植機 |
| 電力 | 供電樁、中繼器、熱能池 |
| 物流 | 傳送帶、分流器、匯流器、物流橋、取貨口 |
| 儲存 | 協議核心、協議儲存箱 |
| 武器 | 武器機器 |

---

## 4. 狀態管理（Pinia Store）

### `useCanvasStore`
```typescript
{
  gridSize: number,          // 單格像素大小（隨縮放變化）
  offset: { x, y },         // 畫布平移偏移
  zoom: number,              // 縮放倍率
  baseRegion: 'wuling' | 'valley4' | null,  // 基地選擇
  canvasSize: { w, h } | null  // 基地對應格子尺寸，null 為自由大小
}
```

### `usePlacedDeviceStore`
```typescript
{
  devices: PlacedDevice[],   // 已擺放設備清單
  selectedIds: string[],     // 當前選取的設備 uid 清單
  hoveredId: string | null,  // 滑鼠懸停的設備 uid
  heldDevice: HeldDevice | null  // 當前「拿起」狀態
}

// PlacedDevice
{
  uid: string,               // 實例唯一 ID
  deviceId: string,          // 對應 devices.ts 的 DeviceDef.id
  x: number,                 // 格子座標 X
  y: number,                 // 格子座標 Y
  rotation: 0 | 90 | 180 | 270,
  activeRecipe: string | null
}

// HeldDevice（拿起狀態）
{
  deviceId: string,
  sourceUids: string[] | null,  // null 表示從工具列拿起，否則為原始設備 uid
  previewX: number,
  previewY: number,
  rotation: 0 | 90 | 180 | 270,
  isCopy: boolean               // Ctrl 複製模式
}
```

---

## 5. UI 規格

### 5.1 整體版型（本模組相關區域）

```
┌──────────────┬──────────────────────────┬─────────────┐
│              │                          │             │
│  左側面板    │      2D 格子畫布          │  右側統計   │
│  （設備資訊）│                          │  面板       │
│              │  拿起 / 放置 / 旋轉       │  （見 CR-04）│
│  Tab 切換：  │  框選 / 移動              │             │
│  ・配方表    │  縮放 / 平移              │             │
│  ・設備形狀  │  基地邊界（若有選擇）     │             │
│  ・耗電資訊  │  液體方位標示（武陵）     │             │
│              │                          │             │
├──────────────┴──────────────────────────┴─────────────┤
│  下方設備工具列                                         │
│  [ 採集 ] [ 加工 ] [ 種植 ] [ 電力 ] [ 物流 ] [ 儲存 ] │
│  各 Tab 顯示該分類所有設備圖示與名稱                    │
└────────────────────────────────────────────────────────┘
```

### 5.2 左側資訊面板

點選工具列設備或畫布中已部署設備時顯示，包含三個 Tab：

| Tab | 內容 |
|-----|------|
| **配方表** | 所有可用配方列表，每個配方顯示輸入 / 輸出品項、速率、週期時間；已部署設備可在此切換當前使用的配方 |
| **設備形狀** | 設備佔格示意圖，標示所有輸入 / 輸出接口的位置與 type（傳送帶 / 水管） |
| **耗電與資訊** | 耗電量（kW）、設備大小（格數）、分類、其他額外說明 |

### 5.3 下方設備工具列

- 依 3.3 分類以 Tab 橫向切換顯示
- 基地模式下，`allowInBase: false` 的設備（如中繼器）自動從工具列隱藏
- 每個設備顯示：圖示、名稱
- 搜尋框可跨分類即時過濾

> **右側統計面板**：顯示流量估算、警示列表、電力統計等，由 CR-04 定義，不在本文件範疇。

### 5.4 快捷鍵彙整

| 快捷鍵 | 情境 | 功能 |
|--------|------|------|
| 左鍵單擊（工具列） | 任何時候 | 拿起設備 |
| 左鍵單擊（畫布） | 拿起狀態 | 放下設備 |
| 左鍵長按（畫布） | 拿起狀態 | 進入朝向選擇模式 |
| 左鍵長按（已部署設備） | 一般狀態 | 拿起設備（移動） |
| R | 拿起狀態 | 旋轉設備預覽 |
| Ctrl＋放置 | 拿起狀態（從畫布） | 複製放置，原設備保留 |
| Esc | 拿起狀態 | 取消，設備回原位或消失 |
| Delete | 已選取設備 | 刪除選取設備 / 管線 |
| Ctrl+Z | 任何時候 | 復原（無限制） |
| Ctrl+Y | 任何時候 | 取消復原 |
| Ctrl+C | 已框選 | 複製選取組，立即進入拿起狀態 |
| 空白鍵＋拖拉 | 任何時候 | 平移畫布 |
| 滾輪 | 任何時候 | 縮放畫布 |
| Shift＋點選 | 一般狀態 | 多選設備 |

---

## 6. 實作範例

### 6.1 Snap-to-Grid 擺放邏輯

```typescript
// 將滑鼠座標換算為格子座標
function screenToGrid(screenX: number, screenY: number, store: CanvasStore) {
  const gridX = Math.floor((screenX - store.offset.x) / store.gridSize)
  const gridY = Math.floor((screenY - store.offset.y) / store.gridSize)
  return { x: gridX, y: gridY }
}

// 檢查目標位置是否與現有設備重疊
function hasCollision(
  candidate: PlacedDevice,
  existing: PlacedDevice[],
  deviceDefs: DeviceMap
): boolean {
  const def = deviceDefs[candidate.deviceId]
  const candidateCells = getOccupiedCells(candidate, def)
  return existing
    .filter(d => d.uid !== candidate.uid)
    .some(d => {
      const cells = getOccupiedCells(d, deviceDefs[d.deviceId])
      return candidateCells.some(c =>
        cells.some(e => e.x === c.x && e.y === c.y)
      )
    })
}
```

### 6.2 朝向選擇模式（長按拖動）

```typescript
// 長按畫布後，依拖動方向決定設備朝向
function calcRotationFromDragDirection(
  longPressPos: { x: number, y: number },
  currentPos: { x: number, y: number }
): 0 | 90 | 180 | 270 {
  const dx = currentPos.x - longPressPos.x
  const dy = currentPos.y - longPressPos.y
  if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
    return heldDevice.rotation  // 拖動距離不足，保持當前朝向
  }
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? 0 : 180
  } else {
    return dy >= 0 ? 90 : 270
  }
}

// 長按計時與模式切換
let longPressTimer: ReturnType<typeof setTimeout> | null = null
const LONG_PRESS_MS = 300

const onPointerDown = (e: PointerEvent) => {
  longPressTimer = setTimeout(() => {
    enterDirectionSelectMode(e)  // 顯示菱形方向框
  }, LONG_PRESS_MS)
}

const onPointerUp = (e: PointerEvent) => {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
    placeDevice()  // 未達長按閾值 → 單擊放置
  } else {
    placeDeviceWithDirection()  // 長按鬆開 → 以選定朝向放置
  }
}
```

### 6.3 設備正對管線自動連接

```typescript
// 擺放設備後，檢查每個 port 是否正對現有管線端點
function autoConnect(
  placed: PlacedDevice,
  connections: Connection[],
  deviceDefs: DeviceMap
) {
  const ports = getAbsolutePorts(placed, deviceDefs[placed.deviceId])
  for (const port of ports) {
    const match = connections.find(conn =>
      isPortFacing(port, conn.dangling) // dangling：尚未連接的管線端點
    )
    if (match) {
      connectPortToLine(port, match)
    }
  }
}
```

---

## 7. 驗證方式

| 驗證項目 | 方法 |
|----------|------|
| 工具列單擊拿起設備 | 點選工具列設備，確認左側面板更新、游標顯示設備預覽 |
| 拿起狀態 Edge Scrolling | 拿起設備後移至畫布邊緣，確認視角自動捲動 |
| R 鍵旋轉預覽 | 拿起狀態下按 R，確認設備預覽旋轉，接口方向對應更新 |
| Esc 取消拿起 | 拿起後按 Esc，確認預覽消失，設備不被放置 |
| 單擊放置 snap 到正確格子 | 單擊畫布各位置放置，確認落點對應格線 |
| 長按朝向選擇 | 長按畫布後拖動至四個方向，確認菱形框顯示、鬆開後朝向正確 |
| 多格設備正確佔位 | 擺放 3×3 精煉爐，確認 9 格均被佔用 |
| 重疊時僅高亮不阻擋 | 強制重疊兩台設備，確認可放置但顯示紅色高亮與 Error |
| 工具列拿起連續放置 | 放置後確認自動繼續拿起下一個相同設備 |
| 從畫布長按拿起移動 | 長按已部署設備，確認進入拿起狀態可移動 |
| Ctrl 複製放置 | 從畫布長按拿起後按 Ctrl 放置，確認原位設備保留 |
| 左側面板三個 Tab | 確認配方表、設備形狀、耗電資訊各 Tab 內容正確 |
| 設備形狀 Tab 接口標示 | 確認接口位置與方向與 devices.ts 定義一致 |
| 工具列 Tab 分類切換 | 點選各分類 Tab，確認只顯示該分類設備 |
| 搜尋跨分類過濾 | 輸入關鍵字，確認跨 Tab 即時過濾設備 |
| 基地選擇影響畫布大小 | 選擇武陵 / 四號谷地，確認畫布邊界對應正確格子尺寸 |
| 武陵液體方位標示 | 選擇武陵後，確認畫布正確側邊顯示液體輸入方位標示 |
| 移動設備後管線維持連接 | 長按拿起已接管線的設備移動，確認管線仍連接 |
| 複製擺放 | 框選設備與管線後 Ctrl+C，確認立即進入拿起狀態，放置後正確擺放 |
| 複製包含管線 | 框選含管線的設備組，確認管線一併複製且 uid 為新值 |
| 複製復原 | 複製放置後 Ctrl+Z，確認整組（設備＋管線）同時消失 |
| 基地不可擺放中繼器 | 選擇武陵基地後，確認設備工具列中中繼器 Tab 不顯示 |
| TypeScript 型別保護 | 新增設備資料時，確認缺少必要欄位時 TypeScript 編譯報錯 |

---

*本文件為 CR-01 Feature Spec，系統整體架構見 `00_top_spec.md`。*
