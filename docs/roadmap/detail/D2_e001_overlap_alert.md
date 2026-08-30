# R-D2 — E001 重疊警訊上右側

| meta | value |
|------|-------|
| 對應大綱 | [ROADMAP_OUTLINE.md](../ROADMAP_OUTLINE.md) §6 |
| 里程碑 | M4（2026-11-29）；首次可演示 11/8 |
| 擋門檻 | **是**（主編步驟 8） |
| 建議主責／備援 | shirone（純函式）＋L2（列表接線）／aaaaa |
| 性質 | 純函式 ＋ 接線 |
| 依賴 | [A2](./A2_grid_and_port_alignment.md)、[B2](./B2_placement_chain.md) |
| 狀態 | `[~]` 可開工（純函式與幾何已就位，dev 頁可觀察） |
| 最後更新 | 2026-08-30 |

---

## 1. 背景與動機

E001「設備重疊」是整套驗證系統裡最容易解釋、最容易演示、也最容易寫測試的一條規則：兩台設備佔到同一格就報錯。它被選為 11/29 的警訊門檻，正是因為它能在 30 秒內演示完畢，而不需要理解配方或流量。

基礎設施已齊備：`validationStore` 的 detector 註冊機制、`ValidationContext`（座標為格子座標）、`src/utils/layout/` 的佔格與路徑展開模組、`E001_deviceOverlap` 的偵測邏輯與測試都已就位，並在 `/dev/validation-test` 註冊後可實際觀察。缺的是把 `alerts` 映射到右側列表。

風險在於**同一問題報兩條**。shirone 與 azure9572 在同一領域用不同 ID 開發，代碼唯一性由 `spec/03_validation.md` §2.2 的代碼表約束。

## 2. 使用者看得到什麼

把兩台設備疊在一起，右側 Tips 區出現一條看得懂的訊息，例如「設備 A 與設備 B 位置重疊」；把它們分開，訊息消失。

## 3. 現況盤點

| 對象 | 路徑 | 現況 |
|------|------|------|
| detector 檔 | `src/lib/validation/detectors/E001_deviceOverlap.ts` | 設備與管線重疊皆已涵蓋 |
| 驗證 store | `src/store/validationStore.ts` | 註冊機制已有 |
| 組裝 | `src/composables/useValidation.ts` | `ValidationContext` 已完整，座標為格子座標 |
| 幾何 | `src/utils/layout/deviceOccupancy.ts`、`pipelineGeometry.ts`、`overlapDetection.ts` | 佔格、路徑展開、格點表偵測 |
| Dev 頁 | `src/app/dev/ValidationTest.vue` | 已註冊 E001，可實際觀察警示 |
| 右側 Tips 列表 | — | **不存在**，本項要補 |

## 4. 技術決策

### 4.1 註冊入口

detector 由使用端顯式呼叫 `validationStore.registerDetector()` 掛上；本階段唯一的使用端是 `src/app/dev/ValidationTest.vue`。註冊點跟著消費端走，不另立集中檔——集中檔會變成一份必須與實際消費端同步維護的第二份真相。

代碼唯一性由 `spec/03_validation.md` §2.2 的代碼表約束：同一個問題只能有一個代碼，shirone 與 azure 的重疊由該表裁決（見 [D3](./D3_recipe_alerts.md)）。

### 4.2 detector 硬規則（沿用既有）

1. **禁止 import Vue／Pinia**。detector 是純函式，吃 `ValidationContext`、吐 alert 陣列。
2. 一個 detector 一個 PR，附測試。
3. 不得在 L3 跑 detector。

### 4.3 重疊判定

```text
設備與管線展開成佔格後，共用同一張稀疏格點表：
  for 每個物件的每一格 cell：
      if 表中該格已有其他物件 id → 記為配對 [existingId, id]（字典序去重）
      表中該格 append 本物件 id
```

複雜度是 O(總佔格數)，與物件數呈線性。佔用層 (z, d) 直接展開成第三軸的格點，因此層別交集不需要額外的條件判斷（見 `spec/03_validation.md` §2.2.1）。

### 4.4 alert 的顯示契約

L2 把 `validationStore.alerts` 映射成列表 props：

| prop | 說明 |
|------|------|
| `level` | `error` ｜ `warning` |
| `code` | 例如 `E001` |
| `message` | 完整繁中句子，含設備名稱 |
| `relatedDeviceUids` | 相關設備 uid（供未來點擊導覽用，本階段可不實作點擊） |
| `relatedConnectionUids` | 相關管線 uid，同上 |

