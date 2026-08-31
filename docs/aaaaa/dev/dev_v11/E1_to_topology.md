# V11-E1 — toTopology

**對應工項：** V11-E1  
**狀態：** `[x]` 完成（2026-08-31）  
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
| **A. 輸出現有 FactoryNode／FactoryEdge** | layout＋connections → nodes／edges | **是** |
| B. 全新拓樸型別，引擎另改 | 本版範圍過大 | 否 |

### 2.1 落地簽章

```ts
function toTopology(
  devices: PlacedDevice[],
  pipelines: Pipeline[],
  connections: Connection[],
  getMachine?: GetMachineFn,
): { nodes: FactoryNode[]; edges: FactoryEdge[] }
```

### 2.2 行為（測試釘死）

| 項 | 規則 |
|----|------|
| 邊納入 | **僅** `from` 與 `to` 皆非 null → 進 `edges`；斷線**不進** edges |
| handle | `out-{n}`／`in-{n}` |
| machineType | `Machine.id`（方案 B） |
| position | **格子** x／y（非像素；檔頭註記） |
| bendPoints | waypoints 去掉首尾；單位同 position |
| edge.data.portType | pipeline.media |
| Pinia | 不呼叫 |

### 2.3 不做

- 不改 `useFlowEngine.ts` 本體
- 不改正式畫布

---

## 3. 檔案計畫（已落地）

| 動作 | 檔案 |
|------|------|
| 新建 | `src/utils/layout/toTopology.ts` |
| 新建 | `src/__tests__/utils/layout/toTopology.test.ts` |
| 驗證 | 輸出可被 `buildGraph(nodes, edges)` 消費 |

---

## 4. 驗證標準

- [x] 兩機＋完整連線 → nodes／edges；`buildGraph` 可建邊
- [x] 斷線 → edges 空、nodes 仍在
- [x] 單元測試 4 綠；layout 全測 57；type-check 過

---

## 5. 開發日誌

### 2026-08-31

- Adapter 落地；斷線不進 edges；格子座標註記
- 與 `buildGraph` 串測通過
