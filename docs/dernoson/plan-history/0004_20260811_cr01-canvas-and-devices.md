# 0004_20260811_cr01-canvas-and-devices

- **prev:** `./0003_20260811_top-spec-integration-simulator.md`
- **skill:** plan-history v3
- **status:** draft

## 主題簡述

CR-01 產線擺設編輯區 —— 模擬器的核心操作介面：精確格子制畫布上的設備擺放、旋轉、移動、複製、框選，以及物件資訊面板。畫布狀態是其餘所有 CR 的資料來源，本 CR 沒有上游依賴。

規格出處 `spec/01_canvas_and_devices.md`（v0.3，Phase 1）。本計畫是統籌側的追蹤紀錄，不重述規格。

**本計畫的約束**

- `spec/` 是對外文件，統籌決斷寫在本計畫，不寫回 `spec/`。
- `待實作` 代表「規格已定、尚未逐項對照程式碼確認」；`src/editor/canvas/` 下已有實作（見 O2），動任一格前先核對現況。
- 三層架構：畫布互動屬 L2，純視覺元件屬 L3，store 與型別屬 L1（見 `CLAUDE.md` 第 1 節）。
- spec 提及的 `tmp_01_impl_notes.md` 已不在 `spec/` 中（見 O1），實作細節需重新確認來源。

## 規劃描述

依 spec 的主要章節切格：畫布規格、基地選擇、物件資訊面板、擺放互動狀態機、移動、複製、多選批次、設備資料庫、UI 規格、快捷鍵，最後以 spec 第 5 節的驗證表格作為整體收斂判準。

擺放互動是本 CR 最大的一塊，spec 第 2.3 節本身就分成「拿起 / 拿起狀態互動 / 放下 / 連續擺放 / 視覺回饋 / 自動連接」六個子段，因此拆成數格而非一格 —— 一格塞不下且無法分別追蹤進度。

Phase 2 的朝向選擇模式與 Phase 3 的移動時管線自動重規劃各自獨立成格，以免混進 Phase 1 的收斂判準。

## 觀察與推論

### O1 · 2026-08-11 03:20:00+08:00 — spec 引用的實作筆記檔不存在

`spec/01_canvas_and_devices.md` 在 3.1、4.3 與第 3 節末尾三處引用 `tmp_01_impl_notes.md`（型別定義 `PortDef` / `RecipeDef` / `DeviceDef`、`devices.ts` 資料範例、Pinia store 狀態設計、snap-to-grid 與朝向選擇模式演算法）。`spec/` 目錄下只有 12 份 markdown 與 `assets/`，沒有這個檔案；`11_toolbar.md` 2.3 節也引用它談 `DeviceDef.allowInBase`。

所以 CR-01 與 CR-11 的型別與演算法細節目前沒有可指的文件出處。真實出處只可能在 `src/types/machine.ts` 等既有程式碼，或已被刪除。這使「規格 → 實作」的對照在型別層斷鏈，需要先補回或明確改指程式碼。

### O2 · 2026-08-11 03:25:00+08:00 — 畫布側既有實作盤點

`src/editor/canvas/FactoryCanvas.vue`、`FlowNodeOverlay.vue`、`PipelineEdge.vue` 已存在；`src/editor/inspector/InspectorPanel.vue`、`InspectorSidebar.vue` 對應物件資訊面板；`src/components/MachineShape.vue` 對應設備形狀；`src/store/canvasStore.ts`、`selectionStore.ts` 對應畫布與選取狀態；`src/data/machines.ts`、`src/types/machine.ts` 對應設備資料庫；`src/composables/useShortcuts.ts` 對應快捷鍵。`src/utils/geometryUtils.ts` 與 `src/utils/shirone/getMachineOccupiedGrids.ts` 提供佔格計算。

spec 寫的 `/data/devices.ts` 在 tree 中實為 `src/data/machines.ts`，命名已漂移。逐格核對時應以程式碼實際命名為準，並在本計畫記下對照關係，不要照 spec 的路徑去找檔案。

### O3 · 2026-08-11 04:12:00+08:00 — 擺放與移動路徑已落地，使用者看得到的那一半沒有

