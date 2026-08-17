# 0005_20260811_cr02-pipeline-connection

- **prev:** `./0003_20260811_top-spec-integration-simulator.md`
- **skill:** plan-history v3
- **status:** draft

## 主題簡述

CR-02 管線連接 —— 在設備之間建立傳送帶與水管的連線關係。管線的連接狀態是 CR-03 警示與 CR-04 流量估算的計算基礎，沒有它產線邏輯不成立。

規格出處 `spec/02_pipeline.md`（v0.4）。橫跨三期：Phase 1 手動彎折點、Phase 2 分流器 / 匯流器自動生成、Phase 3 自動路徑規劃。

**本計畫的約束**

- `spec/` 是對外文件，統籌決斷寫在本計畫，不寫回 `spec/`。
- `待實作` 代表「規格已定、尚未逐項對照程式碼確認」；`src/editor/canvas/PipelineEdge.vue` 等已存在（見 O1），動任一格前先核對現況。
- 分流器 / 匯流器在 Phase 1 就作為一般設備存在於設備庫與工具列，可手動擺放；Phase 2 才有「拉管線時自動生成」的互動。兩者不可混談。

## 規劃描述

依 spec 主要章節切格：管線模式、type 判斷、繪製流程、90 度限制、繪製中路徑的即時性、自動吸附與設備編輯時的自動連接、物流橋、分匯流器（Phase 2）、選取與資訊面板、編輯行為、警示重算原則、視覺樣式，最後以驗證表格收斂。

「90 度限制」與「繪製中已定案 / 未定案的區分」從繪製流程獨立出來，因為兩者都是使用者可直接感知的獨立行為，且各自有專屬的驗證項目 —— 混在一格會讓進度看不出卡在哪裡。

Phase 3 的自動路徑規劃不在本計畫開格，它是 0003#9 的範疇；本計畫只保證 Phase 1 的手動彎折點路徑不會擋住之後的替換。

## 觀察與推論

### O1 · 2026-08-11 03:25:00+08:00 — 管線側既有實作盤點

`src/editor/canvas/PipelineEdge.vue` 對應管線繪製；`src/utils/shirone/getPipelineOccupiedGrids.ts` 提供管線佔格計算，`rewritePipelineStructure.ts` 疑似對應分匯流器 / 截斷的結構改寫；`src/utils/portUtils.ts` 與 `src/app/dev/topologyPortUtils.ts` 對應接口處理；`src/types/graph.ts` 對應連線圖結構。

`rewritePipelineStructure.ts` 的存在暗示 Phase 2 的分匯流器插入邏輯可能已有雛形，早於 spec 的 Phase 排序。逐格核對時要先確認它實際覆蓋到哪一段，再決定 0005#8 的起點。

### O2 · 2026-08-11 03:30:00+08:00 — 警示重算原則以設備接口為準

spec 2.8 節明訂：管線移動脫離接口或刪除本身不直接產生警示，而是觸發對受影響設備的重新評估（例如某接口因此失去輸入來源才產生 E004）；若管線兩端接口原本就未連接任何有效路徑，則移動或刪除後不產生新警示。

這條把警示的歸屬單一化到設備接口，管線不是警示主體。實作上代表管線異動後不能就地產生警示，必須反查受影響設備再交給 CR-09 判定 —— 兩份 spec 的驗證項目（本 CR「管線刪除警示以設備為主」與 CR-09 的 E004）測的是同一條規則的兩端。

### O3 · 2026-08-11 04:20:00+08:00 — 管線只有型別與渲染，沒有任何建立管線的路徑

`src/types/graph.ts` 的 `FactoryEdgeData` 已定義 `portType`（`belt` / `pipe`）與 `bendPoints`；`PipelineEdge.vue` 依 `bendPoints` 拼出直角折線 path，並在 `FactoryCanvas.vue:23` 註冊為 `edgeTypes.pipeline`。

