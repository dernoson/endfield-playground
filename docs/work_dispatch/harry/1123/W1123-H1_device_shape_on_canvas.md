# W1123-H1｜harry｜一般設備改掛 DeviceShape（只做一處）

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **確定**（11/22 主裁；**11/24 主裁裁：本週可用時間少、範圍過大 → 縮為一處**） |
| 時數 | **≤2h** |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[#92](https://github.com/dernoson/endfield-playground/pull/92) |
| 陪做 | **toby**（11/24 主裁指定：看 `GridCanvas` 接線與對位，不擴第二套邏輯） |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 正式畫布上一般設備的外形（只換這一處）｜`src/editor/layout/GridCanvas.vue` 的**設備繪製區段**（約第 311–340 行，`v-for="device in renderedDevices"` 內、逐格 `<rect v-for="cell in deviceCells.get(device.id)">` 那一段）｜埠命中、拖曳、連線、基地框、警示、`Electric.vue`、`DeviceShape.vue` 本體、`MainLayout.vue`｜toby（對位）、dernoson（合入） |

---

## 0. 白話目標

主裁：你這週時間不多，把範圍縮到一處。

只做一件事：正式畫布上**一般設備**的方塊，換成已在 master 的 `DeviceShape`。供電樁不用你管，`DeviceShape` 內部已會分流給 `Electric`。

超過 2 小時、或對位不對，就寫停點，算有交代。

---

## 1. 必做（只這一段）

1. 在 `GridCanvas.vue` 設備繪製區段，對一般設備把逐格 `<rect>` 換成一個 `<DeviceShape>`（傳入 `machineType`、`width`、`height`、`gridSize`，其餘 props 留預設；`width`／`height` 為格數）。
2. 位置沿用原本 `device.position` 與 `cellSize` 的換算，不改公式。
3. 開 PR，說明只含這一段，並 @ toby。

---

## 2. 陪做（toby，≤1h）

- toby 先看你的 diff 對位（方塊對到格子、供電樁不被誤換）。
- 有問題在 PR review 或 Discord 寫一句，不必再開第二張 PR。

---

## 3. 不要做

- 改埠（`port`）繪製、命中、高亮
- 改拖曳、`deviceDragPreview`、基地框、出界紅框、`WarningIcon`
- 重寫 `DeviceShape.vue` 或 `Electric.vue`
- 改 `MainLayout.vue`、右側產耗、左欄

---

## 4. DoD

- [ ] 正式頁至少看得到一般設備用 `DeviceShape` 外形
- [ ] diff 只在 `GridCanvas.vue` 的設備區段
- [ ] 埠與拖曳行為不變

未交：畫布繼續方塊。寫一句停在哪即可；不換人接手。
