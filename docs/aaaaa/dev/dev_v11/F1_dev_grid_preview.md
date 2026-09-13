# V11-F1 — /dev 格點演示（本版必要）

**對應工項：** V11-F1  
**狀態：** `[x]` 完成（2026-08-31）  
**依賴：** D1／E1 可餵 fixture  
**最後更新：** 2026-08-31  
**正式依據：** A1 決策 8；W0831-A0「看得見格子」

---

## 1. 背景

A0 不以主畫布美觀為驗收，但本版將 `/dev` 格點升為**必要**：證明 L1 型別＋連線衍生＋拓樸結果看得見。

性質鎖：**L1 除錯工具**——fixture／local computed，**不接** `editorStore`，非正式 GridCanvas。

---

## 2. 技術決策（已落地）

| 項 | 作法 |
|----|------|
| 路由 | `/dev/layout-l1-preview`（dev-only guard） |
| 頁面 | `LayoutL1Preview.vue`：格點＋佔格＋管線色標＋連線／拓樸摘要 |
| 資料 | `src/data/mockLayout.ts`：`connected`／`broken` 兩態 |
| 函式 | `resolveConnections`／`toTopology`／`getDeviceOccupiedCells` |
| 不做 | GridCanvas、拖拉、Pinia |

---

## 3. 檔案計畫（已落地）

| 動作 | 檔案 |
|------|------|
| 新建 | `src/app/dev/LayoutL1Preview.vue` |
| 新建 | `src/data/mockLayout.ts` |
| 新建 | `src/__tests__/data/mockLayout.test.ts` |
| 修改 | `src/router/index.ts`、`src/app/dev/DevLayout.vue` |

---

## 4. 驗證標準

- [x] 開啟可見格子與設備／管線
- [x] 可切換「已連接」／「斷線」
- [x] 未 import editorStore
- [x] fixture 測試 2 綠；個人驗收步驟見下

### 4.1 個人驗收（30 秒）

```text
1. 開 /dev/layout-l1-preview
2. 預設「已連接」：兩台分流器＋綠線；摘要 from／to 非 null；edges=1
3. 點「斷線」：橙線；from／to null；edges=0
4. 確認未接主畫布／Pinia
```

---

## 5. 開發日誌

### 2026-08-31

- 落地預覽頁＋兩態 fixture；splitter 右出 index=1
- type-check 過；mockLayout＋layout 測 59 綠
