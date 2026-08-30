# Roadmap 大綱｜2026-08-23 → 2026-11-29

**版本：** v1.2（2026-08-30）
**建立日期：** 2026-08-22
**規劃：** aaaaa
**守門與合入：** dernoson（主編）
**上游來源：** 主編提出並確認的 ROADMAP v0.2（決策層原始文件，未公開；其內容已完整拆進本檔與 `detail/`）
**狀態總覽：** **M1 門檻成立**（R-A1、R-A2 皆 `[x]`）。22 項中：`[x]` 3、`[~]` 7、`[!]` 5、`[ ]` 7。本週 W0823 必要兩項全達；加分項 7／8 有產出且已合入 master（僅 goodmorning、avery 為零）。詳見 §8 08/30 列與 §12。

> 標記說明：`[ ]` 未開始 / `[~]` 進行中 / `[x]` 完成 / `[!]` 封鎖中（等待依賴）

---

## 0. 這份檔是什麼

上游 ROADMAP v0.2 回答「**到 11/29 要做出什麼**」，本檔回答「**那些事要拆成哪幾個工項、每項誰做、做完長什麼樣**」。

| 檔案 | 職責 |
|------|------|
| 上游 ROADMAP v0.2（未公開） | 主編 10 步、三塊畫面、月底門檻、刻意不做 |
| **本檔（大綱）** | 工項群組、狀態標記、週曆、封鎖追蹤；**不寫長篇技術細節** |
| [detail/](./detail/) | 各工項的背景、決策、檔案計畫、週切片、DoD、風險頂替 |

結構沿用 `docs/aaaaa/dev/` 既有慣例：`todolist_vN.md` ↔ `dev_vN/`，本檔即 roadmap 版的 todolist，`detail/` 即 roadmap 版的 dev 細項資料夾。

相關：[work_dispatch/](../work_dispatch/)（**正式每週派工**）、[AGENT_CONTEXT.md](../aaaaa/AGENT_CONTEXT.md)、`spec/00_top_spec.md`。

---

## 1. 概述

### 1.1 目標

到 2026-11-29，做出一條**已串通、打開就能操作、右側數字與警訊跟得上畫布**的主線。不是做完 Top Spec Phase 1。

### 1.2 已定案（主編已確認，本輪不再重議）

| 項 | 結論 |
|----|------|
| 驗收基準 | 主編 10 步；11/29 以 [D5 驗收劇本](./detail/D5_acceptance_rehearsal.md) 的 8 步演示為準 |
| 月底門檻 | 8/30 對齊、9/27 擺放、10/25 連線、11/29 串通；每月最後一個週日驗收 |
| 分層硬規則 | L3 不 import store；L2 只呼叫 L1 高階 action；L1 不寫正式 UI |
| 唯一寫入點 | 藍圖狀態只經 `editorStore` 高階 action；禁止 `nodes.push`、禁止自組 Command |
| 引擎不重算 | FlowEngine 只在 L1 跑；L2／L3 只讀 `flowStore` |
| 工單格式 | 四欄固定：畫面｜交哪個檔｜不要碰｜卡住找誰 |
| 一週一塊 | 同一人同一週只做一種性質（純函式／畫面／接線） |
| 關鍵路徑限制 | 月底門檻的必要條件只派 `risk ≤ 中`（aaaaa、shirone、paper、dernoson）<br>**⚠ 2026-08-30：** shirone 主動要求轉調 L2／L3（待定案）、dernoson 已升為中－高且不得兼功能 Owner → **9 月起程式必要條件實質只剩 aaaaa**；L2 側維持「渲染層落地前不押門檻」（§11） |
| 資料流 | `data_1` → `pnpm sync:aaaaa-data` → `docs/aaaaa/data` → `pnpm generate:src-data` → `src/data` |
| 速率 | belt 30／min、pipe 60／min（沿用 V8／V9） |
| 藍圖格式 | 最小 JSON `{ version, planId?, nodes, edges }`；**不做** HTML 自包含記錄檔<br>**⚠ 2026-08-25：`nodes`／`edges` 已不是儲存形狀，本列待重訂（§9 封鎖表 R-D4），改寫排 9 月首週 v1.2** |

