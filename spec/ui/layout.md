# Factory Planner – 編輯器版面規格（Layout）

本文件從 `spec/plan_phase1.md` 延伸，**細化主視窗四區（上／左／中／右／下）的資訊架構、技術選型與與現有 codebase 的對接方式**。目標是讓後續實作可依此文迭代，而不必反覆口頭對齊。

---

## 1. 文件範圍與假設

| 項目 | 說明 |
|------|------|
| **涵蓋** | 編輯器 shell：導航列、左側功能列、中央 Vue Flow 畫布、右側檢視欄（Tab）、下方機器工具列 |
| **不含（Phase 1）** | 真實產線模擬計算、Import/Export 序列化邏輯（僅 UI／handler 預留） |
| **技術前提** | 與 Phase 1 一致：Vue 3、TypeScript、Vite、Pinia、Tailwind CSS、`@nuxt/ui`（作為元件庫，**非** Nuxt 應用）、`@vue-flow/core` 與相關套件、`@vueuse/core` |

---

## 2. 與現行 codebase 的對應關係

現有實作已具備「五區骨架」，本規格在此基礎上**調整職責與元件拆分**，而非另起爐灶。

| 區域 | 目前檔案／元件 | 規格中的定位 |
|------|----------------|--------------|
| 頂部 | `src/editor/navbar/Navbar.vue` | 以標題為視覺重心；工具列（選取／平移等）可維持或日後收斂 |
| 左側 | `src/editor/sidebar/ProjectSidebar.vue` | **專案／檔案層操作**：存檔、引入檔案等（與 Navbar 右側檔名展示分工見 §5） |
| 中央 | `src/editor/canvas/FactoryCanvas.vue` | Vue Flow 畫布；承接由下方拖入的機器 |
| 右側 | `src/editor/inspector/InspectorSidebar.vue` + `InspectorPanel.vue` | **檢視欄**：以 Tab 區分「產線統計」與「產線錯誤」；地圖／Snap 等設定可保留於同一面板或另 Tab（見 §6） |
| 下方 | `src/editor/toolbar/ToolbarPanel.vue` | **可部署機器庫**：分類 Tab、縮圖＋名稱、拖曳至畫布 |

版面結構入口：`src/app/layouts/MainLayout.vue`  
全域樣式與 grid／flex 區塊：`src/style.css`（`.editor-layout`、`.workspace-main` 等）

---

## 3. 目標版面（資訊架構）

```
┌──────────────────────── Navbar（標題為主）────────────────────────┐
│ [←] 應用標題 …                              [工具／檔名等選擇性區] │
├──────────┬────────────────────────────────────────────┬─────────────┤
│          │                                            │ 右側檢視欄   │
│ 左側     │              Vue Flow 畫布                  │ [Tab]       │
│ 功能列   │                                            │ 統計 | 錯誤  │
│          │                                            │             │
│ 存檔等   │                                            │             │
│          │                                            │             │
├──────────┴────────────────────────────────────────────┴─────────────┤
│ 下方工具列：[Tab 分類] 機器卡片（縮圖＋名稱），可拖曳至畫布          │
└────────────────────────────────────────────────────────────────────┘
```

**說明**

- 左側 `USidebar`（`collapsible="icon"`）已存在；規格要求將「存檔、引入檔案」等**優先放於左欄**，與 Phase 1 規劃中 Navbar 的檔案操作可作取捨：**建議** Navbar 保留「檔名／狀態提示」，左欄保留「一次性動作按鈕」（新建／匯入／匯出／存檔），避免重複時需在 UI 規格註明唯一入口。
- 右側為 **Tab 化檢視**，不再是「Inspector 底部順排 ProductionStats」的單一區塊；統計與錯誤分頁利於 Phase 2 接入不同資料來源。

---

## 4. 技術選型（Layout 層）

### 4.1 版面與元件（`@nuxt/ui`）

| 需求 | 建議元件／模式 |
|------|----------------|
| 右側／左側可收合側欄 | 沿用 `USidebar`（現狀） |
| 檢視欄 Tab | `UTabs`（或 `UTabs` + `UTabsList`／`UTabsTrigger` 等 v4 慣用寫法，依專案現有用法對齊） |
| 下方機器分類 Tab | 同上；窄螢幕時 Tab 可 `scrollable` 或改為下拉（後續 RWD 票） |
| 機器卡片（縮圖＋名稱） | `UCard` 或自訂 `button` 角色區塊 + `UAvatar`／`<img>`；需鍵盤可操作與 `aria-grabbed`／拖曳替代方案（見 §8） |
| 頂部標題列 | 沿用 `UHeader` |

### 4.2 拖曳至畫布（與 Vue Flow）

