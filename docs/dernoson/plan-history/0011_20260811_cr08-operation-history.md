# 0011_20260811_cr08-operation-history

- **prev:** `./0003_20260811_top-spec-integration-simulator.md`
- **skill:** plan-history v3
- **status:** draft

## 主題簡述

CR-08 操作歷史 —— 以 Command Pattern 統一管理所有佈局狀態變更，提供無限制復原 / 取消復原。CR-01、CR-02、CR-05 的所有操作都經本模組提交，任何視角下的 Ctrl+Z / Ctrl+Y 作用於同一佇列。Session 結束後歷史清空，不持久化。

規格出處 `spec/08_history.md`（v0.3，Phase 1）。

**本計畫的約束**

- `spec/` 是對外文件，統籌決斷寫在本計畫，不寫回 `spec/`。
- `待實作` 代表「規格已定、尚未逐項對照程式碼確認」；`historyStore.ts` 與 `createMacroCommand.ts` 已存在（見 O1），動任一格前先核對現況。
- Command 由 L1 的 high-level store action 內部產生，L2 不得自行呼叫 `historyStore.execute()` 或 import `createMacroCommand`（`CLAUDE.md` 第 5 節）。L1 缺 action 時回報補上，不在 L2 組 mutation。

## 規劃描述

依 spec 主要章節切格：佇列與 undo / redo 語意、納入歷史的操作範圍、不納入的視圖操作、複合操作、跨視角共用、Session 清空，最後以驗證表格收斂。

「不納入歷史的操作」獨立成格而非附註在納入那一格之下 —— spec 第 3 節有五項驗證專門測「這些操作按 Ctrl+Z 時應該復原的是上一個資料操作，而不是它們自己」，是可獨立失敗的行為，需要獨立追蹤。

複合操作也獨立成格：它是 CR-01 複製貼上、CR-02 含自動節點的管線、CR-05 一鍵導入三處共同依賴的機制，是本 CR 對外的主要介面。

## 觀察與推論

### O1 · 2026-08-11 03:25:00+08:00 — 歷史模組既有實作盤點

`src/store/historyStore.ts`、`src/lib/history/index.ts`、`src/lib/history/createMacroCommand.ts`、`src/types/history.ts` 已存在；`src/app/dev/HistoryReplay.vue` 是 L1 的 debug 頁。

`createMacroCommand.ts` 單獨成檔，且 `CLAUDE.md` 第 5 節明文禁止 L2 import 它，代表複合操作的機制已經定型並已寫進開發守則 —— 這一塊比其他 CR 成熟。逐格核對時 0011#4 應是最接近終結狀態的一格。

### O2 · 2026-08-11 03:30:00+08:00 — 歷史範圍橫跨三個 CR，且各自的 Phase 不同

spec 2.2 節列出的納入範圍中：CR-02 的「自動生成的分流器 / 匯流器」標 Phase 2、「放置後調整彎折點」標 Phase 3；CR-05 的三項（新增 / 刪除流程配方節點、中間產物設定變更）在 CR-05 spec 中全屬 Phase 2。

所以本 CR 雖整份標 Phase 1，其驗證表中至少五項要等上游 CR 的 Phase 2 / Phase 3 才能測。Phase 1 的收斂判準只能涵蓋 CR-01 全部、CR-02 的 Phase 1 部分與視圖操作那五項，不能要求 26 項全過。

### O3 · 2026-08-11 04:40:00+08:00 — 歷史機制全部落地並有測試，缺的是使用它的人

`historyStore` 的 `execute` / `undo` / `redo` / `clear` 與 `canUndo` / `canRedo` / `undoDepth` / `redoDepth` 完整；`historyStore.test.ts` 19 個案例覆蓋執行後推堆疊、新操作清空 redo、多步後進先出 undo、undo→redo 往返、`clear()`。

