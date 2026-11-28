# W1123-T1｜toby｜把 #84 合進 master，並陪 harry 對位

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **確定**（11/22 主裁；**11/24 主裁裁：主邏輯沒問題，只改職責相關小問題；不擴第二套邏輯；讓 toby 幫 harry 看看**） |
| 時數 | 合 #84 約 **3h**；陪 harry 約 **≤1h** |
| 擋門檻 | **是**（M4：右側產耗＋警訊） |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[D1](../../../roadmap/detail/D1_stats_item_summary.md)、[D2](../../../roadmap/detail/D2_e001_overlap_alert.md)、[W1109-T1](../1109/W1109-T1_pr84_and_alerts.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 右側產耗＋警示＋設備變紅｜[#84](https://github.com/dernoson/endfield-playground/pull/84) 合入；陪 harry 看畫布設備外形接線（[W1123-H1](../../harry/1123/W1123-H1_device_shape_on_canvas.md)）｜第二張右側 PR、新偵測器、`MainLayout.vue`、供電樁、左欄、為 harry 另開第二套邏輯｜dernoson（怎麼合）、harry（對位） |

---

## 0. 白話目標

主裁（11/24）：主邏輯沒問題，要改的是職責相關的小問題，**不建議再擴第二套邏輯**。你的任務有兩件，順序是先合、後陪：

1. 把 [#84](https://github.com/dernoson/endfield-playground/pull/84) 的職責小問題修完，合進 master。
2. 陪 harry 看 `GridCanvas` 的設備外形接線，只看對位與不動埠命中，不代寫。

---

## 1. 必做

1. 再對一次現在的 `origin/master`（已含 #92／#93／#94）。有小衝突就解。
2. **職責小修**：依 review 或自查，把與數字無關的 `useFlowEngine.ts`／`flowStore.ts`／`LayoutView.vue` diff 拿掉，或搬到 L1/L2 正確位置。只修職責，不加新邏輯。
3. 確認正式編輯器路由上看得到：空白產線文案、連線時數字會變、至少一條警示、觸發的設備格子是紅的。
4. 跟 dernoson 確認可以合。**合入即為本週交付。**
5. **陪 harry（≤1h）**：harry 的 H1 PR 出來後，看一次 `GridCanvas` 的對位（方塊對格、供電樁不被誤換、埠命中不變）。意見寫在 PR review 或 Discord 一句即可，不必另開 PR。

---

## 2. 不要做

- 為 #84 或 harry 另開第二張右側／畫布 PR
- 新的偵測器、新的 L1 純函式
- 改 `MainLayout.vue`
- 做供電樁、左欄、刪除／旋轉畫面
- 替 harry 代寫 `GridCanvas` 的設備段（只給意見）

---

## 3. DoD

- [ ] [#84](https://github.com/dernoson/endfield-playground/pull/84) **MERGED**
- [ ] master 上正式頁看得到產耗與警示（含設備變紅）
- [ ] 表格元件仍然不 import store
- [ ] 陪 harry：在 H1 PR 或 Discord 留一句對位意見（有或「無意見」皆可）

未交：右側維持合入前的 master。11/29 產耗／警訊句不過。陪做不算未交。