逐項核對 `src/editor/canvas/FactoryCanvas.vue`：放置走 `handlePaneClick`（:192）→ `placeNodeAtPointer`（:171）→ `editorStore.placeDevice`（自動進歷史）；snap 由 `canvasStore.gridSize` 與 `editorStore.snapToGrid` 在 `buildFactoryNode`（:141）算出。`R` 鍵（:105）分兩路：`placementArmed` 時遞增 `previewRotation`，否則對 `rotateTargetUid` 呼叫 `rotateDevice`。`Esc`（:124）只解除 armed。拖曳移動由 `node-drag-start` / `node-drag-stop` → `commitDeviceMove`（`editorStore.ts:361`）寫入歷史，零位移不進歷史；多選拖曳走同一對 handler。畫布縮放 / 平移由 Vue Flow 的 `zoom-on-scroll` 與 `pan-on-drag` 提供，格線由 `Background :gap="gridSize"` 畫出。

沒有找到的：跟隨游標的半透明預覽元素（`previewRotation` 只是個數字，畫面上不存在預覽節點）、Edge Scrolling、畫布長按拿起、放置後自動續拿、`Ctrl` 複製放置、綠 / 紅重疊回饋、`Q` / `E` 畫布旋轉、`G` 格線開關（`canvasStore.showGrid` / `toggleGrid` 有實作但無任何消費者）、基地框線繪製。節點以 Vue Flow 預設方框渲染（`FlowNodeOverlay.vue`，`min-w-25`），不依 `Machine.width` / `height` 佔格。

所以 spec 2.3 節六個子段中，只有「放下」與「`R` 旋轉」真的能跑；拿起狀態機缺的正是使用者唯一看得見的部分。

### O4 · 2026-08-11 04:12:30+08:00 — 物件資訊面板與快捷鍵表都還沒有落點

`src/editor/inspector/InspectorPanel.vue` 全部內容是工廠寬 / 高輸入框、snap-to-grid 勾選、一段「未來預留」清單與 `ProductionStats`，沒有任何讀取選取設備的程式碼，沒有 Tab，沒有配方表。`selectionStore.selectedNodeIds` 在 `src/` 內只有一個消費者：`useShortcuts.ts:47` 的 Delete 鍵。

快捷鍵實際綁定共六組，且分散兩處：`useShortcuts.ts` 有 Ctrl+Z / Ctrl+Y / Delete / Space（按住切 pan），`FactoryCanvas.vue` 有 `R` / `Esc`。沒有任何集中的鍵位表，也沒有情境維度。

spec 4.2 節的三 Tab 與 4.3 節的 16 組快捷鍵目前是零落地與六分之六不成表；`useShortcuts` 的檔頭註解自述「Copy / Paste 暫未實作」，與 tree 現況一致。

### O5 · 2026-08-11 04:13:00+08:00 — 專案裡有兩套互不相通的設備概念

`src/data/machines.ts` 的 `machineList` 有 100 台機器，`Machine` 介面（`types/machine.ts:110`）全欄位 readonly、埠定義收在 `modes[]`，型別保護成立。查詢入口 `getMachine(name)` 以**中文名**為 key（`machines.ts:1550`）。

但工具列與畫布走的是另一套：`types/editor.ts` 的 `EquipmentType` 是五個英文代號（`smelter` / `crusher` / `assembler` / `conveyor-node` / `power-node`），`ToolbarPanel.vue` 硬寫這五項，`FactoryCanvas.buildFactoryNode` 把該代號原封不動存進 `node.data.machineType`。而 FlowEngine 用 `getMachine(node.machineType)` 查表 —— 傳入 `'smelter'` 必然查不到。`equipmentLabelMap` 標的「組裝台」「輸送帶節點」「電力節點」三個名字在 `machineList` 中根本不存在（只有「精煉爐」「粉碎機」查得到中文名）。目前畫面上跑得動的節點全部來自 `editorStore.ts:10` 的 `mockNodes`，那批才用中文名。

另外 `MachineCategory`（`types/machine.ts:29`）是五個標籤（物流設備 / 倉庫存取 / 基礎生產 / 合成製造 / 電力），與 spec 的六分類（採集 / 加工 / 種植 / 電力 / 物流 / 儲存）不是同一套；`Machine` 沒有 `allowInBase` 欄位。

所以「從工具列擺一台設備到畫布」這條路目前放出來的是 FlowEngine 認不得的節點。0004#13 要收的不只是把 spec 的檔案路徑改指程式碼，而是這兩套概念要合成一套。

### O6 · 2026-08-17 09:51:21+08:00 — 基地選擇的 L2 / L3 缺口已補齊，但補的是一個繞過 Nuxt UI 的自繪元件

- **更新:** O3

