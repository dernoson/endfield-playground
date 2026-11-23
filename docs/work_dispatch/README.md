# 每週派工（work_dispatch）

| meta | value |
|------|-------|
| version | **v3.25（2026-11-23；發出 W1123／M4 週）** |
| 本週區間 | **2026-11-23 → 2026-11-29**（[WEEK_20261123](./WEEK_20261123.md) **v1.0**） |
| 上週區間 | 2026-11-09 → 2026-11-22（[WEEK_20261109](./WEEK_20261109.md) **v1.1**；已結算） |
| 上游 | [ROADMAP_OUTLINE](../roadmap/ROADMAP_OUTLINE.md) **v1.28** |

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
| [toby](./toby/1123/) | [T1](./toby/1123/W1123-T1_merge_pr84.md) | 把 #84 合進 master |
| [harry](./harry/1123/) | [H1](./harry/1123/W1123-H1_device_shape_on_canvas.md) | 設備＋供電樁接到正式畫布 |
| [paper](./paper/1123/) | [P1](./paper/1123/W1123-P1_left_panel_with_shirone.md) | 跟 shirone 對完左欄稿 |
| [shirone](./shirone/1123/) | [S1](./shirone/1123/W1123-S1_machine_card_new.md) | 照新稿做完左側設備視窗 |
| [goodmorning](./goodmorning/1123/) | [G1](./goodmorning/1123/W1123-G1_l3_free.md) | L3 一塊（選取／未供電或跟稿） |
| [MBD](./MBD/1123/) | [M1](./MBD/1123/W1123-M1_l3_free.md) | L3 一塊（供電範圍虛線或跟稿） |
| [azure9572](./azure9572/1123/) | [Z1](./azure9572/1123/W1123-Z1_blueprint_then_l1.md) | 先收 #95，再視情況非首要 L1 |
| [aaaaa](./aaaaa/1123/) | [A0](./aaaaa/1123/W1123-A0_d5_rehearsal.md) | D5 劇本對齊現行 POC |
| [dernoson](./dernoson/1123/) | [D0](./dernoson/1123/W1123-D0_gate.md) | 守閘；#84 優先 |
| [casey](./casey/README.md) | — | **已退出，不再派工** |

上週工單在各人的 `1109/`。

---

## 1. 定案摘要（全員）

1. **M4＝11/29。** 門檻句＝右側產耗＋警訊；旋轉／刪除只收底層；JSON 不進 POC
2. **toby** 先合 #84，不要第二套右側
3. **harry** 把已合的 `DeviceShape`／`Electric` 接到 `GridCanvas`
4. **paper ↔ shirone** 對完左側設備視窗（先連結再改碼）
5. **goodmorning／MBD** 各一塊 L3；不擋門檻
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
| WEEK_20261123 | **v1.0** |
| ROADMAP_OUTLINE | **v1.28** |
