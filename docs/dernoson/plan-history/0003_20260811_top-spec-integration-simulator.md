# 0003_20260811_top-spec-integration-simulator

- **prev:** —
- **skill:** plan-history v3
- **status:** draft

## 主題簡述

《明日方舟：終末地》集成工業模擬器的總體規劃。`spec/00_top_spec.md` 是給其他工作人員看的規格文件；本計畫是統籌人這一側的對應紀錄，負責三件在 CR 之上的事：Phase 分期的收斂條件、跨功能設計原則的落地檢核、以及 top spec 第 6 節那六個至今無人拍板的待確認事項。

十一份 Feature Spec 各自轉寫為 0004–0014，`prev` 都指向本計畫。

**本計畫的約束**

- `spec/` 是對外文件，統籌決斷寫在本計畫，不寫回 `spec/`；要改 `spec/` 需使用者明確指示。
- 本批計畫由 spec 轉寫而來，`待實作` 一律代表「規格已定、尚未逐項對照程式碼確認」，不代表程式碼是空的（見 O2）。動任何一格之前先核對現況再改 `state`。
- 六個待確認事項是使用者的決斷，agent 不代為裁決。

## 規劃描述

轉寫原則：spec 的一個主要章節（或一個 CR）對應一格待辦，格子的正文寫「這一格要達到什麼狀態、判準是什麼」，而不是複製 spec 全文 —— spec 檔本身仍是唯一的規格出處，計畫只負責追蹤狀態與決斷。

每份 spec 的「驗證方式」表格收成該計畫的最後一格，作為該 CR 的收斂判準；spec 的「待確認 / 待補」內容轉成 `待決斷`。

分期骨架照 top spec 第 4 節：Phase 1 = CR-01 / 02 / 03 / 04 / 05（基礎）/ 08 / 10（計算）/ 11；Phase 2 = CR-06 / 09 / 10（警示）/ 04（調度券）/ 02（分匯流器）/ 05（並列與導入）；Phase 3 = CR-02（自動路徑）/ CR-07。

## 觀察與推論

### O1 · 2026-08-11 03:20:00+08:00 — spec/ 現況清點

`spec/` 下有 12 份 markdown（`00_top_spec.md` 至 `11_toolbar.md`，共 1707 行）與 `assets/` 兩張 mockup SVG。`00_top_spec.md` 版本 v0.3，各 Feature Spec 版本介於 v0.1（CR-11）至 v0.4（CR-02、CR-03）。

CR-11 的 v0.1 與其內文「細節待依 00_top_spec.md CR-11 的敘述持續補齊」一致：工具列是最晚從 CR-01 拆出來的一份，成熟度明顯低於其餘十份。轉寫時它的未定內容應保留為 `待決斷`，不要替它補規格。

### O2 · 2026-08-11 03:25:00+08:00 — src/ 已有大量對應實作

`src/` 下已存在 FactoryCanvas.vue、PipelineEdge.vue、FlowChart/（DeviceNode、FlowEdge、MaterialNote、ProductNode、WarehouseNode、PendingImportNode）、StatsPanel/（ItemSummaryTable、PowerSummary、TicketEstimate）、`lib/validation/detectors/overlapDetector.ts`、`lib/history/createMacroCommand.ts`、`store/`（canvas、editor、flow、history、selection、validation）、`utils/shirone/`（getMachineOccupiedGrids、getPipelineOccupiedGrids、rewritePipelineStructure）。

所以這批計畫不是從零開工，而是把既有實作對回規格。逐格的真實完成度沒有被逐項驗證過 —— 那正是 `0001_20260810_merge-verification-sweep.md` 在做的事。在該掃描給出結論之前，本批計畫的 `state` 只反映「規格側的狀態」，不宣稱程式碼側的狀態。

### O3 · 2026-08-11 05:10:00+08:00 — 逐格對照程式碼跑完一輪，形狀是「引擎成熟、互動層薄、驗證層斷線」

本批 11 份 CR 計畫已各自逐格對照 `src/` 一次，細節寫在各自的觀察（0004 的 O3–O5、0005 的 O3–O6、0006 的 O3–O5、0007 的 O3–O4、0008 的 O3–O4、0009 的 O3、0010 的 O3、0011 的 O3–O4、0012 的 O3、0013 的 O3、0014 的 O3）。判定尺度是「實作是否覆蓋該格正文所述行為」；各 CR 的 spec 驗證表實測仍留給各自的收斂格，所以本輪沒有任何格子因為「跑過驗證表」而被標為完成。

三個橫跨全批的結構性現象：

