# V22-C1 — 把底層結論寫進 POC

**對應工項：** V22-C1
**狀態：** `[x]` 已寫入大綱 v1.27（2026-11-22），隨 #94 合入 master（2026-11-23）
**日期：** 2026-11-22
**依賴：** B1 閘門通過
**正式依據：** [W1109-A0](../../../work_dispatch/aaaaa/1109/W1109-A0_poc_scope.md)
**開發分支：** `dev/aaaaa1109`

---

## 1. 啟用後要寫的句子

查證基準：`origin/master` `a02e069`。底層指 store 的 action 與測試。

| 項 | 底層 | 畫面 | POC |
|----|------|------|-----|
| 旋轉 | **已完成。** `layoutStore.rotateDevice`、`src/__tests__/store/layoutStore.rotation.test.ts` | **不記完成。** `LayoutView.vue` 已有快捷鍵呼叫，這週不另補按鈕 | **收底層** |
| 刪除 | **已完成。** `layoutStore.removeDevice`、`src/__tests__/store/layoutStore.test.ts` 內的 removeDevice 案例 | **不記完成。** `LayoutView.vue` 沒有呼叫 `removeDevice` | **收底層** |
| JSON | 檔案外殼仍未做 | 頂欄沒有 | **不收。** 大綱 v1.26 已寫明，啟用時只核對 |

舊的 `editorStore.removeDevices` 不拿來當這張工單的底層證據。工單點名的是 `layoutStore`。

---

## 2. 啟用後改哪些檔

| 檔 | 改什麼 |
|----|--------|
| `docs/roadmap/ROADMAP_OUTLINE.md` | 門檻相關句補上：旋轉與刪除的**底層**納入 POC；畫面不納入。JSON 那句保持移出 |
| `docs/roadmap/detail/B3_rotation_90.md` | 一行：底層已完成，畫面未完成。不要把 8 月的「未開始」留成唯一狀態 |
| `docs/roadmap/detail/B5_delete_single_device.md` | 一行：底層已完成，正式畫布未接。同上 |
| [W1109-A0](../../../work_dispatch/aaaaa/1109/W1109-A0_poc_scope.md) | DoD 三格改成實況 |

閘門通過之前，以上檔案都不改。

---

## 3. 不要做

- 補刪除呼叫、補旋轉按鈕
- 改 `layoutStore` 簽名
- 做 JSON 按鈕、警示、供電樁、左欄

---

## 4. DoD

- [x] 大綱同時看得到：兩項底層在 POC、畫面不在、JSON 不在
- [x] B3、B5 各有一句，不再只剩 8 月的狀態
- [x] 本步沒有改 `src/`。同分支另有 B1 的試玩 diff

---

## 5. 開發日誌

### 2026-11-22｜寫入大綱

- 負責人下令處理 C1。大綱改 v1.27，B3／B5 與工單 DoD 已改
- 不發解鎖句。沒有補畫面

### 2026-11-22｜句子定稿，不落地

- 負責人確認 POC 只收底層
- 因 V21 未收斂，本步不改大綱
