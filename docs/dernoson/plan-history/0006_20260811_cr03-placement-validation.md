# 0006_20260811_cr03-placement-validation

- **prev:** `./0003_20260811_top-spec-integration-simulator.md`
- **skill:** plan-history v3
- **status:** draft

## 主題簡述

CR-03 擺設位置衝突 —— 持續監聽畫布狀態，偵測設備擺放與管線佈線的空間合法性，以 Error 回饋。警示狀態同時決定 CR-04 流量估算的計算範圍（有 Error 的節點略過）。

規格出處 `spec/03_validation.md`（v0.5，Phase 1）。

**本計畫的約束**

- `spec/03_validation.md` 的 §2.2.1 佔用層編碼與 §2.2.2 偵測實作由本計畫維護並回寫；其餘章節仍以 spec 為對外權威，本計畫不代寫。
- `待實作` 代表「規格已定、尚未逐項對照程式碼確認」；動任一格前先核對現況。
- 空間座標一律為格子座標，佔用層以 (z, d) 表示，`d = 佔用層數`。

## 規劃描述

依 spec 主要章節切格：偵測器演算法、高度層碰撞判定、Error 代碼分類職責、E003、觸發時機、畫布視覺、資訊面板、總覽面板警示列表，最後以驗證表格收斂。

E003（超出基地框線）獨立成一格且狀態是 `待決斷` 而非 `待實作` —— 因為重估紀錄明寫「不要管 E003」，但 spec 內文與 CR-01 的基地選擇都仍要求它。這是一個真實的規格矛盾，需要使用者裁決，不由 agent 自行選邊。

## 觀察與推論

### O1 · 2026-08-11 03:20:00+08:00 — spec 內含推翻自身後半內容的重估紀錄

`spec/03_validation.md` 開頭有一段標記 2026-08-04 的重估紀錄，共五條：(1) 偵測器只輸出「哪些物件發生重疊」，不自行判斷是 E001 還是 E002，分類交由處理端依物件類型決定；(2) 改用 `src/types/euclideanSpace.ts` 的 `Position`（`number[]`）陣列結構，以迴圈動態存取軸向；(3) 拿到的就是原始座標，不再 `Math.floor`；(4) 回傳 list of object id；(5) 不要管 E003。

第 (1) 條與第 (5) 條直接牴觸同一份文件 2.2 節的 Error 代碼表（該表把 E001 / E002 定義為兩種不同觸發條件，並列出 E003）。同一份 spec 同時說「要分 E001 / E002」與「偵測器不分類」，也同時列出 E003 與「不要管 E003」。這不是措辭差異，是兩個不相容的規格版本並存在一份文件裡；轉寫時不能兩邊都當真。

### O2 · 2026-08-11 03:25:00+08:00 — 偵測器側既有實作盤點

`src/lib/validation/detectors/overlapDetector.ts` 已存在（重估紀錄第 3 節說它是新建、取代原本空的 `deviceOverlap.ts`）；`src/utils/geometryUtils.ts`、`src/utils/shirone/getMachineOccupiedGrids.ts`、`getPipelineOccupiedGrids.ts` 提供佔格計算；`src/store/validationStore.ts`、`src/composables/useValidation.ts`、`src/types/validation.ts` 對應驗證狀態；`src/app/dev/ValidationTest.vue` 是 L1 的 debug 頁。

重估紀錄第 3 節預告的三個檔案（新建 overlapDetector、更新 geometryUtils、新建對應測試）在 tree 中都能對上，且 `deviceOverlap.ts` 已不存在。所以重估紀錄描述的方向已經在程式碼裡落地了一部分 —— 這使 O1 的矛盾更偏向「重估紀錄才是現行版本，spec 內文後半是舊版殘留」，但這仍是推論，需使用者確認而非逕自認定。

### O3 · 2026-08-11 04:25:00+08:00 — 重疊演算法已落地且有測試，但整條 CR-03 對使用者不存在

