# V18-D1 — L1 contract lab 合入（W1018-A0 ②B）

**對應工項：** V18-D1
**狀態：** `[ ]` 未開始（開版建檔；與 C1 **皆交**）
**日期：** 2026-10-25
**依賴：** 無（分支已存在）
**正式工單：** [W1018-A0 §1](../../../work_dispatch/aaaaa/1018/W1018-A0_m3_engine_lab.md)
**來源分支：** `origin/dev/aaaaa1019-l1-lab`（相對 master 約＋3 commit：lab 頁＋router＋USAGE）
**開發分支（本週文件線）：** `dev/aaaaa1018`

> **與 C1 皆交：** 本項＝②B（必做）。驗收步驟見 [C1](./C1_m3_acceptance_steps.md)。**本輪開版文件先 commit，lab PR 另裁再開。**

---

## 1. 背景

`dev/aaaaa1019-l1-lab` 已含：

| 產物 | 路徑 |
|------|------|
| Lab 頁 | `src/app/dev/L1ContractLab.vue`＋`l1ContractLab/contractCatalog.ts` |
| 路由／導覽 | `src/router/index.ts`、`DevLayout.vue` |
| 用法 | `docs/aaaaa/dev/USAGE_l1_contract_lab.md` |

合入後可在 `/dev/l1-contract-lab` 演示 V14–V17 契約（含源產出鏈相關入口）。

---

## 2. 作法（若選 B）

1. 自 `origin/dev/aaaaa1019-l1-lab` 開／更新 PR → `master`（必要時先 rebase／merge master）
2. PR 寫明：W1018-A0 ②B；不發解鎖句；未改 C1 鎖檔
3. 合入後回寫本檔狀態與 [E1](./E1_acceptance_and_handoff.md)

**不做：** 正式頁掛 lab、改 LayoutView 互動、擴大 catalog 範圍超 2h。

---

## 3. DoD

- [ ] PR 已開（或已合）
- [ ] 品質閘綠（若有碼 diff）
- [ ] 未改 GridCanvas／LayoutView／MainLayout 業務邏輯
- [ ] 不發解鎖句

---

## 4. 開發日誌

### 2026-10-25

- 開版建檔；來源分支 tip 已核（USAGE＋lab 頁）
