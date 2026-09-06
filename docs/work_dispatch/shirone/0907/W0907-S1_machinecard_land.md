# W0907-S1｜shirone｜讓 MachineCard 落地

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | **確定**（收尾；本週只有這一塊） |
| 擋門檻 | 否 |
| 對應 PR | [#41](https://github.com/dernoson/endfield-playground/pull/41)（仍開） |
| 產能參考 | 自報 3–5h |

---

## 1. 目標

上週的 MachineCard 功能面沒有問題，卡的是**檔案落在哪**。主編會在 **9/09 前**於 #41 留一句路徑裁決；照那句搬完、重推、合入。

**合入前不派第二塊。** 這週把 #41 關掉就是全部。

---

## 2. 邊界

- 只動 MachineCard 自己那幾個檔＋其 stories。
- 不 import store、不 import `src/data/*`（假 props 驗收）。
- 不碰 detector（已移交）、不碰 `ToolbarPanel`（本週對全員硬鎖）。

---

## 3. 驗收

- 檔在裁決後的路徑；Storybook 假 props 看得到兩張卡，點一下 emit 對應 id。
- `pnpm type-check`、`pnpm lint-check` 綠。
- #41 合入，或有明確退件理由。

對照用的實例：[PR #43](https://github.com/dernoson/endfield-playground/pull/43)（aaaaa 的工具列切片，已合入）。

---

## 4. 如果你覺得裁決的路徑不對

**回一句再改，不要直接以實作表態。**

上次 W0823-S1 的幾何路線你判斷對了、主編也全盤採納，但當時工單寫著「待裁決」而你沒等——那次沒出事是因為反正要重寫。**gate 只有一個人，下次不一定接得住。**

所以這次的規則很簡單：不同意就在 #41 回一句你的理由，主編當天會回。回完照你的做法走也可以，重點是**分歧要留下紀錄**。

---

## 5. 未交頂替

不計失敗。工具列維持暫時列表，不影響 09/27。