本計畫寫於 `8838faf`；之後 `dev/paper`、`dev/toby`、`dev/cake` 三條合入 `dev/dernoson`（HEAD `c8c1cb3`）。`git diff 8838faf c8c1cb3 -- src/` 只動到六個檔案、+505 行，全部落在 CR-01 / CR-02 的互動層。

O3 記的「基地選擇沒有 UI、畫布也沒有畫框線」已經不成立：

- `components/BaseRegionSelector/Index.vue`（188 行，新檔）是純 props / emits 的 L3 下拉，三個選項武陵 / 四號谷地 / 自由畫布，自己處理外部點擊與 Esc 收合，零 store 依賴，符合 L3 邊界。
- `Navbar.vue:65` 接線：`:model-value="baseRegion"`、`@update:model-value` → `canvasStore.setBaseRegion()`，L2 只做事件路由，符合分層。
- `FactoryCanvas.vue:49` 的 `baseRegionBoundary` 把 `canvasSize.w/h × gridSize` 換成像素，:423 在 `EdgeLabelRenderer` 內畫出 `pointer-events-none` 的綠框，不阻擋擺放 —— 與 spec「允許在框線外擺放」一致。

三點要記下來：框線左上角固定對齊 flow 座標原點 `(0,0)`，沒有「基地在畫布何處」的概念；trigger 文字恆為「基地選擇」，選了哪個看不出來（0015#11 已認領）；以及這個元件是手寫 `<button>` + `<ul>` + scoped CSS，沒有用 `USelectMenu` / `UDropdownMenu`，跟 `CLAUDE.md` 第 4 節「優先使用 Nuxt UI v3 元件」相牴觸 —— 它是從 `dev/GoodMorning` 原樣接手的，屬 0003#10 要檢核的實例。

### O7 · 2026-08-17 09:52:00+08:00 — 埠 Handle 改為依機型動態產生，於是 O5 的兩套設備概念變成擋路的 bug

- **更新:** O5

`FlowNodeOverlay.vue:53` 的 `layoutHandles()` 把原本寫死的「左邊一個 target、右邊一個 source」換成依 `getMachine(data.machineType)` → `getMachineMode()` → `input_ports` / `output_ports` 動態產生的 Handle。查不到機型時 `machine` 為 `undefined`，`inputHandles` / `outputHandles` 都是空陣列，**該節點一顆 Handle 都不渲染**。

而 `getMachine()` 以中文 `name` 為 key（`machines.ts:1564` → `machineMap`），`EquipmentType` 五個值裡只有 `'crusher'` 剛好撞上某台機器的英文 `id`（`machines.ts:195`），而 `id` 走的是另一張 `machineByIdMap`、`getMachine` 根本不查它。所以工具列放出來的五種設備，`getMachine()` 全部回 `undefined`。

後果從「放得下去但不參與計算」升級為「放得下去、但畫面上沒有任何接口可以拉線」—— 使用者連不上它，`handleConnect` 也就永遠不會被觸發。O5 講的兩套概念不合一，現在是一個當場看得見的功能缺陷，不再只是計算層的隱患。畫面上拉得動線的節點仍然只有 `mockNodes` 那批（用中文名）。

### O8 · 2026-08-17 09:54:00+08:00 — 選取與快捷鍵各自往前一步，但快捷鍵那步是在沒有鍵位表的情況下加的

- **更新:** O3、O4

同一輪合併（見 O6 的 diff 範圍）另外動到選取與快捷鍵兩處：

- `selectionStore` 新增 `selectedEdgeIds` / `setEdgeSelection()` / `hasEdgeSelection`；`FactoryCanvas.handleSelectionChange` 現在同時寫入節點與管線選取；`useShortcuts` 的 `Delete` 除了 `removeDevices()` 之外，會對每個選取的管線逐條呼叫 `removeConnection()`。spec 的「框選設備與管線」因此成立。
- `useShortcuts.ts:42` 新增 `triggerResetCanvas()`，:113 用原生 `keydown` 綁 Ctrl+R / Cmd+R，`preventDefault()` 攔掉瀏覽器重新整理，跳 `window.confirm()` 後呼叫 `editorStore.resetCanvas()`。檔內註解自述這是暫時性鍵位，正式入口應為 L3 按鈕 + `UModal`。

第二項使 O4 記的「六組鍵散在兩個檔案」變成七組。值得記的不是數字，而是這一組鍵不在 spec 4.3 的 16 組裡、還攔截了瀏覽器原生行為，卻只需要往 `useShortcuts` 加一個 listener 就進來了 —— 0004#15 那份鍵位表要防的正是這個，而它還沒存在，所以防不到。移除與 Command Pattern 化分別由 0015#9、0015#10 認領。

