# V23-B1 — V21／V22 結案核對

**對應工項：** V23-B1
**狀態：** `[x]` 已核對並回寫（2026-11-28）
**日期：** 2026-11-28
**依賴：** [todolist_v21](../todolist_v21.md)、[todolist_v22](../todolist_v22.md)
**目的：** 上一版的啟用條件是「D1、E1 皆完成且合入 master」。本檔記下當時怎麼查、查到什麼，並把兩版文件改成已收斂。
**開發分支：** `dev/aaaaa1123`

---

## 1. 收斂定義（沿用 V22）

兩條都要成立才算收斂：

1. V21-D1 與 V21-E1 皆 `[x]`
2. 該變更已合入 `origin/master`（PR MERGED；以 `git`／`gh` 為準）

---

## 2. 查證（2026-11-28，`origin/master` `0c72c9f`）

| # | 查什麼 | 預期 | 實況 | 判定 |
|---|--------|------|------|------|
| 1 | #94 | MERGED | MERGED，2026-11-23 13:00 UTC；標題「docs(v22): W1109 依項驗收與 POC 底層」 | 過 |
| 2 | `dev/aaaaa1109` 與 master | 為祖先 | `git merge-base --is-ancestor dev/aaaaa1109 master` 結果 0 | 過 |
| 3 | V21-D1 `canConnect` 試玩 | 在 master | `src/app/dev/l1ContractLab/tryoutRun.ts`、`TryoutPanel.vue`、`contractCatalog.ts` 在 master；`tryoutRun.test.ts` 在 master | 過 |
| 4 | 試玩測試 | 綠 | `tryoutRun`、`layoutStore.canConnect`、`connectRules` 三檔共 29 項通過 | 過 |
| 5 | #94 是否越界 | 只動文件與 `src/app/dev/` | `src/` 變動只有 `tryoutRun.test.ts`、`TryoutPanel.vue`、`contractCatalog.ts`、`tryoutRun.ts` | 過 |
| 6 | POC 句子 | 仍在大綱 | 大綱 v1.29 仍有「旋轉、刪除的底層納入 POC；畫面不納入；JSON 移出」 | 過 |

結論：**V21 與 V22 皆已收斂。**

---

## 3. 回寫清單

- [x] `todolist_v21`：狀態總覽、牌程、D1／E1、DoD、日誌
- [x] `dev_v21/D1`、`dev_v21/E1`：狀態改為已合入
- [x] `todolist_v22`：閘門、B1、封鎖表、DoD、日誌
- [x] `dev_v22/A1`、`B1`、`C1`、`E1`：狀態列補合入說明（11-22 當時的表述不改寫）
- [x] `AGENT_WEEK_1109`：補一則收斂日誌
- [x] `AGENT_WEEK_1123`：新建，接手本週約束

---

## 4. 仍不做

- 不改寫 11-22 當時的查證表。它是快照，用日期說話
- 不因為收斂而改 POC 句子

---

## 5. 開發日誌

### 2026-11-28｜核對與回寫

- 六項查證全過；V21、V22 結案
- 本機尚有已合入的 `dev/aaaaa1109`、`work_dispatch_1123` 等舊分支，未刪除（刪除與否由負責人決定）