訊息文案在 detector 內組好，L3 不拼字串——與 [B4](./B4_selection_inspector.md)、[C2](./C2_add_connection_contract.md) 一致。

### 4.5 點擊導覽

點警訊跳到對應設備列為**下一階段**，本項只顯示。這一條要寫進工單，否則很容易變成「順便做一下高亮」而拖到 11/29。

## 5. 檔案計畫

| 動作 | 檔案 | 說明 |
|------|------|------|
| 修改 | `src/lib/validation/detectors/E001_deviceOverlap.ts` | `run()` 真實邏輯 |
| 新建 | `src/__tests__/lib/validation/detectors/E001_deviceOverlap.test.ts` | 重疊／不重疊／旋轉後重疊 |
| 修改 | `src/composables/useValidation.ts` | `buildContext()` 換算為格子座標 |
| 修改 | `src/app/dev/ValidationTest.vue` | 註冊 E001 供觀察 |
| 新建或修改 | `src/components/StatsPanel/AlertList/Index.vue` | L3 警訊列表；只吃 props |
| 修改 | `src/editor/stats/ProductionStats.vue` | L2：`alerts` 映射成列表 props |
| **不碰** | Vue／Pinia in detector、E004／W001（[D3](./D3_recipe_alerts.md)）、點擊導覽 | |

## 6. 週切片

| 週日 | 切片 |
|------|------|
| 08/23 | （提前打底，已交）shirone 交 E001 純函式＋測試；幾何收斂至 `src/utils/layout/` |
| 11/01 | 右側 Tips 列表元件（L3）與 L2 的 `alerts` 映射 |
| 11/08 | **兩台重疊 → 右側出現一條訊息** |
| 11/29 | **門檻：** 重疊警訊穩定，分開後消失 |

E001 純函式刻意提前到 8/23 打底（見 [W0823-S1](../../work_dispatch/shirone/W0823-S1_e001_device_overlap.md)），失敗可延到 9 月，不擋 8/30。

## 7. 不做

- 不做點擊警訊導覽到設備
- 不做警訊的忽略／靜音功能
- 不做 E002／E003 或其他未列入的 detector
- 不在 detector 內碰 Vue／Pinia

## 8. 依賴與封鎖

| 項目 | 說明 |
|------|------|
| [A2](./A2_grid_and_port_alignment.md) | 佔格展開若吃錯 size，重疊判定必然錯 |
| shirone 與 azure 的 ID 衝突 | 由 [D3](./D3_recipe_alerts.md) 一併裁決 |

## 9. DoD

- [ ] 兩台設備重疊 → 右側出現一條含設備名稱的可懂訊息
- [ ] 分開後訊息消失
- [ ] 旋轉造成的重疊也能偵測（依賴 [B3](./B3_rotation_90.md)）
- [ ] `E001_deviceOverlap.test.ts` 通過，含旋轉案例
- [ ] detector 不 import Vue／Pinia（code review 確認）
- [ ] E001 已在 `/dev/validation-test` 註冊並實際產出警示
- [ ] 警訊列表元件不 import store
- [ ] `pnpm type-check`／`lint-check`／`format-check`／`test` 通過

## 10. 風險與未交頂替

| 風險 | 對策 |
|------|------|
| 同一問題報兩條（shirone／azure 重複） | `spec/03_validation.md` §2.2 代碼表為唯一 ID 來源；同一代碼只能有一個實作 |
| shirone 交 AI 大檔（`opus.ts`／`sonnet.ts` 之類） | 工單明寫不得提交進正式樹；一個 detector 一個 PR |
| detector 悄悄 import Pinia | DoD 列入 import 檢查 |
| 順手做點擊導覽而延誤 | §4.5 明寫下一階段 |

**未交頂替：** UI 列表若未交，可暫時把 alert 以純文字列在 StatsPanel 底部，門檻仍成立。

## 11. 開發日誌

### 2026-08-22
- 建檔。註冊入口集中被列為封鎖解除前提，理由是 shirone／azure 同域不同 ID 的既有風險

### 2026-08-30
- 幾何收斂至 `src/utils/layout/`，佔用層編碼改採 (z, d)，`ValidationContext` 座標統一為格子座標
- 註冊入口改為使用端顯式註冊；E001 已於 `/dev/validation-test` 掛上，封鎖解除
- 11/01 切片改為右側 Tips 列表與 L2 映射