### O9 · 2026-08-29 14:34:38+08:00 — 鍵位表落地了，但是扁平的，而且只蓋到 16 組裡的 12 組

- **更新:** O4、O8

`dev/dernoson` 合入後重掃。新增 `src/store/keybindingStore.ts`：`KEYBINDING_ACTIONS` 是一份
唯讀常數表，12 筆，每筆帶 `id` / `label` / `category` / `defaultCombo`；使用者覆寫以
`useLocalStorage('endfield-keybindings')` 持久化，`resolvedCombo(id)` 回答「這個動作現在綁在
哪個鍵」。`useShortcuts.ts` 全面改用 `onComboTriggered` / `useComboHeld` 讀該表，鍵字串不再
硬編；`FactoryCanvas.vue:160` 的 `rotateDevice` 也改走同一條路。改鍵介面為
`src/editor/settings/ShortcutSettingsPanel.vue` 與 `src/components/ShortcutRow/Index.vue`，
掛在 `App.vue`。

O4 與 O8 記的「鍵散在兩個檔案、沒有集中的表」因此不再成立：表存在，而且兩個消費檔都從它讀。

但 0004#15 要的**情境維度**沒有進表，表是扁平的 `id → combo`。三處情境分歧仍是硬編 if：
`FactoryCanvas.vue:160-170` 的 `rotateDevice` 依 `placementArmed` 分兩路；
`FactoryCanvas.vue:179-183` 用原生 `keydown` 固定綁 Escape 取消拿起，刻意不可配置；
`useShortcuts.ts:101` 用 `placementArmed || isSettingsPanelOpen` 前置判斷讓可配置的
`openSettings`（預設也是 Escape）不與前者互踩。三者互相知道彼此的存在，靠的是人工協調而非表。

涵蓋率是 12 組對 spec 4.3 的 16 組。表內沒有 Q / E 畫布旋轉、G 格線開關（見 O10），也沒有
放置、拿起、複製、縮放、多選、框選。「暫時性鍵位」只以 `label` 的中文字樣「（暫時性）」表示，
沒有結構化欄位 —— 也就是說表擋得住「鍵位散落」，但仍擋不住下一個 Ctrl+R 式的鍵被加進來。

另記一項與本格無關但屬同一批新碼的事實：`keybindingStore` 是 L1 store 且**零測試**。
`src/__tests__/store/` 下六支 store 各有一份測試，這支沒有；`useKeybinding.ts` 同樣沒有。
本日 `pnpm test` 為 28 檔 301 案例全過，與 0015 的 O5 在 2026-08-17 記下的數字一字不差 ——
也就是說這批新碼進來時測試數沒有動過。

### O10 · 2026-08-29 14:34:38+08:00 — 畫面平移多了 WASD 一路，Q / E 與 G 仍然沒有

- **更新:** O3

`FactoryCanvas.vue:189-214` 新增四個 `useComboHeld('panUp' / 'panDown' / 'panLeft' / 'panRight')`
訊號，任一按住時以 requestAnimationFrame 迴圈位移 Vue Flow viewport。平移因此有兩條路徑：
原本的 Space 切 `pan` 工具後拖拉，以及新的 WASD 連續位移。

O3 記的另外三項複查後**維持原狀**：`grep` 全 `src/` 找不到 `canvasRotation` / `rotateCanvas`
或任何 Q / E 綁定，`KEYBINDING_ACTIONS` 內也沒有這兩鍵；`canvasStore.showGrid` 與 `toggleGrid`
的消費者仍然只有 `canvasStore.ts` 自己（:38、:61、:80、:90），畫面上沒有格線開關；
`FlowNodeOverlay.vue:100` 仍是 `min-w-25` 的固定寬方框，不依 `Machine.width` / `height` 佔格。

所以 0004#1 判準的五項裡，縮放與平移成立，畫布旋轉、格線開關、多格佔格三項仍未成立。

## 待辦

### 1 畫布規格：格線、縮放、平移、畫布旋轉、格線開關

- **state:** 實作中
- **basis:** → O10

格子單位對應遊戲原生格線，1 格 = 1 cell，設備依遊戲佔格數擺放（精煉爐 3×3、配件機 3×3）。滾輪縮放需依游標位置為錨點；空白鍵＋拖拉平移；`Q` / `E` 以 90° 為單位逆 / 順時針旋轉畫布；`G` 開關格線顯示。

