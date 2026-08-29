# 0007_20260811_cr04-flow-simulation

- **prev:** `./0003_20260811_top-spec-integration-simulator.md`
- **skill:** plan-history v3
- **status:** draft

## 主題簡述

CR-04 流量模擬與產能估算 —— FlowEngine 是模擬器的核心計算模組。畫布狀態每次變動即以靜態流量分析算出整條產線的穩態產能，在畫布與產線總覽面板即時呈現。有 Error 的節點略過，不影響其餘節點的估算。

規格出處 `spec/04_flow_simulation.md`（v0.3）。Phase 1 為基礎估算，Phase 2 加上調度券兌換效率。

**本計畫的約束**

- `spec/` 是對外文件，統籌決斷寫在本計畫，不寫回 `spec/`。
- `待實作` 代表「規格已定、尚未逐項對照程式碼確認」；FlowEngine 與 StatsPanel 已存在（見 O1），動任一格前先核對現況。
- 流量單位與浮點精度尚未定案（0003#4），凡涉及數值表示的格子都受它牽動。

## 規劃描述

依 spec 主要章節切格：觸發時機、計算範圍、演算法主體、限流規則、分匯流節點、環路、畫布顯示、顏色編碼、總覽面板、調度券，最後以驗證表格收斂。

演算法主體（拓撲排序 + 正向傳播）與其三條分支規則（限流縮比、分匯流、環路）分開成格，因為三者各有獨立的驗證項且各自可能單獨出錯 —— 併成一格會讓「拓撲排序對了但限流沒縮」這種狀態無處可記。

## 觀察與推論

### O1 · 2026-08-11 03:25:00+08:00 — FlowEngine 側既有實作盤點

`src/composables/useFlowEngine.ts`、`src/store/flowStore.ts`、`src/types/flow.ts`、`src/types/graph.ts`、`src/utils/flowHelpers.ts`、`src/utils/reverseChain.ts` 對應計算核心；`src/components/StatsPanel/`（Index、ItemSummaryTable、PowerSummary、TicketEstimate、WarehouseEstimate）與 `src/editor/stats/ProductionStats.vue` 對應產線總覽面板；`src/app/dev/FlowEngineTest.vue` 與 `DevTopologySvg.vue` 是 L1 的 debug 頁。

`TicketEstimate.vue` 已存在，代表 Phase 2 的調度券兌換效率有雛形，早於 spec 的 Phase 排序；`WarehouseEstimate.vue` 在 CR-04 spec 中沒有對應章節，可能屬 CR-05 的倉庫直取。兩者都要在逐格核對時釐清歸屬，不要預設它們就是本 CR 的交付物。

### O2 · 2026-08-11 03:30:00+08:00 — 效率顏色編碼被三份 spec 共用

CR-04 2.4 節定義四級效率顏色（100% 綠 / 50–99% 黃 / 0–49% 橘 / 0% 灰）。`spec/05_recipe_flow.md` 3.1 節與 4.3 節明寫 Flow Chart 節點顏色「同 CR-04 的顏色編碼」，`spec/03_validation.md` 的 Error / Warning 邊框色則是另一套。

所以效率色與警示色是兩套並行的顏色語意，會同時落在同一個設備上（例如效率 75% 的黃 vs Warning 的黃）。規格沒有說明兩者疊加時如何呈現 —— 這是實作時一定會撞到、但 spec 沒回答的問題，留待實作階段觀察後再決定是否需要使用者裁決。

### O3 · 2026-08-11 04:30:00+08:00 — FlowEngine 計算面已全數落地，且比 spec 要求更細

`useFlowEngine.ts` 共 1445 行，spec 2.3 節要的每一段都能對到函式：`buildGraph`（:709）建有向圖、`topologicalSort`（:797，Kahn；排不完的節點即環路，設 `hasCycle` 並進 `invalidSubgraphUids`）、`propagateFlows`（:861）正向傳播含限流縮比、`detectCongestion`（:1187）堵塞反向傳播、`calcItemSummary`（:1294）品項統計、`runFlowEngine`（:1352）串接後寫入 `flowStore.applyResult`。合法鏈路過濾另有 `validateChains`（:443）以 sink 為起點反向 BFS。

