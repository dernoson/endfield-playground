# V15-E1 — 驗收、PR、交接

**對應工項：** V15-E1
**狀態：** `[~]` 驗收通過；PR 已開（合入後回寫仍待）
**日期：** 2026-10-10
**依賴：** [C1](./C1_devices_outside_base.md) `[x]`、[D1](./D1_port_hit_test.md) `[x]`
**正式依據：** [W1004-A0 §5](../../../work_dispatch/aaaaa/1004/W1004-A0_dispatch_and_e003.md)、[WEEK §0.2 V10](../../../work_dispatch/WEEK_20261004.md)

---

## 1. 驗收結果（2026-10-10 實跑）

| # | 步驟 | 預期 | 結果 |
|---|------|------|------|
| 1 | `pnpm test` | 綠 | **49 files／906 tests 通過** |
| 2 | `pnpm type-check` | 綠 | **通過**（首跑抓到 `portHitTest.ts` 漏 import `PortMedia`，已修） |
| 3 | `pnpm lint-check` | 綠 | **通過** |
| 4 | `pnpm format-check` | 綠 | **通過** |
| 5 | diff 不含鎖檔 | `GridCanvas`／`MainLayout`／`ToolbarPanel`／detectors／TopBarButton 零命中 | **通過**（`src/` 只新增 `devicesOutsideBase`／`portHitTest` 兩支＋測試） |
| 6 | 未改 `canPlaceDevice` | `placementCheck.ts`／`layoutStore.ts` 無 diff | **通過** |
| 7 | 公開 V10 | ②③ 皆有測試 | **達成（分支）**；合入後才算 master 達成 |

---

## 2. PR

| 項 | 內容 |
|----|------|
| PR | [#60](https://github.com/dernoson/endfield-playground/pull/60) |
| 標題 | `W1004-A0：devicesOutsideBase＋hitTestPortAt（V15）` |
| 分支 | `dev/aaaaa1004` → `master` |
| Commit | ①文件（V15 開版＋V14 收斂＋C1／A0 用詞回寫）②`devicesOutsideBase` ③`hitTestPortAt` |
| 合入序 | **不排換殼序**（WEEK：A0 送來就審） |
| 解鎖句 | **不發** |

---

## 3. 交接產物

| 產物 | 對象 | 一句話 |
|------|------|--------|
| `devicesOutsideBase(devices, baseRegion)` | toby T1 | 回傳 id 上 Error 樣；`null` 基地回 `[]`；不擋落子 |
| `hitTestPortAt(gridPoint, devices)` | 10/11 C1 L2 | 格點輸入、熱區 0.5 格；回傳 `PortRef`＋side＋media；放開仍走 `canConnect` |

口頭節奏：[INTRO](../../collaborator_survey/dispatch_private/1004/INTRO_A0_devices_outside_and_port_hit.md)

---

## 4. 合入後回寫

- [ ] todolist_v15 → 結案
- [ ] AGENT_WEEK_1004 §0／§4
- [ ] 決策層 REVIEW／PENDING 日誌一行
- [ ] WEEK V10 勾選（主編／結算時）

---

## 5. DoD

- [x] §1 驗收表通過
- [x] PR 已開
- [x] 下游一句話寫進 PR body

---

## 6. 開發日誌

### 2026-10-10｜驗收＋開 PR

- 品質閘四項全綠；type-check 修一處漏 import
- 三 commit；PR 開至 master

### 2026-10-10

- 建檔