**現狀**：`ToolbarPanel.vue` 已對 `UButton` 設定 `draggable="true"`，並於 `dragstart` 寫入 MIME：

`application/x-endfield-equipment`（payload 為 `EquipmentType` 字串）。

`FactoryCanvas.vue` 於外層容器 `@dragover.prevent`、`@drop` 讀取該型別並呼叫 `placeNodeAtPointer`。

**規格約定（維持且不更名，除非全專案重構）**

- **DataTransfer type**：`application/x-endfield-equipment`
- **Payload**：單一機器識別（現為 `EquipmentType`）；若未來改為 UUID／資料庫 id，應擴充為 JSON 字串並保留向下相容解析。
- **放置後行為**：與現有 `disarmPlacement()` 一致；若未來需「連續放置模式」，由 `editorStore` 新增旗標，不在此 Layout 文件規範業務邏輯。

### 4.3 狀態管理（Pinia）

| Store | 與 Layout 相關的擴充方向 |
|-------|---------------------------|
| `editorStore` | 機器**分類**、**縮圖 URL／asset key**、Placement／選取機種（已部分存在） |
| **新建（建議）** `simulationViewStore` 或 `productionInsightStore` | 右側「統計」「錯誤」的 Tab 索引、`mock` 與日後 API 資料；避免塞爆 `editorStore` |
| `selectionStore` | 與右側「選取節點詳情」未來擴充相關；Phase 1 Layout 可不強依賴 |

命名可依實作調整，重點是**統計／錯誤資料與圖編輯 state 分離**，便於 Phase 2 接入序列化與模擬。

---

## 5. 區域規格

### 5.1 上方導航欄（Navbar）

**目標**：現階段以**標題為主**，維持辨識度與品牌／產品名稱即可。

**建議內容**

- **左**：左側欄開合按鈕（現有）；**主標題**（現有「終末地集成工業系統模擬器」可保留或縮短為產品名）。
- **右（選擇性）**：編輯工具（選取／平移／框選等）、**目前檔名或「未儲存」狀態**（現有 `fileName` ref，後續接 Pinia）。

**對接**：`Navbar.vue`；若將「新建／匯入／匯出」完全移至左欄，應從 Navbar 移除重複入口並在本文件「變更紀錄」註記。

---

### 5.2 左側功能列（Project Sidebar）

**目標**：集中**檔案與專案級動作**，並保留「等待更多發想」的擴充間。

**第一輪建議項目**

| 動作 | Phase 1 行為 | 後續 |
|------|----------------|------|
| 新建專案 | `onSelect` TODO | 清空／重置 stores + 預設圖 |
| 引入檔案（匯入） | TODO | 檔案選擇器 + Phase 2 反序列化 |
| 匯出／存檔 | TODO（可拆「匯出為檔」與「快速存檔」若產品需要） | 同上 |

**對接**：`ProjectSidebar.vue` 內 `projectMenuItems`；圖示沿用 Lucide（`i-lucide-*`）。

**UX 備註**：窄螢幕維持 rail／hover 展開現行行為；破壞性操作（新建／重置）日後應加確認對話框（`UModal`）。

---

### 5.3 中央畫布（Factory Canvas）

**目標**：維持 Vue Flow 為唯一編輯表面；**接受來自下方工具列的 drop**。

**對接**：`FactoryCanvas.vue`、`editorStore.nodes`／`edges`。

**與下方工具列的契約**：僅依賴 §4.2 的 DataTransfer 協議與 `EquipmentType`（或後繼型別），工具列不直接呼叫 Vue Flow API。

---

### 5.4 右側檢視欄（Tab）

**目標**：可切換 Tab，至少兩頁——

1. **產線統計**  
   - **輸入需求**（目標產物、需求速率或數量—Phase 1 可用表格占位）  
   - **輸出結果**（實際產出、瓶頸提示占位）  
   - **產量／產能相關指標**（可与現有 `ProductionStats.vue` 的機器數、連線數等合併或上下區塊拆分）

2. **產線錯誤回報**  
   - **堵塞**、**供量不足**、**傳送帶重疊** 等—Phase 1 以**結構化列表 mock**（類型、發生位置節點 id、說明、嚴重度）  
   - 日後由模擬引擎填入同一結構

**Inspector（地圖設定）放置策略（擇一實作並在 PR 說明）**

- **方案 A**：右側第一層 Tab：`地圖設定` | `產線統計` | `產線錯誤`  
- **方案 B**：保留「Inspector」為標題區塊，下含 `UTabs` 僅含統計／錯誤；地圖設定固定在 Tab 上方（現 `InspectorPanel.vue` 結構相近）

**對接檔案建議**

