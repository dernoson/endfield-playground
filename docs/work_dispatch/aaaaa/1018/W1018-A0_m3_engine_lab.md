# W1018-A0｜aaaaa｜派工已發；M3 引擎讀驗收＋lab（≤2h）

| meta | value |
|------|-------|
| 週次 | 2026-10-18 → 2026-10-25 |
| 等級 | **確定・兩件**（流程＋ L1 驗收） |
| 擋門檻 | **是（C5 讀取鏈可演示）** |
| 上游 | [WEEK_20261018](../../WEEK_20261018.md)、[C5](../../../roadmap/detail/C5_source_primary_output.md) |
| 畫面｜交哪個檔｜不要碰｜卡住找誰 | 派工在 `docs/work_dispatch/`；驗收／lab 在 docs 或 `/dev`｜`GridCanvas`／`LayoutView`（toby）、`MainLayout`｜toby（C1）、dernoson（合入） |
| 時數上限 | **≤2h**（問卷：公司專案壓縮；負責人裁 **A＋B 皆交**） |
| 會議報告 | [INTRO_meeting_m3_engine_lab](./INTRO_meeting_m3_engine_lab.md) |
| 驗收說明 | [ACCEPTANCE_V2_c5_chain](./ACCEPTANCE_V2_c5_chain.md) |
| Lab 說明 | [LAB_l1_contract_guide](./LAB_l1_contract_guide.md) |
| 最後更新 | 2026-10-25 |

---

## 0. 白話目標

C5 **寫入（#72）**與**引擎讀／機型 id（#74）**已在 master。本週你不做新引擎大改，只做：

| # | 件 | 為什麼 |
|---|----|--------|
| ① | 派工已發（本檔＋WEEK＋各人工單） | M3 週發工 |
| ② | **A＋B 皆交：**（A）M3「源素材→拓樸／引擎可測」驗收說明；（B）L1 contract lab 合入／可開頁 | 門檻日證明讀取鏈；可視化與串接說明 |

**不做：** 正式頁源素材下拉、整包右側產耗、再寫長篇派工當第二主交付。

---

## 1. ② 驗收／lab

**A. 驗收步驟：** 見公開 [ACCEPTANCE_V2_c5_chain](./ACCEPTANCE_V2_c5_chain.md)（執行細項 [V18-C1](../../../aaaaa/dev/dev_v18/C1_m3_acceptance_steps.md)）。須寫清：

1. 如何放一台源設備並 `setDevicePrimaryOutput`
2. 如何經 `toTopology`／測試看到產出速率（對齊 #74）
3. 失敗時看哪裡

**B. Lab：** 碼在分支 `/dev/l1-contract-lab`；用途與各函式串接見 [LAB_l1_contract_guide](./LAB_l1_contract_guide.md)。開 PR → master **另裁**。

---

## 2. 不要做

- 改 `LayoutView`／`GridCanvas`（toby C1）
- 改 `editorStore` 簽名
- 擴大 V17 範圍、再開大包引擎重構

---

## 3. DoD

- [x] `WEEK_20261018` 與各人工單在分支
- [x] 會議報告／驗收說明／lab 指南在 `aaaaa/1018/`
- [x] ②A 驗收說明可跟做（ACCEPTANCE＋測試指令）
- [x] ②B lab 在分支可開（隨本週 PR 合入）
- [x] 會議／LAB 補埠幾何與 L2 `PortRef` 串接說明
- [x] 未改 C1 鎖檔
