# V21-D1 — P1：canConnect 可調參

**對應工項：** V21-D1
**狀態：** `[x]` 已在 `dev/aaaaa1109` 實作（2026-11-22）。**尚未合入 master**
**日期：** 2026-11-08（建檔）
**依賴：** [C1](./C1_tryout_shell_p0.md) `[x]`
**準則：** [A0 §2](./A0_tryout_panel_plan.md)
**開發分支（預定）：** 與 C1 同一線

---

## 1. 目標（牌 3 才做）

沿用 C1 試玩殼，加上 `canConnect`：

| 可調 | 情境 |
|------|------|
| 兩端錨點，或簡化 waypoints 三點；`media` | 合法 belt；端點錯位 |

失敗走既有 `describeConnectFailure`，文字要讀得懂。不把 `addPipeline` 表單化、不把 `resolveConnections` 做成全管線編輯器。

---

## 2. 技術約束

與 [C1 §2](./C1_tryout_shell_p0.md) 相同。若試玩會寫入 store，必須隔離 Pinia，沿 #79／V20 慣例。

---

## 3. 驗證標準（開工後）

- [x] `canConnect` 可調參（起點、終點、媒質）
- [x] 至少一則成功、一則失敗可讀（失敗句來自 `describeConnectFailure`）
- [x] 未改 L1 簽名

---

## 4. 開發日誌

### 2026-11-22｜接到試玩第三題

- 白名單加上 `canConnect`。快捷兩則：合法皮帶、終點斜走
- 測試見 `src/__tests__/app/dev/tryoutRun.test.ts`
- 合入 master 之前，V22 仍不啟用

### 2026-11-08｜C1 已交，本項仍空

- 試玩殼可沿用；`canConnect` 仍未做

### 2026-11-08｜建檔

- 開版時確認 **含本項，但是牌 3**；W1102 不做