1. **計算層遠比互動層成熟。** FlowEngine（1445 行，9 個測試檔）已涵蓋建圖、拓撲排序、正向傳播、限流、分匯流、環路、堵塞、品項統計，且多處超出 spec；而 CR-02 整個「怎麼生出一條管線」是空的、CR-01 的拿起預覽是空的、CR-05 的視角切換不存在。目前畫面上跑得動的資料全來自 `editorStore` 的 `mockNodes`。
2. **驗證層是斷的。** `detectOverlaps` 有完整演算法與 13 個測試，但沒有 `Detector` 外殼、沒有 `registerDetector()` 呼叫點，`alerts` 在正式 UI 中零消費者。連鎖後果是 CR-03 / CR-09 / CR-10 三個 CR 對使用者都不存在，且 CR-04 的「略過 Error 節點」永遠沒有東西可略過。這一條是本批影響面最大的單點。
3. **同一件事有兩份實作的情況已經開始漂。** 效率四級顏色在佈局側門檻 0.5、流程側 0.75（0008 的 O4）；總覽面板有 `ProductionStats` 與空殼 `StatsPanel` 兩份（0007 的 O4）；設備概念有 `machineList` 與 `EquipmentType` 兩套（0004 的 O5）；媒質相容判定只活在 FlowEngine（0005 的 O5）。

所以下一步的優先順序不是「哪個 CR 進度落後」，而是先接上驗證層、再消掉三處重複實作 —— 這兩件都是別的格子在等的前置。

### O4 · 2026-08-17 09:56:00+08:00 — 合併後重掃：互動層薄了一點，驗證層一動也沒動，重複實作多欠了一筆

- **更新:** O3

本批 11 份 CR 計畫寫於 `8838faf`。之後 `dev/paper`、`dev/toby`、`dev/cake` 合入 `dev/dernoson`（HEAD `c8c1cb3`，合併過程記在 0015 的 O5–O14）。`git diff 8838faf c8c1cb3 -- src/` 只動到六個檔案、+505 行，全部落在 CR-01 / CR-02 的互動層：`BaseRegionSelector/Index.vue`（新）、`Navbar.vue`、`FactoryCanvas.vue`、`FlowNodeOverlay.vue`、`useShortcuts.ts`、`selectionStore.ts`。逐格影響寫在 0004 的 O6–O8、0005 的 O7–O8、0014 的 O4。本輪 `pnpm test` 28 檔 301 測試全綠。

對照 O3 的三個結構性現象：

1. **互動層薄了一點，但只有一小塊。** 基地選擇三層到齊、管線建得起來也刪得掉、管線可框選、埠 Handle 依機型定位。CR-02 從「整段空白」變成「有一條 Vue Flow 原生拉線的捷徑」，CR-01 的拿起預覽仍然是空的。
2. **驗證層一個字都沒改。** `src/` 內仍然零個 `registerDetector()` 呼叫，`validationStore.alerts` 恆為空，正式 UI 零消費者。這一條在 O3 已被判為本批影響面最大的單點，一輪合併過去仍是原樣，而且 0015 的 O14 記到 `dev/azure9572` 帶著五個 detector 卻同樣沒人註冊 —— 這個缺口現在有兩份未接線的實作在等它。
3. **重複實作多欠一筆，而且原本那筆的代價變高了。** `BaseRegionSelector` 是手寫 `<button>` + `<ul>` + scoped CSS，沒用 Nuxt UI（0004 的 O6），與 `CLAUDE.md` 第 4 節相牴觸。而 `machineList` / `EquipmentType` 兩套設備概念不合一，在埠 Handle 改為動態產生之後，直接造成「工具列放出來的設備沒有接口可拉線」（0004 的 O7）—— 從隱患變成擋路的缺陷。

所以 O3 定下的優先順序不但沒有失效，還更明確了：先接驗證層，再把 `EquipmentType` 併回 `machineList`。第二項現在是 CR-02 連線流程與 CR-11 工具列的共同前置。

## 待辦

### 1 設備圖示來源：自繪 SVG 或遊戲截圖

- **state:** 待決斷
- **basis:** → O1

設備圖示要自繪 SVG 還是直接用遊戲截圖。截圖有版權疑慮，自繪成本高且需要一致的視覺規範。決斷需同時回答：採哪一種、由誰產出、放在哪個目錄、命名規則。

未決之前工具列（CR-11）與物件資訊面板的設備形狀 Tab 只能用佔位圖示。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 6 節第 1 項轉入，維持未決（來源：spec）

### 2 設備資料庫的維護責任歸屬

- **state:** 待決斷
- **basis:** → O1

`data/machines.ts`（spec 寫作 `/data/devices.ts`）要照搬遊戲全部設備與配方，遊戲更新後需要有人手動同步。決斷需回答：指定人是誰、同步的觸發時機（版本更新即刻／固定週期）、以及資料正確性由誰複核。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 6 節第 2 項轉入，維持未決（來源：spec）

### 3 各協議核心區域的格子尺寸是否已清點完整

- **state:** 待決斷
- **basis:** → O1