`overlapDetector.ts:17` 的 `detectOverlaps(machineList, pipelineList)`：以一張稀疏 `Map<string, string[]>`（key 為座標 `join(',')`）取代本計畫 0006#1 正文寫的多維陣列 `allgrid`，理由寫在檔內註解（維度在執行期才由第一個點決定，巢狀寫法無法靜態定型；大座標會撐出巨大稀疏陣列）。座標不做 `Math.floor`；維度不一致丟 `Dimension mismatch`；回傳 `string[]`（所有發生重疊的物件 id，去重）而非 `{id1, id2}` 配對。`overlapDetector.test.ts` 13 個案例全通過，含 1D / 4D 與維度錯誤。

但它不符合 `types/validation.ts` 的 `Detector` 介面，且 `src/` 內沒有任何 `registerDetector()` 呼叫點（`validationStore.ts:46` 有實作、零呼叫者；`0001#7` 已記過同一件事）。結果是 `validationStore.alerts` 恆為空、`errorCount` 恆為 0、`hasBlockingError()` 恆回 `false` —— FlowEngine 的「略過 Error 節點」因此永遠沒有東西可略過，畫布上也沒有任何警示樣式的消費者（`alerts` 在 `src/editor/` 與 `src/components/` 內零引用，只有 dev 頁 `ValidationTest.vue` 讀它）。

所以 CR-03 的狀態是：核心演算法比 spec 走得更遠（含多維與測試），但因為缺註冊與缺 UI 消費者，功能對使用者而言等於零。

### O4 · 2026-08-11 04:25:30+08:00 — 高度層只有第三個座標軸，沒有 z / h 語意

`getOccupiedCells`（`getMachineOccupiedGrids.ts`）以 `machine.position[2]` 與 `size[2]` 展開第三維格點，`shironesMachine`（`types/shironesinterface.ts`）只有 `id` / `position` / `rotation` / `size`。沒有層別欄位、沒有 `h` 貫穿旗標、沒有依物件類型指派 `(z, h)` 的對照表，也沒有水管本體的重疊豁免。

所以 0006#2 目前只是「第三個座標軸」而非規格要的層別語意。好消息是落地路徑短：把 `h = 1` 展開成 `{0, 1}` 兩層格點餵給 `detectOverlaps` 即可，偵測器本體不必改 —— 要動的是型別欄位與展開規則。

### O5 · 2026-08-11 04:26:00+08:00 — 觸發時機已完整落地，且與 CR-04 的 debounce 確實分開

`useValidation.ts:66` 的 watch 監聽 `editorStore.nodes` / `edges`，`deep: true`、`immediate: true`、**無 debounce**，檔頭註解明寫理由是驗證必須先於 FlowEngine 完成。`MainLayout.vue:21` 先 `useValidation()` 再 `useFlowEngine()`，順序與註解一致；`useFlowEngine` 則是 `useDebounceFn(runFlowEngine, 150)`。`useValidation.test.ts` 6 個案例覆蓋觸發與重跑。

所以「驗證同步、估算 debounce，兩條路徑不共用」這條設計已經成立，不是待辦。0006#5 剩下的不是機制而是內容：沒有 detector 就沒有東西可觸發。

### O6 · 2026-08-30 07:10:00+08:00 — 分支狀態決定合入方向只能是 merge

`dev/shirone0824` 領先 merge-base `780ebcf` 37 個 commit，`master` 領先 12 個。前者除了 shirone 的三個 detector commit，還含 aaaaa 的 V10 全套（`src/__tests__/data/machineGeometry.test.ts`、`src/app/dev/PlacementDemo.vue`、`portUtils` 的 pad-to-square `rotatePort` 修正）與 0825 派工文件，這些在 `master` 上都不存在。

因此 cherry-pick 那三個 commit 會丟掉本計畫要改的對象（`machineGeometry.test.ts`）與它依賴的 `rotatePort` 修正。`git merge-tree` 驗證兩邊可自動合併，唯一雙邊改動的 `W0823-D0` 改的是不同行。

### O7 · 2026-08-30 07:15:00+08:00 — 座標語意與佔用層編碼定案

- **更新:** O1