### 1.3 非目標（11/29 前不做）

- CR-05 流程視角／並列視角
- 框選多物、複製貼上、自動物流橋／分流／匯流生成
- 自動路徑規劃、LP 優化（CR-07）
- HTML 自包含記錄檔、跨版本 migrate
- 調度券總效率當主演示（引擎欄位保留，UI 不當門檻）
- 重寫 FlowEngine 或 store 骨架

### 1.4 流程大綱

```text
R-A 對齊（8/23→8/30）
      │  能打開、能放一台、佔格與資料一致
      ▼
R-B 擺放（9/6→9/27）           步驟 2 ＋ 5
      │  真機器選單、擺放鏈、旋轉、選取資訊、單刪
      ▼
R-C 連線（10/4→10/25）          步驟 3 ＋ 4 ＋ 6
      │  port 對 port、90 度彎折、拖移進歷史、源素材
      ▼
R-D 串通（11/1→11/29）          步驟 7 ＋ 8 ＋ 9 ＋ 10
      │  右側產耗、重疊警訊、配方警訊、JSON 存讀
      ▼
   11/29 驗收劇本 8 步

R-E 跨月支撐（8/23→11/29，貫穿全期，不綁單月門檻）
```

### 1.5 里程碑一覽

| 里程碑 | 日期 | 使用者能做到 | 必要工項 | 加分工項 |
|--------|------|--------------|----------|----------|
| M1 對齊 | 2026-08-30（日） | 新 clone 能開；放一台且佔格不是錯尺寸 | A1、A2 | A3、A4 |
| M2 擺放 | 2026-09-27（日） | 拉多種真機器；點選看資訊；單刪；可轉 90° | B1、B2、B4 | B3、B5 |
| M3 連線 | 2026-10-25（日） | 兩 port 拉管線可彎折；拖移；源設素材 | C1、C2、C3、C5 | C4 |
| M4 串通 | 2026-11-29（日） | 右側產耗＋兩類警訊；JSON 存讀還原 | D1、D2、D4、D5 | D3 |

「必要」＝該月門檻缺此項即不通過，只能派給 `risk ≤ 中`。
「加分」＝未交不影響門檻，須在工單寫明由誰的既有產出頂替。

---

## 2. 工項總表