超出 spec 的部分：依媒質的速率上限（`BELT_RATE_LIMIT` 30 / `PIPE_RATE_LIMIT` 60，`edgeRateLimit` :248）、埠 cardinality 檢查（`markPortCardinalityViolations` :382）、依實際輸入集合匹配配方（`matchRecipeByInputs` :95）、副產物匹配與 form↔媒質相容性。分流 / 匯流在 `propagateFlows` :904–980：分流器與管道分流器把輸入均分至所有輸出邊、匯流器與管道匯流器加總後套媒質上限。

觸發面：`useFlowEngine()` 以 `watch([nodes, edges, alerts], useDebounceFn(runFlowEngine, 150), { deep, immediate })` 啟動，`MainLayout.vue:24` 已呼叫。測試面：`src/__tests__/` 下 FlowEngine 相關 9 個檔案，整包 28 檔 301 例全通過（含 H6 環路、v8 限流、v8 埠 cardinality、v9 堵塞與副產物）。

所以 CR-04 是本專案完成度最高的一塊。沒落地的只有：spec 提到的「使用者設定的分流比例」（目前恆為均分）、以及 source / sink 兩個彙總數字的畫布顯示位置。

### O4 · 2026-08-11 04:30:30+08:00 — 總覽面板有兩份，其中一份恆為 0

畫布顯示：管線流量標籤在 `FactoryCanvas.vue:306` 的 `EdgeLabelRenderer`（堵塞時換橘底），節點效率百分比與四級顏色在 `FlowNodeOverlay.efficiencyColorClass`（:32，`>=1` 綠 / `>=0.5` 黃 / `>0` 橘 / 其餘灰），非合法鏈路顯示灰色虛線外框加「非法」字樣。缺 source 總輸出、sink 總收入兩個位置與管線 hover tooltip。

面板則有兩套並存：
- `src/editor/stats/ProductionStats.vue`（636 行）直接接 `flowStore`，電力統計、品項摘要表、總產出、原料使用率、機器台數上限、調度券兌換與倉庫填滿預估全部可跑，掛在 `InspectorPanel` 內。
- `src/components/StatsPanel/Index.vue` 把 `PowerSummary` / `ItemSummaryTable` / `TicketEstimate` / `WarehouseEstimate` 四個 L3 元件以寫死的 `0` 與 `[]` 掛出，掛在 `MainLayout` 的 `area-stats`。四個元件本身符合 L3 規範（純 props），但沒有任何 L2 餵資料，畫面上是一塊恆為 0 的面板。

所以 0007#9 / 0007#10 的內容其實已經由 `ProductionStats` 滿足，代價是同一個畫面上還有一塊永遠是 0 的統計區。這不是「哪份對」的選擇題而是重複交付：要嘛把 `StatsPanel` 接上 `flowStore`（合乎 L2 映射、L3 純展示的分層）讓 `ProductionStats` 退場，要嘛移除 `StatsPanel`。兩份並存時 CR-04 的面板驗證項無法判定通過與否。

另外，效率四級顏色是寫死在 `FlowNodeOverlay` 的 Tailwind class，而 `src/assets/styles/tokens.css` **不存在**（`src/` 下只有 `style.css`）。0007#8 要求的單一顏色來源目前沒有落點，CR-05 的 Flow Chart 要沿用也只能複製一份 class 判斷 —— 那正是 O2 提醒要避免的漂移。

## 待辦

### 1 FlowEngine 觸發時機與 debounce

- **state:** 完成
- **basis:** → O3

以下任一事件後自動重新計算：設備擺放 / 移動 / 刪除 / 旋轉、管線新增 / 刪除 / 修改、設備配方變更。高頻操作以 debounce 處理避免重複觸發。

與 CR-03 的同步驗證不同 —— 驗證同步、估算 debounce，兩條路徑不共用。

已落地：`useFlowEngine()` 的 deep watch 涵蓋 `nodes` / `edges` / `alerts` 三個來源，設備與管線的任何欄位變動（含旋轉、配方）都會觸發；`useDebounceFn(runFlowEngine, 150)` 提供 debounce；`MainLayout` 已在 `useValidation()` 之後呼叫，兩條路徑分開。

判準：spec 第 3 節「即時重算觸發」（< 200ms）、「管線變動觸發重算」、「配方變更觸發重算」三項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.1 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— watch + 150ms debounce 已在 `useFlowEngine` 並由 `MainLayout` 啟動 → O3

### 2 計算範圍：Error 節點略過與子圖獨立

- **state:** 實作中
- **needs:** 0006#1、0012#2
- **basis:** → O3