但 `src/` 內沒有任何地方產生 `type: 'pipeline'` 的邊：`editorStore` 的 `mockEdges`（:135）全是預設型別、沒有 `data`，所以 `PipelineEdge` 實際上從未被渲染過。`editorStore.addConnection` / `removeConnection` 兩個 high-level action 有實作並自帶歷史，但 `src/` 內零呼叫者（只有測試呼叫）。`FactoryCanvas` 沒有處理 Vue Flow 的 `connect` 事件，`FlowNodeOverlay` 雖然有左右各一個 `Handle`，拉出來的連線不會進 store。

沒有找到的：管線模式與 `P` 鍵、接口高亮、繪製狀態機（起點 / 預覽 / 彎折點 / 確認）、90 度限制與斜線封鎖、吸附、物流橋、管線選取與資訊面板、管線移動 / 複製、`tokens.css` 中的管線與接口樣式。

所以 CR-02 的實作進度是：資料結構與「畫出來」這一段有了，「怎麼生出一條管線」整段空白。畫面上目前的連線全來自 mock 資料。

### O4 · 2026-08-11 04:20:30+08:00 — `rewritePipelineStructure.ts` 與分匯流器無關

- **推翻:** O1

`src/utils/shirone/rewritePipelineStructure.ts` 全檔 46 行，唯一匯出是 `absToRelPath(originalPoints)`：把絕對座標點列轉成「起點 + 逐軸位移量」的相對表示。唯一使用者是 `getPipelineOccupiedGrids.ts`，用來走訪管線經過的每一格。檔案中沒有任何分流、匯流、截斷或結構改寫的邏輯。

O1 由檔名推測它「疑似對應分匯流器 / 截斷的結構改寫」不成立。0005#8 沒有現成雛形可接，起點是零。另外檔名與內容不符本身就是個坑：下一個人照檔名找分匯流器邏輯會再撞一次。

### O5 · 2026-08-11 04:21:00+08:00 — belt / pipe 互連限制已有一份實作，但在 FlowEngine 裡

`useFlowEngine.ts` 的 `isPortMediaMismatch`（:264）與 `isItemFormMediaMismatch`（:286）會判定跨媒質的邊非法，並讓下游節點進 `invalidSubgraphUids`；`src/__tests__/flowEngine.v8.formMedia.test.ts` 與 `flowEngine.v7.modeMedia.test.ts` 覆蓋了固體走 pipe、氣體走 belt 等案例。媒質上限也在同一處（`BELT_RATE_LIMIT` 30、`PIPE_RATE_LIMIT` 60）。

但這是估算階段的事後判定：它讓流量算不出來，不會產生 Alert，也不阻止使用者拉出那條線。CR-02 要的是拉線當下就不成立。所以 0005#2 的判定規則已經有一份實作，做 CR-02 時應該對齊 / 復用它，否則畫布端與估算端會養出兩套「什麼能接什麼」的規則。

### O6 · 2026-08-11 04:31:00+08:00 — `tokens.css` 不存在

`src/` 下唯一的樣式檔是 `src/style.css`，沒有 `src/assets/styles/tokens.css`（`src/assets/` 只有 `hero.png`）。目前所有顏色都是散在元件裡的 Tailwind class（例如 `FlowNodeOverlay` 的效率四級配色、`FactoryCanvas` 的堵塞標籤配色）。

所以 `CLAUDE.md` 第 4 節「自訂顏色統一寫在 `tokens.css`」目前沒有落點。0005#12 的八種管線 / 接口狀態、0007#8 的效率四級色都指向同一個尚不存在的檔案 —— 誰先動這兩格，誰就要順手把它建出來。

### O7 · 2026-08-17 09:51:21+08:00 — 建立管線的路徑已經打通，但是用 Vue Flow 的預設拉線，不是 spec 的繪製狀態機

- **更新:** O3

