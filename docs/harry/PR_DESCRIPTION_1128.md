# PR Description 草稿：正式畫布一般設備改掛 DeviceShape（W1123-H1）

以下內容可直接複製進 GitHub PR 描述欄。

---

## Summary

@toby 麻煩看對位（方塊對到格子、供電樁不被誤換）。

- 正式畫布 `GridCanvas` 的設備繪製區段，把逐格 `<rect>` 換成一個 `<DeviceShape>`（傳 `machineType`、`width`、`height`、`gridSize`，以及 `dragging`）
- 位置沿用原本 `device.position × cellSize`，以外層 `<g transform="translate(...)">` 套上；`DeviceShape` 本身從 (0,0) 開始畫
- 供電樁不另外分流：與一般設備走同一個 `v-for`，由 `DeviceShape` 內部轉給 `Electric`
- 拖曳中：`DeviceShape` 的 `dragging` 讓外框與箭頭降為 70% 不透明，另外疊一層半透明藍色遮罩（`fill-sky-400`、`fill-opacity` 0.25、`pointer-events-none`），放下後移除

## 變更檔案

| 檔案 | 變更 |
|------|------|
| `src/editor/layout/GridCanvas.vue` | 只動設備區段：模板的逐格 `<rect>` 與名稱 `<text>` 換成 `DeviceShape`＋拖曳遮罩；script 端把已無人使用的 `deviceCells`（逐格計算）換成 `deviceSizes`（每台寬高），並移除隨之不用的 `RenderedDeviceCell`、`getDeviceOccupiedCells`、`toDeviceFootprint` import |

未改：埠繪製／命中／高亮、拖曳邏輯與 `deviceDragPreview`、基地框、出界紅字、`WarningIcon`、`<title>`、管線、`DeviceShape.vue`、`Electric.vue`、`MainLayout.vue`、`LayoutView.vue`。

## 行為差異（刻意）

- **出界紅框拿掉：** 舊版出界時方塊邊線變紅；`DeviceShape` 沒有對應 prop 且本週凍結，故只保留上方「Error：超出基地」紅字與 `<title>` 提示
- **舊版名稱 `<text>` 拿掉：** `DeviceShape` 自己會畫機器名稱
- **拖曳外觀：** 由「整塊變淺藍」改為「70% 不透明＋半透明藍遮罩」

## 範圍外／已知問題

- **旋轉未處理：** `DeviceShape` 沒有 `rotation` prop，這裡一律傳機器原始寬高。旋轉 90°／270° 的非正方形設備，外形與實際佔格（埠的位置）會長寬顛倒；例如灌裝機轉 90° 後埠排成 4 寬 × 6 高，外形仍是 6 × 4。要修需 `DeviceShape` 支援旋轉，或由畫布依旋轉換寬高（但箭頭方向仍不對）
- **淺色模式看不到外框：** `DeviceShape` 的外框與箭頭寫死白色，在淺色主題的白底格線上幾乎看不見，只剩頭像圓框與埠；深色主題正常。屬 `DeviceShape` 配色，本週凍結，未改
- **遮罩是矩形：** 遮罩蓋整個寬高外接矩形；長條機器的倒角處、供電樁的圓形外框以外也會染到一點藍
- 查不到機器定義的設備：舊版不畫方塊但仍有名稱文字；現在外形與名稱都不畫（`<title>` 仍在）

## 驗證

- `pnpm type-check`／`pnpm lint-check`／`pnpm format-check`／`pnpm test`：全過（61 個測試檔、1060 個測試）
- 用 Edge 在 `pnpm dev` 實測（1600×900）：
  - 以 store 放置塑型機、精煉爐、供電樁、轉 90° 的灌裝機 → 每台各一個 `device-shape`，舊逐格 `<rect>` 為 0；供電樁顯示 `Electric` 圓形外框與供電範圍虛線
  - 深色主題：外框、頭像、名稱與畫布繪製的埠對齊
  - 按住塑型機拖曳 → 遮罩出現、`data-dragging="true"`；放開 → 遮罩消失、store 位置由 (20,6) 更新為 (23,8)
  - console 無錯誤

## 對應文件

| 文件 | 連結 |
|------|------|
| 工單 | [W1123-H1_device_shape_on_canvas.md](../work_dispatch/harry/1123/W1123-H1_device_shape_on_canvas.md) |
| 週總表 | [WEEK_20261123.md](../work_dispatch/WEEK_20261123.md) v1.1 |
| 上游 | #92（`DeviceShape`） |

🤖 Generated with [Claude Code](https://claude.com/claude-code)