有 Error 等級警示的設備與管線略過計算（Error 來源為 CR-03 的空間衝突與 CR-09 的輸入 / 輸出缺失）。略過的節點在畫布上顯示為灰色、無流量標示。其餘連通的子圖各自獨立計算，一個子圖出問題不影響其他子圖。

引擎側完備：`runFlowEngine` 把 `validationStore.hasBlockingError` 當作 predicate 傳給 `buildGraph`，被判 blocking 的節點不進計算；`validateChains` 與 `_propagateInvalidDownstream` 讓非法節點的下游一併退出，畫布也已依 `invalidChainUids` 顯示灰色虛線。

但目前沒有任何 detector 被註冊（見 0006#1），`hasBlockingError()` 恆回 `false` —— 這條路徑實際上從未被走過，驗證項也測不了。本格卡在上游而非自身。

判準：spec 第 3 節「Error 節點略過」通過（重疊設備不顯示流量，其下游顯示灰色）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.2 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 引擎側的略過與下游傳播已完成，等上游產出 Error → O3

### 3 靜態流量分析：拓撲排序與正向傳播

- **state:** 實作中
- **needs:** 0003#4
- **basis:** → O3

假設穩態滿產，採有向圖拓撲排序後正向傳播：建立有向圖（節點為設備、邊為帶方向的管線）→ 拓撲排序 → 從 source 節點（礦機、種植機等無輸入接口的設備）開始依拓撲順序正向計算各邊流量。

`buildGraph` / `topologicalSort` / `propagateFlows` 三段都已落地並有測試（O3），實作以個 / 分鐘、JS `number` 表示。仍留在實作中的唯一理由是 0003#4：若基準單位改為個 / 秒、或判定浮點精度不足需改有理數，動到的是這一格的數值表示。

判準：spec 第 3 節「Source 到 Sink 正確傳播」通過（各節點流量與配方速率一致）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.3 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 建圖 / 拓撲排序 / 正向傳播已完成並有測試，單位以個 / 分鐘 + `number` 實作 → O3

### 4 限流縮比規則

- **state:** 完成
- **basis:** → O3

若輸入速率 < 配方需求速率，以輸入速率為上限等比縮放輸出，設備效率顯示為對應比例而非 100%。

已落地於 `propagateFlows`，並額外套用媒質速率上限（belt 30 / pipe 60）作為第二層限流；`flowEngine.v8.rateLimits.test.ts` 覆蓋。

判準：spec 第 3 節「限流縮比」通過（礦機供料不足時效率顯示對應比例）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.3 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 縮比與媒質上限已實作並有測試 → O3

### 5 分流器均分與匯流器加總

- **state:** 實作中
- **basis:** → O3

分流器：輸入流量平均分配至各輸出，或依使用者設定的分流比例。匯流器：各輸入流量加總後輸出。

均分與加總都已落地（`propagateFlows` :904–980，涵蓋分流器 / 管道分流器 / 匯流器 / 管道匯流器，匯流輸出另套媒質上限）。

未落地的是「使用者設定的分流比例」：目前恆為均分，`FactoryNodeData` 也沒有存比例的欄位，spec 沒定義設定入口。另外畫布上還放不出分流器（工具列只有五個 `EquipmentType`，見 0004#13），要驗證只能靠單元測試餵圖。

判準：spec 第 3 節「分流器均分」「匯流器加總」兩項通過；分流比例是否納入 Phase 1 待確認。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.3 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 均分與加總已實作，使用者自訂比例未動 → O3

### 6 環路偵測與略過

- **state:** 完成
- **basis:** → O3

拓撲排序時若偵測到環路，將該子圖標記為異常並略過計算，不影響其他子圖。

`topologicalSort` 以 Kahn 演算法排不完的節點即環路，設 `graph.hasCycle` 並將其加入 `invalidSubgraphUids`、`isValid = false`；`flowEngine.test.ts` 的 H6 兩個案例覆蓋「環路節點標為非法」與「環路子圖不計入品項統計」。

判準：spec 第 3 節「環路偵測」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.3 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— Kahn 排序的環路標記與略過已實作並有 H6 測試 → O3

### 7 畫布即時顯示流量數值

- **state:** 實作中
- **basis:** → O4

四個顯示位置：管線上顯示當前傳輸速率（個/min）並在懸停時顯示詳細 tooltip；設備上顯示當前運行效率（%）；產線起點（source）顯示總輸出速率；產線終點（sink，取貨口）顯示總收入速率。

