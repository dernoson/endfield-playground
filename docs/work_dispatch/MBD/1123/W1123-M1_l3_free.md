# W1123-M1｜MBD｜L3 自由人（一塊）

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **加分**（11/22 主裁；自報 **≤2h**、**時間不穩**） |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[#93](https://github.com/dernoson/endfield-playground/pull/93)、[W1109-G1](../../goodmorning/1109/W1109-G1_power_pole.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 供電樁外形增量｜`Electric.vue`（必要時 stories）｜`DeviceShape.vue` 整檔、`GridCanvas`、`MachineCard`｜paper（若跟稿）、dernoson |

---

## 0. 白話目標

主裁：L3 自由人。白紙有改到供電樁就跟著改；否則做指定的那一塊還沒弄完的 UI。

上週 #93 已合。上上週工單曾把「供電樁範圍虛線」留給樣式側——這週就做這一塊，可中斷。

---

## 1. 這週派給你的一塊

**預設：**

在 `Electric.vue` 加上**供電範圍虛線外框**（選取或供電狀態看得到一圈虛線）。Storybook 能單獨演示。不要另做一套供電樁檔。

**若白紙這週改了供電樁稿：** 改跟稿，並註明幀。

時間不穩：做不完就 push 現況＋Discord 一句停在哪，算有交代。

---

## 2. 不要做

- 改 `GridCanvas`（harry）
- 改 `DeviceShape.vue` 整檔（goodmorning 的狀態樣式區）
- 改 `MachineCard`、右側產耗
- 檔案還沒想清楚就開第二套元件

---

## 3. DoD

- [ ] 有提交／PR，或 Discord 寫停在哪
- [ ] diff 以 `Electric.vue`（＋其 stories）為主

未交：不擋門檻。供電樁維持 #93 長相。