本計畫寫於 `8838faf`；之後 `dev/paper`、`dev/toby`、`dev/cake` 三條合入 `dev/dernoson`（HEAD `c8c1cb3`）。`git diff 8838faf c8c1cb3 -- src/` 只動到六個檔案、+505 行，其中四個與 CR-02 有關。

O3 說的「`src/` 內沒有任何地方產生 `type: 'pipeline'` 的邊」已經不成立：

- `FactoryCanvas.vue:375` 的 `handleConnect(connection)` 接住 Vue Flow 的 `connect` 事件，組出 `type: 'pipeline'`、帶 `data.portType` 的 `FactoryEdge`，走 `editorStore.addConnection()` 進歷史。`PipelineEdge.vue` 從此真的會被渲染（`bendPoints` 為 undefined 時退化成起點到終點的單一直線段）。
- `FactoryCanvas.vue:355` 的 `resolveConnectionPortType()` 依**起點** handle 查 `mode.output_ports[idx].media` 決定 `portType`，查不到機型 / 型態 / 埠時 fallback `'belt'`。
- `FlowNodeOverlay.vue:53` 的 `layoutHandles()` 把原本寫死的「左邊一個 target、右邊一個 source」換成依 `machine.modes[].input_ports` / `output_ports` 動態產生的 Handle，依 `port.side` 貼到四邊、同側多埠沿邊均分，id 為 `in-{索引}` / `out-{索引}`，與 `parsePortIndex()` 的解析格式對齊。Handle 隨父層的 `rotate()` 一起轉。
- `FactoryCanvas.vue:130` 的 `handleEdgeContextMenu()` 在管線上右鍵開 `UDropdownMenu`，唯一項目是刪除，走 `removeConnection()`。
- `selectionStore` 新增 `selectedEdgeIds` / `setEdgeSelection()` / `hasEdgeSelection`；`handleSelectionChange` 同時寫入節點與管線選取；`useShortcuts` 的 `Delete` 現在也逐條刪掉選取的管線。

所以 CR-02 的形狀變了：不再是「整段空白」，而是「有一條能用的捷徑，但那條捷徑不是 spec 描述的東西」。缺的仍是管線模式（`P` 鍵）、接口高亮、彎折點繪製狀態機、90 度限制、吸附、物流橋、以及管線的移動與複製。

### O8 · 2026-08-17 09:53:00+08:00 — 互連限制在畫布端仍然完全不存在，而且現在更容易踩到

- **更新:** O5

`handleConnect()` 只讀起點的埠媒質來標記 `portType`，**沒有任何一行檢查終點埠的媒質是否相符**，Vue Flow 那側也沒有掛 `isValidConnection`。所以使用者可以把 `pipe` 埠直接拉到 `belt` 埠上，連線會成立、會進歷史、會被畫出來，只是 FlowEngine 事後把它判為 mismatch 而算不出流量 —— 也就是 O5 描述的那個落差，現在有了實際可觸發的入口。

另外重新確認過 O6：`src/` 下唯一的樣式檔仍是 `src/style.css`，`src/assets/` 仍然只有 `hero.png`，`tokens.css` 到現在都還沒有落點。

## 待辦

### 1 管線模式切換

- **state:** 待實作
- **basis:** → O3

透過工具列控項或快捷鍵 `P` 切換進入 / 離開管線模式。進入後：所有設備接口自動高亮、所有現有管線自動高亮、游標樣式切換為管線工具樣式。

判準：spec 第 5 節「管線模式切換」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.1 節轉入（來源：spec）

### 2 管線 type 自動判斷與互連限制

- **state:** 實作中
- **basis:** → O5、O8

每個接口在設備資料中定義媒質（程式碼中為 `PortMedia`：`belt` / `pipe`，非 spec 寫的 `conveyor`）。拉管線時依**起點接口的媒質**決定本次拉的是傳送帶或水管，視覺樣式與連接規則對應切換。不同媒質的接口無法互連，嘗試互連觸發 Error（由 CR-03 呈現）。