`Position` 由不定長的 `number[]` 改為具名三軸 `{ x, y, z }`，語意固定為格子座標；`Axis` 收窄為 `'x' | 'y'`（管線只在平面上走，所在層由媒質固定）。像素到格子的換算落在 `useValidation.buildContext()`，`ValidationContext` 對外保證格子座標。佔用層編碼採 `d`（佔用深度），`d = h + 1`，`occupiedLayers = { z … z+d-1 }`（來源：`docs/aaaaa/LAYOUT_REWRITE_DISPATCH_IMPACT_0825.md` §4 第 2 項主編裁決）。

O1 記的「spec 內含推翻自身後半內容的重估紀錄」在該區塊刪除後不再成立。O1 當時量到的是事實、推論也對，是樹動了，所以是更新而非更正或推翻。

`d` 恰好等於佔格描述的 `size.z`：把 (z, d) 展開成第三軸的格點之後，層別交集在幾何層不需要任何條件分支。這是採 `d` 而非 `h` 的實際好處。

### O8 · 2026-08-30 07:20:00+08:00 — 兩套同名 getOccupiedCells 的實際爆炸面很小

`src/utils/geometryUtils.ts` 與 `src/utils/shirone/getMachineOccupiedGrids.ts` 各有一個 `getOccupiedCells`，簽章、回傳型別與維度都不同。前者只有 `src/__tests__/data/machineGeometry.test.ts` 與檔內 `isDeviceWithinBaseRegion` 使用；`cellsOverlap` 與 `isDeviceWithinBaseRegion` 本身零使用。

所以把 `geometryUtils` 收斂成只管基地邊界、佔格改由 `src/utils/layout/deviceOccupancy.ts` 單一提供，實際要跟改的只有一個測試檔，且它的斷言（格數與四角）一字不必動。`geometryUtils` 另有一份私有複製的 `BASE_REGION_SIZES`，與 `canvasStore` 重複，一併收為單一來源。

### O9 · 2026-08-30 07:25:00+08:00 — E001 轉換層的頭尾缺口與端點外推的必要性

原 `E001_deviceOverlap` 只在 `conn.data.bendPoints` 非空時才建管線，且 `waypoints` 完全來自 `bendPoints` —— 無彎折點的直線連線因此完全不進偵測，有彎折點者兩端線段也不被檢查。

補頭尾時端點必須取在設備佔格「之外」相鄰的一格。若以埠所在的邊界格為端點，每條連線都會與它的來源與目標設備同格（一般設備佔用層 {0,1} 與傳送帶 {0} 交集非空），結果是每一條連線都報一筆。`editorStore` 的 16 條 `mockEdges` 全無 `data` 也無 handle，因此埠推算必須有回退路徑。

### O10 · 2026-08-30 07:30:00+08:00 — 下游文件的引用面遠大於本次改動範圍

`getOccupiedCells` 與 `cellsOverlap` 在 `docs/` 底下另有 22 份文件引用（`docs/aaaaa/dev/dev_v5/B1_geometry_utils.md` 18 處最多，其次為 `docs/shirone/README.md`、`docs/shirone/DETECTOR_CHECKLIST.md`、`docs/roadmap/detail/A2`／`B2`／`B3`）。本次只改 `spec/03_validation.md`、`D2`、`docs/dernoson/L1/shirone.md`、`W0823-S1` 與其技術註記共五份。

其餘文件在改動後會指向不存在的函式。這是刻意的範圍取捨，不是遺漏。

### O11 · 2026-08-30 07:35:00+08:00 — validation 路徑的 debug 輸出蓋掉實際結果

`validationStore.run()` 內有 6 處 `console.log` / `console.time`、`registerDetector` 有 2 處、`useValidation.runValidation()` 另有 2 處。dev 頁的人工驗收要靠看 alert 筆數與訊息，這些輸出會把 console 灌滿。對應 `0015#12`。


### O12 · 2026-08-30 07:55:00+08:00 — 補頭尾後 mock 藍圖產生 5 筆管線互撞的基線警示