| ID | 工項 | 里程碑 | 建議主責 | 性質 | 擋門檻 | 細項 |
|----|------|--------|----------|------|--------|------|
| R-A1 | 公告基準與工單格式凍結 | M1 | dernoson | 決策 | 是 | [A1](./detail/A1_announce_and_baseline.md) |
| R-A2 | 佔格與 port 對資料 | M1 | aaaaa | 資料／純函式 | **是** | [A2](./detail/A2_grid_and_port_alignment.md) |
| R-A3 | 新人上手半頁 | M1 | dernoson | 文件 | 否 | [A3](./detail/A3_onboarding_onepager.md) |
| R-A4 | 週節奏與門檻驗收機制 | M1 | aaaaa＋dernoson | 流程 | 否 | [A4](./detail/A4_weekly_cadence_gate.md) |
| R-B1 | 工具列接真實機器資料 | M2 | aaaaa（資料）＋L3 | 資料→畫面 | **是** | [B1](./detail/B1_toolbar_real_machines.md) |
| R-B2 | 擺放鏈 L2 串接 | M2 | toby／harry | 接線 | **是** | [B2](./detail/B2_placement_chain.md) |
| R-B3 | 旋轉 90 度 | M2 | toby／harry | 接線 | 否 | [B3](./detail/B3_rotation_90.md) |
| R-B4 | 選取與設備資訊面板 | M2 | L2 攤平＋L3 呈現 | 接線＋畫面 | **是** | [B4](./detail/B4_selection_inspector.md) |
| R-B5 | 刪除單台 | M2 | toby／harry | 接線 | 否 | [B5](./detail/B5_delete_single_device.md) |
| R-C1 | Port 命中與 draft 連線 | M3 | L2 主責 | 接線 | **是** | [C1](./detail/C1_port_hit_and_draft.md) |
| R-C2 | ~~addConnection 契約與型別檢查~~ **待重新定義**（§9） | M3 | aaaaa（規則）＋L2 | 純函式＋接線 | **是** | [C2](./detail/C2_add_connection_contract.md) |
| R-C3 | 管線折線與 90 度彎折渲染 | M3 | L3 | 畫面 | **是** | [C3](./detail/C3_pipeline_polyline_render.md) |
| R-C4 | 拖移進歷史 | M3 | L2 | 接線 | 否 | [C4](./detail/C4_move_into_history.md) |
| R-C5 | 源節點素材設定 | M3 | aaaaa（action）＋L2 | 接線 | **是** | [C5](./detail/C5_source_primary_output.md) |
| R-D1 | 右側產耗表接 flowStore | M4 | aaaaa | 接線＋畫面 | **是** | [D1](./detail/D1_stats_item_summary.md) |
| R-D2 | E001 重疊警訊上右側 | M4 | shirone（純函式）＋L2 | 純函式＋接線 | **是** | [D2](./detail/D2_e001_overlap_alert.md) |
| R-D3 | 配方類警訊 E004／E005／W001 | M4 | shirone／azure 收斂 | 純函式 | 否 | [D3](./detail/D3_recipe_alerts.md) |
| R-D4 | 最小藍圖 JSON 匯出／匯入 | M4 | aaaaa | 純函式＋接線 | **是** | [D4](./detail/D4_blueprint_json_io.md) |
| R-D5 | 11/29 驗收劇本與彩排 | M4 | aaaaa＋dernoson | 驗收 | **是** | [D5](./detail/D5_acceptance_rehearsal.md) |
| R-E1 | 資料與 codegen 維運 | 跨月 | aaaaa | 資料 | 否 | [E1](./detail/E1_data_codegen_ops.md) |
| R-E2 | 三層守門與 PR 規範 | 跨月 | dernoson | 流程 | 否 | [E2](./detail/E2_layer_guard_pr_rules.md) |
| R-E3 | 備援與人力調度 | 跨月 | aaaaa | 流程 | 否 | 細項於決策層維護，不公開 |

「建議主責」為規劃值，**實際派工以 [work_dispatch/](../work_dispatch/) 當週 `WEEK_*.md` 與各人細項為準**。

---

## 3. R-A｜對齊月（→ 2026-08-30）

**門檻句：** 新 clone 能開網頁；從下方拿一種設備放到格子上，佔格與資料大致一致；至少一處走真實 machine 尺寸；列出 port 錯的機器清單。

**M1 驗收（2026-08-30）：成立。** 必要項 R-A1／R-A2 皆 `[x]`；加分 A3／A4 為 `[~]`（機制已跑、半頁置頂已生效，repo 半頁與完成率紀錄見各 detail）。

- [x] **R-A1** 公告基準與工單格式凍結：確認本大綱可公告、凍結「主線只走 editorStore action」、固定四欄工單格式與週日會議程
  - 細項：[detail/A1_announce_and_baseline.md](./detail/A1_announce_and_baseline.md)（W0823-D0，8/23 宣讀＋Discord 摘要）
- [x] **R-A2** 佔格與 port 對資料：產出 port／佔格錯機清單（機器 id ＋ 錯在資料或渲染），修正「錯在資料」者，至少一台常用加工機佔格正確
  - 細項：[detail/A2_grid_and_port_alignment.md](./detail/A2_grid_and_port_alignment.md)（W0823-A1，PR #32 合入；錯機清單＋`rotatePort` pad-to-square＋`/dev/placement-demo`）
