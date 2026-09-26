# V14 驗收指南 — aaaaa 本週交付（A0 落子前預檢＋A1 次優）

**週次：** 2026-09-21 → 2026-09-27
**負責人：** aaaaa
**最後更新：** 2026-09-27
**工單：** [W0921-A0](../../../work_dispatch/aaaaa/0921/W0921-A0_placement_precheck.md)、[W0921-A1](../../../work_dispatch/aaaaa/0921/W0921-A1_connect_rules.md)
**對照公開驗收：** [WEEK_20260921 §0.1](../../../work_dispatch/WEEK_20260921.md)（aaaaa＝**V2**）
**執行計畫：** [todolist_v14](../todolist_v14.md)＋本目錄

---

## 0. 交付總覽

| 工項 | 內容 | PR | 分支 |
|------|------|-----|------|
| A0 落子前預檢 | `canPlaceDevice`／`canMoveDevice` 提共用 | 待開 | `dev/aaaaa0921` |
| A1 連線規則（次優） | `canConnect`＋錨點共用 | 待開（分開） | 同上 |

**A1 不在 WEEK V1–V8 之列**——次優、不擋門檻。公開對應項只有 **V2**。

---

## 1. 這是程式 PR（非純文件）

| 項 | 值 |
|----|-----|
| 動到的目錄 | `src/utils/layout/`、`src/store/layoutStore.ts`、`src/__tests__/` |
| 要跑品質閘 | **是** |
| 解鎖句 | **無** |

---

## 2. C1 — A0 預檢（約 5 分鐘）

| 檢查 | 預期 |
|------|------|
| 檔案存在 | `src/utils/layout/placementCheck.ts` |
| 匯出 | `canPlaceDevice`／`canMoveDevice`／`DRAFT_ID`／`DeviceDraft`／`LayoutView` |
| `DRAFT_ID` | `'__draft__'`（字面釘死） |
| store | 私有檢查已移出；`addDevice`／`moveDevice` 呼叫共用版 |
| `git diff …/layoutStore.test.ts` | **空** |
| 新測試 | 空地／重疊含 draft／未知機型／非有限座標／移動原位 |
| JSDoc | 含約 200 台效能句 |
| `grep editorStore placementCheck.ts` | 零命中 |
| diff | 不含 `src/editor/*` |

### 手動對照 WEEK §0.2 A0

```text
pnpm type-check
pnpm test
git diff src/__tests__/store/layoutStore.test.ts
```

---

## 3. D1 — A1 連線規則（若交；約 5 分鐘）

| 檢查 | 預期 |
|------|------|
| 檔案 | `connectRules.ts`＋測試 |
| 順序證據 | `resolveConnections` 有提共用；既有測試未改且綠 |
| `canConnect` | discriminated union；無 `message` |
| 規則 7 | 斷線（null 端點）→ `ok: true` 有測 |
| `layoutStore.ts` | **不在本 PR diff** |
| 與 A0 | **不同 PR** |

未交：本節整段略過，不算 V14 主線失敗。

---

## 4. 品質閘

```text
pnpm type-check
pnpm lint-check
pnpm format-check
pnpm test
```

---

## 5. 公開驗收對照（門檻日快照）

以 `git`／`gh`／`origin/master` 為準；細節見 [REVIEW §3](../../collaborator_survey/dispatch_private/0921/REVIEW_20260921.md)。

| 公開項 | 對象 | 開版時實況（2026-09-27） |
|--------|------|--------------------------|
| V2 | aaaaa A0 | 未達（檔案與 PR 皆無）——本指南用於交付後複驗 |
| V1 | toby T1 | 未達（未見 PR） |
| V4 | shirone S1 | 已達（#53） |

---

## 6. 日誌

### 2026-09-27

- 開版；對齊 W0921-A0／A1 DoD 與 WEEK §0.2 速查
