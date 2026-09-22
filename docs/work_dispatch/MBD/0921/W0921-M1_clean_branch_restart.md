# W0921-M1｜MBD｜把上週那 6 筆重推成一支乾淨分支（單步，不下死線）

| meta | value |
|------|-------|
| 週次 | 2026-09-21 → 2026-09-27 |
| 等級 | **單步發工・不下 deadline・不計未完成** |
| 擋門檻 | 否 |
| 產能參考 | 自報 3–5h、風險「時間不穩」、補充「慢慢搞」。**這單刻意排得比 3h 小** |
| 上游 | [WEEK_20260921](../../WEEK_20260921.md)、上週 [W0914-M0](../0914/W0914-M0_pause.md)（暫停單） |

---

## 0. 先講清楚：上週那 6 筆，不是白做

你在暫停週自己開工推了 6 筆（9/20 整晚），改的是 `src/components/StatsPanel/` 五個檔的樣式——Index、ItemSummaryTable、PowerSummary、TicketEstimate、WarehouseEstimate。commit 訊息寫「嚴肅模仿 figma」。

**那些樣式改動是可用的，主編會收。**

只有一件事不收：同一批 commit 裡也改了 `src/app/layouts/MainLayout.vue`，把 `InspectorSidebar` 的 import、`inspectorOpen` 跟整個標籤都刪掉了。那個側欄是十月要做的「點選設備看資訊」的入口（[R-B4](../../../roadmap/detail/B4_selection_inspector.md)），刪掉別人下個月就沒地方接。

而且那個檔上週剛被 toby 改過並合入 master（#50），你這份 diff 現在一定會衝突。

---

## 1. 這不是你的錯，是派工端的錯

你週報寫「中途改過，有重工成本」——**你八成就是撞車的當事人。**

上週 shirone 的工單正好是把 `src/components/StatsPanel/` 整個搬到 `src/app/StatsPanel/`。你們兩個同一週改同一批檔、互不知情、都沒開 PR。

會發生這件事是因為：**檔案鎖只寫在當週工單裡，而你那週的工單是「暫停」，所以你根本沒收到鎖表。** 這條已經改了——從本週起，暫停單也會附「這週別碰哪些檔」，鎖表也會貼到 Discord。

**所以：重工成本不算在你頭上，也不要求你去 rebase。** `MainLayout` 的三方衝突不是你該處理的東西。

---

## 2. 本週這一步

**把那 5 個面板檔的樣式改動，重新推成一支不含 `MainLayout.vue` 的乾淨分支。**

就這一件事。沒有死線，做到哪算哪。

| 步 | 做什麼 |
|----|--------|
| 1 | 從**最新 master** 開一支新分支 `dev/MBD0921` |
| 2 | 把那 5 個檔的樣式改動重做一次（照你上週的成果貼過去就好，不用重想） |
| 3 | 推上去，開 PR，標題帶 `W0921-M1` |

**路徑用哪一個由主編告訴你。** shirone 這週會把那個目錄從 `src/components/StatsPanel/` 搬到 `src/app/StatsPanel/`；他先合入你就用新路徑，沒合入你就用舊路徑。**兩種都對，不要自己判斷，在 Discord 問一句。**

---

## 3. 交哪個檔

| 動作 | 檔案 |
|------|------|
| 修改 | `StatsPanel/Index.vue` |
| 修改 | `StatsPanel/ItemSummaryTable.vue` |
| 修改 | `StatsPanel/PowerSummary.vue` |
| 修改 | `StatsPanel/TicketEstimate.vue` |
| 修改 | `StatsPanel/WarehouseEstimate.vue` |

---

## 4. 不要碰（本週鎖表，規則 23）

| 檔／區 | owner |
|--------|-------|
| **`src/app/layouts/MainLayout.vue`** | toby。**這是本週最重要的一條**——上週的問題就出在這裡 |
| `src/editor/layout/*`、`src/editor/toolbar/*` | toby（落子鏈，在 9/27 門檻線上） |
| `src/utils/layout/*`、`src/store/*` | aaaaa |
| `src/editor/inspector/*`、`InspectorSidebar` | 凍結。**不是給誰用，是誰都不能刪** |
| `src/app/shirones_StatsPanel/*`、`src/app/test_StatsPanel/*` | shirone（去留待裁，不要動） |
| `FactoryCanvas.vue`、`FlowNodeOverlay.vue` | 凍結保留 |

**如果你覺得非改 `MainLayout.vue` 不可**（例如樣式在那裡才看得到效果）：在 Discord 講一句，toby 或主編幫你改。不用等太久，半天內會有回音。

---

## 5. DoD

- [ ] 分支 `dev/MBD0921` 自最新 master 開出
- [ ] PR 的 `git diff --stat` **不含** `MainLayout.vue`
- [ ] 只有 StatsPanel 那 5 個檔
- [ ] `pnpm dev` 首頁右側面板能開、沒破版
- [ ] `pnpm type-check`／`lint-check`／`format-check` 綠

跑不動或看不懂錯誤訊息就貼到 Discord，不用自己卡。

---

## 6. 卡住找誰

| 狀況 | 找誰 |
|------|------|
| 不知道該用哪個路徑 | Discord 問，**這題沒有笨問題**——路徑這週正在搬，問才是對的 |
| git 開分支／推上去出事 | dernoson |
| 樣式要對哪張稿 | paper |
| 覺得還該多做點什麼 | **先講再做**（上週就是這一步漏掉） |

---

## 7. 下一步（做完這個之後）

面板的**空狀態與文案**是你的（延續 W0823-M1、W0831-M1 那條線，PR #37 已經合入過一次）。等 shirone 的搬家合入、主編裁完留哪一套面板，就會發給你。

**9/13 會議說「你和 shirone 共同完成右側面板」，本週起切乾淨：shirone＝元件與路徑，你＝文案與空狀態。** 兩個人不會再同時進同一個目錄。

---

## 8. 未交頂替

沒做完不計，沒有任何影響。主編或 toby 會從你上週的 6 筆裡挑面板樣式的部分自己處理。**本單存在的意義是讓你自己把東西收回來，不是非做不可。**