- [~] **R-A3** 新人上手半頁：三塊畫面、props／emit、L3 禁 store、禁止根目錄上傳、禁止檔名當版本
  - 細項：[detail/A3_onboarding_onepager.md](./detail/A3_onboarding_onepager.md)（Discord 置頂已生效；**repo 貼入 `docs/dernoson/` 尚未完成**）
- [x] **R-A4** 週節奏與門檻驗收機制：週日會固定議程、30 秒驗收定義、連續兩週未演示的處理、延期改版規則
  - 細項：[detail/A4_weekly_cadence_gate.md](./detail/A4_weekly_cadence_gate.md)（8/23 會上宣讀；8/30 首次完成率與本檔週曆回寫）

---

## 4. R-B｜擺放月（→ 2026-09-27）

**門檻句：** 從下方選單拉多種真機器放到畫布；點選後看到該機資訊；能刪單台；能轉 90 度（若 8 月未做完，9 月必須完成）。對應主編步驟 2 ＋ 5。

- [ ] **R-B1** 工具列接真實機器資料：`ToolbarPanel` 清單改吃 `getAllMachines`／`getMachinesByTag`，分類 Tab 可先少類，卡片顯示真名與佔格
  - 細項：[detail/B1_toolbar_real_machines.md](./detail/B1_toolbar_real_machines.md)
- [!] **R-B2** 擺放鏈 L2 串接：工具列 `armPlacement` → drop／click → **只呼叫** `placeDevice`；預覽佔格讀真實 machine size
  - 細項：[detail/B2_placement_chain.md](./detail/B2_placement_chain.md)（**仍封鎖**：佈局自建六純函式僅落地 4／6，見 §9）
- [!] **R-B3** 旋轉 90 度：拿起中或已放置皆可 `rotateDevice`；port side／offset 走 `portUtils`
  - 細項：[detail/B3_rotation_90.md](./detail/B3_rotation_90.md)（**A2 依賴已解除**；`rotatePort` pad-to-square 已修；仍等 B2／佈局層）
- [~] **R-B4** 選取與設備資訊面板：選取 → L2 把 `Machine` ＋ node 攤成 plain props → L3 顯示名稱、佔格、配方、耗電
  - 細項：[detail/B4_selection_inspector.md](./detail/B4_selection_inspector.md)（W0823-T1 提前切片已合入 PR #33：名稱／佔格／耗電；**尚未**拆 L2 攤平、無配方）
- [ ] **R-B5** 刪除單台：Delete 鍵與右鍵入口接 `removeDevices`，走既有 `useShortcuts`，進歷史
  - 細項：[detail/B5_delete_single_device.md](./detail/B5_delete_single_device.md)

---

## 5. R-C｜連線月（→ 2026-10-25）

**門檻句：** 兩台設備 port 對 port 拉管線，皮帶與水管能分、能轉 90 度彎；單台／單線可刪、可拖移；源設備能設產出素材。對應主編步驟 3 ＋ 4 ＋ 6。

- [!] **R-C1** Port 命中與 draft 連線：port 點可見、可點選、拖出暫時折線，放開命中另一 port 才成立
  - 細項：[detail/C1_port_hit_and_draft.md](./detail/C1_port_hit_and_draft.md)（等 B2；harry W0823-H1 已交工具態快捷鍵，屬連線前置加分）
- [!] **R-C2** ~~addConnection 契約與型別檢查~~：**2026-08-25 起待重新定義**——佈局自建後連接為衍生值、不儲存，`addConnection` 已無標的；新契約排 9 月首週 v1.2（見 §9）
  - 細項：[detail/C2_add_connection_contract.md](./detail/C2_add_connection_contract.md)（**內容待更新**）