CR-01 的基地選擇（武陵 / 四號谷地）要疊加該基地實際格子尺寸的框線，前提是這些尺寸已被完整清點。決斷需回答：現有清點到什麼程度、缺的部分由誰補、資料放在哪（`data/environments.ts` 已存在，需確認是否即為此用途）。

在此之前 CR-01 的基地框線只能以暫定尺寸實作。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 6 節第 3 項轉入，維持未決（來源：spec）

### 4 流量計算的基準單位與浮點精度

- **state:** 待決斷
- **basis:** → O1

CR-04 與 CR-07 都寫「個/分鐘」，但 top spec 第 6 節仍把基準單位列為待確認（個/秒 or 個/分鐘）。決斷需回答：對外顯示與內部計算各用哪個單位、是否統一、以及配比運算是否會踩到浮點精度（例如 1/3 條傳送帶的分流）而需要有理數或定點數表示。

這一格未決會直接影響 CR-04 的估算實作與 CR-07 的 LP 模型係數，優先度高於其餘待確認事項。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 6 節第 4 項轉入，維持未決（來源：spec）

### 5 調度券兌換率是否需要多組預設值

- **state:** 待決斷
- **basis:** → O1

兌換率由使用者自訂，但不同商店 / 不同時期的匯率不同。決斷需回答：是否要支援具名的多組預設、若要則預設值從哪來（內建資料或使用者自建）、以及切換預設時是否要重算並保留前次設定。

答「否」的話 CR-04 與 CR-07 只需一組全域設定，實作明顯簡單。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 6 節第 5 項轉入，維持未決（來源：spec）

### 6 LP 求解套件選型

- **state:** 待決斷
- **basis:** → O1

CR-07 需要純前端可執行的線性規劃求解器。spec 建議 `glpk.js`，但明列需確認授權與 bundle size 是否可接受。決斷需回答：採哪一套、授權是否相容本專案、加進 bundle 後的體積增量是否可接受、以及是否需要 lazy load 只在優化頁面載入。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 6 節第 6 項轉入，維持未決（來源：spec）

### 7 Phase 1 MVP 的收斂條件

- **state:** 待實作
- **needs:** 0004#16、0005#13、0006#9、0007#11、0008#12、0011#7、0013#8、0014#6
- **basis:** → O1

Phase 1 交付「可用的產線規劃器 + 流程視角初體驗」：能擺設備、拉管線、看到即時估算，並可切至流程視角。

收斂判準是 `needs` 列的八格（各 CR 的驗證項目全數通過）全部進入終結狀態。判準不含 CR-06、CR-07，也不含 CR-09 / CR-10 的 Warning 部分與 CR-02 的分匯流器自動生成 —— 那些屬 Phase 2 以後。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 4 節 Phase 1 轉入（來源：spec）

### 8 Phase 2 完整模擬體驗的收斂條件

- **state:** 待實作
- **needs:** 0009#8、0012#8
- **basis:** → O1

Phase 2 交付「警示系統、流程規劃與分享功能完整上線」：CR-09 流量 / 配方警示、CR-10 電力警示、CR-04 調度券兌換效率、CR-02 分流器 / 匯流器自動生成（含截斷模式）、CR-05 並列視角與一鍵導入、CR-06 藍圖匯出匯入與跨版本 migrate。

`needs` 只列 Phase 2 專屬的兩份計畫；其餘散在 Phase 1 各計畫中被標為 Phase 2 的格子，收斂時需逐一回查各計畫。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 4 節 Phase 2 轉入（來源：spec）

### 9 Phase 3 進階自動化的收斂條件

- **state:** 待實作
- **needs:** 0010#10
- **basis:** → O1

Phase 3 交付「自動佈線與產能優化」：CR-02 自動路徑規劃（彎折點自動運算、放置後可調整），以及 CR-07 多目標優化產能推導全套。

CR-07 spec 自述「實作細節可依 Phase 2 完成後的使用回饋進一步調整」，所以本格開工前應先確認 Phase 2 的回饋是否推翻了 CR-07 的既有設計。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 4 節 Phase 3 轉入（來源：spec）

### 10 跨功能設計原則的落地檢核

- **state:** 實作中
- **basis:** → O3、O4

top spec 第 5 節七條原則要能逐條指出落地位置，而不只是寫在文件上。合併後重掃的結果（變動處標「↓」）：

