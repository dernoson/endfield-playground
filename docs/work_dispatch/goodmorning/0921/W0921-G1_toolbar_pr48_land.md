# W0921-G1｜goodmorning｜#48 收尾合入（本週只有這一件事）

| meta | value |
|------|-------|
| 週次 | 2026-09-21 → 2026-09-27 |
| 等級 | **確定・單一件事** |
| 擋門檻 | 否，**但在門檻路徑上**——見 §1 |
| 交期 | **9/24（三）**；到期未動由主編直接處置（不是你的失分） |
| 產能參考 | 自報 ≤2h。病後第一週**不加量**，預告中的「佈局視角設備樣式」本週不派 |
| 上游 | [WEEK_20260921](../../WEEK_20260921.md)、[PR #48](https://github.com/dernoson/endfield-playground/pull/48) |

---

## 0. 先說一句

上週你掛病號，工單沒開工。**這不算在你頭上**——W0914-G1 是整份 0914 派工裡唯一為你鬆綁的工單（`ToolbarPanel.vue` 對你限視覺解鎖、踩鎖爭議結案），結果沒用上，成因與能力、工單清不清楚、檔案鎖都無關。

**限視覺解鎖的狀態維持，不因上週零產出收回。** 鎖的收放看規則不看產能。

---

## 1. 為什麼這週它變重要了

#48 自 9/13 開著，最後活動停在 9/14，**已經 8 天沒動**。

本週它的性質變了：`ToolbarPanel.vue` 是落子鏈的一環。toby 這週要把「點工具列真機器 → 放到畫布」接起來（[T1](../../toby/0921/W0921-T1_placement_chain.md)），他需要動那個檔的 `<script>` 區。**#48 不結，他那一刀動不了，而 9/27 硬綁 B1。**

所以 9/24 是硬期限——不是對你的要求變嚴，是後面排了人。

---

## 2. 一句話驗收

**#48 合入 master，工具列的 Tab／真機器列表／拖拉都沒壞。**

---

## 3. 你要做的事（就三件）

| # | 做什麼 |
|---|--------|
| 1 | 把 master 最新內容 merge 進 `dev/goodmorning`（期間 master 進了不少東西，先確認還合得起來） |
| 2 | 依主編 review 意見修正 —— **只改視覺**：CSS、class、間距、顏色、stories |
| 3 | 在 PR 回一則訊息說「已依意見修正，可再審」 |

**不需要做的：** 不需要等 paper。「paper 過」本週起從合入前提改成**事後補審**——上週兩邊互等整整七天，那是派工設計的錯，不是你們任何一個人的問題。

---

## 4. 交哪個檔

| 動作 | 檔案 |
|------|------|
| 修改 | `src/editor/toolbar/ToolbarPanel.vue` —— **只有 `<template>` 與 `<style>`** |
| 修改 | `src/editor/toolbar/*.stories.ts` |

### `<script>` 區本週不要動

這是新增的一條界線，原因在 §1：#48 合入後，那個檔的 `<script>` 區會轉給 toby 接落子意圖，`<template>`／`<style>` 仍然是你的。

具體說，這幾樣不要改：`handleRealMachineClick`、`handleEquipClick`、`handleEquipDragStart`、`activeTag`、`selectedRealMachineId`、以及任何 `editorStore` 的呼叫。

若你認為某個視覺效果非改 script 不可（例如要加一個 class 的 computed），**先在 PR 講一句**，不要直接改。

---

## 5. 不要碰

| 不要 | 為什麼 |
|------|--------|
| `ToolbarPanel.vue` 的 `<script>` | §4 |
| `src/editor/layout/*` | toby 的落子鏈 |
| `src/app/StatsPanel/*`、`src/components/StatsPanel/*` | shirone 的搬家 PR |
| `src/app/layouts/MainLayout.vue` | toby 的鎖 |
| a11y 屬性、鍵盤行為、`role`／`aria-*` | 屬邏輯，不在限視覺解鎖的範圍內 |
| 新開平行目錄或改檔名 | 沿用既有路徑 |

---

## 6. DoD

- [ ] `dev/goodmorning` 已含最新 master，無衝突
- [ ] #48 的 diff 只在 `<template>`／`<style>`／stories
- [ ] `pnpm dev`：Tab 切換、真機器列表、五顆舊按鈕的點擊與拖拉**都沒壞**
- [ ] `pnpm type-check`／`lint-check`／`format-check`／`test` 綠
- [ ] PR 上回一則「已修正，可再審」
- [ ] **9/24 前完成**

---

## 7. 卡住找誰

| 狀況 | 找誰 |
|------|------|
| merge master 有衝突 | dernoson，**當天講**，不要自己硬解 |
| 不確定某個改動算不算「視覺」 | PR 上問一句，不要先改再說 |
| 身體還沒好 | 直接講，我們改派。**這不是失分** |

> 主編週中會 ping 你一次。**那次 ping 是問人不是問進度**，不用有壓力。

---

## 8. 未交頂替

9/24 沒動靜的話，主編會直接裁掉 `.vue` 的非視覺 diff 後合入（你的 stories 部分可用），**不關閉 #48**。關閉會讓連續三期未交變成四期，對剛病假回來的人不必要，而且工具列視覺本來就該進去。

---

## 9. 下週預告（不是本週工項）

你週報寫下週想接「畫面 mock（L3）」。#48 落地後，佈局視角的設備方塊正式視覺就是你的——那是新畫布上第一塊真正的美術工作，會在 9/28 的工單發。**本週不要提前開始**，先把 #48 收乾淨。
