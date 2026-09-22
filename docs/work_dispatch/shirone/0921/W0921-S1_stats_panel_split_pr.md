# W0921-S1｜shirone｜把「搬家」那一筆單獨拆成一支 PR 合進去

| meta | value |
|------|-------|
| 週次 | 2026-09-21 → 2026-09-27 |
| 等級 | **確定・本週只有這一件事** |
| 擋門檻 | 否（但擋 [R-D1](../../../roadmap/detail/D1_stats_item_summary.md)） |
| 產能參考 | **自報下週 ≤2h**（本週的一半）。本單就是照 ≤2h 設計的 |
| 上游 | [WEEK_20260921](../../WEEK_20260921.md)、上週工單 [W0914-S1](../../shirone/0914/W0914-S1_stats_panel_land.md) |

---

## 0. 先講結論：上週的工單，你做到了

W0914-S1 要的是「把產線總覽 `StatsPanel` 搬到 `src/app/StatsPanel/`」。你分支上的第一筆 commit（`8a24858 refactor(StatsPanel): 產線總覽面板遷移至 src/app`）**就是那一刀，而且是乾淨的 10 檔 rename、0 行變更**。

它沒進 master 的原因不是做得不對，是**後面 19 筆把它埋起來了**——同一支分支上還有兩套依 Figma 重寫的面板（`shirones_StatsPanel`、`test_StatsPanel`，合計約 2,800 行），`MainLayout.vue` 的 import 指向其中一套，而分支基底早於 #50，那一行現在必定衝突。

主編看到的是一支「什麼都有」的分支，沒辦法只合他要的那一部分。

**所以本週不是叫你重做，是叫你把那一刀單獨拿出來。**

---

## 1. 一句話驗收

**一支 PR，只含 `src/components/StatsPanel/` → `src/app/StatsPanel/` 的純 rename ＋ `MainLayout.vue` 的 import 一行，`git diff --stat` 看不到任何新增元件。**

---

## 2. 怎麼做（三步，≤2h）

| 步 | 做什麼 |
|----|--------|
| 1 | 從**最新的 master** 開一支新分支 `dev/shirone0921` |
| 2 | 把 `8a24858` 那一筆 cherry-pick 過來（或直接重做一次 `git mv`，10 個檔，兩分鐘） |
| 3 | 改 `src/app/layouts/MainLayout.vue` 裡 StatsPanel 的 import 路徑，**只改那一行**，開 PR |

**不要 rebase `dev/shirone0918`。** 那支分支留著別動，兩套新面板還在上面，下一步怎麼走等主編裁（§4）。從 master 重開一支乾淨的比較快，也比較不會出事。

---

## 3. 交哪個檔

| 動作 | 檔案 |
|------|------|
| 搬移 | `src/components/StatsPanel/*` → `src/app/StatsPanel/*`（含 4 個 `.stories.ts`） |
| 修改 | `src/app/layouts/MainLayout.vue` —— **只有 StatsPanel 的 import 那一行** |

### `MainLayout.vue` 的例外授權

該檔的 owner 是 toby。本週**破例只對你開放 import 路徑那一個字串**，其餘一個字都不能動——包括空行、格式、順序。

這是上週踩鎖的直接後果：你那份 diff 現在必定與 #50 衝突。給例外是因為「改路徑的人順手改 import」比「兩個人接力改同一行」更不容易出錯，不是鎖失效了。

---

## 4. 兩套新面板：本週不處理，也不要刪

`shirones_StatsPanel` 與 `test_StatsPanel` **留在 `dev/shirone0918` 分支上，本週不合入、不刪除、不搬動。**

主編本週會裁「留哪一套」，但那是**下一支 PR 的事**。理由很簡單：你自報 ≤2h，而收兩套面板的尾不是 2 小時的工作。

裁決出來之前你不需要做任何事。裁決出來之後我會發新工單，屆時會包含：

- 留下的那套改名進 `src/app/StatsPanel/`，另一套刪除
- `ItemSummaryTable.vue` 要保留（[R-D1](../../../roadmap/detail/D1_stats_item_summary.md) 要接 `flowStore`，MBD 的空狀態 PR #37 也在裡面），新面板沒有這一塊
- 三份重複的 `HarmonyOS_Sans_TC` 字型抽成共用（`src/app/MachineCard/fonts/` 已有一份，你的兩個新目錄各一份）

> 字型是既有 blob 重用，SHA 相同，**倉庫不會膨脹**，所以不急。但工作樹上三份相同字型該收。

---

## 5. 不要碰

| 不要 | 為什麼 |
|------|--------|
| `src/app/layouts/MainLayout.vue` 的其他任何一行 | toby 的鎖；本週他在改別的區塊 |
| `src/editor/layout/*`、`src/editor/toolbar/*` | toby 的落子鏈，門檻線上 |
| `src/utils/layout/*`、`src/store/*` | aaaaa 的預檢重構 |
| `src/editor/inspector/*`、`InspectorSidebar` | B4 的入口，凍結保留 |
| 這支 PR 裡夾帶任何新元件、新字型、新 story | **夾帶就退回重拆**，那正是上週卡住的原因 |
| detector、store、9 月門檻必要項 | 不在你本週範圍 |

---

## 6. 一句要寫在前面的話（規則 21）

上週的兩套新面板不是白做，也不是錯——**是工單沒要、而你沒先說**。這是第三次同型：W0823 是幾何路線、W0831 是路徑與檔數，兩次事後都被追認；這次多出來的是工單沒有要的另外兩件事，其中一件動到別人正在合入的檔。

**所以本週的邊界寫成清單而不是一句話。若你認為還該做 X，先在 Discord 講一句再做**——不必等回覆超過半天，講了就算數。這對你是必要條件不是選配。

---

## 7. DoD

- [ ] 分支 `dev/shirone0921` 自**最新 master** 開出
- [ ] `git diff --stat origin/master...` 只有 10 個 rename（`R100`）＋`MainLayout.vue` 一行
- [ ] `src/app/StatsPanel/` 在 PR 分支上存在，`src/components/StatsPanel/` 不存在
- [ ] `pnpm dev` 首頁右側總覽區塊仍在、不報錯
- [ ] 三個目錄全域搜尋仍零 `store`／`src/data` import（維持上週的成績）
- [ ] `pnpm type-check`／`lint-check`／`format-check`／`test` 綠
- [ ] `dev/shirone0918` 未被刪除、未被 rebase

---

## 8. 卡住找誰

| 狀況 | 找誰 |
|------|------|
| cherry-pick 或 `git mv` 出事 | dernoson，當天講 |
| `MainLayout.vue` 改完 `pnpm dev` 壞了 | **不要自己擴大修**，貼錯誤訊息找 toby |
| 覺得應該順手做 X | **先講再做**（§6） |

---

## 9. 未交頂替

右側維持舊路徑 `src/components/StatsPanel/`，畫面不受影響。**但 [R-D1](../../../roadmap/detail/D1_stats_item_summary.md) 續封鎖，MBD 的下一步也一起卡著**——這支 PR 只有十個 rename，卻是三條線的解鎖鍵。

---

## 10. 下期預告（不是本週工項）

你週報提到同類工作打算半自動交給 workflow，預估下次可壓在 20 分鐘到 1 小時。**這件事本身很好，值得試。** 唯一要注意的是：單位成本降一個量級時，review 量會同比上升——所以第一次用它交的東西，範圍請比平常更小，讓人看得完。
