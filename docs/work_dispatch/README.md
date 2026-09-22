# 每週派工（work_dispatch）

| meta | value |
|------|-------|
| version | **v3.6（2026-09-22；0921 門檻週發工）** |
| 本週區間 | **2026-09-21 → 2026-09-27**（[WEEK_20260921](./WEEK_20260921.md) **v1.0**）｜**M2 門檻日 9/27** |
| 上週區間 | 2026-09-14 → 2026-09-20（[WEEK_20260914](./WEEK_20260914.md) v1.1） |
| 上游 | [ROADMAP_OUTLINE](../roadmap/ROADMAP_OUTLINE.md) **v1.11** |

---

## 0. 先看這裡

| 你想知道 | 打開 |
|----------|------|
| **我這週要交什麼** | 下表 **0921** |
| 這週全隊／驗收 | [WEEK_20260921.md](./WEEK_20260921.md) |
| **檔案鎖（暫停中也適用）** | [WEEK_20260921.md](./WEEK_20260921.md) §3 |

### 本週（9/21–9/27）

| code | 工單 | 一句話 |
|------|------|--------|
| [aaaaa](./aaaaa/0921/) | [**A0（最優）**](./aaaaa/0921/W0921-A0_placement_precheck.md) | `canPlaceDevice` 落子前預檢，**9/24 交** |
| | [A1](./aaaaa/0921/W0921-A1_connect_rules.md) | C2 `connectRules.ts`（10/04 提前量） |
| [toby](./toby/0921/) | [**T1（主戲・擋門檻）**](./toby/0921/W0921-T1_placement_chain.md) | 落子鏈：點真機器 → 點畫布 → 出現 |
| [dernoson](./dernoson/0921/) | [D0](./dernoson/0921/W0921-D0_gate_and_three_rulings.md) | **9/22 先裁三件**；守閘；待審 ≤3 |
| [goodmorning](./goodmorning/0921/) | [G1](./goodmorning/0921/W0921-G1_toolbar_pr48_land.md) | #48 收尾，**9/24 前**（擋 T1 第 2 刀） |
| [shirone](./shirone/0921/) | [S1](./shirone/0921/W0921-S1_stats_panel_split_pr.md) | 只把「純搬家」拆一支 PR 合進去 |
| [harry](./harry/0921/) | [H1](./harry/0921/W0921-H1_pipeline_polyline.md) | C3 折線幾何＋dev 頁（不綁時間） |
| [MBD](./MBD/0921/) | [M1](./MBD/0921/W0921-M1_clean_branch_restart.md) | 上週 6 筆重推乾淨分支（單步） |
| [paper](./paper/0921/) | [P1](./paper/0921/W0921-P1_figma_comment_gap.md) | Figma comment 對照 `src/` 落差清單 |
| [avery](./avery/0921/) | [V0](./avery/0921/W0921-V0_pause.md) | 暫停（亞運）；**暫停期也請回週報** |
| [azure9572](./azure9572/0921/) | [Z0](./azure9572/0921/W0921-Z0_pause.md) | 暫停（備賽至 11 月） |

---

## 1. 定案摘要（全員）

1. **9/27 硬綁 B1**；門檻句＝從下方選單拉真機器放到畫布
2. 本週**只放行落子**；選取／旋轉／刪除（B3／B4／B5）一律退回
3. 落子意圖走新的 `usePlacementIntent.ts`；**不擴充 `EquipmentType`、不改 `editorStore`**
4. 落子的 `label` 填 `machine.name`（中文名）
5. L2 **不得自行重算佔格重疊**，一律呼叫 `canPlaceDevice`
6. `ToolbarPanel.vue` 按區塊分鎖：`<script>`＝toby（#48 後）／`<template>`＋`<style>`＝goodmorning
7. `MainLayout.vue` owner＝toby 全檔；shirone 限改 StatsPanel import 一行
8. `InspectorSidebar` **凍結，誰都不能刪**（R-B4 入口）
9. 「paper 過」改**事後補審**，不再當任何 PR 的合入前提
10. **待審 PR 超過 3 天無活動即 Discord 點名**
11. 合入序：#48 → S1 搬家 → A0 → T1 → H1 → A1 → M1

---

## 2. 目錄

`0921/`＝本週；`0914/`＝上週；`0907/`／`0831/`／`0823/`＝封存。

---

## 3. 本週狀態

| 檔 | 狀態 |
|----|------|
| WEEK_20260921 | **v1.0**（三項裁決依建議先發，見 §2.0） |
| ROADMAP_OUTLINE | **v1.11** |
