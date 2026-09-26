# V14 週報 — 落子預檢＋連線規則（aaaaa｜0921）

**週次：** 2026-09-21 → 2026-09-27（M2 門檻週）
**負責人：** aaaaa
**分支：** `dev/aaaaa0921`
**狀態：** 程式驗收通過；**PR 待負責人確認後再開**（A0／A1 宜分開）
**撰寫：** 2026-09-27

---

## 1. 本週交什麼

| 工項 | 公開對應 | 產物 | 狀態 |
|------|----------|------|------|
| A0 落子前預檢 | WEEK **V2** | `placementCheck.ts`；store 提共用 | 程式 `[x]`；PR 待開 |
| A1 連線規則 | 次優（非 V1–V8） | `connectRules.ts`＋錨點／媒質共用 | 程式 `[x]`；PR 待開 |
| 週會演示 | — | `/dev/placement-connect-check.html` | `[x]` |

**不發解鎖句。** 點擊落子已於 9/23 放行；選取／旋轉／刪除仍鎖。

---

## 2. 為什麼重要（門檻句）

- **V2**：toby 落子鏈要問「這格放不放得下」——以前檢查鎖在 store 私有函式裡
- 若不交：L2 容易自算 `detectOverlaps` → 預覽綠、放下紅（與連線錨點各寫一份是同類錯）
- **V1（T1）** 仍可能「放下去才知道」過門檻，但體驗降級；預檢是正確性前置

A1 不擋門檻；提早交只是讓 10/04 少做錨點搬家。

---

## 3. 驗收摘要

詳見 [evidence/V14_dod.md](./evidence/V14_dod.md)、[V14_acceptance_guide](./V14_acceptance_guide.md)。

| 檢查 | 結果 |
|------|------|
| `pnpm type-check`／`test`（847） | 綠 |
| `layoutStore.test.ts`／`resolveConnections.test.ts` 未改 | 是 |
| `DRAFT_ID === '__draft__'` | 是 |
| 未碰 `src/editor/*`／`editorStore` | 是 |
| 演示頁獨立 HTML（不經 router） | 是 |

---

## 4. 週會怎麼講／怎麼看

| 資源 | 用途 |
|------|------|
| [INTRO 口頭稿](../../collaborator_survey/dispatch_private/0921/INTRO_A0_placement_precheck.md) | 3–5 分鐘節奏 |
| [USAGE](./USAGE_l2_placement_and_connect.md) | L2 接線範例 |
| 演示頁 | `pnpm dev` → `/dev/placement-connect-check.html` |

**收束句：** 這週 L1 是把「能不能放／能不能連」提出來給畫布用，且跟真寫入／真衍生用同一套答案；不解鎖選取，也不另發明判定。

---

## 5. 下游／下週

```text
toby T1：落子鏈呼叫 canPlaceDevice；conflicts 用 __draft__ 認預檢對象
10/04 C2：A1 已交 → 改排 addPipeline 內部防線；錨點共用已完成
0928：選取面歸屬等 PENDING 項仍不擋本版
```

PR 開法（確認後）：

1. **PR1** `W0921-A0`：placementCheck＋store＋演示頁（或演示可隨 A0）
2. **PR2** `W0921-A1`：connectRules＋portAnchorIndex＋portMedia＋resolveConnections／useFlowEngine

範圍宣告模板見 [E1 §2.1](./E1_acceptance_and_handoff.md)。
