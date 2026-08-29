# 0006_20260811_cr03-placement-validation

- **prev:** `./0003_20260811_top-spec-integration-simulator.md`
- **skill:** plan-history v3
- **status:** draft

## 主題簡述

CR-03 擺設位置衝突 —— 持續監聽畫布狀態，偵測設備擺放與管線佈線的空間合法性，以 Error 回饋。警示狀態同時決定 CR-04 流量估算的計算範圍（有 Error 的節點略過）。

規格出處 `spec/03_validation.md`（v0.4，Phase 1）。這份 spec 內含一段 2026-08-04 的重估紀錄，推翻了本文後半的部分規定，是本計畫最需要先處理的地方（見 O1）。

**本計畫的約束**

- `spec/` 是對外文件，統籌決斷寫在本計畫，不寫回 `spec/`。
- `待實作` 代表「規格已定、尚未逐項對照程式碼確認」；`overlapDetector.ts` 已存在（見 O2），動任一格前先核對現況。
- spec 內文與其重估紀錄有直接矛盾（O1），凡引用 spec 內文的格子都要先確認該段是否已被重估紀錄推翻。

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

## 待辦

### 1 統一重疊偵測器：多維空間索引

- **state:** 實作中
- **basis:** → O3

不分開實作 E001 與 E002，改以一個全局空間索引一次解決：遍歷所有設備（`getMachineOccupiedGrids`）與連線（`getPipelineOccupiedGrids`）取得佔用格子，撞到同一格即記為重疊。座標用原始值不做 `Math.floor`，回傳物件 id。

演算法本體已落地並有 13 個測試案例（O3）。與原正文的兩處差異已確認採用程式碼的版本：索引結構用稀疏 `Map` 而非多維陣列 `allgrid`（維度執行期才決定、大座標稀疏，理由在檔內註解），輸出是去重的 id 清單而非 `{id1, id2}` 配對。

剩下兩件事：一是輸出型別要不要改回配對，取決於 0006#3 的裁決（分類需要知道是「誰與誰」撞在一起）；二是它目前不符合 `Detector` 介面也沒被 `registerDetector()`，在接上之前整個 CR-03 對使用者不存在。

判準：`overlapDetector.test.ts` 的重疊判定案例全通過（已達成），且偵測結果實際進入 `validationStore.alerts`。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 重估紀錄第 1、2 節轉入 → O1（來源：spec 重估紀錄）
- H2 · 2026-08-11 落地 —— `detectOverlaps` 演算法與測試已在 tree，未接上 store → O3
- H3 · 2026-08-11 修正 —— 索引結構與輸出型別以程式碼實況為準，正文改寫 → O3（取代 H1 的 `allgrid` 描述）

### 2 高度層與立體碰撞判定

- **state:** 待實作
- **basis:** → O4

每個物件帶 `z`（物理層，0 = 地面、1 = 空中）與 `h`（貫穿旗標，1 表示同時佔滿 z=0 與 z=1）。佔用層 `occupiedLayers(obj) = h === 1 ? {0,1} : {z}`；兩物件佔同一格子時，佔用層交集非空才算衝突。

各類物件的 (z, h)：一般設備 (0,1)、傳送帶本體 (0,0)、水管本體 (1,0)、取出口 / 存入口 / 供貨源樁 (0,0)、傳送帶的分匯流器與物流橋 (0,0)、水管的分匯流器與中介橋 (0,1)。

要點：水管的分匯流器與物流橋雖屬水管系統，因 h=1 佔用 {0,1}，**不享有水管本體的重疊豁免**，判定同一般設備。

現況只有第三個座標軸，沒有層別語意（O4）：`shironesMachine` 無 `z` / `h` 欄位。落地路徑是型別加欄位 + 把 `h = 1` 展成兩層格點餵給既有的 `detectOverlaps`，偵測器本體不必改。

判準：spec 第 3 節「h=0 物件互不阻擋」「h=1 阻擋水管」「水管分匯流器歸為 h=1」三項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 2.2.1 節轉入（來源：spec）

### 3 Error 代碼分類的職責歸屬

- **state:** 待決斷
- **basis:** → O1、O3

偵測器只回傳重疊的物件 id，不判斷是 E001（設備重疊）還是 E002（佈線違法）；分類由上層依物件類型決定。但 spec 2.2 節的代碼表仍以兩種不同的觸發條件定義 E001 與 E002。

需要使用者裁決的是：對外仍呈現 E001 / E002 兩碼（分類邏輯放在驗證核心）、還是合併成單一「空間衝突」碼？前者要定義分類規則（兩個都是設備 → E001；含管線 → E002？），後者要同步改 CR-02 與 CR-09 spec 中引用這兩碼的地方。

裁決還會決定一件實作面的事：現有 `detectOverlaps` 回的是去重的 id 清單，分類若需要「誰與誰撞」就得改回配對輸出（O3）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 重估紀錄第 1 節與 2.2 節的矛盾轉入，維持未決 → O1（來源：spec）

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

機制已完整落地（O5）：`useValidation` 的 deep + immediate + 無 debounce watch、`MainLayout` 中先驗證再估算的呼叫順序，且有測試。剩下的不是機制而是內容 —— 註冊數為 0 時觸發了也沒有 detector 可跑，兩項驗證都測不了。本格要到 0006#1 接上 store 之後才能收。

判準：spec 第 3 節「E001 旋轉觸發重疊」「警示即時更新」兩項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/03_validation.md` 2.1 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 同步 watch 與呼叫順序已在 `useValidation` / `MainLayout` 成立且有測試 → O5

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
