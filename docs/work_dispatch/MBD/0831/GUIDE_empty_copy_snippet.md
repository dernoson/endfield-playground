# 教學｜MBD｜空狀態文案（W0831-M1 本步）

| meta | value |
|------|-------|
| 對應工單 | [W0831-M1](./W0831-M1_empty_copy_step.md) |
| 唯一要改的檔 | `src/components/StatsPanel/ItemSummaryTable.vue` |
| 交付 | **推到分支即算交付**（合入由 dernoson 負責） |
| Deadline | **無**。能做多少算多少 |

---

## 1. 先知道一件事

你 8/24 改的空狀態**已經在 master**（PR #37）。  
週報填「無產出」沒關係——正式樹上有了。

本步只改**那一行字**，表格不要動。

---

## 2. 檔案現況

| 現況 | 你要做的 |
|------|----------|
| `rows: ItemSummaryRow[]`，型別在同檔 | 不要改型別 |
| 約第 79 行：`目前沒有產耗資料` | 改成下面建議句，或維持但 PR 寫「已對過 D1」 |
| `StatsPanel/Index.vue` 傳 `:rows="[]"` | **不要改 Index**；打開 `pnpm dev` 右側就是空狀態 |
| 有資料時的表格 | **一行都不要碰** |

### Mock props（驗收用）

| prop | 型別 | 空狀態時 |
|------|------|----------|
| `rows` | `ItemSummaryRow[]` | `[]` |

欄位維持：`itemId`、`name`、`iconUrl`、`produced`、`consumed`、`net`、`efficiency`。

---

## 3. 改這一行

現在：

```vue
<p class="text-sm">目前沒有產耗資料</p>
```

改成（可微調，意思要一樣）：

```vue
<p class="text-sm">尚未擺放設備——放置並連線後，產耗會顯示在這裡。</p>
```

不要改 `v-if`／`v-else`，不要 import store。

---

## 4. 30 秒驗收

1. `pnpm dev` → 右側統計看到新句子（不是空白表）
2. 有資料時表格還在（本機若要測：暫時改 Index 的 `:rows`，**看完還原，不要 commit Index**）
3. 截圖丟 Discord 或附在 PR

指令（有空再跑）：

```powershell
pnpm type-check
pnpm lint-check
pnpm format-check
pnpm test
```

---

## 5. 交件（推上去就算完成）

開工前 Discord 一句：「W0831-M1 我要改 `ItemSummaryTable.vue`」

```powershell
git checkout -b dev/mbd-empty-copy
git add src/components/StatsPanel/ItemSummaryTable.vue
git commit -m "fix(stats): 空狀態文案對齊尚未擺放設備"
git push -u origin dev/mbd-empty-copy
```

做不動：回「這步先停」即可，**不計失敗**。下一步等你說「做完了」再派。
