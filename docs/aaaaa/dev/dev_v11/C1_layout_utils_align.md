# V11-C1 — 既有 layout utils 檔名對齊與補測

**對應工項：** V11-C1  
**狀態：** `[ ]` 未開始  
**依賴：** A1（可與 B1 平行；改名不依賴新領域型別）  
**最後更新：** 2026-08-31  
**正式依據：** A1 決策 7；評估文 §4.7

---

## 1. 背景

規劃檔寫 `portAnchors.ts`；現況為 `portAnchor.ts`。另有 `deviceOccupancy` 無獨立 `__tests__/utils/layout/` 測（僅經 `machineGeometry` 間接）。決策：**對齊檔名＋補測**。

---

## 2. 技術決策

| 項 | 作法 |
|----|------|
| 改名 | `portAnchor.ts` → `portAnchors.ts`；測試檔同步 |
| 匯出 | 維持 `resolvePortAnchorCell` 函式名（語意已準；不強制加 s） |
| 補測 | 新增 `deviceOccupancy.test.ts`：旋轉 0–3、d／z 展開 |
| 其餘 | `pipelineGeometry`／`overlapDetection` 已有測 → 回歸確認全綠 |
| 消費者 | 更新 `E001_deviceOverlap.ts`、註解中的路徑字串 |

---

## 3. 檔案計畫

| 動作 | 檔案 |
|------|------|
| 改名 | `src/utils/layout/portAnchor.ts` → `portAnchors.ts` |
| 改名 | `src/__tests__/utils/layout/portAnchor.test.ts` → `portAnchors.test.ts` |
| 新建 | `src/__tests__/utils/layout/deviceOccupancy.test.ts` |
| 修改 import | `src/lib/validation/detectors/E001_deviceOverlap.ts` |
| 修改註解 | `src/app/dev/topologyPortUtils.ts`（路徑字串） |

---

## 4. 驗證標準

- [ ] 全專案無殘留 `@/utils/layout/portAnchor` import
- [ ] layout 相關測試全綠
- [ ] type-check／lint／format 過

---

## 5. 開發日誌

### 2026-08-31

- 依決策 7 開細項
