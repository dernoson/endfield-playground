# W1109-G1｜goodmorning｜供電樁拆成獨立元件並開 PR

| meta | value |
|------|-------|
| 週次 | 2026-11-09 → 2026-11-22 |
| 等級 | **確定**（11/08 會議；自報 **3–5h**） |
| 擋門檻 | 否。MBD 在等這張 |
| 上游 | [WEEK_20261109](../../WEEK_20261109.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | Storybook 裡看得到單獨的供電樁｜`src/editor/layout/shapes/Electric.vue`｜`DeviceShape.vue` 的整檔重畫、`GridCanvas`、右側產耗、左欄｜paper（審）、MBD（等你 push）、dernoson（合入） |

---

## 0. 白話目標

設備在畫面上的樣式，這兩週優先做一件：把供電樁從共用外形裡拆出來，變成自己的元件。

開 PR，請白紙看。MBD 要等這個檔出現在遠端，才開始畫它的樣式。

你若這週不在，先跟主編說一聲再停。沒說的話就照下面做。

---

## 1. 一步一步

1. 新檔放 `src/editor/layout/shapes/Electric.vue`。供電樁只走這個檔。
2. `DeviceShape.vue` 只留「供電樁改去叫 Electric」的必要幾行。不要整檔重畫。
3. 補一份 stories，Storybook 單獨看得到供電樁。
4. **開 PR**，說明裡 @ paper。分支從 `origin/master` 開。不要把另一套完整的 `DeviceShape.vue` 塞進同一張 PR。

`origin/GoodMorning` 上已有 Electric 的提交。可以沿用，但先對過 master，把和供電樁無關的 diff 拿掉再開 PR。

---

## 2. 不要做

- 重寫整份 `DeviceShape.vue`
- 改 `GridCanvas` 的互動
- 做供電樁的範圍虛線（MBD 的樣式在他的工單）
- 改左側面板、右側產耗

---

## 3. DoD

- [ ] PR 裡供電樁是 `Electric.vue`
- [ ] Storybook 開得到這個元件
- [ ] PR 上找得到 paper

未交：MBD 繼續等，不另做一套供電樁。