- [ ] **R-C3** 管線折線與 90 度彎折渲染：`PipelineEdge` 畫正交折線，違規線段給紅色視覺
  - 細項：[detail/C3_pipeline_polyline_render.md](./detail/C3_pipeline_polyline_render.md)
- [ ] **R-C4** 拖移進歷史：拖曳結束呼叫 `commitDeviceMove(uids, before)`，Undo 可還原位置
  - 細項：[detail/C4_move_into_history.md](./detail/C4_move_into_history.md)
- [ ] **R-C5** 源節點素材設定：源設備可指定 `primaryOutput` 與速率，寫入 `FactoryNode.data`
  - 細項：[detail/C5_source_primary_output.md](./detail/C5_source_primary_output.md)

---

## 6. R-D｜串通月（→ 2026-11-29）

**門檻句：** 一條「源 → 加工 → 匯出點」連起來後，右側看到產耗（含中間物）；重疊與缺 IO／配方不符在右側有字；頂欄 JSON 存檔再開得回來。對應主編步驟 7 ＋ 8 ＋ 9 ＋ 10。

- [~] **R-D1** 右側產耗表接 flowStore：`ItemSummaryTable` 讀 `itemSummary`，空產線顯示空狀態，有連線會變
  - 細項：[detail/D1_stats_item_summary.md](./detail/D1_stats_item_summary.md)（W0823-M1 空狀態切片已合入 PR #37；**尚未**接 `flowStore`）
- [~] **R-D2** E001 重疊警訊上右側：`E001_deviceOverlap` 真邏輯＋測試，集中 `registerDetector`，右側顯示一條可懂訊息
  - 細項：[detail/D2_e001_overlap_alert.md](./detail/D2_e001_overlap_alert.md)（W0823-S1＋layout 收斂已合入 PR #36；`/dev/validation-test` 可觀察；**右側 Tips 列表未做**；shirone 轉調後純函式 owner 待移交）
- [~] **R-D3** 配方類警訊：缺輸入／缺輸出（E004／E005）與材料組合不符（W001）至少一類上右側，與 azure 草稿收斂成一套
  - 細項：[detail/D3_recipe_alerts.md](./detail/D3_recipe_alerts.md)（**W001 已合入 master** PR #35；E004／E005 仍在舊分支 `dev/azure9572`；ID 表未凍結；右側未接）
- [!] **R-D4** 最小藍圖 JSON 匯出／匯入：~~`{ version, planId?, nodes, edges }`~~ ＋ Zod 驗證；頂欄 Save／Load。**2026-08-25 起格式待重訂**——儲存形狀改為 `devices`／`pipelines`，`connections` 為衍生值不儲存（見 §9）
  - 細項：[detail/D4_blueprint_json_io.md](./detail/D4_blueprint_json_io.md)（**內容待更新**）
- [ ] **R-D5** 驗收劇本與彩排：8 步劇本文件化，11/22 先彩排一次，11/29 正式演示
  - 細項：[detail/D5_acceptance_rehearsal.md](./detail/D5_acceptance_rehearsal.md)

---

## 7. R-E｜跨月支撐（8/23 → 11/29）

不綁單月門檻，但每月都要有動作。

- [~] **R-E1** 資料與 codegen 維運：`data_1` → `data` → `src/data` 同步流程保持可跑，資料改動附測試
  - 細項：[detail/E1_data_codegen_ops.md](./detail/E1_data_codegen_ops.md)（W0823-A1 併入 `dataConsistency.test.ts`；本週檢查點已過）
- [~] **R-E2** 三層守門與 PR 規範：待審 PR ≤ 3、禁止根目錄上傳與檔名當版本、Breaking 先改 L1
  - 細項：[detail/E2_layer_guard_pr_rules.md](./detail/E2_layer_guard_pr_rules.md)（8/23 口頭凍結退回清單；**8/30 一次清空全部待審 PR**——規則實跑，惟合入仍單點）
