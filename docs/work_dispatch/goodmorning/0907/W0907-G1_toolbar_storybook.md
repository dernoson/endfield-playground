# W0907-G1｜goodmorning｜工具列 Storybook（交付到 story 為止）

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | 加分 |
| **deadline** | **2026-09-11（週五）23:59** 前開出 PR |
| 過審 | **白紙（paper）過審** 後才合入 |
| 交付終點 | **Storybook 而已**；接線／接 store／接正式 `ToolbarPanel`＝**L2 的事，本週不做** |
| 路徑建議 | `src/components/Toolbar/`（工具列組合）、`src/components/ToolButton/` 或同層按鈕檔（按鈕本身） |
| 不要碰 | **`src/editor/toolbar/ToolbarPanel.vue`（硬鎖）**、任何 store、`src/data/*`、根目錄 |

---

## 0. 上週那三筆（先對齊）

你 9/06 改到 `ToolbarPanel.vue` 的三筆**不會合入**——那是正式資料層，不是本週視覺交付點。這週改做 **Storybook 裡的工具列元件**。

交檔請走 `git push`＋開 PR，不要用 GitHub 網頁 Upload。

---

## 1. 白話目標

在 Storybook 裡讓人看得到：

1. **整條工具列**一個 story（排版、分組、整體長相對稿）
2. **工具列按鈕本身**另開一個 story（單顆：預設／選中／必要的話禁用）

對齊 paper 的命名與排版概念（見 [P1](../../paper/0907/W0907-P1_naming_and_layout.md)）。**視覺對到白紙點頭為止。**

**接線不是你的工作。** 不要 import store、不要掛進主畫面、不要改 `ToolbarPanel`。L2 以後會來接。

---

## 2. 這幾個詞

| 詞 | 白話 | 本週 |
|----|------|------|
| **Storybook** | 元件展示台（`pnpm storybook`） | **唯一驗收現場** |
| **工具列 story** | 整條 bar 的展示頁 | 要有 |
| **按鈕 story** | 單顆按鈕的展示頁 | 要有（獨立一頁，不要只塞在工具列裡） |
| **ToolbarPanel** | 正式下方工具列（資料層） | **禁止動** |
| **白紙過審** | paper 看 story 對稿後說「過」 | 合入前提 |

---

## 3. 開工

- [ ] Discord 回：「G1 工具列 Storybook，deadline 9/11，等白紙審」
- [ ] `pnpm storybook` 跑得起來
- [ ] 等／對照 paper 的命名＋排版概念（週三前會出）；概念未到可先做結構，之後再調數值

---

## 4. 交檔

```bash
git switch -c dev/goodmorning0907
# 只新增／修改 src/components/Toolbar/*、按鈕元件與其 *.stories.ts
git push -u origin HEAD
```

開 PR，標題帶 `W0907-G1`，並在 Discord **@白紙** 請他看 Storybook。

**推到分支＋開出 PR 才算交付。** 上週自報「已開 PR」但遠端沒有，這邊看不到。

---

## 5. DoD

- [ ] Storybook 有「工具列」story，整條對得上稿的結構
- [ ] Storybook 有「工具列按鈕」**獨立** story（至少 Default／Active）
- [ ] 未 import store、未動 `ToolbarPanel`、未掛進主 app 接線
- [ ] 9/11 前有 PR
- [ ] **paper 回覆「過」**（或你已依其修改清單改完並再請審）
- [ ] 未用網頁 Upload

---

## 6. 關於「可能中途退出」

週報有勾這一項。這張工單照 ≤2h、可中斷的前提發：只到 Storybook、不接線。真的要退出，Discord 回一句即可。

---

## 7. 未交頂替

不計失敗。正式 `ToolbarPanel` 維持現況；L2 之後另開視覺來源。
