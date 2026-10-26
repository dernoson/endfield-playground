# W1026-H1｜harry｜WarningIcon Storybook／props 對齊（獨立小件）

| meta | value |
|------|-------|
| 週次 | 2026-10-26 → 2026-11-01 |
| 等級 | **加分**（問卷下周 **3–5h**；會議未點名 → 給可收尾完整小塊） |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261026](../../WEEK_20261026.md)、MBD [#70](https://github.com/dernoson/endfield-playground/pull/70)／[#71](https://github.com/dernoson/endfield-playground/pull/71) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 警示 icon 展示｜`src/components/WarningIcon/*`（stories／必要 props）｜`GridCanvas`／`LayoutView`（toby #78）、`MainLayout`、store｜paper（稿）、dernoson（合入） |

---

## 0. 白話目標

上週暫停（期中）。本週有產能，但 **#78 仍鎖畫布**——你做**不碰畫布掛載**的完整小塊：

把已合入的 **WarningIcon** 在 Storybook 整理到「工程師一看就會用」（size／顏色／狀態），並與 paper 未連通警示稿對齊。

**不要**自己改 GridCanvas 掛上端點（#78 已含斷線警示路徑；掛載衝突留給合入後另派）。

---

## 1. 必做

1. 讀現有 `WarningIcon` 與 stories。
2. 補齊／整理 Storybook：至少一個預設態；有稿則對齊色與尺寸。
3. 開 PR（只動 icon／stories 目錄）。

---

## 2. 不要做

- 改 `LayoutView`／`GridCanvas`／`MainLayout`
- import Pinia／改 store
- 搶改 MBD `DeviceShape`

---

## 3. DoD

- [ ] Storybook 看得到清晰的 WarningIcon 用法
- [ ] 未改 #78 鎖檔
- [ ] 有 PR