在 `/dev/validation-test` 實測：頁面初始載入 `editorStore` 的 18 台 `mockNodes` 與 16 條 `mockEdges` 時，E001 產出 5 筆「管線與管線佔用相同格子」。按「清空所有設備」後歸零；接著 A（格子 10,10）0 筆、加 B（格子 11,11）1 筆「設備「精煉爐」與設備「精煉爐」佔用相同格子」、加 C（格子 50,50）維持 1 筆、再清空歸零。console 無任何錯誤。

那 5 筆的成因是 `mockEdges` 全無 `data` 也無 handle：兩端錨點走回退路徑（出口取右緣中點、入口取左緣中點外推一格），兩端不共線時 `absToRelPath` 展開成「先 x 後 y」的 L 形，而那不是畫面上實際渲染的路徑。多條連線的 L 形轉角落在同一格，就互相判為重疊。

功能上不算誤判 —— 藍圖本來就沒有定義那些連線走哪條路徑；但它意味著在管線路徑由 CR-02 真正決定之前，管線對管線的重疊判定沒有可信的輸入。設備對設備、設備對管線的判定不受影響。


### O13 · 2026-08-30 08:10:00+08:00 — mock 藍圖的「非法」是回退錨點的產物，不是資料本身

依「無彎折點且兩端 x 與 y 都不同」的定義實測，`mockEdges` 15 條裡有 9 條判為非法，而且是兩條鏈路的骨幹（`e-CuA-furnaceA`、`e-H2OA-furnaceA`、`e-furnaceA-sewageA`、`e-cB1-reactA`、`e-Acid-reactA`、`e-purifier-reactB`、`e-cB2-reactB`、`e-reactB-partsB`、`e-reactB-sewageB`）。沒有任何測試依賴這些邊，但主編輯器與 `FlowEngineTest.vue` 開啟時的預設藍圖就是它。

但這 9 條的端點是**回退錨點**（出口取右緣、入口取左緣）算出來的，因為 `mockEdges` 全無 `sourceHandle` / `targetHandle`。查真實埠幾何後發現回退方向與這些機器完全不符：

| 機器 | 入埠 | 出埠 |
|------|------|------|
| 物品輸出口 1x3 | — | right:1 belt |
| 物品輸入口 1x3 | **right:1** belt | — |
| 精煉爐／配件機／粉碎機 3x3 | top:0/1/2 | **bottom:0/1/2** |
| 反應池 5x5 | top:1/3、left:1/3 | right:1/3 pipe、bottom:1/3 belt |
| 提純機 5x5 | left:1/3 pipe | right:1/3 pipe |

也就是說，物品輸入口的入埠在右側而非左側，三種加工機的輸出在下緣而非右緣。依實際埠算出來的錨點與回退版本完全不同，哪幾條需要轉角點也會跟著不同。

還有一個連帶：多條邊自同一節點出發時，因為沒有 handle 而共用同一個埠索引 0，錨點完全相同，展開後必然在起點附近互相重疊。補 `bendPoints` 解不掉這一項。

因此「補 `bendPoints`」的前置是先給 `mockEdges` 補上 `sourceHandle` / `targetHandle`。而 handle 會被 `useFlowEngine.resolveEdgeMedia` 用來解析邊的傳輸媒質，`mockEdges` 現有註解也記明多輸出節點的邊順序會影響品項配對，所以補 handle 會動到 CR-04 的行為，不是純資料修正。


## 待辦

### 1 統一重疊偵測器：三軸格點索引

- **state:** 完成
- **basis:** → O7、O8、O9

設備與管線的空間重疊是同一個判定，共用一張稀疏格點表一次算完：兩者各自展開成佔格（`@/utils/layout/deviceOccupancy`、`pipelineGeometry`），打進 `Map<"x,y,z", id[]>`，同格即記為重疊配對。索引結構用字串 key 而非巢狀陣列，因為藍圖座標可為負值且分布稀疏。輸出是字典序去重後的 `[idA, idB]` 配對，代碼指派留給 detector。

座標固定三軸且語意為格子座標，換算在 `useValidation.buildContext()` 完成，幾何層不做 `Math.floor`。佔用層 (z, d) 已在佔格展開時化為第三軸的格點，層別交集因此不需要條件分支。

