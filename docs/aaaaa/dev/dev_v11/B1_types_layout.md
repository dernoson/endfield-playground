# V11-B1 — types/layout 與 Breaking 註記

**對應工項：** V11-B1  
**狀態：** `[ ]` 未開始  
**依賴：** A1  
**最後更新：** 2026-08-31  
**正式依據：** 評估文 §1／§4.7；A1 決策 3／4

---

## 1. 背景

佈局模型：設備與管線各自持有絕對格子座標；**連接狀態每次重算、不儲存**。  
既有 `types/footprint.ts` 已服務佔格純函式；領域模型（機器 id、mode、埠索引、管線媒質等）尚無正式 `types/layout`。

---

## 2. 技術決策

| 方案 | 作法 | 採用 |
|------|------|------|
| **A. layout 領域＋footprint 幾何** | PlacedDevice／Pipeline／Connection(derived)；轉成 DeviceFootprint／PipelineFootprint 再餵既有 utils | **是** |
| B. 合併廢除 footprint | 單一檔吃掉幾何 | 否（打散既有 4 支） |

### 2.1 建議型別草圖（初稿；驗證期可修）

```ts
/** 已放置設備（佈局領域） */
interface PlacedDevice {
  id: string
  machineType: string // Machine.id
  position: Position // {x,y,z}
  rotation: 0 | 1 | 2 | 3
  machineMode?: string
  // 其餘執行期欄位（recipe 等）本版可先 optional／註記
}

/** 管線（儲存形；不含 Connection） */
interface Pipeline {
  id: string
  media: 'belt' | 'pipe'
  waypoints: Position[] // 含端點格；z 由媒質層慣例
}

/**
 * 衍生連線（不進藍圖儲存）
 * 由 resolveConnections 產生
 */
interface Connection {
  id: string // 可穩定推導或 ephemeral；初稿自訂並在測試釘死
  pipelineId: string
  from: { deviceId: string; portType: 'input' | 'output'; portIndex: number } | null
  to: { deviceId: string; portType: 'input' | 'output'; portIndex: number } | null
}
```

轉換層（可同檔或 `layout/toFootprint.ts` 小函式）：

- `toDeviceFootprint(device, sizeFromMachine): DeviceFootprint`
- `toPipelineFootprint(pipeline, depth): PipelineFootprint`

**size／depth 來源：** 讀 `getMachine`／codegen；一般設備 d＝2、belt／pipe d＝1（評估文 §1／§3.2）。本版若資料尚缺 `d` 欄，以常數表／註記 stub，**不**改 `editorStore`。

### 2.2 Breaking 註記（PR／本檔必寫）

| 舊 | 新（目標模型） | 本版狀態 |
|----|----------------|----------|
| `editorStore.nodes`／`edges` | `devices`／`pipelines`；`connections` computed | **僅註記**；不動 store |
| `addConnection`／`removeConnection` | 廢除；改管線 path actions | 註記 |
| `removeDevices` 連帶刪邊 | 管線留在原地 | 註記 |
| 藍圖 JSON `nodes`／`edges` | `devices`／`pipelines` | 註記 |

---

## 3. 檔案計畫

| 動作 | 檔案 |
|------|------|
| 新建 | `src/types/layout.ts` |
| 可選 | `src/utils/layout/toFootprint.ts`（若轉換不想塞進 types） |
| 不改 | `src/types/footprint.ts`（保留） |
| 不改 | `src/store/editorStore.ts` |

---

## 4. 驗證標準

- [ ] `pnpm type-check` 通過
- [ ] Breaking 註記寫在本檔 §2.2 與 PR
- [ ] D1／E1 可 import 本型別開工

---

## 5. 開發日誌

### 2026-08-31

- 依決策 4 開細項；草圖先寫、驗證期修正
