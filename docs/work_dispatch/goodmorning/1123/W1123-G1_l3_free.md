# W1123-G1｜goodmorning｜L3 自由人（一塊）

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **加分**（11/22 主裁；自報 **≤2h**） |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[#92](https://github.com/dernoson/endfield-playground/pull/92) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | Storybook／元件外形｜見 §1｜`GridCanvas`、右側產耗、`MachineCard`、`MainLayout`｜paper（若跟稿）、dernoson |

---

## 0. 白話目標

主裁：L3 自由人。白紙有改到你負責的外形就跟著改；否則做下面指定的那一塊還沒弄完的 UI。

上週 #92 已合。這週不要再開整份 `DeviceShape`。harry 會把 shapes 接上畫布——你只動 L3 本體樣式。

---

## 1. 這週派給你的一塊

**預設（白紙沒有另指外形稿時）：**

`DeviceShape.vue` 的**選取／未供電（unpowered）**外觀，對齊 Storybook 可演示的狀態。只改樣式與既有 props，不改互動契約。

**若白紙這週改了設備外形稿：** 改跟稿那幾行，並在 PR／Discord 寫「跟白紙哪一幀」。

不要跟 MBD 搶 `Electric.vue` 的範圍虛線——那是他的塊。

---

## 2. 不要做

- 改 `GridCanvas`（那是 harry）
- 改 `MachineCard`（那是 shirone）
- 改右側產耗
- 整檔重寫 `DeviceShape`

---

## 3. DoD

- [ ] 有 PR，或 Discord 寫「這週跟稿／停在哪」
- [ ] 只動你這一塊；沒有 `GridCanvas`／`MachineCard` diff

未交：不擋門檻。harry 仍可用現有 shapes 接畫布。