`E001_deviceOverlap` 是薄轉換層：把 `ValidationContext` 轉成佔格描述、把配對包成 Alert；並在 `src/app/dev/ValidationTest.vue` 顯式 `registerDetector` 掛上。

判準：`overlapDetection.test.ts` 的重疊判定案例全通過，且偵測結果實際進入 `validationStore.alerts`。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 重估紀錄第 1、2 節轉入 → O1（來源：spec 重估紀錄）
- H2 · 2026-08-11 落地 —— `detectOverlaps` 演算法與測試已在 tree，未接上 store → O3
- H3 · 2026-08-11 修正 —— 索引結構與輸出型別以程式碼實況為準，正文改寫 → O3（取代 H1 的 `allgrid` 描述）
- H4 · 2026-08-30 改題 —— 原題「統一重疊偵測器：多維空間索引」；維度固定為三軸後不再是多維 → O7
- H5 · 2026-08-30 決斷 —— 座標固定三軸格子座標、佔用層採 (z, d)（使用者裁決）→ O7
- H6 · 2026-08-30 落地 —— 幾何遷入 `src/utils/layout/`，E001 於 dev 頁註冊並實際產出 alert → O8、O9

### 2 高度層與立體碰撞判定

- **state:** 實作中
- **basis:** → O7、O9

每個物件帶 `z`（起始層，0 = 地面、1 = 空中）與 `d`（佔用深度，自 z 起向上佔滿的層數）。佔用層 `occupiedLayers(obj) = { z … z+d-1 }`；兩物件佔同一格子時，佔用層交集非空才算衝突。

各類物件的 (z, d)：一般設備 (0,2)、傳送帶本體 (0,1)、水管本體 (1,1)、取出口 / 存入口 / 供貨源樁 (0,1)、傳送帶的分匯流器與物流橋 (0,1)、水管的分匯流器與中介橋 (0,2)。

要點：水管的分匯流器與物流橋雖屬水管系統，因 d=2 佔用 {0,1}，**不享有水管本體的重疊豁免**，判定同一般設備。

`d` 即佔格描述的 `size.z`，展開成第三軸格點後偵測器本體不需要任何層別判斷（O7）。E001 轉換層目前以類別預設值指派：設備一律 (0,2)、管線依 `data.portType` 決定 z（belt 0、pipe 1）且 d=1。

欠的是資料面：`Machine` 型別尚無層別欄位，`machines.ts` 也沒有回填，因此傳送帶、取貨口、分匯流器等特例目前一律當一般設備處理。這一項屬 aaaaa 的資料域。

判準：spec 第 3 節「d=1 物件互不阻擋」「d=2 阻擋水管」「水管分匯流器歸為 d=2」三項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 2.2.1 節轉入（來源：spec）
- H2 · 2026-08-30 決斷 —— 佔用層編碼由 `h` 改為 `d`，`d = h + 1`（使用者裁決）→ O7
- H3 · 2026-08-30 落地 —— 佔用層以佔格 `size.z` 表達並在 E001 轉換層以類別預設值指派；資料面欄位待補 → O9（取代 H1 的 `h` 表述）

### 3 Error 代碼分類的職責歸屬

- **state:** 待決斷
- **basis:** → O1、O3

偵測器只回傳重疊的物件 id，不判斷是 E001（設備重疊）還是 E002（佈線違法）；分類由上層依物件類型決定。但 spec 2.2 節的代碼表仍以兩種不同的觸發條件定義 E001 與 E002。

需要使用者裁決的是：對外仍呈現 E001 / E002 兩碼（分類邏輯放在驗證核心）、還是合併成單一「空間衝突」碼？前者要定義分類規則（兩個都是設備 → E001；含管線 → E002？），後者要同步改 CR-02 與 CR-09 spec 中引用這兩碼的地方。

偵測側已合一：一個偵測器、一張格點表同時涵蓋設備與管線（2026-08-24 dernoson 與 shirone 合議），輸出已是 `[idA, idB]` 配對，分類需要的「誰與誰撞」資訊具備。待決的只剩對外呈現幾碼。

