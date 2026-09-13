# V10-E1 — `/dev` 最小擺放演示頁（M1 演示備援）

**對應工項：** V10-E1  
**狀態：** `[x]` 完成（與 V10-I1 同批掛載）  
**依賴：** I1（埠旋轉正確後演示才有意義）  
**最後更新：** 2026-08-26  
**正式依據：** 8/26 決策 6；[ROADMAP_OUTLINE](../../../roadmap/ROADMAP_OUTLINE.md) §3 M1 門檻句；[I1](./I1_rotate_port_offset_fix.md)

---

## 1. 為什麼要這一頁

M1 門檻句含「**從下方拿一種設備放到格子上**」。主線擺放鏈屬 R-B2（9 月），本週在 L2 側只有 toby 的 W0823-T1（加分、可能未交、且已改指向 Inspector）。

若 8/30 現場沒有任何「拿一台放下去」的可操作畫面，即使資料全綠、清單齊備，門檻句的演示部分仍會卡住。因此在 `/dev` 補一頁最小演示，**把演示風險從別人的加分項移回自己手上**。

| 這頁是 | 這頁不是 |
|--------|----------|
| L1 除錯／演示工具 | 主線擺放功能（R-B2） |
| 證明「資料 × 幾何函式」正確 | 證明主畫布串通 |
| 8/30 的演示備援 | 11/29 驗收用途（D5 明確要求不開 `/dev`） |

---

## 2. 最小範圍

| 要有 | 說明 |
|------|------|
| 機器選擇區 | 讀 `getAllMachines()`／`getMachinesByTag()`；顯示中文名＋`width×height` |
| 格盤 | SVG 格點；尺寸固定即可（例 24×16 格） |
| 放下 | 選機後點格盤 → 該機以真實 `width×height` 佔格；重複可放多台 |
| 佔格顯示 | 以 `getOccupiedCells()` 的結果上色（**必須走同一支函式**，否則失去驗證意義） |
| 旋轉（建議） | 按鈕或右鍵切 `rotation 0→1→2→3`，佔格與埠隨之更新 |
| 埠標記（建議） | 沿用 `topologyPortUtils`／`MachineShape` 的 side／offset 落點 |
| 清除 | 一顆「清空」按鈕 |

**不要有：** 連線、Undo、存讀、對齊吸附、多選、拖曳體驗優化。

---

## 3. 實作方式（兩條路，擇一）

| 方案 | 作法 | 取捨 |
|------|------|------|
| **A（建議）** | 新頁 `PlacementDemo.vue`，內部重用 `DevTopologySvg`／`topologyPortUtils` 或 `MachineShape` 畫格與埠 | 改動最小、與 V9 拓樸同源；`DevTopologySvg` 吃 `FactoryNode[]`，本頁只需在 local state 組 node 陣列 |
| B | 從零寫 SVG 格盤 | 完全可控，但重複 V9-C2 已寫好的埠定位邏輯 |

採 A。`DevTopologySvg` 的 props 是 `nodes`／`edges`（`FactoryEdge[]` 傳空陣列），節點幾何由 `machineType` 解析——正好符合「放一台」的需求。

### 3.1 掛載點

| 檔案 | 動作 |
|------|------|
| 新建 `src/app/dev/PlacementDemo.vue` | 演示頁本體 |
| `src/router/index.ts` | `/dev` children 新增 `path: 'placement-demo'` |
| `src/app/dev/DevLayout.vue` | `devPages` 新增一列（icon＋description） |

沿用既有 `beforeEnter`（`import.meta.env.DEV`），正式環境不可達。

### 3.2 硬界線（性質鎖）

- **不** import `editorStore`／任何 Pinia store；狀態用元件內 `ref`
- **不**呼叫 `placeDevice` 等 action，**不**碰歷史
- **不**改 `FactoryCanvas.vue`／`FlowNodeOverlay.vue`／`MainLayout`
- 資料一律唯讀（`getAllMachines`／`getMachine`／`getOccupiedCells`）

這條界線讓本頁維持 L1 除錯工具屬性，不與「一週一塊」的性質鎖衝突（見 [A1](./A1_scope_decision.md) §2.4）。

---

## 4. 演示腳本（8/30 用，30 秒）

```text
1. 開 /dev/placement-demo
2. 左側點「粉碎機（3×3）」
3. 點格盤 → 出現 3×3 佔格，中央標示機器名
4. 按旋轉 → 非方形機（例 6×4 灌裝機）寬高對調，埠跟著換邊
5. 對照 machines.json 同一台的 width／height：一致
```

同一頁可順帶展示 `fault=render` 的存在（若主畫布同一台顯示不同）。

---

## 5. 非目標

- 取代 R-B2 主線擺放鏈
- 接 store／歷史／驗證
- 美術與互動細修
- 11/29 驗收用途

---

## 6. DoD

- [x] `/dev/placement-demo` 可達（DEV 環境），左側導覽可見
- [x] 可選機 → 放上格盤，佔格為真實 `width×height`（經 `DevTopologySvg`／`getOccupiedCells`）
- [x] 旋轉後顯示格對調；埠表列出 `rotatePort` 前後 side@offset
- [x] 未 import 任何 store；未改主畫布相關檔
- [x] 個人驗收完畢（2026-08-26）
- [~] 主編驗收待（dernoson）
- [x] §4 腳本可走完（選灌裝機／粉碎機 → 旋轉）

---

## 7. 開發日誌

### 2026-08-26

- 依決策 6 建立細項
- 與 I1 同批落地：`PlacementDemo.vue`＋router＋DevLayout；演示 pad-to-square 旋轉
- 個人驗收完；主編驗收待