已落地：格線繪製、滾輪縮放、平移。平移現在有兩條路徑 —— Space 切 `pan` 工具後拖拉，以及
WASD 連續位移。未落地：`Q` / `E` 畫布旋轉、`G` 格線開關（`canvasStore.showGrid` 與 `toggleGrid`
仍然零消費者）、節點依 `Machine.width` / `height` 佔格（仍是固定寬方框）。

WASD 是 spec 4.3 之外新增的平移方式，鍵位已進 `KEYBINDING_ACTIONS`；`Q` / `E` / `G` 則表裡表外
都沒有，補做時鍵位要一併進表（見 0004#15）。

判準：spec 第 5 節「畫布縮放 / 平移 / 旋轉 / 格線顯示開關 / 多格設備正確佔位」五項驗證通過。
目前五項中縮放與平移兩項成立。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.1 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 格線 / 縮放 / 平移三項已在 `FactoryCanvas.vue` 可跑，旋轉 / 格線開關 / 佔格未動 → O3
- H3 · 2026-08-29 修正 —— WASD 平移落地，Q / E、G、多格佔格三項複查後維持未落地，正文改寫 → O10

### 2 基地選擇與可建造框線

- **state:** 實作中
- **needs:** 0003#3
- **basis:** → O6

使用者可選擇當前規劃的基地（武陵 / 四號谷地）。選擇後畫布疊加該基地實際格子尺寸的框線作為擺放參考；允許在框線外擺放，超出者由 CR-03 的 E003 標示但不阻擋。未選擇基地時畫布無框線。

三層都到齊了：L1 的 `canvasStore.baseRegion` / `canvasSize` / `setBaseRegion()`、L3 的 `BaseRegionSelector`、L2 的 `Navbar` 接線與 `FactoryCanvas` 框線 overlay（O6）。spec 那兩項判準的行為本身已經可以驗收。

剩下的都不在「畫得出框線」這件事上：尺寸仍是 `canvasStore.ts:8` 的硬寫值（武陵 256×256、四號谷地 192×192），來源不明，等 0003#3 清點；框線固定貼在 flow 原點，沒有「基地位在畫布何處」的概念；trigger 不顯示已選基地（0015#11）。`src/data/environments.ts` 已確認**不是**基地資料，它是環境標籤（穩定 / 酸性 / 濕潤 / 息壤），與基地尺寸無關。

判準：spec 第 5 節「基地選擇顯示框線」「框線外擺放不阻擋」兩項通過（行為已達成，等 0003#3 確認尺寸數值才算收）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.1 節基地選擇段轉入（來源：spec）
- H2 · 2026-08-11 落地 —— L1 的 `canvasStore.baseRegion` / `canvasSize` 已就位，UI 與框線未動 → O3
- H3 · 2026-08-11 修正 —— `environments.ts` 確認非基地資料，正文改寫 → O3
- H4 · 2026-08-17 落地 —— L3 選擇器與 L2 框線 overlay 補齊，剩下的都是尺寸來源與定位問題 → O6（取代 H2）

### 3 物件資訊面板的兩種觸發情境

- **state:** 待實作
- **basis:** → O4

情境 A（從工具列點選設備）顯示可使用配方一覽、設備名稱 / 大小 / 耗電量，並使滑鼠進入「準備擺放」狀態。情境 B（點選畫布中已部署設備）顯示同上資訊，額外顯示當前運行配方（流速）與當前錯誤警示。

兩情境共用同一個面板元件，差別只在有無「已部署」才有的兩塊資訊。面板的三個 Tab 版面另見本計畫第 14 格。

判準：spec 第 5 節「已部署設備顯示當前配方與警示」通過，且工具列側的觸發由 CR-11 驗證。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.2 節轉入（來源：spec）

### 4 拿起設備狀態機

- **state:** 實作中
- **basis:** → O3

進入「拿起設備」的兩個入口：工具列單擊（見 CR-11）、畫布上對單一或已框選的一組設備左鍵長按。拿起狀態下的互動固定為四項：滑鼠移動時預覽跟隨游標並 snap 至格線、移至畫布邊緣自動捲動視角（Edge Scrolling）、`R` 鍵旋轉設備預覽（接口方向須同步更新）、`Esc` 取消（從畫布拿起則回原位，從工具列拿起則消失）。

