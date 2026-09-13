# 教學｜goodmorning｜工具列 style（W0831-G1）

| meta | value |
|------|-------|
| 對應工單 | [W0831-G1](./W0831-G1_toolbar_style.md) |
| 主改檔 | `src/app/dev/PaperFigBottomBar.vue` |
| Deadline | **2026-09-04（五）23:59** |
| 設計 | 對齊 paper **工具列** frame；不跟 MachineCard |

---

## 1. 你這週做什麼／不做什麼

| 做 | 不做 |
|----|------|
| 調底部工具列的色、圓角、間距、字級、Tab／卡片外觀 | `MachineCard`（改派 shirone） |
| 改 `PaperFigBottomBar.vue`（必要時同目錄 CSS） | 改 `ToolbarPanel.vue` 裡的機器資料／點擊落子 |
| 做到哪就先推分支 | 等稿完美再交、GitHub 網頁 Upload |

上週 MachineCard 因稿在變交不出——這週改做你本來就在調的工具列樣子。

---

## 2. 怎麼對稿

1. 開 `docs/paper/`（或等 paper 補完 frame 標號）找到**工具列**那張  
2. `pnpm dev` → 進 `/dev` 找到底部列（`PaperFigBottomBar`）  
3. 對色碼／圓角／高度：現況已有 `#2B2B2B`／`#3C3C3C`／`#EEFD1C` 等，以稿為準微調  

**不要**接真實 `getMachinesByTag`——那是 aaaaa 的 A1。

---

## 3. 交件（三選一；禁止網頁 Add file）

**A. 本機 git（推薦）**

```powershell
git checkout -b dev/goodmorning-g1-toolbar-style
git add src/app/dev/PaperFigBottomBar.vue
git commit -m "style(dev): 工具列視覺對齊 paper 稿"
git push -u origin dev/goodmorning-g1-toolbar-style
```

若有另加 CSS，一併 `git add`。

**B.** 整份檔貼 Discord，請 dernoson 代推。  
**C.** ZIP，內層路徑要一樣。

附一張對稿截圖更好。

---

## 4. 逾時

9/4 23:59 前交不出來，Discord 說「本週不做」——**不計失敗**。最怕不回訊息。