在裁決之前，`E001_deviceOverlap` 對所有空間衝突一律吐 `E001`。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 重估紀錄第 1 節與 2.2 節的矛盾轉入，維持未決 → O1（來源：spec）
- H2 · 2026-08-30 修正 —— 輸出已改為配對，本格不再牽動輸出型別；偵測側合一但呈現碼數維持未決 → O9

### 4 E003 超出基地框線：留還是砍

- **state:** 待決斷
- **needs:** 0003#3
- **basis:** → O1

重估紀錄第 5 條寫「不要管 E003」，但同一份 spec 的 2.2 節列出 E003（設備或管線佔用格子超出當前基地可建造框線），第 3 節有「E003 超出基地框線」驗證項，`spec/01_canvas_and_devices.md` 2.1 節也要求框線外擺放顯示 Error 警示。

需要使用者裁決：E003 是永久砍掉（則 CR-01 的基地框線只做視覺參考，不產警示，且該 CR 的驗證項要刪）、還是只是暫緩到基地尺寸清點完成（0003#3）之後？

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 重估紀錄第 5 條與 2.2 節的矛盾轉入，維持未決 → O1（來源：spec）

### 5 警示觸發時機與同步全局驗證

- **state:** 實作中
- **basis:** → O5

以下任一狀態變更後自動重新執行全局驗證：設備擺放、移動、刪除、旋轉；管線新增、刪除、修改。驗證採同步計算，結果即時更新至 store，不需使用者手動觸發。

與 CR-04 的 debounce 重算不同 —— 驗證是同步的，估算才 debounce。兩者的觸發時機不可共用同一條路徑。

機制已完整落地（O5）：`useValidation` 的 deep + immediate + 無 debounce watch、`MainLayout` 中先驗證再估算的呼叫順序，且有測試。`buildContext()` 另負責把像素座標換算為格子座標，`ValidationContext` 對外只保證格子座標。

E001 已在 `/dev/validation-test` 註冊，觸發與重跑因此可端到端實測。剩下的是把 spec 第 3 節那兩項在該頁逐條走過。

判準：spec 第 3 節「E001 旋轉觸發重疊」「警示即時更新」兩項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 2.1 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 同步 watch 與呼叫順序已在 `useValidation` / `MainLayout` 成立且有測試 → O5
- H3 · 2026-08-30 落地 —— `buildContext()` 承擔座標換算；E001 於 dev 頁註冊後觸發鏈端到端可驗 → O7、O9

### 6 畫布視覺警示與 Error 優先

- **state:** 待實作
- **basis:** → O3

設備層級：Error 紅色邊框＋角落警示圖示，Warning 黃色邊框＋角落警示圖示，同時有兩者時以 Error 樣式優先。管線層級：Error 紅色閃爍邊框，Warning 黃色邊框，懸停時 tooltip 顯示警示代碼與說明。

這套規格是全專案警示樣式的來源，CR-09 與 CR-10 都明寫「沿用 CR-03 定義」，所以必須是單一實作，不可各 CR 自行複製一份。

判準：spec 第 3 節「管線 tooltip 顯示警示」「Error 與 Warning 同時顯示優先權」兩項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 2.3 節轉入（來源：spec）

### 7 物件資訊面板列出衝突

- **state:** 待實作
- **basis:** → O3

點選有衝突的設備或管線時，物件資訊面板列出該物件當前所有衝突項目（代碼與說明），與畫布上的紅色高亮同步呈現。

判準：spec 第 3 節「物件資訊面板顯示衝突」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 2.4 節轉入（來源：spec）

### 8 產線總覽面板警示列表與點選導覽

- **state:** 待實作
- **basis:** → O3

總覽面板含獨立的警示列表區塊，依 Error → Warning 排序，每項顯示代碼、名稱與涉及的物件（例：`[E001] 設備重疊：精煉爐 #3 與配件機 #1`）。點選任一項目時畫布自動導覽（Pan + Zoom）至相應設備或管線，並閃爍高亮 1.5 秒。