這是本 CR 最核心的狀態機，CR-11 與 CR-05 的一鍵導入都復用它，所以必須是單一實作而非各自複製。

目前只有狀態旗標與旋轉數值：`editorStore.placementArmed` / `armPlacement` / `disarmPlacement`、`FactoryCanvas.previewRotation`、`R` 與 `Esc` 兩個 watch。四項互動中「`R` 旋轉」有值但畫面上沒有預覽可看，其餘三項（跟隨游標的預覽、Edge Scrolling、從畫布長按拿起）完全沒有實作。

判準：spec 第 5 節「拿起狀態 Edge Scrolling」「R 鍵旋轉預覽」「Esc 取消拿起」「從畫布長按拿起移動」四項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.3 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— armed 旗標與 `R` / `Esc` 兩鍵已接上，預覽與 Edge Scrolling 未動 → O3

### 5 放下設備：左鍵單擊放置

- **state:** 實作中
- **basis:** → O3、O5

Phase 1 的放置方式只有一種：左鍵單擊，以當前預覽位置與朝向放下設備，落點須 snap 到正確格子。

單擊放置與 snap 已可跑（`FactoryCanvas.handlePaneClick` → `placeDevice`，snap 用 `canvasStore.gridSize`）。但放出來的節點 `data.machineType` 存的是 `EquipmentType` 英文代號，FlowEngine 的 `getMachine()` 查不到（O5）—— 放得下去，但放出來的東西不參與計算。這一項要跟 0004#13 一起收才算數。

判準：spec 第 5 節「單擊放置 snap 到正確格子」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.3 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 單擊放置與 snap 可跑，但放出的節點型別對不上設備庫 → O3、O5

### 6 朝向選擇模式（Phase 2）

- **state:** 待實作
- **basis:** → O2

Phase 2 新增的第二種放置方式：長按畫布觸發，在設備周圍顯示菱形方向選擇框；按住拖動滑鼠至四個方向之一決定朝向；鬆開滑鼠以選定朝向放下。

獨立成格是為了不讓 Phase 2 功能混進 Phase 1 的收斂判準。

判準：spec 第 5 節「長按朝向選擇」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.3 節 Phase 2 段轉入（來源：spec）

### 7 連續擺放與 Ctrl 複製放置

- **state:** 待實作
- **basis:** → O3

三種放置後行為，依拿起來源分歧：從工具列拿起放置後自動繼續拿起下一個相同設備，直到 `Esc` 結束；從畫布拿起放置後結束操作；從畫布拿起並按住 `Ctrl` 放置視為複製，原位設備保留。

現況與此相反：`handlePaneClick` 放置後一律 `disarmPlacement()`，三種分歧一個都沒有。

判準：spec 第 5 節「Ctrl 複製放置」通過，連續放置由 CR-11 驗證。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.3 節轉入（來源：spec）

### 8 擺放視覺回饋：綠 / 紅半透明預覽

- **state:** 待實作
- **basis:** → O3

可放置時綠色半透明預覽，與其他設備重疊時紅色半透明預覽。重疊不阻擋放置，放置後由 CR-03 產生 Error 警示。

判準：spec 第 5 節「重疊時僅高亮不阻擋」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.3 節轉入（來源：spec）

### 9 設備擺放後正對現有管線時自動連接

- **state:** 待實作
- **needs:** 0005#6
- **basis:** → O2

擺放設備後，若設備接口正對已存在的管線端點，自動建立連接，無需進入管線模式。僅在接口 type 與管線 type 相符時成立。

實作歸屬在 CR-02（見 0005#6），本格只負責畫布側的觸發時機（擺放 / 移動 / 旋轉三種編輯行為之後）。

判準：spec 第 5 節「設備正對管線自動連接」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.3 節轉入（來源：spec）

### 10 設備移動與已連接管線的維持

- **state:** 實作中
- **basis:** → O3

對單一或已框選的一組設備左鍵長按進入拿起狀態後移動。移動時已連接的管線維持連接關係，但 Phase 1 不自動重新規劃路徑。放下後若產生衝突（設備重疊、管線違法）顯示對應 Error，不阻擋放置。

已落地的是「直接拖曳」而非 spec 的「長按進入拿起狀態後移動」：Vue Flow 的 `nodes-draggable` 加上 `commitDeviceMove` 寫歷史，單選與框選多選共用同一對 handler。邊以 source / target uid 連接，移動後自然維持連接（`commitDeviceMove` 的註解自述端點跟隨留待 CR-02）。放下後的衝突警示還沒有（依賴 0006#5 / 0006#6）。