兩半已經分開：「type 自動判斷」這半落地了（`resolveConnectionPortType()` 依起點 `output_ports[idx].media` 標記 `data.portType`）；「不同 type 無法互連」這半在畫布端一行都沒有，使用者現在拉得出 pipe → belt 的線（O8）。

本格剩下的就是互連限制。判定必須復用 FlowEngine 的 `isPortMediaMismatch`（O5）而非另寫一份，掛點是 Vue Flow 的 `isValidConnection`，或 `handleConnect()` 內的前置檢查加 CR-03 Alert。

判準：spec 第 5 節「Type 自動判斷」（已達成）「不同 type 無法互連」兩項通過，且畫布端與 FlowEngine 用同一份媒質判定。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.2 節轉入（來源：spec）
- H2 · 2026-08-11 落地 —— 媒質判定已存在於 FlowEngine，畫布端未接 → O5
- H3 · 2026-08-11 修正 —— 接口型別名稱以程式碼的 `PortMedia`（belt / pipe）為準，正文改寫 → O5
- H4 · 2026-08-17 落地 —— type 自動判斷已進畫布端（`resolveConnectionPortType`），互連限制仍缺 → O7、O8（取代 H2）

### 3 管線繪製流程（Phase 1 手動彎折點）

- **state:** 待實作
- **basis:** → O7

在管線模式下：點選設備接口作為起點 → 移動滑鼠顯示預覽路徑 → 點選中途空格新增彎折點 → 移至目標接口自動吸附 → 點選確認放置，或按 `Escape` 取消。

產物形狀與寫入路徑都已備妥，而且現在有一條能跑的捷徑：Vue Flow 的原生拉線經 `handleConnect()` 建出 `type: 'pipeline'` 的邊並進歷史，`PipelineEdge.vue` 也真的開始被渲染（O7）。但那條捷徑是「從 Handle 拖到 Handle，一步成線」，沒有起點 / 預覽 / 彎折點 / 確認這個狀態機，`bendPoints` 永遠是 undefined，畫出來永遠是一條直線。

所以本格要決的是：新的繪製流程是**取代** `handleConnect()`，還是與它並存（原生拉線當快速通道、管線模式當精細通道）。並存的話兩條路徑必須共用同一個建邊函式，否則 `portType` 與未來的互連檢查會養出兩份。

Phase 1 不支援編輯已放置管線的彎折點；需調整路徑須刪除後重建。

判準：spec 第 5 節「手動彎折點」「已放置管線不可編輯」兩項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.3 節轉入（來源：spec）
- H2 · 2026-08-17 修正 —— 出現一條繞過本格的原生拉線路徑，正文改寫並帶出「取代或並存」的待決點 → O7

### 4 彎折點 90 度限制與斜線封鎖

- **state:** 待實作
- **basis:** → O3

所有相鄰節點（起點、彎折點、終點）之間的線段必須純水平或純垂直。當前彎折點位置若使任一線段出現斜線，該彎折點顯示紅色警示且**無法確認放置**，直到全部線段為 90 度轉角為止。系統在預覽時即時偵測並標示違規線段。

這是硬性封鎖而非警示，是本 CR 唯一會阻擋使用者操作的規則 —— 與其餘「不阻擋、只標示」的設計慣例相反，實作時不要順手改成不阻擋。

判準：spec 第 5 節「斜線鎖定確認」「斜線修正後解鎖」兩項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.3 節與第 3 節轉入（來源：spec）

### 5 繪製中已定案與未定案路徑的視覺區分

- **state:** 待實作
- **basis:** → O3

每點選一個彎折點，起點至該彎折點之間的路徑即視為已確定，樣式與正常管線一致，不再隨後續游標移動而改變。從最後一個已確定端點到目前游標位置的這段，樣式須與已確定路徑有明顯區別，並隨滑鼠移動即時更新。

目的是讓使用者在按下確認前就能持續掌握管線最終大致會怎麼走。

