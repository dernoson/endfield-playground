# W1109-Z1｜azure9572｜JSON 匯入匯出的一小步

| meta | value |
|------|-------|
| 週次 | 2026-11-09 → 2026-11-22 |
| 等級 | **加分**。不要求做完，不影響 POC |
| 時數 | 每週 **≤2h**。11/10、11/13 有考試，那幾天不做也行 |
| 上游 | [WEEK_20261109](../../WEEK_20261109.md)、[D4](../../../roadmap/detail/D4_blueprint_json_io.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 無新畫面｜`src/types/layout.ts` 旁的純函式與測試。建議新檔 `src/utils/layout/blueprintFile.ts` 與其測試｜頂欄按鈕、`layoutStore` 簽名、右側面板｜dernoson（要不要合） |

---

## 0. 白話目標

會議把 JSON 匯入匯出交給你，同時講明：不要趕大量進度，它不進 POC 驗收。

store 已經有 `toSnapshot()` 和 `loadSnapshot()`。缺的是檔案外殼：下載的 JSON 帶 `version: 2`，讀回來時還原設備與管線。

這兩週只做外殼與測試。頂欄按鈕不做。

---

## 1. 能做多少算多少

1. 一個純函式：`LayoutSnapshot` 加上 `version: 2`，可再帶 `planId`。
2. 另一個純函式：讀進 JSON。`version` 不是 2 就拒絕，並說明是格式不合。
3. 通過的內容交給現成的 `loadSnapshot`。不要新開 store action，不要改它的參數。
4. 測試覆蓋：來回一次資料相等；舊版 version 被拒絕。
5. 做不完就開 PR，或在 Discord 寫停在哪一個函式。兩種都算有交代。

---

## 2. 不要做

- 頂欄 Save／Load 按鈕
- 改 `Navbar.vue`
- 接到右側或畫布
- 讀舊的 v1 檔

---

## 3. DoD

- [ ] 有 PR，或有一句話說明停在哪
- [ ] 沒有頂欄 diff
- [ ] 沒有改 store 簽名

未交：JSON 維持未做。POC 不因此失敗。
