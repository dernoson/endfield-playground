# V14 收斂盤點 — 0921 公開工單 × 執行計畫（2026-09-27）

**分支：** `dev/aaaaa0921`
**對照：** [W0921-A0](../../../work_dispatch/aaaaa/0921/W0921-A0_placement_precheck.md)、[W0921-A1](../../../work_dispatch/aaaaa/0921/W0921-A1_connect_rules.md)、[todolist_v14](../todolist_v14.md)
**品質閘實跑：** `pnpm test` → **46 files／854 tests** 綠；`type-check` 綠
**結論一句：** **程式與驗收／說明文件已收斂；負責人已確認開 PR（單 PR、body 分 A0／A1 兩節）。**

---

## 1. 公開工單對照

| 公項 | 等級 | 程式 DoD | 超額／偏離 | 公開狀態 |
|------|------|----------|------------|----------|
| **W0921-A0**（V2） | 確定・最優・擋門檻 | **齊**（`placementCheck`＋store 提共用；`layoutStore.test.ts` 未改） | 無 | **PR 交審**（見 E1） |
| **W0921-A1** | 次優・不擋門檻 | **齊**（錨點共用＋`canConnect`） | ①方向＝有序 output→input；②**提前** `addPipeline`←`canConnect` | **同 PR 第二節** |

公開工單 DoD 核取方塊**合入後再勾**。

---

## 2. V14 執行項狀態

| 項 | 狀態 | 備註 |
|----|------|------|
| A1 定案 | `[x]` | 決策 #6 已被防線提前覆寫，見 §3 P2 |
| B1 V13 收斂 | `[x]` | |
| C1 A0 | `[x]` | |
| D1 A1 | `[x]` | 含方向修正＋store 防線 |
| E1 驗收／說明／演示 | `[x]` | |
| E1 開 PR | `[x]`／開出後填編號 | **定案：單 PR 分節**（2026-09-27 負責人確認） |
| E1 合入／上游回寫 | `[ ]` | 合入後做 P5 |

---

## 3. 待處理問題

### P1｜開 PR — **已定案（進行中）**

- 負責人確認開 PR。
- **採單 PR**：標題含 `W0921-A0`＋`W0921-A1`；body 分兩節（[E1 §2.1](./E1_acceptance_and_handoff.md)）。
- 理由：`layoutStore.ts` 同時含 A0 提共用與 A1 `addPipeline` 防線。

### P2｜A1「本週不做 addPipeline」已提前做完

- 預覽曾可寫入非法管線；store 已擋。
- 10/04 可少做該防線；PR body 明寫提前量。

### P3｜方向比 C2 改寫句更嚴

- 實作＝有序 `output → input`。PR 對齊「回復原文必須 output→input」。

### P4｜門檻鏈仍缺 T1（非本版）

- 公開 V1＝toby；本 PR 不交落子鏈。

### P5｜合入後上游回寫（仍開）

| 檔 | 動作 |
|----|------|
| ROADMAP detail/B2 | 開發日誌：L1 預檢已交 |
| ROADMAP_OUTLINE §9.1 | 門檻結算 |
| 公開 W0921-A0／A1 DoD | 勾選 |
| REVIEW／PENDING | 補合入狀態 |

### P6｜不在本版

- 選取／旋轉／刪除；解鎖句；L2 highlight（10/18）；T1。

---

## 4. 0928 交接用一句

```text
V14：A0 placementCheck＋A1 canConnect（錨點／媒質共用；方向＝output→input；
addPipeline 已接 canConnect）。單 PR 分節交審。不發解鎖句。
toby 接 canPlaceDevice；conflicts 認 __draft__。
```
