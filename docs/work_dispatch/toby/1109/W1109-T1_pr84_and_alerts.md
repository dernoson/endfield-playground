# W1109-T1｜toby｜先收 #84，再接警示

| meta | value |
|------|-------|
| 週次 | 2026-11-16 → 2026-11-22。**11/09–11/15 不開工**（你已報這週沒有休息日） |
| 等級 | **確定**（11/08 會議） |
| 擋門檻 | 否。11/29 的右側警示仍是整段門檻，這週只做接上 |
| 上游 | [WEEK_20261109](../../WEEK_20261109.md)、[D1](../../../roadmap/detail/D1_stats_item_summary.md)、[D2](../../../roadmap/detail/D2_e001_overlap_alert.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 右側總覽的警示，以及變紅的設備｜`src/editor/stats/ProductionStats.vue`、`src/app/StatsPanel/AttentionPanel.vue`、`GridCanvas.vue` 的設備 `<rect>`｜`useFlowEngine.ts`、`layoutStore` 簽名、`MainLayout.vue`、供電樁、左欄｜aaaaa（alert 形狀）、dernoson（#84 怎麼合） |

---

## 0. 白話目標

兩件事，順序不能反。

第一件：把 [#84](https://github.com/dernoson/endfield-playground/pull/84) 改到合得進去。它現在跟 master 衝突，而且比上週工單多做了電力與調度券。

第二件：警示接到畫面上。右側總覽看得到一條警示；那台設備在畫面上的格子變紅。

11/15 之前不要開這兩件。第二件在第一件還不能合的時候不要開始。

---

## 1. 第一件（#84）

1. 以現在的 `origin/master` 為底，把衝突解掉。
2. 產耗仍要有：沒有設備時一句話，有連線時數字會變。
3. 上週多出來的電力、調度券可以留在同一張 PR，但不要再加第三塊。
4. `useFlowEngine.ts` 與 `MainLayout.vue` 若不是數字所必需，從這張 PR 拿掉。

---

## 2. 第二件（警示）

1. 讀已經有的 `validationStore.alerts`。不要新寫 detector。E001 已在 dev 頁，E005 已在 master。
2. 右側用 `AttentionPanel.vue` 的 tips 顯示一條看懂的句子。沒有警示時不要留假資料。
3. 有警示的那台設備，在 `GridCanvas.vue` 的設備格子上改成紅色。只改顏色的 class，不要重寫畫布。
4. 更新 #84，或在它合進去之後另開一張 PR。不要開成和 #88 平行的第二套產耗。

---

## 3. 不要做

- 11/09–11/15 提交功能
- 新的偵測器
- 改 `layoutStore` 的簽名
- 改 `MainLayout.vue`
- 做供電樁、左欄、刪除與旋轉的新畫面

---

## 4. DoD

- [ ] #84 在 gh 上不再是衝突
- [ ] 右側看得到警示，清空後消失
- [ ] 觸發的設備格子是紅的
- [ ] 表格元件仍然不 import store

未交：右側維持現況。警示整段留到下次，不換人在這週接手。
