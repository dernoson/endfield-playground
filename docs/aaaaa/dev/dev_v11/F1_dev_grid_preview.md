# V11-F1 — /dev 格點演示（本版必要）

**對應工項：** V11-F1  
**狀態：** `[ ]` 未開始  
**依賴：** D1／E1 可餵 fixture（可先 hardcode layout fixture）  
**最後更新：** 2026-08-31  
**正式依據：** A1 決策 8；W0831-A0「看得見格子」

---

## 1. 背景

A0 不以主畫布美觀為驗收，但本版將 `/dev` 格點升為**必要**：證明 L1 型別＋連線衍生＋（可選）拓樸結果看得見。

性質鎖（同 V10-E1）：**L1 除錯工具**——local state／fixture，**不接** `editorStore`，不視為 L2／GridCanvas 產品化。

---

## 2. 技術決策

| 項 | 作法 |
|----|------|
| 路由 | `/dev/` 下新頁（建議名 `layout-l1-preview` 或等價）；dev-only guard |
| 內容 | 格點底圖＋fixture 設備佔格＋管線 path；標示衍生 Connection／斷線 |
| 資料 | 內嵌 `mockLayout` fixture 或 `data/mockLayout.ts`（評估文 §4.7） |
| 可選 | 呼叫 `toTopology` 旁路顯示 nodes／edges 摘要 |
| 不做 | 正式 GridCanvas、拖拉落子、Pinia |

可沿用藍本思路：`DevTopologySvg.vue`／`topologyPortUtils`／`MachineShape`——**只當參考，不強迫複製 UI**。

---

## 3. 檔案計畫

| 動作 | 檔案 |
|------|------|
| 新建 | `src/app/dev/…` 預覽頁（檔名實作時定） |
| 可選 | `src/data/mockLayout.ts` 或同目錄 fixture |
| 修改 | dev 路由索引（既有 `/dev` hub） |

---

## 4. 驗證標準

- [ ] 開啟頁面可見格子與至少一組 fixture 設備／管線
- [ ] 可辨識「已連接」與「斷線」至少各一態（或切換 fixture）
- [ ] 未 import／呼叫 editorStore 寫入 action
- [ ] 個人驗收步驟寫入 G1 證據

---

## 5. 開發日誌

### 2026-08-31

- 決策 8：本版必要；非 stretch
