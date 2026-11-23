# W1123-H1｜harry｜設備外形＋供電樁接到正式畫布

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **確定**（11/22 主裁；自報 **≤2h**） |
| 擋門檻 | 否。但畫布仍方塊會讓 11/29 演示難看 |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[#92](https://github.com/dernoson/endfield-playground/pull/92)、[#93](https://github.com/dernoson/endfield-playground/pull/93) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 正式畫布上的設備長相｜`GridCanvas.vue`（改掛 shapes）、必要時 `LayoutView.vue` 傳 props｜`DeviceShape.vue`／`Electric.vue` 本體重畫、`MachineCard`、右側產耗、`MainLayout.vue`｜goodmorning／MBD（shapes 契約）、dernoson（合入） |

---

## 0. 白話目標

主裁：把 morning 跟 MBD 做的設備＋供電樁接進畫面。

`DeviceShape.vue` 與 `Electric.vue` 已在 master，但只出現在 Storybook。正式 `GridCanvas.vue` 仍用 `<rect>` 方塊畫設備。你這週做**接線**：讓擺上去的設備走既有 L3。

時數 ≤2h：只做最小可看版本，不重寫拖曳／埠命中。

---

## 1. 必做

1. 在 `GridCanvas`（或它上層已有的 SVG 結構）把「一般設備」改成渲染 `DeviceShape`；供電樁機型走既有 `Electric` 分流（shapes 裡已有）。
2. 選取／拖曳狀態若 L3 已有 props，對上現有選取資料；對不上就先用預設，不要為了完美改 store。
3. 埠熱區、連線、出界紅框等**既有互動保留**。不要為了好看拆掉命中。
4. 開一張 PR。說明寫：接上 #92／#93，未改 L3 外形本體。

---

## 2. 不要做

- 重畫 `DeviceShape.vue`／`Electric.vue`
- 改右側產耗、`MachineCard`、工具列大改
- 改 `MainLayout.vue`
- 補刪除按鈕或旋轉按鈕（畫面仍不派）

---

## 3. DoD

- [ ] 正式頁至少看得到一台一般設備用新外形
- [ ] 供電樁看得到圓形／電力圖示路徑（走 `Electric`）
- [ ] diff 沒有整份重寫 shapes 本體

未交：畫布繼續方塊。不換人在這週接手 L3 外形。