- `InspectorPanel.vue`：改為 Tab 容器  
- `ProductionStats.vue`：擴充或拆分為 `ProductionStatsTab.vue`（純展示 + props／store）  
- 新建 `ProductionIssuesTab.vue`（或 `LineDiagnosticsPanel.vue`）—錯誤列表  
- 型別：`src/types/production.ts`（新建）—`ProductionIssueType`、`ProductionIssue`、`ThroughputSnapshot` 等

---

### 5.5 下方工具列（可部署機器）

**目標**

- **Tab**：依**機器分類**切換（例：冶煉／加工／物流／電力—實際分類表由資料驅動）。  
- **每一機種**：顯示**縮圖**與**名稱**；支援**拖曳**至畫布（沿用現有 drag／drop）。  
- **點擊**：維持現有「武裝放置」（armed placement）+ 點畫布放置流程。

**資料模型建議**

```ts
// 概念示意—實作時置於 src/types/editor.ts 或 machines/catalog.ts
interface MachineCategory {
  id: string;
  label: string;
}

interface MachineCatalogEntry {
  equipmentType: EquipmentType; // 或未來改為 string id
  label: string;
  categoryId: string;
  thumbnailUrl?: string; // 或 iconKey / spriteKey
}
```

**資產策略**

- Phase 1：`thumbnailUrl` 可為 `undefined`，以 **Lucide icon + 色塊** 占位；或 `public/machines/*.webp`。  
- 預留載入 lazy：`loading="lazy"`，避免工具列一次載入過多大圖。

**對接**：重構 `ToolbarPanel.vue`：頂層 `UTabs`，內容區為水平捲動的卡片網格；drag／click handler 抽至 `useMachinePalette()` composable 以降低元件肥大。

---

## 6. 檔案／目錄調整建議（實作 checklist）

以下為建議路徑，開發時可微調，但**宜維持單一入口 layout**。

```
src/editor/
├── navbar/Navbar.vue
├── sidebar/ProjectSidebar.vue
├── canvas/FactoryCanvas.vue
├── inspector/
│   ├── InspectorSidebar.vue
│   └── InspectorPanel.vue          ← Tab 容器 + 地圖設定區
├── stats/
│   └── ProductionStats.vue          ← 擴充或改為 Tab 內嵌
├── diagnostics/
│   └── ProductionIssuesPanel.vue    ← 新建：錯誤列表
├── toolbar/
│   └── ToolbarPanel.vue             ← 分類 Tab + 卡片 + 拖曳
└── palette/
    └── machineCatalog.ts            ← 新建：分類與機器條目（可純靜態）
```

---

## 7. 預期結果（驗收描述）

完成後，使用者應可感知：

1. **右側**：在統計／錯誤 Tab 間切換；內容即便為 mock，也必須呈現**清晰區塊標題**與**列表／指標占位**，而非空白頁。  
2. **下方**：依分類 Tab 瀏覽機器；每個項目有**名稱與視覺縮圖（或約定占位）**；拖曳至畫布可新增節點（與現行行為一致）。  
3. **上方**：一眼可讀**主標題**；輔助資訊不超過「檔名／工具」等次要層級。  
4. **左側**：可觸發存檔／引入等入口（Phase 1 可仍為 TODO，但選單項目與圖示就位）。

---

## 8. 無障礙與操作細節（建議列為 DoD）

- **鍵盤**：機器卡片需能以 Tab 聚焦；Enter 觸發等同點擊（armed）；拖曳無法使用時應仍有放置路徑（現有 pane click）。  
- **對比**：Tab、錯誤嚴重度文字符合現有暗色主題 (`panel`、`text-muted`)。  
- **效能**：下方機器列表量大時使用虛擬卷軸（後續優化票）；Phase 1 若項目少於約 50 個可略。

---

## 9. 與 Phase 2 的銜接

- **統計／錯誤**：Mock 資料應集中於單一 module／store，便於日後替換為「模擬結果」或「後端回傳」。  
- **Import/Export**：左欄與 Navbar 的檔案操作應共用同一組 composable（建議未來 `useProjectFile()`），避免重複邏輯。

---

## 10. 變更紀錄

| 日期 | 摘要 |
|------|------|
| （建立） | 初版：對齊 `plan_phase1.md` 與現有 `MainLayout`／拖曳協議，並細化右側 Tab、下方分類與縮圖需求 |

---

## 參考：現有拖曳協議實作位置

- 送出：`src/editor/toolbar/ToolbarPanel.vue`（`application/x-endfield-equipment`）  
- 接收：`src/editor/canvas/FactoryCanvas.vue`（`handleCanvasDrop`）

後續若新增第二種拖曳來源（例如從右側「範本」拖出），應擴充 MIME 或統一改為 `application/json` 並在此文件更新 §4.2。
