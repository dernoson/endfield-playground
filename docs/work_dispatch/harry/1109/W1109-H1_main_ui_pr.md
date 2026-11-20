# W1109-H1｜harry｜主畫面 UI 收到已過審的 PR

| meta | value |
|------|-------|
| 週次 | 2026-11-09 → 2026-11-22 |
| 等級 | **確定**（11/08 會議；自報 **3–5h**） |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261109](../../WEEK_20261109.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 主畫面裡白紙已過的那一版｜已合的 [#89](https://github.com/dernoson/endfield-playground/pull/89)、[#90](https://github.com/dernoson/endfield-playground/pull/90)｜右側產耗、`GridCanvas`、供電樁、左欄新稿｜dernoson（若還有未開的 PR） |

---

## 0. 白話目標

會議要你把主畫面 UI 開成 PR。白紙已經過審。剩下的修改等下次，這兩週不要做。

開會之後，工具列（#89）和機器卡（#90）已在 11/09 合進 master。若你手上沒有另一塊「白紙已過、卻還沒開 PR」的主畫面 diff，這張工單就到這裡。

---

## 1. 必做

1. 對一下：白紙點頭的主畫面，是不是都已經在 #89 或 #90。
2. 若還有一塊已過審、尚未開 PR 的 diff，只開那張 PR，不要順便改。
3. 在 PR 或 Discord 留一句：哪些已交、哪些留到下次。

---

## 2. 不要做

- 繼續加 [#88](https://github.com/dernoson/endfield-playground/pull/88)。右側產耗與警示是 toby
- 改工具列、機器卡上「下次再改」的部分
- 改 `GridCanvas`、供電樁、`MachineCard` 的新稿

---

## 3. DoD

- [ ] 已過審的主畫面有 PR（#89／#90 已算）
- [ ] 這兩週的 diff 沒有會議說要留下次的修改

未交：主畫面停在 #89／#90，不追加。