Phase 3 升級為移動時自動重新規劃已連接管線的路徑，屬 CR-02 的自動路徑規劃範疇，不在本格。

判準：spec 第 5 節「移動設備後管線維持連接」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.4 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 拖曳移動與歷史已可跑，互動形式與 spec 的長按拿起不同 → O3

### 11 框選後整組複製

- **state:** 實作中
- **needs:** 0011#4
- **basis:** → O3

框選設備與管線後按 `Ctrl+C`，滑鼠立即進入拿起狀態並拖曳整組半透明複製預覽，以單擊（或 Phase 2 的長按選朝向）放置。放置時為所有複製物件產生新 uid；框選範圍外的管線端點不複製。

L1 的 `editorStore.pasteSelection(nodes, edges, offset)` 已實作並自帶歷史，新 uid 與「兩端都在選取內的邊才複製」都在裡面。缺的是 L2：`src/` 內沒有任何呼叫者，`Ctrl+C` / `Ctrl+V` 沒有綁定（`useShortcuts` 檔頭自述 Copy / Paste 未實作），也沒有複製預覽。

整個複製貼上是單一複合操作，一次 `Ctrl+Z` 整組復原；`pasteSelection` 目前是以單一 Command 達成，尚未經過 0011#4 的 Macro Command。

判準：spec 第 5 節「複製擺放」「複製包含管線」「複製復原」三項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.5 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— L1 的 `pasteSelection` 已具備，L2 尚無呼叫者與鍵位 → O3

### 12 多選與批次操作

- **state:** 實作中
- **basis:** → O3、O8

`Shift`＋點選多選設備；拖拉空白區域框選範圍內所有設備與管線；多選後拖拉為批次移動；多選後按 `Delete` 為批次刪除。

已落地：框選（`selection-on-drag`，但只在 `activeTool === 'box-select'` 時開啟）、`selection-change` 同時寫入節點與**管線**選取（`setSelection` / `setEdgeSelection`）、批次拖曳（`selection-drag-*` → `commitDeviceMove`）、`Delete` 批次刪除設備與管線（`useShortcuts` → `removeDevices` + 逐條 `removeConnection`）。管線那一半是後補的（O6 那一輪），對應 spec 的「框選設備與管線」。

缺的仍是進入框選模式的入口 —— Navbar 只提供「選取」與「移動畫布」兩個工具，`box-select` 沒有任何 UI 或鍵位可切換到，所以框選這條路使用者實際上摸不到；另 Vue Flow 單擊節點不發 `selection-change`，`Shift` 多選是否確實寫進 store 需實測。

判準：spec 第 5 節「Shift 多選」「框選設備與管線」「批次移動」「批次刪除」四項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 2.7 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 框選 / 批次移動 / 批次刪除已接上，`box-select` 模式無切換入口 → O3
- H3 · 2026-08-17 落地 —— 框選與 `Delete` 擴及管線，spec 的「框選設備與管線」達成 → O8

### 13 設備資料庫：來源、型別保護與分類

- **state:** 實作中
- **needs:** 0003#2
- **basis:** → O5、O7

完整照搬遊戲內所有設備與配方，以 TypeScript 維護（spec 寫 `/data/devices.ts`，tree 中實為 `src/data/machines.ts`），受型別系統保護並保留特殊設備的自訂邏輯彈性。

資料側已成熟：100 台機器、`Machine` 介面全 readonly、埠與損耗收在 `modes[]`、行為函式（`onTick` / `onInput` / `onOutput` / `calcEfficiency`）留了自訂邏輯的位置，且資料由 `docs/aaaaa/scripts/generate-src-data.mjs` 從 JSON 生成。型別定義的出處即 `src/types/machine.ts`，不再指向已不存在的 `tmp_01_impl_notes.md`（O1）。

還沒收的兩件事（都在 O5）：一是分類不一致 —— 程式碼的 `MachineCategory` 是五個標籤（物流設備 / 倉庫存取 / 基礎生產 / 合成製造 / 電力），spec 要的是六類（採集 / 加工 / 種植 / 電力 / 物流 / 儲存），要決定以哪一套為準；二是 `EquipmentType` 這套平行的五個英文代號還存在於工具列與畫布擺放路徑上，必須併回 `machineList`。維護責任歸屬見 0003#2。

