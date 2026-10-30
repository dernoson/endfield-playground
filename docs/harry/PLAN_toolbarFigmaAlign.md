# PLAN：工具列對齊設計稿 Tools Selection＋機器圖（工單外）

**來源：** 使用者 2026-10-31 指示（不在 W1026 工單內）｜**設計稿：** Figma「禿忘救命啊」頁 `2041:14` 的 `Tools Selection`（`2302:176`），本機匯出 `docs/harry/figma_full.json`（不進版控）
**分支：** `dev/cake_toolbar`（自 `upstream/master` `d48ac99`，與 W1026-H1 的 `dev/cake` 分開）
**歸屬：** `ToolbarPanel.vue` 為 goodmorning #48 的檔案；goodmorning 本週暫停，WEEK_20261026 檔案鎖未列此檔

---

## 1. 使用者裁決（2026-10-31）

- 另開分支、獨立 PR
- 分類按鈕只改顯示文字（兩字短名），資料 `MACHINE_TAGS` 不動；設計稿的「功能」分類沒有對應資料，不加
- 機器圖轉 200×200 WebP；抓圖腳本也要能直接輸出 WebP
- 沒有圖的機型留空

## 2. 設計稿對照（容器 1920×208，左右 padding 80）

| 項目 | 設計稿 | 改前 | 改後 |
|------|--------|------|------|
| 容器上 padding | 22 | 23 | 22 |
| 分類列→卡片列 | 10 | 18 | 10 |
| 卡片間距 | 22 | 18 | 22 |
| 卡片底板／黃線 | top 13／91 | 14／92 | 13／91 |
| 分類按鈕圓角 | 預設 16、按下 15 | 15 | 16／15 |
| 分類文字 | 物流／倉儲／生產／合成／電力 | 資料原名 | 顯示對照 |
| 卡片圖片 | 100×100 機器圖 | 紅框占位 | WebP；無圖留空 |
| 視角按鈕 | 圓角 4、預設透明 | 圓角 8、`#4E4E4E` | 圓角 4、透明 |
| TAB 提示文字 | 14px | 12px | 14px |
| 收合三角形距面板 | 10px | 約 6px | 10px |
| 字型 | HarmonyOS Sans TC | Inter（`:root`） | 工具列根節點指定 HarmonyOS |

## 3. 機器圖

- `docs/harry/dev/icons/<buildingId>.png` 以遊戲 buildingId 命名，與專案 `Machine.id` 不同套。對照方式：`FactoryBuildingTable` 的 `name.id` 查 `I18nTextTable_CN`（兩邊轉 double 比對，因為落地的 int64 已失真），再以中文名人工對上專案機器
- **陷阱：** 專案 `grinder`（研磨機）＝遊戲 `thickener_1`；遊戲 `grinder_1` 是粉碎機（專案 `crusher`）
- 46 台中 35 台有圖；無圖 11 台：物品准入口、分流器、物流橋、匯流器、管道准入口、管道分流器、管道橋、管道匯流器、基礎材料輸出點、物品輸出口、物品輸入口
- 對照表放在腳本 `MACHINE_ICON_BUILDING_ID`；腳本輸出 `src/assets/machines/<Machine.id>.webp`，前端用 `import.meta.glob` 依檔名查，不必再帶對照表

## 4. 變更檔案

| 檔案 | 層 | 變更 |
|------|----|------|
| `docs/harry/scripts/fetch-factory-machine-craft-table.mjs` | 工具 | 新增 ffmpeg WebP 轉檔、前端用圖匯出、`--webp-only`（不連網）模式 |
| `docs/harry/dev/icons/*.webp` | 資料 | 92 張 200×200 WebP |
| `src/assets/machines/*.webp` | 資產 | 35 張前端用圖（共約 632KB） |
| `src/editor/toolbar/toolbarMachines.ts` | L2 | `TOOLBAR_CATEGORY_LABELS`、`getMachineIconUrl`、`ToolbarMachineRow.iconUrl` |
| `src/editor/toolbar/ToolbarPanel.vue` | L2 | 第 2 節各項 |
| `src/__tests__/editor/toolbarMachines.test.ts` | 測試 | 圖片查表、分類顯示文字 |

## 5. 明確排除

- 「功能」分類、改 `MACHINE_TAGS`（L1）
- `MachineCard` 的 `iconUrl`（可用同一個 `getMachineIconUrl`，但屬 W1011-H2 待跟進，另案）
- 捲動提示漸層、搜尋框等已與設計稿一致的部分
- 改 `:root` 全域字型（`style.css` 註解寫「全域字型 HarmonyOS」但實際 `:root` 是 Inter，先回報）

## 6. 驗證

- 四項全過（56 個測試檔、979 個測試）
- Edge 1920×1080 量測：分類列 y=22、卡片 y=75、卡片間距 22、底板 13／黃線 91、文字 (107, 41)，與設計稿一致；35／46 張卡片有圖；console 無錯誤