已落地兩處：管線流量標籤（含堵塞換色）與節點效率百分比。未落地：管線 hover 的詳細 tooltip、source 總輸出、sink 總收入。後兩者的數值 `flowStore.sinkDeliveries` 已算好，缺的是畫布上的呈現位置。

判準：四個位置的數值與 FlowEngine 計算結果一致，且隨重算即時更新。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.4 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 管線流量與節點效率兩處已顯示，tooltip 與 source / sink 彙總未動 → O4

### 8 效率顏色編碼

- **state:** 實作中
- **basis:** → O4

四級：100% 綠、50–99% 黃、0–49% 橘、0%（完全無輸入）灰。顏色寫進 `src/assets/styles/tokens.css`，因為 CR-05 的 Flow Chart 節點明寫沿用同一套編碼（O2），必須單一來源。

四級分級已實作於 `FlowNodeOverlay.efficiencyColorClass`，但顏色是寫死的 Tailwind class，且 `tokens.css` 根本不存在（O4）。所以「分級」這一半成立、「單一來源」這一半沒有，CR-05 現在要沿用只能複製一份判斷。本格要收的是把四級顏色抽成單一定義。

與 CR-03 警示色疊加時的呈現規則 spec 未定義（O2），實作時若撞到需回報使用者。

判準：spec 第 3 節「效率顏色分級」通過（四種情境各自對應綠 / 黃 / 橘 / 灰），且顏色只有一份定義。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.4 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 四級分級已實作，但顏色寫死在元件內、`tokens.css` 不存在 → O4

### 9 產線總覽面板：整體統計與產出摘要表

- **state:** 實作中
- **needs:** 0013#3
- **basis:** → O4

整體統計區塊：總耗電量、總供電量、電力狀態（盈餘 / 不足，不足時對應 W005）、設備數量（含幾台有 Error）、管線數量。電力數值由 CR-10 計算後提供，本 CR 只負責呈現。

產出摘要表：依品項列出生產（/min）、消耗（/min）、淨產量（/min）、效率；淨產量為正顯示綠色（盈餘），為負顯示紅色（上游供料不足以滿足下游）。

`ProductionStats.vue` 已把兩塊都做出來（電力統計、盈餘 / 不足配色、設備與管線數、非法節點數、產出摘要表含淨產量正負配色）。三件未完：總供電量恆為 0（`runFlowEngine` 寫死 `totalPowerSupply: 0`，等 0013#4）、總耗電量未排除未供電設備（等 0013#3）、設備數量沒有「其中幾台有 Error」。

還有一件要先解掉的重複交付：`src/components/StatsPanel/` 那份恆為 0 的面板同時掛在畫面上（O4），兩份並存時本格的驗證項無法判定。

判準：spec 第 3 節「電力統計」「產出摘要表」兩項通過，且畫面上只有一份總覽面板。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.5 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— `ProductionStats` 已呈現兩塊，另有一份空殼 `StatsPanel` 並存 → O4

### 10 調度券兌換效率（Phase 2）

- **state:** 實作中
- **needs:** 0003#5
- **basis:** → O4

使用者在設定區自訂各品項的調度券兌換率（個/min → 券/hr），面板顯示總預估產出與逐品項的換算明細。

已落地：`flowStore` 的 `ticketRates` / `setTicketRate` / `ticketOutput` / `ticketTotal`（僅取 `net > 0` 的品項，且不被 `reset()` 清掉），`ProductionStats` 內有兌換率輸入與可展開的逐品項明細，改值即時反映。所以 Phase 2 的這一段實際上早於排序落地了。

未定的只剩多組具名預設（0003#5）。另注意 L3 的 `TicketEstimate.vue` 是另一份空殼（O4），與本格的實作無關。

判準：spec 第 3 節「調度券計算」通過（設定兌換率後預估券數即時更新）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 2.5 節 Phase 2 段轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 兌換率設定與明細已在 `flowStore` + `ProductionStats` 可跑 → O4

### 11 CR-04 驗證項目全數通過

- **state:** 待實作
- **basis:** → O3、O4

`spec/04_flow_simulation.md` 第 3 節列出 13 項驗證。本格是 CR-04 的收斂判準：Phase 1 的 12 項全數實測通過即滿足 Phase 1，調度券那一項隨 0007#10 一併收斂。

實測結果寫成本計畫的觀察，不逐項開新格。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/04_flow_simulation.md` 第 3 節轉入為收斂判準（來源：spec）