`editorStore` 有九個自帶歷史的高階 action：`placeDevice` / `moveDevices` / `commitDeviceMove` / `rotateDevice` / `removeDevices` / `setRecipe` / `pasteSelection` / `addConnection` / `removeConnection`，全部在內部呼叫 `historyStore.execute`；`editorStore.test.ts` 31 例。全 `src/` 中 `historyStore.execute()` 的呼叫點只有 `editorStore` 內部，L2 沒有違規呼叫。`useShortcuts` 綁 Ctrl+Z / Ctrl+Y 並只用 `undo()` / `redo()`，符合 `CLAUDE.md` 第 5 節。

`createMacroCommand` 有實作與 6 個測試案例，但 `src/` 內零呼叫者 —— 它要服務的三個場景（複製貼上、含自動節點的管線、流程視角導入）目前都還沒有 L2 觸發點。

歷史不持久化：`src/` 內唯一的 `useLocalStorage` 在 dev 頁 `HistoryReplay.vue` 的勾選清單，與歷史佇列無關；`historyStore` 沒有任何持久化程式碼，重新整理即空。

### O4 · 2026-08-11 04:40:30+08:00 — 「不進歷史」目前是自動成立而非被實作出來

畫布縮放 / 平移（Vue Flow 內部 + `canvasStore`）、選取 / 框選（`selectionStore`）、面板展開收合（`MainLayout` 的兩個 `ref`）都不經過 `historyStore`，所以 spec 那五項驗證中的三項現在就成立。

但另外兩項測不了：視角切換還不存在（0008#1），Flow Chart 節點排版也還沒接上真實資料（0008#3）。所以 0011#3 不是「做完了」而是「一半的對象還沒出生」—— 等視角與 Flow Chart 落地時要回頭確認它們沒有偷偷推進歷史。

## 待辦

### 1 歷史佇列與 undo / redo 語意

- **state:** 完成
- **basis:** → O3

`Ctrl+Z` 復原上一步操作、還原 Pinia store 至操作前狀態；`Ctrl+Y` 取消復原、重新套用已復原的操作。無步驟數限制。執行新操作後 redo 佇列清空（標準行為）。

四項判準各有對應的單元測試案例（O3），鍵位由 `useShortcuts` 綁定且只呼叫 `undo()` / `redo()`。堆疊無長度上限。

判準：spec 第 3 節「基本復原」「基本取消復原」「多步復原」「新操作清空 redo」四項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/08_history.md` 2.1 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— `historyStore` 四項語意與 19 個測試案例已在 tree，鍵位已綁 → O3

### 2 納入歷史的操作範圍

- **state:** 實作中
- **basis:** → O3

CR-01：擺放、移動、旋轉、刪除設備、複製貼上、設備配方變更。CR-02：新增管線（Phase 1 含自動物流橋，Phase 2 起含自動分匯流器）、移動、複製、刪除管線、修改彎折點（Phase 1 僅限繪製中，Phase 3 支援放置後調整）。CR-05：新增 / 刪除流程配方節點、中間產物設定變更（皆 Phase 2）。

Command 一律由 L1 high-level action 內部產生並推入佇列，不由 L2 手動組裝。

L1 側九個高階 action 都已自帶歷史（O3），涵蓋 CR-01 的六項與 CR-02 的新增 / 刪除管線。實際跑得到的只有擺放、移動、旋轉、刪除四項 —— 配方變更、複製貼上、管線增刪的 action 都沒有 L2 呼叫者（見 0004#11、0005#3）。CR-05 的三項連 action 都還不存在。

判準：spec 第 3 節對應的 12 項單項復原驗證通過；標 Phase 2 / Phase 3 的項目隨上游 CR 收斂（O2）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/08_history.md` 2.2 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— L1 九個 action 已自帶歷史，其中四項有 L2 觸發點 → O3

### 3 不納入歷史的視圖操作

- **state:** 實作中
- **basis:** → O4

以下屬視圖操作而非資料操作，不進歷史佇列：畫布縮放 / 平移、視角切換、選取 / 框選、左側面板展開 / 收合、Flow Chart 節點位置調整（純視覺排版）。

判準不是「按了沒事」而是「按了會復原上一個資料操作」—— spec 第 3 節五項驗證都是這樣描述的，兩者是不同的行為，實作成前者會過不了驗證。

