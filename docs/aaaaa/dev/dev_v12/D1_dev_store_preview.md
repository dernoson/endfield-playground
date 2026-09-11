# V12-D1 — ／dev store 演示（週會必要）

**對應工項：** V12-D1  
**狀態：** `[ ]` 未開始  
**日期：** 2026-09-11  
**依賴：** [C1](./C1_layout_store.md)  
**正式依據：** 負責人 2026-09-11 定案「dev 演示頁仍需要，作為週會報告」

---

## 1. 背景

V11 已有 `/dev/layout-l1-preview`（純函式＋fixture，不經 store）。  
本版另做 **經 `layoutStore` 的演示頁**，供週會 30 秒證明：載入 → getter 衍生 connections → 可讀。

---

## 2. 技術決策

| 項 | 選擇 |
|----|------|
| 路由 | 建議 `/dev/layout-store-preview`（名稱可微調，須寫進驗收指南） |
| 資料 | `getMockLayoutScenario` → `toLayoutSnapshot` → `loadSnapshot` |
| 顯示 | devices／pipelines 列表或簡圖＋connections 摘要（from／to 是否 null） |
| 切換 | connected／broken 兩態 |
| 禁止 | import `editorStore`；接主畫布；改 GridCanvas |

可復用 L1 預覽的視覺片段，但**資料路徑必須經 store**，否則週會無法證明 C1。

---

## 3. 檔案修改計畫

| 檔 | 動作 |
|----|------|
| `src/app/dev/LayoutStorePreview.vue`（名稱可調） | **新建** |
| `src/router`（dev 路由區） | 加一條 dev-only |
| `GridCanvas.vue`／`ToolbarPanel`／`editorStore` | **不碰** |

---

## 4. 個人驗收（約 30 秒）

```text
1. pnpm dev → /dev/layout-store-preview
2. 預設已連接：loadSnapshot 後 connections 有非 null 端點（或摘要顯示已連）
3. 切斷線：管線保留；from／to 為 null（或摘要顯示斷線）
4. 確認頁面經 useLayoutStore，未接 editorStore
```

---

## 5. DoD

- [ ] 路由可開；兩態可切
- [ ] 資料路徑經 layoutStore
- [ ] 步驟寫入 [V12_acceptance_guide](./V12_acceptance_guide.md)

---

## 6. 開發日誌

### 2026-09-11

- 定案為本版必要；與 V11 L1 預覽頁分離
