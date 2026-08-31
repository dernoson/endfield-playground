# V11-E1 — toTopology

**對應工項：** V11-E1  
**狀態：** `[ ]` 未開始  
**依賴：** B1、D1（連線衍生結果）  
**最後更新：** 2026-08-31  
**正式依據：** A1 決策 5；評估文 §4.8 Adapter 隔離 FlowEngine

---

## 1. 背景

FlowEngine（`useFlowEngine`）與既有測試吃 **nodes／edges** 形。佈局模型改為 devices／pipelines 後，需 adapter **隔離引擎本體**，避免本版改 1445 行引擎。

---

## 2. 技術決策

| 方案 | 作法 | 採用 |
|------|------|------|
| **A. 輸出現有 FactoryNode／FactoryEdge（或引擎建圖所需最小形）** | layout＋connections → nodes／edges | **是** |
| B. 全新拓樸型別，引擎另改 | 本版範圍過大 | 否 |

### 2.1 建議簽章（初稿）

```ts
function toTopology(
  devices: PlacedDevice[],
  pipelines: Pipeline[],
  connections: Connection[], // 通常＝resolveConnections(...)
): { nodes: /* 與現況相容 */; edges: /* 與現況相容 */ }
```

### 2.2 行為要點（初稿；驗證期修）

- **只為仍連接的端**產生可被引擎消費的邊；斷線管線：不進 edges，或進但標記 invalid（擇一釘死於測試）
- 節點 `data.machineType`＝`Machine.id`（方案 B 已定案）
- 位置：格子座標進 node；若現況 FactoryNode 仍為像素，轉換規則在測試與註解寫明（本版可先格子、於註記標「引擎入口換欄」）
- **不呼叫** Pinia；純函式

### 2.3 不做

- 不改 `useFlowEngine.ts` 本體
- 不改正式畫布

---

## 3. 檔案計畫

| 動作 | 檔案 |
|------|------|
| 新建 | `src/utils/layout/toTopology.ts` |
| 新建 | `src/__tests__/utils/layout/toTopology.test.ts` |
| 唯讀對照 | 現有 `FactoryNode`／`FactoryEdge`、`buildGraph` 入口 |

---

## 4. 驗證標準

- [ ] 最小 fixture：兩機＋一管線對齊 → 輸出可被型別接受的 nodes／edges
- [ ] 斷線 fixture：行為與 §2.2 釘死一致
- [ ] 單元測試綠

---

## 5. 開發日誌

### 2026-08-31

- 採 Adapter 方案；先依原定寫法，驗證期對齊引擎實際欄位
