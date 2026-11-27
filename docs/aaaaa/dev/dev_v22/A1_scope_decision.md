# V22-A1 — 範圍與定案

**對應工項：** V22-A1
**狀態：** `[x]` 範圍已寫（2026-11-22）。2026-11-28 起版本已結案（閘門隨 #94 通過）；下文「不啟用」為 11-22 當時裁示，不改寫
**日期：** 2026-11-22
**開發分支：** `dev/aaaaa1109`（自 `origin/master` `a02e069` 新開）
**正式依據：** [W1109-A0](../../../work_dispatch/aaaaa/1109/W1109-A0_poc_scope.md)、[WEEK_20261109](../../../work_dispatch/WEEK_20261109.md) v1.0、[todolist_v22](../todolist_v22.md)

> **執行計畫：** 本檔所屬之 `todolist_v22`＋`dev_v22/` **即為**本版 aaaaa 執行計畫檔。閘門未過，C1 不落地。

---

## 1. 背景

### 1.1 為什麼現在建 V22

公開工單 [W1109-A0](../../../work_dispatch/aaaaa/1109/W1109-A0_poc_scope.md) 要 aaaaa 確認刪除、旋轉的底層，並把做完的寫進 POC。JSON 移出 POC 已隨 [#91](https://github.com/dernoson/endfield-playground/pull/91) 進入大綱 v1.26。

負責人 2026-11-22 另定：V22 的啟用條件是 V21 收斂。現在只建文件。

### 1.2 為什麼不沿用 `dev/aaaaa1102`

該分支已由 #86 合入，遠端已不存在。本分支從當下的 `origin/master` 新開。

---

## 2. 最終決策（2026-11-22）

| # | 決策 | 落點 |
|---|------|------|
| A-1 | 版本狀態＝**`[!]` 封鎖**。D1 與 E1 未完成、未合入之前，不改大綱、不改 B3／B5、不改程式 | [B1](./B1_v21_residue_close.md) |
| A-2 | 旋轉底層＝**已完成**。證據：`layoutStore.rotateDevice`、`src/__tests__/store/layoutStore.rotation.test.ts`。`LayoutView.vue` 已用快捷鍵呼叫，這只證明 action 有被用到 | [C1](./C1_poc_bottom_layer.md) |
| A-3 | 刪除底層＝**已完成**。證據：`layoutStore.removeDevice`、`src/__tests__/store/layoutStore.test.ts`。`LayoutView.vue` 沒有呼叫它 | C1 |
| A-4 | POC **只收這兩項底層**。畫面都不記完成。這版不補按鈕、不補刪除呼叫 | C1 |
| A-5 | JSON 不在 POC。句子已在大綱。啟用時只核對，不重寫 | C1 |
| A-6 | `canConnect` 留在 V21-D1。本版不拿來補 | B1 |
| A-7 | 分支＝**`dev/aaaaa1109`**。解鎖句不發 | meta |
| A-8 | 時數＝公開每週 **≤2h**。啟用後也只寫結論，不補做 | W1109-A0 |

查證基準：`origin/master` **`a02e069`**（2026-11-21，#93）。

---

## 3. 與既有版本／工單邊界

| 對象 | 關係 |
|------|------|
| V21／#86 | 試玩 P0 已合。D1、E1 未完，所以本版不啟用 |
| W1109-A0 | 啟用後的唯一交付＝底層結論進 POC |
| 供電樁 #92／#93 | **零檔案交集** |
| #84／#88 右側 | **零檔案交集** |
| 左欄 | **零檔案交集** |

---

## 4. 非目標

見 [todolist_v22](../todolist_v22.md)「非目標」。

---

## 5. DoD（本細項）

- [x] 閘門未過寫明，並與 todolist 一致
- [x] 啟用後要寫的兩句底層結論已定
- [x] 畫面不納入 POC
- [x] 本步沒有改大綱、B3、B5、或任何程式

---

## 6. 開發日誌

### 2026-11-22｜建檔

- 對齊 `a02e069`
- 負責人確認封鎖，以及 POC 只收底層
