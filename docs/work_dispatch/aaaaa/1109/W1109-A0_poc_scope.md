# W1109-A0｜aaaaa｜確認刪除與旋轉的底層，並改 POC 範圍

| meta | value |
|------|-------|
| 週次 | 2026-11-09 → 2026-11-22（每週 ≤2h，合成這一項） |
| 等級 | **確定** |
| 擋門檻 | 否。結論本身不擋別人的畫面 |
| 上游 | [WEEK_20261109](../../WEEK_20261109.md)、[B3](../../../roadmap/detail/B3_rotation_90.md)、[B5](../../../roadmap/detail/B5_delete_single_device.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 無新畫面｜`docs/roadmap/ROADMAP_OUTLINE.md` 的 POC 句子，必要時各寫一行到 B3／B5｜畫布、store 簽名、警示、供電樁、左欄｜dernoson（文件怎麼合） |

---

## 0. 白話目標

11/08 會議要你確認兩件事的**底層**有沒有做完：設備刪除、設備旋轉。

底層指 store 的 action 與測試，不是畫面上有沒有一顆按鈕。做完的才寫進 POC 驗收。沒做完的維持不納入，這兩週不要補做。

JSON 匯入匯出已經由會議移出 POC。你要把它寫進驗收範圍，讓別人不會再把它當成 11/29 的必交項。

---

## 1. 必做

1. 讀現況再下結論，不要沿用 detail 裡 8 月的「未開始」：
   - 旋轉：`layoutStore.rotateDevice`、`src/__tests__/store/layoutStore.rotation.test.ts`、`LayoutView.vue` 是否已在呼叫。
   - 刪除：`layoutStore.removeDevice`、`src/__tests__/store/layoutStore.test.ts`。正式畫布 `LayoutView.vue` 目前沒有呼叫它。
2. 各寫一句：底層**已完成**或**尚未完成**。已完成的才列入 POC。刪除若只有 store、正式畫面還沒接，底層可以記完成，畫面不記完成，POC 只收底層。
3. 在大綱的門檻句寫明：JSON 匯入匯出**不在** POC。實作仍可繼續，由 azure 的工單走，不擋驗收。

---

## 2. 不要做

- 補刪除快捷鍵、補旋轉畫面
- 做 JSON 的存檔按鈕
- 改 `layoutStore` 簽名
- 做警示、供電樁、左欄

---

## 3. DoD

- [ ] 刪除、旋轉各有一句底層結論
- [ ] POC 只收你寫明已完成的那些
- [ ] JSON 不在 POC 這句出現在大綱

未交：POC 範圍先維持會議原句（JSON 移出；刪除與旋轉先不納入），不擋 T1／G1／S1。