五項中三項（縮放平移、選取框選、面板收合）目前自動成立，因為那些狀態都不經過 `historyStore`（O4）。另外兩項的對象還不存在：視角切換等 0008#1，Flow Chart 排版等 0008#3。那兩塊落地時要回頭確認它們沒有推進歷史。

判準：spec 第 3 節「視圖操作不進歷史」「視角切換不進歷史」「選取框選不進歷史」「面板收合不進歷史」「Flow Chart 排版不進歷史」五項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/08_history.md` 2.3 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 三項因架構自動成立，另兩項的對象尚未存在 → O4

### 4 複合操作（Macro Command）

- **state:** 實作中
- **basis:** → O3

三種操作由多個子操作組成但須視為單一歷史項目，一次 `Ctrl+Z` 全部復原：複製貼上（擺放多台設備 + 新增多條管線）、新增含自動節點的管線（管線 + 物流橋，Phase 2 起含分匯流器）、從流程視角導入設備（擺放多台設備 + 新增預設管線建議）。

這是本 CR 對外的主要介面，CR-01（0004#11）、CR-02、CR-05（0008#10）三處依賴它。機制已定型並寫進開發守則（O1）。

`createMacroCommand` 已實作並有 6 個測試案例，但三個場景一個都還沒接上（O3）：複製貼上目前是 `pasteSelection` 的單一 Command（尚無 L2 呼叫者）、含自動節點的管線與流程視角導入都還不存在。所以本格是「機制成立、尚未被使用」，三項驗證都測不了。

判準：spec 第 3 節「複合操作單次復原」「複製貼上復原」「流程視角導入設備復原」三項通過；含分流器那一項隨 CR-02 的 Phase 2 收斂。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/08_history.md` 2.4 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— `createMacroCommand` 已具備並有測試，三個使用場景皆未接上 → O3

### 5 跨視角共用同一佇列

- **state:** 待實作
- **needs:** 0008#1
- **basis:** → O2

在佈局 / 流程 / 並列任一視角觸發的 `Ctrl+Z` / `Ctrl+Y` 都作用於同一份歷史，且在 A 視角做的操作可以在 B 視角復原。這是 top spec 第 5 節「操作歷史單一佇列」原則的落地點。

判準：spec 第 3 節「跨視角復原」通過（流程視角新增配方節點 → 切至佈局視角 → Ctrl+Z 復原該節點）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/08_history.md` 2.1 節與第 1 節轉入（來源：spec）

### 6 Session 結束清空、不持久化

- **state:** 完成
- **basis:** → O3

歷史佇列不寫入 localStorage，重新整理頁面後清空。與 top spec 的「自動存檔」原則不衝突 —— 存的是產線狀態，不是操作歷史。

`historyStore` 沒有任何持久化程式碼，`src/` 內唯一的 `useLocalStorage` 屬 dev 頁勾選清單，與歷史無關（O3）。另有 `clear()` 供藍圖整體重置時呼叫。

順帶記一筆：top spec 的「自動存檔」目前也沒有落點 —— 產線狀態同樣沒有持久化（見 0003#10）。

判準：spec 第 3 節「Session 清空」通過（操作後重新整理，Ctrl+Z 無法復原）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/08_history.md` 第 1 節與 2.1 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 確認無持久化路徑，重新整理即空 → O3

### 7 CR-08 驗證項目全數通過

- **state:** 待實作
- **basis:** → O2、O3

`spec/08_history.md` 第 3 節列出 26 項驗證。本格是 CR-08 的收斂判準。

Phase 1 的判準不是 26 項全過：其中至少五項依賴上游 CR 的 Phase 2 / Phase 3（分流器複合操作、流程配方節點刪除、中間產物設定變更、流程視角導入、放置後彎折點修改，見 O2）。Phase 1 只要求其餘 21 項通過，剩下五項隨上游 CR 收斂。

實測結果寫成本計畫的觀察，不逐項開新格。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/08_history.md` 第 3 節轉入為收斂判準（來源：spec）
