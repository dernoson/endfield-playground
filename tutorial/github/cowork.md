# 在 github 上與人共同協作的注意事項

## 不要一個 commit 一堆變更

你一次改很多地方，然後就提交一次，你自己都搞不清楚自己改了啥。
解法：改了一點點東西，就提交一次，提交的資訊寫清楚你改了啥。

## 不要 commit 了才發現有東西沒下載

你會很痛苦，因為衝突沒人想處理
解法：請先下載最新的東西，再進行後續操作。

## commit 資訊寫法

範例：

```
feat: 在XX頁面新增了一個按鈕
fix: OO功能在XXX情況下會出現錯誤
issue #406: 我改動了什麼，解決掉了 #406 的問題
```

冒號前面的是這次 commit 是什麼性質，後面是這次 commit 的描述。

- feat: 新增功能
- fix: 修復 bug
- chore: 雜項
- refactor: 重構
- test: 測試
- docs: 文件
- style: 樣式
- perf: 效能
- revert: 回退

## 如何避免衝突

- 不要跟人共用 branch
- 一個功能、一個問題，一個人搞就好
- 不要在 master / main branch 上開發
- 不要在 master / main branch 上開發
- 不要在 master / main branch 上開發

## branch 命名規則

通常是 dev/ 開頭，你可以：

- 用自己的名字 `dev/dernoson`
- 目前開發目標 `dev/flow-algorithm`

請千萬不要只用 `dev` 做為 branch name，會讓其他人不能取 dev/ 開頭的 branch name。