- **資料單一來源** —— 半成立。`editorStore` 是藍圖的唯一來源，但 `FlowChart/Index.vue` 自帶假資料、`components/StatsPanel/` 掛的是寫死的 0。
- **即時重算** —— 成立（`useFlowEngine` 的 watch + 150ms debounce），但其中「Error 節點略過」的分支從未被執行過，因為沒有 detector。
- **設備資料庫型別保護** —— ↓ 半成立且代價升高。`machines.ts` / `types/machine.ts` 成立，但工具列與畫布走的是另一套 `EquipmentType`，現在直接害得工具列放出來的設備沒有接口（O4）。
- **流量單位 30/min 為 1 條** —— 成立（`types/flow.ts` 的 `BELT_RATE_LIMIT`）。
- **操作歷史單一佇列** —— ↓ 仍成立但出現一個例外：`editorStore.resetCanvas()` 直接改 `nodes` / `edges` 不走 Command，Ctrl+R 打進去的重置無法 undo（0015#10 認領）。其餘九個 action 自帶歷史，L2 無違規呼叫。
- **`useLocalStorage` debounce 500ms 自動存檔** —— **無落點**，產線狀態完全沒有持久化。
- **匯出 HTML 自包含** —— 無落點（CR-06 未動工，屬 Phase 2，符合排期）。

另外新增一條本清單原本沒有、但屬同一類的檢核：`CLAUDE.md` 第 4 節「優先使用 Nuxt UI v3 元件」目前有一個違例，`BaseRegionSelector` 是手寫下拉（0004 的 O6）。

判準：每條原則都能指到具體檔案與測試；做不到的條目要嘛補上，要嘛從原則清單移除。目前需使用者決定的仍是自動存檔那一條：補實作，還是從原則清單移除。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/00_top_spec.md` 第 5 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 七條逐條檢核完成：三條成立、兩條半成立、兩條無落點 → O3
- H3 · 2026-08-17 修正 —— 合併後重掃，型別保護與單一佇列兩條的評語改寫，並記下 Nuxt UI 違例 → O4（取代 H2）

### 11 畫布渲染技術選型：Vue Flow

- **state:** 完成
- **basis:** → O2

畫布渲染採 Vue Flow。PoC 已驗證 snap-to-grid、多格設備佔位、Port 連線三項，並實作於 `src/editor/canvas/FactoryCanvas.vue`。

其餘技術選型（Vue 3 + Vite、Nuxt UI v3、Pinia、VueUse、Tailwind CSS v4、JSON 設備庫 + HTML 記錄檔）在 spec 撰寫時即已定案，本格一併涵蓋，不另開格。

**沿革**

- H1 · 2026-08-11 決斷 —— Vue Flow PoC 通過並採用（來源：`spec/00_top_spec.md` 第 2 節）
- H2 · 2026-08-11 落地 —— `FactoryCanvas.vue` 已存在於 tree → O2

### 12 spec/ 與 plan-history/ 的同步責任

- **state:** 實作中
- **basis:** → O3、O4

`spec/` 對外、`plan-history/` 對內，兩邊會漂移。需要一條明確規則：什麼情況下統籌決斷必須回寫 `spec/`（例如影響其他工作人員的介面約定），什麼情況下只留在計畫裡（例如排期與內部取捨），以及回寫由誰執行。

規則的第一半已寫進 `CLAUDE.md` 第 6 節（`spec/` 對外、統籌走 `plan-history/`、動 `spec/` 需使用者明確指示）。第二半還沒有：沒有定義「哪些決斷屬於對外介面因此必須回寫」，也沒有指定執行者。

逐格核對已經撈出五筆 spec 與程式碼實際不一致、且影響其他工作人員的內容，可作為規則的第一批測試案例：設備分類數（spec 六類 vs 程式碼五類）、接口型別命名（spec `conveyor` vs 程式碼 `PortMedia.belt`）、`tmp_01_impl_notes.md` 的斷鏈引用（CR-01 / CR-11 各兩處）、`spec/03_validation.md` 內部關於 E001 / E002 / E003 的自我矛盾，以及**建立管線的實際互動**（spec 02 寫的是管線模式 + 手動彎折點的繪製狀態機，程式碼走的是 Vue Flow 原生 Handle 拖拉一步成線，見 0005 的 O7）。

第五筆是這輪新增的，也是最典型的案例：它是別人寫的程式碼與對外規格分岔，不回寫 `spec/` 的話，下一個接手 CR-02 的人會照 spec 從零做一套繪製狀態機，而不知道已經有一條並存的路徑要處理。

判準：規則寫進 `CLAUDE.md` 第 6 節，且對本批 12 份計畫各檢查一次是否有已決斷但未回寫的內容。

**沿革**

- H1 · 2026-08-11 決斷 —— 使用者指定 spec/ 為對外文件、統籌走 plan-history/，已註記於 `CLAUDE.md` 第 6 節（使用者）
- H2 · 2026-08-11 落地 —— 規則第一半已入 `CLAUDE.md`；核對撈出四筆待決定是否回寫的不一致 → O3
- H3 · 2026-08-17 修正 —— 合併後多撈出第五筆（管線建立互動與 spec 分岔），正文改寫 → O4（取代 H2）
