# W1123-S1｜shirone｜白紙左側設備視窗新稿

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **確定**（11/22 主裁；自報 **≤2h**；只接維護／長期亦可，本週這塊算維護延續） |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[P1](../../paper/1123/W1123-P1_left_panel_with_shirone.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 左邊設備資訊｜`src/app/MachineCard/`｜`MainLayout.vue`、右側產耗、`GridCanvas`、供電樁｜paper（稿）、dernoson（合入） |

---

## 0. 白話目標

主裁：把白紙的左側設備視窗新稿做完。

先等 paper 的打得開連結，並跟他對過。沒有連結就停——不算未交。

你分支上若已有 `MachineCard` 修改，對完稿再收成一張 PR；不要繼續無 PR 堆積。

---

## 1. 做到這樣

- 只改稿上有變的那一塊。取貨口與一般設備分得開。
- 按鈕走 `MachineCard/Button.vue`，不要另畫一顆。
- **開 PR。** diff 沒有 `MainLayout.vue`。
- 稿對不上時先問 paper，不要自己選一版。

---

## 2. 不要做

- 沒有連結就先大改
- 改 `MainLayout.vue`（含 import）
- 改右側總覽、畫布、供電樁
- 順手重排整個 `MachineCard` 架構

---

## 3. DoD

- [ ] PR 畫面跟得上白紙連結
- [ ] 有開 PR（不是只推分支）
- [ ] diff 沒有 `MainLayout.vue`

未交，或稿沒到：左欄維持 master。不算你未交。