第二件事的急迫度變了：埠 Handle 改為依機型動態產生之後，`getMachine()` 查不到就一顆 Handle 都不畫，工具列放出來的五種設備因此**完全沒有接口可以拉線**（O7）。原本是「放得下去但不參與計算」的隱患，現在是使用者當場撞得到的死路。這一格是 0005 整條連線流程與 0014 工具列的共同前提。

判準：spec 第 5 節「TypeScript 型別保護」通過（缺必要欄位時編譯報錯）、分類與遊戲一致，且畫布上的設備節點與 `machineList` 是同一套識別（可用「從工具列放一台設備後拉得出線」直接驗）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 第 3 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 資料與型別已在 `machines.ts` / `types/machine.ts` 就位 → O5
- H3 · 2026-08-11 修正 —— 發現 `EquipmentType` 與 `machineList` 兩套並存、分類數不一致，正文改寫 → O5
- H4 · 2026-08-17 修正 —— 兩套識別不合一的後果升級為「工具列設備沒有接口」，正文改寫並補驗收方式 → O7

### 14 物件資訊面板三 Tab 版面

- **state:** 待實作
- **basis:** → O4

配方表 Tab：所有可用配方，每個顯示輸入 / 輸出品項、速率、週期時間；已部署設備可在此切換當前配方並顯示當前運行流速。設備形狀 Tab：佔格示意圖，標示所有輸入 / 輸出接口的位置與 type（傳送帶 / 水管）。耗電與資訊 Tab：耗電量（kW）、設備大小、分類、額外說明。

警示的列出由 CR-03 / CR-09 / CR-10 各自負責內容，本格只負責面板承載它們的位置。

判準：spec 第 5 節「物件資訊面板三個 Tab」「設備形狀 Tab 接口標示」兩項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 4.2 節轉入（來源：spec）

### 15 快捷鍵彙整表落地

- **state:** 實作中
- **basis:** → O9

spec 4.3 節列出 16 組快捷鍵，涵蓋放置、拿起、旋轉、複製、刪除、undo / redo、平移、縮放、畫布旋轉、格線、多選、框選。需要一份唯一的鍵位表作為實作依據，避免各元件自行綁鍵導致衝突。

同一鍵在不同情境（一般狀態 / 拿起狀態）有不同行為，因此鍵位表必須帶情境維度而非扁平映射。

表已經存在：`src/store/keybindingStore.ts` 的 `KEYBINDING_ACTIONS` 是單一權威來源，
`useShortcuts.ts` 與 `FactoryCanvas.vue` 都從它讀鍵位，鍵字串不再硬編（O9）。本格原本要防的
「鍵位散落在多個檔案」已經解決，且附帶做出使用者可改鍵的持久化設定介面。

剩下三件事。一、表是扁平的 `id → combo`，情境維度沒進去 —— `rotateDevice` 的兩路分歧、
Escape 同時是「取消拿起」（不可配置）與「開設定」（可配置）的雙重身分，仍是三處互相知道彼此
存在的硬編 if。二、涵蓋 12 組，缺 spec 的放置、拿起、複製、縮放、畫布旋轉、格線、多選、框選
（畫布旋轉與格線見 0004#1）。三、「暫時性鍵位」只寫在 `label` 的中文字樣裡，沒有結構化欄位，
擋不住下一個 Ctrl+R 式的鍵。

判準：16 組全部可觸發且情境切換正確；與 CR-02（`P`、`Escape`）、CR-05（`Tab`）的鍵位無衝突；
表外沒有漏綁的鍵。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 4.3 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 六組鍵已綁但分散兩處且無鍵位表 → O4
- H3 · 2026-08-17 修正 —— 第七組（暫時性 Ctrl+R）在沒有表的情況下被加進來，正文改寫並要求表能標示暫時性鍵位 → O8
- H4 · 2026-08-29 落地 —— `KEYBINDING_ACTIONS` 進樹，`useShortcuts` 與 `FactoryCanvas` 都改讀它 → O9
- H5 · 2026-08-29 修正 —— 散落問題已解，正文改寫為剩情境維度、涵蓋率、暫時性標示三項 → O9

### 16 CR-01 驗證項目全數通過

- **state:** 待實作
- **basis:** → O3、O4、O5

`spec/01_canvas_and_devices.md` 第 5 節列出 27 項驗證。本格是 CR-01 的收斂判準：27 項全部實測通過（工具列相關的 5 項歸 CR-11，不計入本格）。

實測結果寫成本計畫的觀察，不逐項開新格。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/01_canvas_and_devices.md` 第 5 節轉入為收斂判準（來源：spec）