判準：spec 第 5 節「已確定路徑與游標線段區分」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.3 節轉入（來源：spec）

### 6 自動吸附與設備編輯時的自動連接

- **state:** 待實作
- **basis:** → O3

管線端點接近接口時自動吸附至最近的合法接口，吸附範圍為接口中心點周圍 1 格以內，吸附時顯示高亮確認提示。

另一半是反向的：設備的移動 / 旋轉 / 擺放（CR-01）造成接口與既有管線端點對齊時，系統自動建立連接，無需進入管線模式。兩者共用同一套「接口與端點是否對齊」的判定，因此同一格 —— 分開實作必然漂移。自動連接僅在 type 相符時成立。

判準：spec 第 5 節「吸附至接口」「移動設備自動連接」兩項通過（含 type 不符時確認不連接）。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.4、2.5 節合併轉入（來源：spec）

### 7 物流橋強制自動插入

- **state:** 待實作
- **basis:** → O3

管線路徑規劃時判斷路徑必須跨越現有管線，強制自動插入物流橋，不提供切換選項，兩條管線立體交叉互不干擾。這是 Phase 1 唯一在繪製時自動處理的節點，使用者無需手動放置。

自動生成的物流橋計入設備清單，可被選取、刪除；刪除時管線恢復原狀並重新驗證。

判準：spec 第 5 節「物流橋強制插入」通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.6 節轉入（來源：spec）

### 8 分流器 / 匯流器自動生成與截斷模式（Phase 2）

- **state:** 待實作
- **basis:** → O4

分流器觸發：從現有管線的中途點拉出新管線，預設自動插入分流器，原管線在該點一分為二。匯流器觸發：將管線終點拉至現有管線的中途點，預設自動插入匯流器，兩條管線合流後繼續。

兩者都可由使用者點選預示圖示切換為「截斷模式」：分流器的截斷保留截斷點之後的路徑、新管線從截斷點接出取代原起點；匯流器的截斷捨棄截斷點之前的起源路徑、換由新拉的管線接入後繼續。

前置盤點已做完且結果是否定的：`rewritePipelineStructure.ts` 只是座標轉相對位移的工具，與分匯流器無關（O4）。本格從零開始。FlowEngine 端倒是已經有分流均分與匯流加總的計算邏輯（見 0007#5），本格產生的節點要能餵進去。

判準：spec 第 5 節四項分匯流器驗證（預設生成 × 2、切換截斷 × 2）通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.6 節 Phase 2 段轉入（來源：spec）
- H2 · 2026-08-11 修正 —— 前置盤點否定，本格無現成雛形可接，正文改寫 → O4（取代 H1 的前置假設）

### 9 管線選取、框選與物件資訊面板

- **state:** 實作中
- **basis:** → O7

點選單一管線顯示物件資訊面板，內容含管線 type、連接的兩端設備與接口、當前流量估算（CR-04）與警示狀態（CR-03 / CR-09）。管線可跟隨設備一起被框選，框選範圍內的管線與設備一併進行後續編輯行為。

選取這一半已落地：`selectionStore.selectedEdgeIds` / `setEdgeSelection()` / `hasEdgeSelection` 就位，`FactoryCanvas.handleSelectionChange` 把 Vue Flow 框選到的管線與設備一併寫進 store（O7）。

缺的是資訊面板：`InspectorPanel.vue` 目前只有畫布尺寸與 snap 開關，沒有讀 `selectedEdgeIds`，也沒有任何顯示單條管線細節的版面。這一半與 0004#14（物件資訊面板三 Tab 版面）是同一塊畫面，兩格要一起收才不會做出兩套。

判準：spec 第 5 節「點選管線顯示資訊面板」「管線隨設備框選」（已達成）兩項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.7 節轉入（來源：spec）
- H2 · 2026-08-17 落地 —— 管線選取與框選已就位，資訊面板未動 → O7

### 10 管線的移動、複製、刪除

- **state:** 實作中
- **basis:** → O7

