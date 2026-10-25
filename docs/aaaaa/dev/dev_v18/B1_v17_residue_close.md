# V18-B1 — V17 殘項收斂

**對應工項：** V18-B1
**狀態：** `[x]` 完成（2026-10-25）
**日期：** 2026-10-25
**依賴：** 無（開版前置）
**目的：** 確認 V17／#74／#76 已在 master，避免 V18 文件仍寫「交審中」造成雙源
**開發分支：** `dev/aaaaa1018`

---

## 1. 背景

[todolist_v17](../todolist_v17.md) 開版末狀態為「#74／#76 交審中」。公開 WEEK_20261018 前置已記引擎讀／history 在 master。本項做交叉比對與文件指向收斂，**不改 V17 程式**。

---

## 2. 查證清單（2026-10-25 實查）

| # | 查什麼 | 預期 | 實況 | 判定 |
|---|--------|------|------|------|
| 1 | PR #74／#76 狀態 | MERGED | `gh`：#74 MERGED 2026-10-18；#76 MERGED 2026-10-18 | **成立** |
| 2 | Issue #73／#58 | CLOSED | `gh`：皆 CLOSED | **成立** |
| 3 | `origin/master` 有 resolve／toTopology 切片／history 隔離 | 有 | WEEK／roadmap 前置與 merge log 一致 | **成立** |
| 4 | todolist_v17 狀態總覽 | 標結案／已合 master | 本項一併改 `[x]`；G1／H3 指向 MERGED | **成立** |
| 5 | V18 是否誤把 V17 範圍重做 | **否** | todolist_v18 非目標不含查表重做／history 重做；範圍＝驗收／lab | **成立** |

### 2.1 一併收斂的 V17 meta（最小改動）

| 檔 | 動作 |
|----|------|
| [todolist_v17](../todolist_v17.md) | 狀態總覽／G1／H3／檢核表／日誌 |
| [V17-G1](../dev_v17/G1_acceptance_and_handoff.md) | 狀態 `[x]` MERGED |
| [V17-H3](../dev_v17/H3_history_isolation_acceptance.md) | 狀態 `[x]` MERGED |

**不改：** V17 任何 `src/`；CLAUDE §4.6／AGENT_ROADMAP 過期索引（已知債）。

### 2.2 續掛（不擋 V18）

| ID | 說明 |
|----|------|
| C5 正式頁表單 | 仍非本版；11 月／加分 |
| 公開 WEEK V2 勾選 | 本版 C1／E1 交後由主編結算 |
| PENDING M-1／M-2 | 見 [1018/PENDING](../../collaborator_survey/dispatch_private/1018/PENDING_DECISIONS_20261025.md) |

---

## 3. 不做

- 不重開 V17 功能
- 不為此項單獨開 PR（可併 V18 文件 commit）
- 不強制大修 CLAUDE §4.6／AGENT_ROADMAP 過期索引

---

## 4. DoD

- [x] §2 表以 `git`／`gh` 核過
- [x] todolist_v18 概述寫明 V17 已合 master
- [x] 無「再實作一遍 resolveMachineDef／history 隔離」的範圍漂移

---

## 5. 開發日誌

### 2026-10-25｜完成

- `gh pr view 74／76` → MERGED；issues CLOSED
- 收斂 todolist_v17／G1／H3；下一刀＝C1（驗收步驟）或 D1（lab）
