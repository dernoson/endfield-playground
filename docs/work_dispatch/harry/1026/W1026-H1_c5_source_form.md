# W1026-H1｜harry｜正式頁源素材選擇（C5 左面板 L2）

| meta | value |
|------|-------|
| 週次 | 2026-10-26 → 2026-11-01 |
| 等級 | **加分**（問卷下周 **3–5h**；獨立 L2 一塊；不擋 #78） |
| 擋門檻 | 否（C5 寫入／引擎讀已合；本單＝正式頁表單欠帳） |
| 上游 | [WEEK_20261026](../../WEEK_20261026.md)、[C5](../../../roadmap/detail/C5_source_primary_output.md)、上週左面板 [W1011-H2](../1011/W1011-H2_left_panel_swap.md) |
| 已合依賴 | [#72](https://github.com/dernoson/endfield-playground/pull/72) `setDevicePrimaryOutput`；[#74](https://github.com/dernoson/endfield-playground/pull/74) 引擎讀；[#75](https://github.com/dernoson/endfield-playground/pull/75) `MachineCard` 掛載 |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 選中源設備時左側可選基礎材料｜`MainLayout`（或旁側薄 L2 控制檔）＋必要轉接｜`LayoutView`／`GridCanvas`（toby #78）、`MachineCard` **內部**、`shapes/*`、store **簽名**、右側產耗｜aaaaa（action／材料 API）、shirone（`MachineCard` props）、dernoson（合入） |
| 時數 | **3–5h**（動力窗口內收尾） |

---

## 0. 白話目標

L1 已經能寫、引擎也能讀——正式頁**還不能選**源設備要產什麼。你接上這段：

**選中一台源設備 → 左側出現材料下拉 → 呼叫 `layoutStore.setDevicePrimaryOutput` → 寫入成功。**

不碰畫布（#78 鎖）、不做右側產耗表、不改 WarningIcon／Storybook（那是 MBD 的 L3）。

契約可查 `/dev/l1-contract-lab`（有 `setDevicePrimaryOutput` 示範）。

---

## 1. 必做

1. **判斷源設備：** 選中的 `PlacedDevice` 若是源類（基礎材料輸出點／現有源機定義），才顯示設定區；非源＝不顯示。
2. **材料選項：** 用既有 `getAllMaterials`／`getMaterialForm`（或 lab／USAGE 寫的入口）列基礎材料；能依輸出埠 media 過濾就過濾（belt→solid；pipe→liquid／gas）。過濾做不到就先列基礎材料，PR 註明。
3. **寫入：** 選取時呼叫 `setDevicePrimaryOutput(uid, itemId)`；**不要**自己 mutate `device.primaryOutput`。速率省略（預設 30）。清除可選：選「無」→ `null`。
4. **掛哪：** 左側既有 `MachineCard` **旁邊或下方**加控制區即可。優先**不改** `MachineCard` 內部；若缺 prop 才 Discord 問 shirone，勿自己大改 L3。
5. 開 PR；可先寫短 PLAN（你的習慣）。

---

## 2. 不要做

- 改 `LayoutView`／`GridCanvas`／任何 `shapes/*`
- 新增或改 Pinia action **簽名**（只呼叫既有 `setDevicePrimaryOutput`）
- 改 `MachineCard` 內部樣式／結構（除非 shirone 同意的最小 prop）
- 速率輸入框、多產出、畫布上畫產出圖示
- 接右側 Stats／產耗數字（D1）
- WarningIcon／DeviceShape／Storybook（MBD）

---

## 3. DoD

- [ ] `pnpm dev`：選中源設備 → 左側可選材料 → 再查 store／lab 可見 `primaryOutput` 已寫
- [ ] 非源設備不出現該下拉
- [ ] 只呼叫高階 action；未直接改陣列
- [ ] 未改 #78 鎖檔
- [ ] 有 PR
