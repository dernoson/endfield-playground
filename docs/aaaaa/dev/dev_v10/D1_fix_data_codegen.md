# V10-D1 — 修資料至全綠＋codegen

**狀態：** `[x]` 本批無 JSON 待修（I1 已解測試紅）  
**依賴：** C1 初稿  
**最後更新：** 2026-08-26

---

## 1. 目標（決策 1：本週全綠）

本批 B1 失敗經 C1／I1 判定為 **utils**，非 `machines.json`。  
**D1 本週動作：** 確認無真正 data 列 → **不改 JSON、不跑 codegen**；全綠由 I1 達成。

| 舊假設 | 實際 |
|--------|------|
| 修完所有 fault=data JSON | 本批 fault 初標 data 實為 utils |
| 測試全綠靠改資料 | 測試全綠靠 `rotatePort` pad-to-square |

---

## 2. DoD

- [x] 確認 C1：無待改 JSON 的 data 錯
- [x] `machineGeometry`＋`dataConsistency` 全綠（I1 後 388）
- [x] 未手改 `src/data/machines.ts`
- [x] 清單已標 utils 已修

---

## 3. 開發日誌

### 2026-08-26

- 建立細項時假設有 JSON 待修
- I1 結案後：本項改為「確認無需改資料」並勾選完成
