# V14 收斂盤點 — 0921 公開工單 × 執行計畫（2026-09-27）

**分支：** `dev/aaaaa0921`
**對照：** [W0921-A0](../../../work_dispatch/aaaaa/0921/W0921-A0_placement_precheck.md)、[W0921-A1](../../../work_dispatch/aaaaa/0921/W0921-A1_connect_rules.md)、[todolist_v14](../todolist_v14.md)
**品質閘實跑：** `pnpm test` → **46 files／854 tests** 綠；`type-check` 綠
**結論一句：** **程式與驗收／說明文件已收斂；流程未閉（PR 未開 → master 未達公開 V2）。**

---

## 1. 公開工單對照

| 公項 | 等級 | 程式 DoD | 超額／偏離 | 公開狀態 |
|------|------|----------|------------|----------|
| **W0921-A0**（V2） | 確定・最優・擋門檻 | **齊**（`placementCheck`＋store 提共用；`layoutStore.test.ts` 未改） | 無 | **未合入**（無 PR） |
| **W0921-A1** | 次優・不擋門檻 | **齊**（錨點共用＋`canConnect`） | ①方向收成有序 output→input；②**提前** `addPipeline` 接 `canConnect`（工單原排 10/11） | **未合入**（無 PR） |

公開工單檔內 DoD 核取方塊**刻意未勾**——以合入／PR body 為準，避免文件超前 git。

---

## 2. V14 執行項狀態

| 項 | 狀態 | 備註 |
|----|------|------|
| A1 定案 | `[x]` | 決策 #6（本週不動 addPipeline）已被後續回報**覆寫**，見 §3 |
| B1 V13 收斂 | `[x]` | |
| C1 A0 | `[x]` | |
| D1 A1 | `[x]` | 含後續方向修正＋store 防線 |
| E1 驗收／說明／演示 | `[x]` | 證據／USAGE／週報／演示頁 |
| E1 開 PR／合入／上游回寫 | `[ ]` | **唯一阻擋「全版結案」的流程項** |

---

## 3. 待處理問題（須提出）

### P1｜開 PR（阻擋公開 V2）— 負責人確認後

- 程式已可交；先前指示「確認完成後再 PR」仍有效。
- **拆 PR 建議已過時：** 後期 `addPipeline`＋方向修正也動了 `layoutStore.ts`，與 A0 同檔。實務選項：
  - **建議：** 一支 PR，標題帶 `W0921-A0`＋`W0921-A1`，body 分兩節範圍宣告；或
  - 兩支 PR 但第二支 rebase 於第一支（合入序 A0→A1），成本較高。

### P2｜A1 工單「本週不做 addPipeline」已提前做完

- 原因：預覽可寫入非法管線（output→output 仍 `store=ok`），負責人要求 store 應擋。
- 影響：10/04 C2 切片**可少做**「addPipeline 內部防線」；PR／週會須明說是提前量，不是漏做。

### P3｜方向規則比 C2 改寫句更嚴

- 實作＝**有序** `from=output` 且 `to=input`（反向亦 `direction`）。
- C2 §4.1 改寫句只寫「同向拒絕」。PR 須一句對齊「回復原文必須 output→input」。

### P4｜門檻鏈仍缺 T1（非本版產物，但結算要講）

- 公開 **V1**＝toby 落子鏈；本分支不交。
- A0 合入前：T1 仍可「放下去才知道」，但禁止自算重疊。
- 見私密 [PENDING A-1／A-3](../../collaborator_survey/dispatch_private/0921/PENDING_DECISIONS_20260927.md)。

### P5｜合入後才做的上游回寫（E1 §3）

| 檔 | 動作 |
|----|------|
| ROADMAP detail/B2 | 開發日誌一句：L1 預檢已交 |
| ROADMAP_OUTLINE §9.1 | 門檻結算（主編／aaaaa） |
| 公開 W0921-A0／A1 DoD | 合入後勾選 |
| REVIEW／PENDING | 補「V14 程式已交、PR／合入狀態」一行 |

### P6｜不在本版、勿誤標完成

- 選取／旋轉／刪除；解鎖句；L2 `canConnect` highlight（10/18）；T1 落子鏈。

---

## 4. 0928 交接用一句

```text
V14 程式收斂：A0 placementCheck＋A1 canConnect（錨點／媒質共用；方向＝output→input；
addPipeline 已接 canConnect）。演示 /dev/placement-connect-check.html。
未開 PR → 公開 V2 未達。不發解鎖句。下游 toby 接 canPlaceDevice；conflicts 認 __draft__。
```

範圍宣告模板見 [E1 §2.1](./E1_acceptance_and_handoff.md)。
