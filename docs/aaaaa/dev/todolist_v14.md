# V14 TODOLIST — 落子前預檢＋C2 連線規則提前量（本週 aaaaa）

**版本：** V14
**建立日期：** 2026-09-27
**負責人：** aaaaa
**前置：** [V13 已結案](./todolist_v13.md)（PR [#51](https://github.com/dernoson/endfield-playground/pull/51) 於 2026-09-20 合入；文件收斂見 [V14-B1](./dev_v14/B1_v13_residue_close.md)；簽章草案見 [V13-D1 §3](./dev_v13/D1_placement_precheck_gap.md)）
**正式工單：** [W0921-A0](../../work_dispatch/aaaaa/0921/W0921-A0_placement_precheck.md)（確定・最優・擋門檻）
**次優工單：** [W0921-A1](../../work_dispatch/aaaaa/0921/W0921-A1_connect_rules.md)（次優・可超前・不擋門檻；**未交不算未交付**）
**上游：** [WEEK_20260921](../../work_dispatch/WEEK_20260921.md) v1.2、[ROADMAP_OUTLINE](../../roadmap/ROADMAP_OUTLINE.md) **v1.13**、[AGENT_WEEK_0921](../claude/AGENT_WEEK_0921.md)
**門檻週：** 2026-09-21 → 2026-09-27（**9/27＝M2 硬綁 B1**）
**開發分支：** `dev/aaaaa0921`
**狀態總覽：** **`[~]` 驗收通過、說明／演示齊；PR 待確認後開**（2026-09-27；A1／B1／C1／D1 `[x]`；E1 `[~]`）
**驗收指南：** [dev_v14/V14_acceptance_guide.md](./dev_v14/V14_acceptance_guide.md)
**證據／週報／用法：** [evidence/V14_dod.md](./dev_v14/evidence/V14_dod.md)、[V14_week_report.md](./dev_v14/V14_week_report.md)、[USAGE](./dev_v14/USAGE_l2_placement_and_connect.md)
**待確認問題：** [dispatch_private/0921/PENDING_DECISIONS_20260927.md](../collaborator_survey/dispatch_private/0921/PENDING_DECISIONS_20260927.md)

> 標記說明：`[ ]` 未開始 / `[~]` 進行中 / `[x]` 完成 / `[!]` 封鎖中（等待依賴）
>
> **範圍宣告：** 本版＝程式實作。主線 A0 提共用 `canPlaceDevice`／`canMoveDevice`；次優 A1 寫 `canConnect`。**不發新解鎖句**（點擊落子已於 9/23 放行）。
> **執行計畫：** 本檔＋`dev_v14/` **即為**本週 aaaaa 執行計畫檔。

---

## 概述

### 目標

1. **A0 落子前預檢：** 把 `layoutStore` 私有的 `collectLayoutIssues`／`assessInvolving` 提到 `placementCheck.ts`，匯出 `canPlaceDevice`／`canMoveDevice`；store 對外行為不變
2. **A1 連線規則（次優）：** 先提 `resolveConnections` 錨點共用，再寫 `canConnect`＋`describeConnectFailure`；**本週不做** `addPipeline` 內部防線
3. **不擋合入帶寬：** 不碰 toby／goodmorning／shirone／harry 的鎖檔；A0／A1 **分開 PR**
4. **不發解鎖句：** PR body 只宣告預檢可供 T1 呼叫

### 已定案（2026-09-27｜負責人確認）

| # | 項 | 結論 |
|---|----|------|
| 1 | 版本範圍 | **V14＝W0921-A0＋W0921-A1（次優）**；V13 只做殘項收斂 |
| 2 | A0 簽章 | 照 [V13-D1 §3](./dev_v13/D1_placement_precheck_gap.md)；回傳沿用 `PlacementResult`；`DRAFT_ID='__draft__'` |
| 3 | A0 作法 | **提共用、非另寫一份**；`layoutStore.test.ts` 未修改且全綠 |
| 4 | A0 交期 | **維持工單原文 9/24**（本檔為執行計畫；立刻開工） |
| 5 | A1 | 進 todolist 為正式次優項；A0 交完且有餘裕才開；未交＝回 10/04 |
| 6 | A1 本週不做 | `layoutStore.addPipeline` 內部防線；L2 呼叫端 |
| 7 | 解鎖句 | **不發** |
| 8 | 工廠／旋轉／選取 | 本週不做（WEEK §2.1） |
| 9 | 分支 | `dev/aaaaa0921` |

詳見 [A1_scope_decision.md](./dev_v14/A1_scope_decision.md)。

### 非目標（本版不做）

- 寫落子鏈 L2（toby T1）；改 `LayoutView`／`GridCanvas`／`usePlacementIntent`／`ToolbarPanel` 意圖層
- 改 `MainLayout.vue`、`editorStore` 簽名
- `createPlacedDevice` 工廠、`rotateDevice`、選取面、belt 佈線升格
- A1 的 `addPipeline` 內部防線（排 10/11）與 L2 highlight（toby／10/18）
- 環路偵測；另寫一份佔格或錨點判定
- 發解鎖句；放行選取／旋轉／刪除

### 流程大綱

```text
A 定案 → B V13 收斂（前置）
      → C1 A0 placementCheck（擋門檻）
      → D1 A1 connectRules（次優；A0 後）
      → E1 驗收＋PR＋交接
```

### 週切片

| 區間 | 切片 | 對應 |
|------|------|------|
| → 9/24 | 定案落檔；V13 收斂；A0 提共用＋測試＋PR | A1、B1、C1 |
| 9/24 後 | （有餘裕）A1 錨點共用＋`canConnect`；分開 PR | D1 |
| → 9/27 | 驗收回寫；門檻結算對照 | E1 |

> 工單原文：A0 交期 9/24，讓 T1 有三天可接。本檔開版日為 9/27，仍以該交期為計畫基準，立刻開工。

### 下游消費者（PR 必寫）

```text
下游消費者：
- R-B2／toby T1：呼叫 canPlaceDevice 做落子前預檢（與 addDevice 同一套 PlacementResult）
- R-C2（10/04）：若本版 A1 已交，10/04 改排 addPipeline 內部防線；未交則仍從錨點共用起做
- L2／L3：本版不改 editor／toolbar／MainLayout；對 #48、T1 零檔案衝突（不同檔）
```

### 交付宣告（本版不發解鎖句）

```text
本 PR 交付 canPlaceDevice／canMoveDevice（提共用，非另寫）。
layoutStore.test.ts 未改且全綠。不發解鎖句；選取／旋轉／刪除仍鎖。
```

---

## V14-A｜範圍與定案

- [x] **V14-A1** 9 項決策落版；與 W0921-A0／A1／V13／T1 邊界
  - 細項：[dev_v14/A1_scope_decision.md](./dev_v14/A1_scope_decision.md)

---

## V14-B｜V13 殘項收斂（前置）

- [x] **V14-B1** 交叉比對 #51 已合入；確認 V13 無程式殘刀；簽章草案仍為 A0 唯一依據；收斂 `dev_v13/` meta
  - 細項：[dev_v14/B1_v13_residue_close.md](./dev_v14/B1_v13_residue_close.md)

---

## V14-C｜落子前預檢（W0921-A0・擋門檻）

- [x] **V14-C1** `placementCheck.ts`：匯出 `canPlaceDevice`／`canMoveDevice`／`DRAFT_ID`／`DeviceDraft`／`LayoutView`；store 提共用；測試＋品質閘
  - 細項：[dev_v14/C1_placement_precheck.md](./dev_v14/C1_placement_precheck.md)
  - 產物：`src/utils/layout/placementCheck.ts`、`src/__tests__/utils/layout/placementCheck.test.ts`；重構 `layoutStore.ts`
  - 對照公開驗收：**V2**

---

## V14-D｜連線規則純函式（W0921-A1・次優）

- [x] **V14-D1** 錨點判定提共用 → `connectRules.ts`（`canConnect`＋`describeConnectFailure`）＋測試；**不動** `layoutStore`
  - 細項：[dev_v14/D1_connect_rules.md](./dev_v14/D1_connect_rules.md)
  - 產物：`portAnchorIndex.ts`、`portMedia.ts`、`connectRules.ts`、測試；重構 `resolveConnections.ts`／`useFlowEngine.ts`
  - 依賴：C1 已交；**與 C1 分開 commit**

---

## V14-E｜驗收、PR、交接

- [~] **V14-E1** 對照 W0921-A0／A1 DoD（程式已過）；說明／演示已寫；**PR 待確認後開**；0928 交接摘要草稿見 E1 §4
  - 細項：[dev_v14/E1_acceptance_and_handoff.md](./dev_v14/E1_acceptance_and_handoff.md)
  - 驗收：[dev_v14/V14_acceptance_guide.md](./dev_v14/V14_acceptance_guide.md)
  - 演示：`dev/placement-connect-check.html`

---

## 封鎖／待決追蹤

本版開發不被下列續掛項卡住（分級見 [PENDING_20260927](../collaborator_survey/dispatch_private/0921/PENDING_DECISIONS_20260927.md)）。

| ID | 原因 | 等待對象 | 阻擋本版？ | 何時決 |
|----|------|---------|-----------|--------|
| `historyStore` 分堆疊 | 佈局與舊藍圖共用單一堆疊 | 主編 | **否** | 0928 以後（原 C-3） |
| 選取面歸屬 | `selectionStore` vs `layoutStore` | 主編＋aaaaa | **否**；本週凍結 | B4 開工前 |
| `createPlacedDevice` 工廠 | 預設值長線；本週已定 label＝中文名、工廠不做 | paper＋aaaaa | **否** | 10 月 |
| belt 佈線升格 | 現住 dev-only | C3 owner | **否** | B2／C3 開刀時 |
| — | **不動** toby／goodmorning／harry／shirone 鎖檔；不發解鎖句 | — | — | 本版硬鎖 |

---

## 完成定義（Definition of Done）

### 主線（對照 [W0921-A0 §5](../../work_dispatch/aaaaa/0921/W0921-A0_placement_precheck.md)）

- [x] `placementCheck.ts` 匯出 `canPlaceDevice`／`canMoveDevice`／`DRAFT_ID`／`DeviceDraft`／`LayoutView`
- [x] `collectLayoutIssues`／`assessInvolving` 已**移出**（非複製）；`addDevice`／`moveDevice` 改呼叫共用版
- [x] `src/__tests__/store/layoutStore.test.ts` **未修改**且全綠
- [x] 新測試涵蓋：空地可放／重疊拒絕且 conflicts 含 `__draft__`／未知機型／非有限座標／移動原位可放
- [x] `canPlaceDevice` JSDoc 含效能門檻句（約 200 台）
- [x] 未 import `editorStore`、未改 `src/editor/*`
- [x] `pnpm type-check`／本檔 lint／format／相關 `test` 綠
- [ ] PR body 一行說明 `DRAFT_ID` 與 toby 如何從 conflicts 認出自己

### 次優（對照 [W0921-A1 §4](../../work_dispatch/aaaaa/0921/W0921-A1_connect_rules.md)）

- [x] 錨點展開／命中已提共用；`resolveConnections` 既有測試未修改且全綠
- [x] `canConnect` 回傳 discriminated union；`message` 不在 union 內
- [x] 規則 7（斷線放行）有專門測試
- [x] 媒質判定與 `useFlowEngine` 共用同一函式（`getMachinePortMedia`）
- [x] 與 A0 **分開 commit**；未動 `layoutStore.ts`
- [ ] PR 標題帶 `W0921-A1`（開 PR 時）

### 品質閘

- [ ] diff 不含選取／旋轉／刪除接線、不含 `editorStore` 簽名變更
- [ ] 主線 PR 標題帶 `W0921-A0`；次優帶 `W0921-A1`

---

## 未交頂替

| 工項 | 未交影響 |
|------|----------|
| C1 A0 | T1 退為「放下去才知道」（直接 `addDevice`）；**V1 門檻仍可能成立**，但拖曳體驗降級，且 L2 有動機自算重疊——寧可早交 |
| D1 A1 | 回到原排 10/04，**零影響** |
| B1 V13 收斂 | **不可未交**；未收斂則簽章依據不明 |

---

## 本週工項檢核（對照 W0921-A0／A1）

| 工項 | 工單要求 | V14 狀態 | 備註 |
|------|----------|----------|------|
| A0 | `canPlaceDevice` 提共用＋測試 | `[x]` | 擋門檻；公開 V2；待開 PR |
| A1 | `canConnect`＋錨點共用 | `[x]` | 次優；程式已達；待開 PR |

---

## 開發日誌

### 2026-09-27｜E1 驗收＋說明（PR 暫緩）

- **驗收通過：** type-check／lint／847 tests；DoD 證據見 `evidence/V14_dod.md`
- **說明文件：** 週報、USAGE、INTRO；演示頁 `/dev/placement-connect-check.html`
- **PR 不開**直到負責人確認；建議 A0（＋演示）與 A1 分開

### 2026-09-27｜D1 完成

- **V14-D1 完成：** `canConnect`＋錨點／媒質共用；`resolveConnections.test.ts`／`layoutStore.ts` 未改
- 下一刀＝E1／開 PR（A0 與 A1 宜分開 PR）

### 2026-09-27｜C1 完成

- **V14-C1 完成：** `placementCheck.ts` 提共用；`layoutStore.test.ts` 未改且全綠；新測 6 條
- 公開 V2 程式條件已達；剩 PR 宣告（`DRAFT_ID='__draft__'`）
- **下一刀選項：** D1（A1 次優，有餘裕）或 E1／開 PR

### 2026-09-27｜B1 完成；開工指向 C1

- **V14-B1 完成：** #51 合入查證、零 `src/` 殘刀、簽章單一來源＝V13-D1 §3；`dev_v13/` meta／todolist_v13 指向已收斂
- **V14-A1 完成：** 九項決策與負責人確認一致
- **下一刀＝C1（A0）**；前置成立，可開 `dev/aaaaa0921` 實作 `placementCheck.ts`
- CLAUDE／AGENT_ROADMAP／README 已知過期，本次不動（見 B1 §3）

### 2026-09-27｜開版

- 依 WEEK v1.2、W0921-A0／A1、負責人確認（執行計畫時態／REVIEW 結算風格／不發解鎖句）開 V14
- 簽章唯一依據＝[V13-D1 §3](./dev_v13/D1_placement_precheck_gap.md)；本版不重寫簽章以免漂移
- A1 進 todolist 為正式次優項；與 A0 分開 PR、不動 `layoutStore`
- 現況盤點（`origin/master`）：`placementCheck.ts`／`connectRules.ts` 皆不存在；S1 #53 已合；#48 仍掛；T1 未見 PR
