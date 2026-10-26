# W1026-M3｜MBD｜DeviceShape 收尾＋開 PR

| meta | value |
|------|-------|
| 週次 | 2026-10-26 → 2026-11-01 |
| 等級 | **確定**（上週進行中未交；問卷下周 **6–10h**） |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261026](../../WEEK_20261026.md)、上週 [W1018-M3](../1018/W1018-M3_device_shape.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 畫布設備外觀｜`src/editor/layout/shapes/DeviceShape.vue`＋`.stories.ts`｜`GridCanvas`／`LayoutView`（toby #78）、store、`src/data`、他人 shapes｜paper（稿）、toby（日後掛）、dernoson（合入） |

---

## 0. 白話目標

上週自報「進行中、本週交不出、有產出尚未交」——本週目標只有一件：**把 DeviceShape 做到可開 PR。**

不要改 GridCanvas（toby 鎖 #78）。掛上畫布等 #78 合入後另派。

工作／看病可中斷：最小可交＝靜態矩形＋機名＋Storybook＋PR。

---

## 1. 一步一步

1. 確認／補齊 `DeviceShape.vue`（根 `<g>`）。
2. props：`width`／`height`；可選 `label`、`dragging`（淺藍）。
3. `DeviceShape.stories.ts` 看得到。
4. **開 PR**（結算以 `gh` 為準——有碼無 PR 不算交）。

---

## 2. 不要做

- import store、讀 `src/data`
- 改 `GridCanvas`／`LayoutView`
- 改 `WarningIcon`（本週 harry）、頂欄 `Button/*`
- 與人共檔

---

## 3. DoD

- [ ] Storybook 看得到設備樣式
- [ ] 根 `<g>`；無 Pinia
- [ ] **有開出 PR**
