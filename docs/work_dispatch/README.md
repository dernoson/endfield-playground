# 每週派工（work_dispatch）

| meta | value |
|------|-------|
| version | **v3.26（2026-11-24；W1123 依主裁 11/24 修訂）** |
| 本週區間 | **2026-11-23 → 2026-11-29**（[WEEK_20261123](./WEEK_20261123.md) **v1.1**） |
| 上週區間 | 2026-11-09 → 2026-11-22（[WEEK_20261109](./WEEK_20261109.md) **v1.1**；已結算） |
| 上游 | [ROADMAP_OUTLINE](../roadmap/ROADMAP_OUTLINE.md) **v1.29** |

---

## 0. 先看這裡

| 你想知道 | 打開 |
|----------|------|
| **我這週要交什麼** | 下表 **1123** |
| 這週全隊／驗收 | [WEEK_20261123.md](./WEEK_20261123.md) |
| **檔案鎖** | [WEEK_20261123.md](./WEEK_20261123.md) §2.2 |
| L1 API／詞彙 | [`/dev/l1-contract-lab`](../aaaaa/dev/USAGE_l1_contract_lab.md)、[LAB 指南](./aaaaa/1018/LAB_l1_contract_guide.md) |

### 本週（11/23–11/29｜M4；11/22 主裁）

| code | 工單 | 一句話 |
|------|------|--------|
| [toby](./toby/1123/) | [T1](./toby/1123/W1123-T1_merge_pr84.md) | 合 #84（只修職責小問題）；陪 harry 看對位 |
| [harry](./harry/1123/) | [H1](./harry/1123/W1123-H1_device_shape_on_canvas.md) | 縮為一處：一般設備改掛 `DeviceShape` |
| [paper](./paper/1123/) | [P1](./paper/1123/W1123-P1_left_panel_with_shirone.md) | 左欄稿，與 shirone 群組合議 |
| [shirone](./shirone/1123/) | [S1](./shirone/1123/W1123-S1_machine_card_new.md) | 與 paper 合議後做左側設備視窗 |
| [goodmorning](./goodmorning/1123/) | [G1](./goodmorning/1123/W1123-G1_l3_free.md) | 改派：`PipelineShape` 擁塞外觀 |
| [MBD](./MBD/1123/) | [M1](./MBD/1123/W1123-M1_l3_free.md) | 改派：供電樁核對（虛線已在 master） |
| [azure9572](./azure9572/1123/) | [Z1](./azure9572/1123/W1123-Z1_blueprint_then_l1.md) | 先收 #95，再視情況非首要 L1 |
| [aaaaa](./aaaaa/1123/) | [A0](./aaaaa/1123/W1123-A0_d5_rehearsal.md) | D5 劇本對齊現行 POC |
| [dernoson](./dernoson/1123/) | [D0](./dernoson/1123/W1123-D0_gate.md) | 守閘；#84 優先 |
| [casey](./casey/README.md) | — | **已退出，不再派工** |

上週工單在各人的 `1109/`。

---

## 1. 定案摘要（全員）

1. **M4＝11/29。** 門檻句＝右側產耗＋警訊；旋轉／刪除只收底層；JSON 不進 POC
2. **toby** 先合 #84，不要第二套右側
3. **harry** 只接一般設備一處到 `GridCanvas`；**toby** 陪看對位
4. **paper ↔ shirone** 群組合議左側設備視窗；不以誰先交為前提
5. **goodmorning**：`PipelineShape` 擁塞；**MBD**：供電樁核對；不擋門檻
6. **azure** 先 #95；合了再談非首要 L1
7. **aaaaa** 更新 D5 勾選表；**dernoson** 守閘
8. **avery、casey** 不派工

---

## 2. 目錄

`1123/`＝本週（11/23–11/29）；`1109/`／`1102/`／…＝封存。

---

## 3. 本週狀態

| 檔 | 狀態 |
|----|------|
| WEEK_20261123 | **v1.1** |
| ROADMAP_OUTLINE | **v1.29** |
