# 每週派工（work_dispatch）

| meta | value |
|------|-------|
| version | **v3.23（2026-11-10；1109–1122 兩週派工）** |
| 本週區間 | **2026-11-09 → 2026-11-22**（[WEEK_20261109](./WEEK_20261109.md) **v1.0**；11/15 不開會） |
| 上週區間 | 2026-11-02 → 2026-11-08（[WEEK_20261102](./WEEK_20261102.md) **v1.3**） |
| 上游 | [ROADMAP_OUTLINE](../roadmap/ROADMAP_OUTLINE.md) **v1.26** |

---

## 0. 先看這裡

| 你想知道 | 打開 |
|----------|------|
| **我這週要交什麼** | 下表 **1109** |
| 這週全隊／驗收 | [WEEK_20261109.md](./WEEK_20261109.md) |
| **檔案鎖** | [WEEK_20261109.md](./WEEK_20261109.md) §2.2 |
| L1 API／詞彙 | [`/dev/l1-contract-lab`](../aaaaa/dev/USAGE_l1_contract_lab.md)、[LAB 指南](./aaaaa/1018/LAB_l1_contract_guide.md) |

### 本週期（11/09–11/22｜11/08 會議；11/15 不開會）

| code | 工單 | 一句話 |
|------|------|--------|
| [aaaaa](./aaaaa/1109/) | [A0](./aaaaa/1109/W1109-A0_poc_scope.md) | 確認刪除／旋轉底層；JSON 移出 POC |
| [harry](./harry/1109/) | [H1](./harry/1109/W1109-H1_main_ui_pr.md) | 主畫面 UI 收到已過審的 PR，其餘下次 |
| [paper](./paper/1109/) | [P1](./paper/1109/W1109-P1_pickup_panel.md) | 左欄與取貨口；按鈕要像按鈕 |
| [shirone](./shirone/1109/) | [S1](./shirone/1109/W1109-S1_machine_card.md) | 照稿改左邊設備資訊 |
| [goodmorning](./goodmorning/1109/) | [G1](./goodmorning/1109/W1109-G1_power_pole.md) | 供電樁拆成元件並開 PR |
| [MBD](./MBD/1109/) | [M1](./MBD/1109/W1109-M1_power_pole_style.md) | 等元件 push 後做供電樁樣式 |
| [toby](./toby/1109/) | [T1](./toby/1109/W1109-T1_pr84_and_alerts.md) | 11/16 起先收 #84，再接警示 |
| [azure9572](./azure9572/1109/) | [Z1](./azure9572/1109/W1109-Z1_blueprint_slice.md) | JSON 一小步，不進 POC |
| [dernoson](./dernoson/1109/) | [D0](./dernoson/1109/W1109-D0_gate.md) | 守閘 |
| [casey](./casey/README.md) | — | **已退出，不再派工** |

上週工單在各人的 `1102/`。

---

## 1. 定案摘要（全員）

1. **11/09–11/22 一次派兩週**，因為 11/15 週日會暫停
2. JSON 匯入匯出**不進 POC**。刪除與旋轉要等 aaaaa 確認底層
3. 供電樁：goodmorning 先拆 `Electric.vue` 並開 PR，MBD 再做樣式
4. 左欄：paper 交連結，shirone 再改 `MachineCard`
5. toby 11/15 前不開工；之後先 #84，再把警示接到右側與設備紅色
6. harry 的主畫面停在已過審的 #89／#90，剩下的修改等下次
7. **avery、casey 退出協作，不再派工**（[avery/README](./avery/README.md)、[casey/README](./casey/README.md)）

---

## 2. 目錄

`1109/`＝本週期（11/09–11/22）；`1102/`／`1026/`／`1018/`／…＝封存。

---

## 3. 本週狀態

| 檔 | 狀態 |
|----|------|
| WEEK_20261109 | **v1.0** |
| ROADMAP_OUTLINE | **v1.26** |
