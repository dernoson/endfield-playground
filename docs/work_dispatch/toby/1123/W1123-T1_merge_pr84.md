# W1123-T1｜toby｜把 #84 合進 master

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **確定**（11/22 主裁；自報 **3–5h**） |
| 擋門檻 | **是**（M4：右側產耗＋警訊） |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[D1](../../../roadmap/detail/D1_stats_item_summary.md)、[D2](../../../roadmap/detail/D2_e001_overlap_alert.md)、[W1109-T1](../1109/W1109-T1_pr84_and_alerts.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 右側產耗＋警示＋設備變紅｜[#84](https://github.com/dernoson/endfield-playground/pull/84) 合入｜再開第二張右側 PR、`MainLayout.vue`、供電樁、左欄｜dernoson（怎麼合）、aaaaa（alert 形狀） |

---

## 0. 白話目標

主裁：完成上週沒完成的那個 PR。

[#84](https://github.com/dernoson/endfield-playground/pull/84) 現在是 **OPEN、MERGEABLE**。裡面已有產耗、電力、調度券，以及警示 tips 與設備格子變紅。這週的目標是**合進 master**，不是再長一塊功能。

---

## 1. 必做

1. 再對一次現在的 `origin/master`（已含 #92／#93／#94）。若又有小衝突，解掉。
2. 確認正式編輯器路由上看得到：空白產線文案、有連線時數字會變、至少一條警示、觸發的設備格子是紅的。
3. 跟 dernoson 確認可以合。**合入即為本週交付。**
4. 若 review 要求拿掉與數字無關的 `useFlowEngine.ts`／`flowStore.ts`／`LayoutView.vue` diff，照做；不要為此再開平行 PR。

---

## 2. 不要做

- 再開第二張「右側產耗」PR
- 新的偵測器
- 改 `MainLayout.vue`
- 做供電樁、左欄、刪除／旋轉畫面
- 在 #84 合入前開始下一張功能單

---

## 3. DoD

- [ ] [#84](https://github.com/dernoson/endfield-playground/pull/84) **MERGED**
- [ ] master 上正式頁看得到產耗與警示（含設備變紅）
- [ ] 表格元件仍然不 import store

未交：右側維持合入前的 master。11/29 產耗／警訊句不過。