- [ ] **R-E3** 備援與人力調度：可投入時間不穩定者不承擔門檻必要條件、每週配對名額 ≤ 2、已知空窗不派工
  - 細項涉及個別成員的可投入時間與備援安排，**於決策層維護、不公開**；對協作者生效的部分已寫進 [A4](./detail/A4_weekly_cadence_gate.md) 與每週工單
  - **2026-08-30 決策層備註（摘要）：** shirone 轉調、azure／avery 續留未定、MBD 新工作上手不可規劃 → 9 月門檻範圍須縮小，見 §1.2 關鍵路徑註記

---

## 8. 週曆對照（標的日＝週日）

當週做不完就在當日會上改下一週，不把欠帳堆到月底。

| 週日 | 對應工項 | 30 秒看得出的產出 |
|------|----------|-------------------|
| 08/23 | A1、A3、A4 | **已交：** 公告大綱＋Discord；發 W0823 十張四欄工單；A4 規則口頭凍結 |
| **08/30** | **A2（門檻）** | **M1 成立。** 放一台佔格證據＝測試全綠＋錯機清單＋`/dev/placement-demo`；PR #32 合入。同日清空待審 PR #33–#38 |
| 09/06 | B1 | 下方選單至少一個分類顯示真實機器名。**範圍已收斂：** 新列表與現有五顆按鈕**並存**、不動落子鏈（`EquipmentType`／`armPlacement`／`dataTransfer` key 皆不改），真實機器落子併入 09/13 的 B2 對接，見 [B1 §11](./detail/B1_toolbar_real_machines.md)。**⚠ 產能備註：** harry／azure 自報 0h、avery 失聯、paper ≤2h、shirone 轉調過渡 → 本週實際功能產能極薄，優先 B1 資料側 |
| 09/13 | B2、B4 | 拖放走真實 size；點選設備 → 資訊區出現名稱＋佔格。**B4 已有 T1 提前切片**（名稱／佔格／耗電）；B2 仍等佈局純函式補齊 |
| 09/20 | B3 或 B5 | 旋轉 90 度或刪單台，擇一穩定演示。**B3 的 A2 依賴已解除**（`rotatePort` 已修） |
| 09/27 | **B1＋B2＋B4（門檻）** | 步驟 2 ＋ 5 ＋ 單刪；B3／B5 未完成者本日補齊。**若佈局層未落地，依 §11 不把 B2 當必要項硬綁** |
| 10/04 | C1、C2 | 兩個 port 能連一條直線，型別對才允許。**C2 定義待 v1.2⁺ 重訂** |
| 10/11 | C3 | 彎折點 90 度；違規線段有紅色視覺 |
| 10/18 | C4、C5 | 拖移進歷史（或明寫「本週只移不 Undo」並排進 10/25）；源素材可設 |
| 10/25 | **C1＋C2＋C3＋C5（門檻）** | 步驟 3 ＋ 4 單物 ＋ 6 |
| 11/01 | D1 | 右側產耗表接 `itemSummary`，空產線有空狀態。**空狀態切片已由 W0823-M1 提前交** |
| 11/08 | D2 | 兩台重疊 → 右側一條訊息。**E001 純函式＋dev 頁已就位**；缺右側 Tips |
| 11/15 | D3 | 缺輸入或輸出、材料組合不符，至少一類上右側。**W001 純函式已合入**；缺右側與 ID 表 |
| 11/22 | D4、D5 | JSON 匯出下載；匯入還原；**驗收劇本彩排一次**。**D4 格式待重訂** |
| 11/29 | **D1＋D2＋D4＋D5（門檻）** | 步驟 7～10 串在同一條演示產線上 |

---

## 9. 封鎖項目追蹤

