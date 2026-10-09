# W1004-T1 步驟 02：無邊界視窗與平移

狀態：未執行。前置：[步驟 01](./W1004-T1_step_01_scope.md) 完成。

## 目標與修改檔案

主要修改 `src/editor/layout/LayoutView.vue`、`src/editor/layout/GridCanvas.vue`；同步必要 Story 介面。讓畫布在容器內平移，點擊準確落在任意世界格點，不以 12×8 作世界大小。

## 執行順序

1. 在 LayoutView 建立 useGridViewport，以同一 cellSize 供畫面與換算使用。offset／zoom 只屬於視角，不呼叫 history。
2. 用 VueUse 的元素尺寸工具取得可用容器像素寬高；SVG 寬高填滿容器，以像素尺寸建立 viewBox。尺寸為零時不產生無效格線或點擊。
3. 移除世界尺寸對 SVG 與事件換算的限制。舊 gridWidth／gridHeight 若因呼叫端需要保留，只能作相容用途，不能重新成為邊界。
4. 設 `s = cellSize × zoom`；可見世界範圍由 `(-offset.x)/s` 至 `(viewportWidth-offset.x)/s`，y 同理。起點 floor、終點 ceil，可多畫一圈。格線數量依視窗大小決定，不隨基地尺寸或平移距離增加。
5. 格線、設備佔格、標籤與管線套用同一組 world→screen 轉換。可用共用 SVG transform；不可只移動背景而設備留在原位。
6. 點擊取得 SVG 本地像素：`clientX - bounds.left`、`clientY - bounds.top`。若 viewBox 與顯示尺寸不相等，先換成 viewBox 單位，再交 screenToCell。不要用 event.target 的 offsetX／offsetY。
7. screenToCell 的 Position 接回既有 cell-click／handleCellClick；維持 z=0、機器查詢、預檢、randomUUID、addDevice 及成功後連續落子意圖。
8. 平移用 pointer 位移呼叫 panBy；視角不 clamp 到基地或零座標。處理 pointercancel、拖曳出容器、capture 釋放；拖曳完成不再觸發一次落子。
9. 容器 resize 時重新計算視窗與可見線，保留目前視角。不要假設底部工具列永遠存在或固定高度。

## 驗收

| 案例                     | 預期                                     |
| ------------------------ | ---------------------------------------- |
| 原 12×8 外空格連續放兩台 | 設備寫入 layoutStore，正確佔格與名稱可見 |
| 平移到 x 或 y 為負數     | 可落子，不被視角或畫布邊界夾住           |
| 點設備 rect／text 子元素 | 仍依 SVG 本地座標換算，不漂移            |
| 中鍵或選定手勢拖曳後放開 | 只平移，不新增設備                       |
| 拖曳中移出容器或取消     | 不留下卡住的拖曳狀態                     |
| 改容器尺寸               | SVG 填滿，格線、管線、設備與點擊位置一致 |
| 大幅平移                 | 格線 DOM 數量仍約為可見行列數            |
| 設備重疊位置落子         | 保留既有拒絕與 history 行為              |

縮放非必要項。若在本步加入，必須驗證游標錨點不漂移、縮放後落子及線寬顯示，不能犧牲平移交付。

沿用 useGridViewport 現有數學測試；新增測試以真實回歸風險為主，例如負座標與拖曳後 click 抑制，不重複照抄公式。純函式測試不能替代瀏覽器事件驗收。

下一步：[步驟 03](./W1004-T1_step_03_base_data.md)。