導覽與高亮這套機制 CR-09、CR-10 同樣沿用，同 0006#6 的理由，必須單一實作。

判準：spec 第 3 節「點選警示導覽」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 2.5 節轉入（來源：spec）

### 9 CR-03 驗證項目全數通過

- **state:** 待實作
- **needs:** 0006#3、0006#4
- **basis:** → O1、O3

`spec/03_validation.md` 第 3 節列出 13 項驗證。本格是 CR-03 的收斂判準。

前置是 0006#3 與 0006#4 兩個規格矛盾先被裁決 —— 在「E001 / E002 是否還分兩碼」「E003 留不留」未定之前，13 項中至少 4 項（E001 × 2、E002、E003）不知道該測什麼。

實測結果寫成本計畫的觀察，不逐項開新格。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 第 3 節轉入為收斂判準（來源：spec）

### 10 非法管線的警示歸屬

- **state:** 待決斷
- **basis:** → O9、O13

一條沒有彎折點、且兩端錨點的 x 與 y 都不同的連線，缺一個轉角點，實際路徑並未被指定。幾何層以 `isAxisAlignedPath` 認出這種路徑，E001 的轉換層據此跳過不做重疊判定——對未定義的路徑做判定只會產生假陽性。

待決的是：**要不要讓使用者看見它。** 三個方向：

1. **不看見。** 視為「路徑未指定」而非違規；真正的修法是讓 CR-02 的建立端把渲染出的轉角寫進 `bendPoints`，資料層與渲染層就一致了。`FactoryEdgeData.bendPoints` 目前是選填，`PipelineEdge` 靠 Vue Flow 的 step／smoothstep 自己畫轉角，現行 spec 並沒有禁止斜向連線 —— 這個讀法與 spec 現況一致。
2. **新增一個 Error 代碼。** 在 `spec/03_validation.md` §2.2 代碼表加一列。要一併檢視 CR-02 §2.3 的「`bendPoints` 建立後不可編輯」，否則使用者無法修正一條被判為非法的連線。
3. **併進 E002。** 佈線違法本來就是管線路徑的問題域，但 §2.2 現行的 E002 定義是「路徑經過的格子與已佔用物件的佔用層有交集」，語意是碰撞而非路徑不成立，併進去要改定義。

這一格與 `0006#3`（E001／E002 對外分幾碼）綁在一起：在分類體系定案前新增代碼，會讓 11 月的註冊收斂多背一個變數。兩格宜一起裁。

**沿革**

- H1 · 2026-08-30 決斷 —— 使用者指示開格保留，實作面（述詞與轉換層過濾）先落地 → O9、O13

### 11 mock 藍圖的埠與路徑重建

- **state:** 待實作
- **basis:** → O13

`mockEdges` 15 條全無 `sourceHandle` / `targetHandle`，端點只能走回退錨點（出口取右緣、入口取左緣），而真實埠幾何與這個方向不符：物品輸入口的入埠在右側，精煉爐／配件機／粉碎機的輸出在下緣，反應池與提純機的 pipe 埠在左右、belt 埠在上下。多條邊自同一節點出發時也因共用埠索引 0 而錨點相同。

要做的是：先給 `mockEdges` 補上依實際埠指定的 handle，再依補齊後的錨點算出 `bendPoints`，讓路徑良構且不穿越其他設備。

兩件事要一併確認，因為它們不是純資料修正：`useFlowEngine.resolveEdgeMedia` 會用 `sourceHandle` 解析邊的媒質；`mockEdges` 現有註解記明多輸出節點的品項配對目前靠**邊的順序**，指定 handle 後是否改由 handle 決定、衝突時以誰為準，屬 CR-04 的裁決。

不急：E001 已對不良構的路徑跳過判定，dev 頁與主編輯器的預設藍圖不再產生警示。宜等 CR-02 的建立端能把渲染出的轉角寫進 `bendPoints` 時一併重建。

**沿革**

- H1 · 2026-08-30 決斷 —— 使用者選擇暫不動 mock 資料，開格記著（使用者）→ O13