| ID | 封鎖原因 | 等待對象 | 解除條件 | 狀態 |
|----|----------|----------|----------|------|
| R-B2 | L2 產能不足 **＋ 等待佈局渲染層落地**（2026-08-25） | 每週 work_dispatch 雙軌切分；**佈局自建的 L1 六個純函式** | 六個純函式到位且 `editorStore` 模型改寫合入後，B2 才可實際開工 | `[!]` **仍封鎖**。**進度（8/30）：** 已落地 `deviceOccupancy`／`pipelineGeometry`／`overlapDetection`／`portAnchor`（4／6）；**缺** `resolveConnections`、`toTopology`（及 `types/layout` 定型）與 store 模型改寫 |
| R-B3 | 旋轉牽涉 port side／offset 換算；依賴擺放鏈 | R-B2；原等 R-A2 | **A2 已完成**（`rotatePort` pad-to-square＋測試全綠）→ A2 條件解除；仍等 B2／佈局層 | `[!]`（A2 依賴已清） |
| R-C1 | 依賴 R-B2 擺放鏈可用 | R-B2 | B2 於 9/27 門檻通過（或依 §11 改降級方案） | `[!]` |
| **R-C2** | 佈局自建後連接改為衍生值、不儲存，`addConnection`／`removeConnection` 廢除，**本工項原定義失去標的**（2026-08-25） | 主編＋aaaaa 依 §11 重新定義並改版本號 | 新的連接判定契約寫入 §2 工項總表 | `[!]` **待重新定義**（排 9 月首週） |
| **R-D4** | §1.2 已定案的藍圖格式 `{ version, planId?, nodes, edges }` 不再是儲存形狀（改 `devices`／`pipelines`）（2026-08-25） | 同上 | §1.2 藍圖格式改版並確認 Zod schema 對象 | `[!]` **待重訂格式**（排 9 月首週） |
| ~~R-D3~~ | ~~shirone 與 azure9572 同域不同 ID~~ | — | — | **部分解除（8/30）：** W001 已合入 master（PR #35）。E004／E005 仍在 `dev/azure9572`；ID 表未凍結；右側未接。改標 `[~]`，不再列本表 |
| ~~R-D2~~ | ~~detector 註冊入口需集中~~ | — | — | **已解除（8/30）：** 使用端顯式 `registerDetector`；E001 於 `/dev/validation-test` 掛上。整項改 `[~]`（缺右側 Tips）。shirone 轉調 → 後續 owner 待移交 aaaaa |

新增封鎖一律回寫本表，寫明原因與等待對象；口頭封鎖不算數。

### 9.1 本週（W0823）完成率快照（A4 §4.4）

| 等級 | 分母 | 已 30 秒驗收／已合入 | 完成率 |
|------|------|----------------------|--------|
| **確定（擋門檻）** | 2（A1＝W0823-A1、D0＝W0823-D0） | 2 | **100%** |
| **確定（加分）** | 4（S1、P1、T1、H1） | 4 有產出；P1 缺 frame 標號／變更摘要 → 計部分 | **3 全達＋1 部分** |
| **加分** | 4（G1、V1、M1、Z1） | M1、Z1 合入；G1、V1 零產出 | **2／4** |

說明：依 A4，「PR 已開但主編無工時合入」計完成——本週四條待審於 8/30 晚間全數合入，無需動用延壓條款。avery 未回週報、計未達；goodmorning 事前回報上游設計變更，計未達但不列個人失效（見派工決策層）。

---

## 10. 完成定義（Definition of Done）

### 10.1 單一工項

- [ ] 該工項細項檔的「§DoD」全部勾選
- [ ] 本檔對應項目狀態標記已更新（`[x]` 或 `[!]` 並填封鎖表）
- [ ] `pnpm type-check`／`lint-check`／`format-check`／`test` 通過（純文件工項免）
- [ ] 交付路徑符合工單「交哪個檔」，未新開平行目錄或以檔名當版本
- [ ] 跨層需求已寫進文件，而非只留在對話

### 10.2 月底門檻

