# W1123-G1｜goodmorning｜L3 自由人：管線擁塞外觀（PipelineShape）

| meta | value |
|------|-------|
| 週次 | 2026-11-23 → 2026-11-29 |
| 等級 | **加分**（11/22 主裁；**11/24 主裁裁：改派，原 `DeviceShape` 選取／未供電外觀已在 master，不重做**） |
| 時數 | **≤2h** |
| 擋門檻 | 否 |
| 上游 | [WEEK_20261123](../../WEEK_20261123.md)、[#92](https://github.com/dernoson/endfield-playground/pull/92)、[C3](../../../roadmap/detail/C3_pipeline_polyline_render.md)（congested 色表） |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 管線擁塞外觀（橘色調）｜`src/editor/layout/shapes/PipelineShape.vue` 與其 `PipelineShape.stories.ts`｜`GridCanvas`、`DeviceShape.vue`、`Electric.vue`、`MachineCard`、`MainLayout`、`pipelineTiles` 幾何｜shirone（PipelineShape 原作者）、dernoson |

---

## 0. 白話目標

主裁（11/24）：原本派給你的 `DeviceShape` 選取／未供電外觀，master 已有，不必再做。

這週改派：`PipelineShape` 目前**沒有任何狀態**，擁塞（`congested`）的橘色外觀還沒有。C3 細項已寫明 11 月要接上。你只做 L3 外觀，**引擎 `congestedEdges` 不接**（那是 D1 之後的 L2 工作）。

---

## 1. 這週派給你的一塊

1. `PipelineShape` 新增可選 prop：`congested?: boolean`（預設 `false`）。
2. `congested=true` 時，管線素材加**橘色調**（建議沿用 `Electric.vue` 的 `feFlood` 寫法，不改素材檔）。
3. `PipelineShape.stories.ts` 補一個「擁塞」story，能單獨演示。
4. `congested` 不改 `pipelineTiles` 的幾何、不改 `waypoints` 契約。

**不接線：** 本週不改 `GridCanvas` 傳入 `congested`，只讓 L3 能演示。

---

## 2. 不要做

- 改 `GridCanvas`（harry 那段）
- 改 `DeviceShape.vue`、`Electric.vue`
- 改 `MachineCard`、右側產耗
- 接 `congestedEdges` 引擎或 L2 計算
- 改 `pipelineTiles` 幾何

---

## 3. DoD

- [ ] `PipelineShape` 有 `congested` prop，預設行為不變
- [ ] `PipelineShape.stories.ts` 有擁塞 story
- [ ] 有 PR，或 Discord 寫停在哪
- [ ] diff 只在 `PipelineShape.vue` 與其 stories

未交：不擋門檻。管線維持正常外觀。
