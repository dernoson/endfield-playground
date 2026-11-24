# W1123-M1｜MBD｜L3 自由人：供電樁外形核對（Electric.vue）

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **加分**（11/22 主裁；**11/24 主裁裁：供電範圍虛線已實作完成，本週改為核對，不另寫新元件**） |
| 時數 | **≤1h** |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[#93](https://github.com/dernoson/endfield-playground/pull/93)、[W1109-G1](../../goodmorning/1109/W1109-G1_power_pole.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 供電樁外形核對（12×12 虛線、選取色、拖曳透明度）｜`src/editor/layout/shapes/Electric.vue`（僅在不符時改）、`Electric.stories.ts`｜`DeviceShape.vue`、`GridCanvas`、`MachineCard`、右側產耗｜paper（若白紙有新稿）、dernoson |

---

## 0. 白話目標

主裁（11/24）：供電範圍虛線看起來已完成。這週你只做**核對**：

- master 上 `Electric.vue` 的 12×12 虛線、選取色、拖曳淡化是否與白紙的供電樁稿一致。
- 若一致，回報「不需改」即完成。
- 若不一致，才改 `Electric.vue`（與其 stories）。

不再派「新做虛線」這件事。

---

## 1. 這週派給你的一塊

1. 對照 `src/editor/layout/shapes/Electric.vue` 與 `Electric.stories.ts`，確認：虛線、選取色、拖曳不透明度。
2. 若白紙這週有供電樁稿，對照該幀。
3. 有差就改 `Electric.vue`，PR 寫「對白紙哪一幀」；沒差就在 Discord 寫「核對過，不需改」。

---

## 2. 不要做

- 改 `DeviceShape.vue`（goodmorning 那段已改派，本週不碰）
- 改 `GridCanvas`（harry）
- 改 `MachineCard`、右側產耗
- 另開供電樁新元件或新檔

---

## 3. DoD

- [ ] 在 Discord 或 PR 留一句「核對結果：不需改／已改（哪一點）」
- [ ] diff 若有，只在 `Electric.vue` 與其 stories

未交：不擋門檻。供電樁維持 #93 的長相。