- [x] **M1（8/30）：** 該月「必要工項」全部 `[x]`（R-A1、R-A2）
- [ ] **M1：** 週日會上完成 30 秒演示（錄影或現場皆可）——**以 V10 三證據（測試全綠＋錯機清單＋`/dev/placement-demo`）代替主畫布目視**；會上記錄待補
- [x] **M1：** 未達成項目已在本檔改期並記錄延因，而非默默順延（本週無必要項延期；加分未達見 §9.1）
- [x] **M1：** 加分工項未交者，已確認由既有產出頂替，門檻不受影響（G1→現有 Toolbar；V1→維持現況）
- [ ] M2（9/27）／M3（10/25）／M4（11/29）：尚未到期

### 10.3 11/29 總驗收

以 [D5 驗收劇本](./detail/D5_acceptance_rehearsal.md) 的 8 步為準，全部通過即「初步串通、可運行」。

---

## 11. 動態調整規則

- 週日會只問「演示過了沒」，過了才開下一週範圍
- 連續兩週同項沒演示：切半或換人，不累積罪惡感清單
- 底層 API 改簽名：標 Breaking，先改 L1 再改 L2，同一週不逼 L3 跟版
- 主設計稿與功能順序衝突：外觀聽主設計，順序聽本檔
- §1.2 已定案與 §2 工項總表變更，須主編＋aaaaa 同意後改版本號
- **渲染層落地前，不把任何月底門檻的必要項押在 L2**（2026-08-25 主編裁示）。佈局視角改自建期間，L2 的可交付性取決於前置純函式，不由人力多寡決定；門檻必要項優先押在資料／純函式域，L2 只派提前切片與加分項

---

## 12. 版本紀錄

| 版 | 日期 | 說明 |
|----|------|------|
| v1.0 | 2026-08-22 | 依主編已確認的 ROADMAP v0.2 展開為 22 個工項；建立大綱 ↔ 細項結構與 Agent 文檔 |
| v1.1 | 2026-08-25 | 佈局視角改自建渲染層（主編裁決）的連帶更新：§9 封鎖表 R-B2 退回封鎖並新增 R-C2／R-D4 兩列；§11 新增「渲染層落地前不把門檻必要項押在 L2」。**§1.2 已定案（藍圖格式）與 §2 工項總表（R-C2）的實際改寫另排 9 月首週 v1.2**，本版只登記封鎖與排程原則，未改動兩節內文。影響評估見 [LAYOUT_REWRITE_DISPATCH_IMPACT_0825](../aaaaa/LAYOUT_REWRITE_DISPATCH_IMPACT_0825.md) |
| v1.2a | 2026-08-30 | **W0831 發工前檢修（僅補註記，未改狀態）。** §8 的 09/06 列補上 B1 範圍收斂：新機器列表與現有五顆按鈕並存、不動 `EquipmentType`／`armPlacement`／`dataTransfer` 落子鏈，真實機器落子併入 09/13 B2 對接。連帶勘誤：[B1](./detail/B1_toolbar_real_machines.md) §4.3／§9 的 `machine.size`／`tag` 改為 `width`／`height`／`tags`；[B4](./detail/B4_selection_inspector.md) §4.1 的 `recipes[].name` 改為 `label`（`RecipeDef` 無 `name`）。兩處原文若照抄會產生無法編譯或必錯的實作 |
| v1.2 | 2026-08-30 | **依 W0823 完成度回寫狀態。** M1 成立（A1／A2 `[x]`）；A4 `[x]`、A3／B4／D1／D2／D3／E1／E2 `[~]`；§9 解除 D2／D3 全封鎖並記錄佈局 4／6 純函式進度；§8 週曆標註實績與 9 月產能備註；§9.1 記入首次完成率；§1.2 關鍵路徑加 shirone 轉調註記。**原排「9 月首週」的藍圖格式／R-C2 重訂仍待做，不在本版範圍**（延用 v1.1 註記，下一次改版號處理） |
