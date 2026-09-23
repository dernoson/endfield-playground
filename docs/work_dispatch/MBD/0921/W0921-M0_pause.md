# W0921-M0｜MBD｜本週暫停（上週那 6 筆的處置說明）

| meta | value |
|------|-------|
| 週次 | 2026-09-21 → 2026-09-27 |
| 等級 | **暫停** |
| 擋門檻 | **否**；**不計完成率** |
| 狀態 | `[x]` 暫停成立 |
| 上游 | [WEEK_20260921](../../WEEK_20260921.md) §2.1、上週 [W0914-M0](../0914/W0914-M0_pause.md) |
| 備註 | 本單取代原擬的 W0921-M1（重推乾淨分支）。**主編 9/23 裁定該單作廢**，理由見 §2 |

---

## 1. 本週不派工

不計完成率，沒有死線，不用回訊。

---

## 2. 上週那 6 筆：不合入

你在暫停週自己開工推了 6 筆（9/20 整晚），改的是 `src/components/StatsPanel/` 五個檔的樣式——Index、ItemSummaryTable、PowerSummary、TicketEstimate、WarehouseEstimate，commit 訊息寫「嚴肅模仿 figma」。同一批 commit 也改了 `src/app/layouts/MainLayout.vue`，把 `InspectorSidebar` 的 import、`inspectorOpen` 跟整個標籤刪掉了。

**主編 2026-09-23 裁示：`dev/MBD` 整支不合入，StatsPanel 的樣式設計工作由 shirone 承接。**

原本排給你的是「把那 5 個檔重推成一支不含 `MainLayout.vue` 的乾淨分支」。那單撤掉了——理由不是你做得不好，是**右側面板這週起只留一個 owner**：

| 原狀況 | 現在 |
|--------|------|
| shirone 搬目錄（`components/` → `app/`）、你做樣式 | **shirone 一人做完搬家＋樣式** |
| 兩人同週進同一批檔、互不知情 | 同一目錄不再有第二個人 |

**你要是把那 5 個檔重推一次，就等於再撞一次車**——這回是撞在 shirone 正在做的同一件事上。所以不重推。

---

## 3. 這不是你的錯

你週報寫「中途改過，有重工成本」——你八成就是撞車的當事人。

上週 shirone 的工單正好是把 `src/components/StatsPanel/` 整個搬走。你們兩個同一週改同一批檔、互不知情、都沒開 PR。**會發生是因為檔案鎖只寫在當週工單裡，而你那週的工單是「暫停」，所以你根本沒收到鎖表。**

這條已經改了——從本週起暫停單也附鎖表（見 §4），鎖表也會貼到 Discord。**重工成本不算在你頭上，也不要求你去 rebase。**

`dev/MBD` 分支留著不刪，你的成果不會消失。只是它不走合入這條路。

---

## 4. 本週別碰這些檔（規則 23）

| 檔／區 | owner | 狀態 |
|--------|-------|------|
| `src/app/StatsPanel/*`、`src/components/StatsPanel/*` | **shirone** | **本週搬家＋改樣式，整區歸他** |
| `src/app/layouts/MainLayout.vue` | toby | 全檔。上週的問題就出在這裡 |
| `src/editor/layout/*`、`src/editor/toolbar/*` | toby | **9/27 門檻線上** |
| `src/utils/layout/*`、`src/store/*` | aaaaa | 門檻前置 |
| `src/editor/inspector/*`、`InspectorSidebar` | — | **凍結：誰都不能刪** |
| `FactoryCanvas.vue`、`FlowNodeOverlay.vue` | — | 凍結：保留、不加深、不刪 |

簡單說：**這週 `src/` 底下不要動任何東西。** 想動什麼先在 Discord 講一句。

---

## 5. 下次派工會是什麼

**面板的空狀態與文案這條線，本週起也併給 shirone。** 原本規劃是「shirone ＝ 元件與路徑，你 ＝ 文案與空狀態」，主編 9/23 改為單一 owner，切分取消。

所以下次發給你的**不會是 StatsPanel**。方向兩個，回來時挑一個：

| 方向 | 說明 |
|------|------|
| L3 呈現元件（新的） | 與 StatsPanel 無關的獨立元件，一次一塊，不與人共檔 |
| 樣式／視覺的實作對口 | 接 paper 的稿，做尚未有人認領的畫面 |

**不下死線，也不急。** 在 Discord 回一句「這期可投入 Xh」就好，有空窗才發。

---

## 6. 卡住找誰

| 狀況 | 找誰 |
|------|------|
| 想知道自己那 5 個檔的改動去哪了 | shirone（他會參考你的成果做樣式）或 dernoson |
| 覺得還是想做點什麼 | **先講再做**（上週就是這一步漏掉），Discord 問一句 |
| git 出事 | dernoson |

本週總表：[WEEK_20260921](../../WEEK_20260921.md)。
