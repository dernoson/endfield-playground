# W0907-G1｜goodmorning｜工具列視覺（改對檔案這一次）

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | 加分 |
| **deadline** | **2026-09-11（週五）23:59** |
| 要改的檔 | **只有** `src/app/dev/PaperFigBottomBar.vue` |
| 不要碰 | **`src/editor/toolbar/ToolbarPanel.vue`（本週對全員硬鎖）**、store、`src/data/*`、根目錄 |
| 教學檔 | 沿用 [0831 GUIDE_toolbar_style.md](../0831/GUIDE_toolbar_style.md) |

---

## 0. 先講上週那三筆

你 9/06 推的三筆改的是 `ToolbarPanel.vue`。那個檔是 aaaaa 前一天才合入的正式工具列資料層，**改在那裡不會合入**——不是做得不好，是**改錯檔**。

工單 0831 指定的檔一直是 `PaperFigBottomBar.vue`。這週同一件事，改對地方就好。

另外那三筆是用 GitHub 網頁上傳的，**會整個蓋掉別人的檔**。這週請走 git push（GUIDE §3 有指令）。

---

## 1. 做什麼

把 `src/app/dev/PaperFigBottomBar.vue` 的樣子，改到更接近 paper 的工具列稿（**F-02** 那張，paper 9/09 前會給編號）。

只調視覺：顏色、圓角、間距、字級、hover。**不動任何資料、不加任何邏輯。**

---

## 2. 這幾個詞

| 詞 | 白話 | 本週 |
|----|------|------|
| **dev 頁** | 給設計對照用的臨時頁 | 你的交付就在這裡 |
| **ToolbarPanel** | 正式的下方工具列（aaaaa 在接資料） | **本週硬鎖，禁止動** |
| **store** | 專案的狀態倉庫 | 禁止 import |
| **凍結** | 有人在做的稿，設計要改得先公告 | F-02 本週凍結，你不會再被作廢一次 |

---

## 3. 開工

- [ ] Discord 回：「G1 工具列 style，deadline 9/11」
- [ ] `pnpm dev` → 打開 `/dev` 看得到 `PaperFigBottomBar`
- [ ] 改之前先截一張圖（之後要做前後對照）

---

## 4. 交檔（禁止網頁 Upload）

```bash
git switch -c dev/goodmorning0907
# 改 src/app/dev/PaperFigBottomBar.vue
git commit -am "style(dev): align PaperFigBottomBar with paper toolbar frame"
git push -u origin dev/goodmorning0907
```

**做到哪就先推。** 推到分支就算交付，合不合入是主編的事——上週你自報「已開 PR」但遠端沒有 PR，這邊就看不到。

---

## 5. DoD

- [ ] 視覺相對現況明顯更靠近 paper 工具列稿（前後截圖或對稿）
- [ ] diff **只有** `PaperFigBottomBar.vue` 一個檔
- [ ] 未 import store、未動 `ToolbarPanel`
- [ ] 9/11 23:59 前有分支
- [ ] 未用 GitHub 網頁 Upload

---

## 6. 關於「可能中途退出」

你在週報勾了這一項，也寫了開學加簽、時間 ≤2h。

**這張工單就是照那個前提發的**：一個檔、只改樣式、沒有下游在等。真的要退出，Discord 回一句就好，不用交代理由，也不會追進度。

---

## 7. 未交頂替

不計失敗。`PaperFigBottomBar` 沿用現況，正式 `ToolbarPanel` 不受影響。