移動：整條管線與其彎折點一併平移，僅平移本體，允許脫離原本連接的兩端設備；仍須維持 90 度轉角限制；移動後端點不再對齊原接口則兩端視為未連接，需重新吸附才恢復連接。

複製：彎折點與自動生成節點（分流器 / 匯流器 / 物流橋）一併複製，複製後預設不連接至任何接口，需手動吸附。

刪除已落地，而且有兩個入口：管線上右鍵開 `UDropdownMenu` 選刪除，以及選取後按 `Delete`；兩者都走 `editorStore.removeConnection()`，自帶歷史（O7）。移動與複製一行都沒有。

三者均須可無限復原 / 取消復原（CR-08），且均觸發 CR-04 流量重算。

判準：spec 第 5 節「管線移動」「管線移動脫離接口」「管線複製」「管線刪除觸發流量重算」四項通過。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.8 節轉入（來源：spec）
- H2 · 2026-08-17 落地 —— 刪除的兩個入口（右鍵選單 / `Delete`）都已就位，移動與複製未動 → O7

### 11 管線異動後的警示重算以設備接口為準

- **state:** 待實作
- **needs:** 0012#2
- **basis:** → O2

管線移動脫離接口或刪除本身不直接產生警示；異動後反查受影響的設備接口，由 CR-09 重新評估是否產生 E004 / E005。兩端接口原本就未連接任何有效路徑時，移動或刪除不產生新警示。

判準：spec 第 5 節「管線刪除警示以設備為主」「管線刪除產生設備警示」兩項通過，且與 CR-09 的 E004 判定是同一份實作而非兩份。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 2.8 節轉入（來源：spec）

### 12 管線與接口的視覺樣式規格

- **state:** 待實作
- **basis:** → O3、O6、O7

管線五種狀態：一般（傳送帶橘色實線＋方向箭頭 / 水管藍色實線＋方向箭頭）、管線模式高亮（加粗亮色）、Error（紅色閃爍邊框）、Warning（黃色邊框）、懸停（流量 tooltip）。

接口四種狀態：一般灰色小圓點、管線模式高亮白色圓點＋脈衝動畫、可吸附綠色放大圓點、已連接對應 type 顏色實心點。

顏色統一寫在 `src/assets/styles/tokens.css`，不散落 inline（`CLAUDE.md` 第 4 節）—— 該檔目前不存在，需一併建立（O6）。

現況：`PipelineEdge.vue` 只畫一條 `BaseEdge`，沒有顏色、箭頭或狀態樣式，五種管線狀態都沒有。接口側則已經不是原本的「左右各一顆預設 Handle」了 —— `layoutHandles()` 依 `port.side` 把每顆埠貼到正確的邊、同側均分、隨節點一起旋轉（O7），但它決定的是**位置**，四種接口狀態（一般 / 管線模式高亮 / 可吸附 / 已連接）的配色仍全部沒有。管線唯一有的視覺變化是流量標籤的堵塞配色（`FactoryCanvas.edgeLabelClass`），屬 CR-04。

判準：八種狀態各自可視覺確認，且與 CR-03 / CR-09 的警示樣式規格一致。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 第 4 節轉入（來源：spec）
- H2 · 2026-08-17 修正 —— 接口位置已依 `port.side` 落地，但八種狀態配色一種都沒有，正文區分位置與狀態 → O7

### 13 CR-02 驗證項目全數通過

- **state:** 待實作
- **basis:** → O3

`spec/02_pipeline.md` 第 5 節列出 21 項驗證。本格是 CR-02 的收斂判準：Phase 1 的 17 項全數實測通過即滿足 Phase 1；四項標註 Phase 2 的分匯流器驗證隨 0005#8 一併收斂。

實測結果寫成本計畫的觀察，不逐項開新格。

**沿革**

- H1 · 2026-08-11 決斷 —— 自 `spec/02_pipeline.md` 第 5 節轉入為收斂判準（來源：spec）
