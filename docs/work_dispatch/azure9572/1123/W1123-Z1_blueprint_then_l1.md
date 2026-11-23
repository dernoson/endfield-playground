# W1123-Z1｜azure9572｜先收 #95，再視情況接非首要 L1

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **加分**（11/22 主裁；自報 **3–5h**）。不擋 POC |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[D4](../../../roadmap/detail/D4_blueprint_json_io.md)、[W1109-Z1](../1109/W1109-Z1_blueprint_slice.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 無新畫面｜[#95](https://github.com/dernoson/endfield-playground/pull/95)／`blueprintFile.ts` 與測試｜頂欄、`layoutStore` 簽名、右側、畫布｜dernoson（合入）、aaaaa（下一塊 L1 選什麼） |

---

## 0. 白話目標

主裁：看上週 JSON 匯入匯出的 PR 是否完成；沒完成就接著做；完成再看有什麼 L1 純函式的非首要邏輯。

現況：[#95](https://github.com/dernoson/endfield-playground/pull/95) **OPEN、MERGEABLE**（serialize／parse＋測試）。這週**第一優先把這張合進去或補到可合**。

---

## 1. 第一步（必做）

1. 對 `origin/master` 確認 #95 仍可合、測試仍過。
2. 若 review 要修：只修純函式與測試。不要加頂欄按鈕。
3. 合入，或 Discord 寫「等 review／停在哪個測試」。

---

## 2. 第二步（只有 #95 已合才做）

任選**一塊**非門檻必要的 L1 純函式，開小 PR：

- 建議：`E004`／配方類 detector 的測試補強，或 blueprint 邊界案例（空 devices、非法座標）——**先在 Discord 問 aaaaa／dernoson 選哪一塊**，不要自己開第二條主線。
- 仍然：不改 store 簽名、不做頂欄。

---

## 3. 不要做

- 頂欄 Save／Load
- 改 `Navbar.vue`、右側、畫布
- 在 #95 還沒合前開始第二塊

---

## 4. DoD

- [ ] #95 **MERGED**，或有一句話說明為何未合、差什麼
- [ ] 若已合且有餘力：第二塊小 PR 或明確不做
- [ ] 沒有頂欄／store 簽名 diff

未交：JSON 維持未合。POC 不因此失敗。
