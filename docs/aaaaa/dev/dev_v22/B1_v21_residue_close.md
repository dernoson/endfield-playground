# V22-B1 — V21 尚未收斂

**對應工項：** V22-B1
**狀態：** `[x]` 閘門已過（2026-11-28 核）。殘項隨 #94 於 2026-11-23 合入 master。下方 §2 查證表是 11-22 當時快照，不改寫
**日期：** 2026-11-22
**依賴：** [todolist_v21](../todolist_v21.md)
**目的：** 收 V21 殘項裡擋啟用的那一塊。`canConnect` 試玩做在既有 lab，不改 L1。合入 master 之前，V22-C1 仍不改大綱。
**開發分支：** `dev/aaaaa1109`

---

## 1. 啟用條件

兩條都要成立，V22-C1 才能改大綱：

1. [V21-D1](../dev_v21/D1_can_connect_tryout.md) 與 [V21-E1](../dev_v21/E1_acceptance_and_handoff.md) 的狀態都是 `[x]`
2. 該變更已合入 `origin/master`（PR MERGED；以 `git`／`gh` 為準）

---

## 2. 查證（2026-11-22，`origin/master` `a02e069`）

| # | 查什麼 | 預期（要啟用） | 實況 | 判定 |
|---|--------|----------------|------|------|
| 1 | #86 | 試玩 P0 已合 | MERGED 2026-11-08。範圍是 `hitTestPortAt`／`findPortAt` | 已合，但不是全版 |
| 2 | V21-D1 `canConnect` | `[x]` 且在 master | 本分支已做：試玩第三題，成功與不良構各一則。測試 5 項通過。**尚未合入** | **未過** |
| 3 | V21-E1 | `[x]` 且在 master | 第 3 列已在本分支填過。狀態仍 `[~]`，因為這次變更不在 master | **未過** |
| 4 | todolist_v21 狀態總覽 | 主線 `[x]` 且在 master | 本分支把 D1 勾上。master 上仍是 `[~]` | **未過** |

---

## 3. 這次做了什麼

沿 [V21-D1](../dev_v21/D1_can_connect_tryout.md)，在既有試玩分頁加上 `canConnect`：

- 合法皮帶：分流器 a 的右出料 `(1, 0)` 接到 b 的左進料 `(0, 0)`
- 終點斜走：`(1, 0)` → `(0, 1)`，頁上的失敗句來自 `describeConnectFailure`
- 沒有改 `canConnect` 的簽名，沒有做 `addPipeline` 表單，沒有改大綱

## 4. 仍不做

- 不把這分支記成已收斂。master 上還沒有這次 diff
- 不因此改 POC 大綱（那是 C1）
- 不發解鎖句

---

## 5. 開發日誌

### 2026-11-28｜閘門通過

- 兩條啟用條件皆成立：V21 D1／E1 皆 `[x]`；[#94](https://github.com/dernoson/endfield-playground/pull/94) 於 2026-11-23 MERGED
- `origin/master` `0c72c9f`；`dev/aaaaa1109` 為其祖先

### 2026-11-22｜補上 canConnect 試玩

- `tryoutRun` 測試 5 項通過（原 3 項＋成功、不良構）
- 閘門仍未過。C1 維持不落地

### 2026-11-22｜核對

- 當時 D1 未開工。其後於同日補上，見上一則
