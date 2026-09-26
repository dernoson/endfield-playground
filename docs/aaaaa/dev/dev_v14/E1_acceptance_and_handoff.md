# V14-E1 — 驗收、PR、0928 交接

**對應工項：** V14-E1
**狀態：** `[ ]` 未開始
**日期：** 2026-09-27
**依賴：** [C1](./C1_placement_precheck.md)；[D1](./D1_connect_rules.md) 若開工則一併
**驗收集：** [V14_acceptance_guide.md](./V14_acceptance_guide.md)

---

## 1. 目標

個人與 review_gate 可依同一清單過關；PR body 講清楚這是 **L1 預檢提共用**，不是再解一層互動。

---

## 2. 本版不發解鎖句

V11 發過 `layout-L1`，V12 發過 `layout-store`。**V14 不發。**

理由：點擊落子已於 9/23 放行；本版只交預檢純函式。選取／旋轉／刪除仍鎖（WEEK §2.1）。

### 2.1 PR body 用的範圍宣告（可複製）

**A0（主線）：**

```text
W0921-A0：canPlaceDevice／canMoveDevice（提共用，非另寫）。
layoutStore.test.ts 未改且全綠。DRAFT_ID='__draft__'。
不發解鎖句；選取／旋轉／刪除仍鎖。toby 可從 conflicts 用 __draft__ 認出預檢對象。
```

**A1（次優，若交）：**

```text
W0921-A1：canConnect＋describeConnectFailure；錨點判定與 resolveConnections 共用。
未動 layoutStore／addPipeline 防線（排 10/11）。與 A0 分開 PR。
```

### 2.2 禁止

- 寫成「擺放已完成」——完成的是預檢入口，落子鏈是 T1
- 暗示選取／旋轉／刪除已開
- 把 A1 與 A0 捆成同一 PR

---

## 3. 上游回寫清單

| # | 檔 | 動作 | 狀態 |
|---|----|------|------|
| 1 | [todolist_v14](../todolist_v14.md) | C1／D1／E1 狀態勾選 | `[ ]` |
| 2 | [ROADMAP detail/B2](../../../roadmap/detail/B2_placement_chain.md) | 若 A0 合入，補開發日誌一句（L1 預檢已交） | `[ ]` |
| 3 | [ROADMAP_OUTLINE](../../../roadmap/ROADMAP_OUTLINE.md) §9.1 | 9/27 門檻結算（主編／aaaaa；非本 PR 單獨完成） | 結算時 |
| 4 | 決策層 REVIEW／PENDING | 補交付一行 | `[ ]` |

---

## 4. 0928 交接摘要（PR body 或 Discord）

```text
0921 L1：
  - A0：placementCheck.ts（canPlaceDevice／canMoveDevice）；提共用；DRAFT_ID=__draft__
  - A1：若已交＝connectRules 提前量；未交＝10/04 從錨點共用起做
  - 不發解鎖句；選取仍鎖

下游：
  - toby：落子鏈呼叫 canPlaceDevice；勿自算 detectOverlaps
  - 10/04：C2 純函式門檻（視 A1 是否已交調整切片）
```

---

## 5. DoD

- [ ] C1 DoD 全勾（或未交頂替已寫進 REVIEW／結算）
- [ ] 若開 D1：其 DoD 全勾且分開 PR
- [ ] PR body 含 §2.1 範圍宣告
- [ ] 未發解鎖句
- [ ] todolist_v14 狀態已回寫

---

## 6. 開發日誌

### 2026-09-27

- 開版；固定不發解鎖句與 PR 宣告模板
