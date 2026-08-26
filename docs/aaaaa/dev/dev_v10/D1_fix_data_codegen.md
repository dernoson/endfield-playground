# V10-D1 — 修資料至全綠＋codegen

**對應工項：** V10-D1  
**狀態：** `[ ]` 未開始  
**依賴：** C1 初稿（至少有 `fault` 可分）  
**最後更新：** 2026-08-26  
**正式依據：** [W0823-A1](../../../work_dispatch/aaaaa/W0823-A1_grid_port_alignment.md) §4.2、[R-E1](../../../roadmap/detail/E1_data_codegen_ops.md)

---

## 1. 目標（決策 1：本週全綠）

**本週修正所有機器參數問題**，`machineGeometry.test.ts` 與 `dataConsistency.test.ts` **全綠**。

| 舊條款（不再採用） | 本版 |
|--------------------|------|
| 修不完按常用度排序，剩餘排 9/6 | **全部 `fault=data` 本週修完** |
| 測試可留待修案例 | **不得留** `skip`／`todo`／allowlist |

流程：

1. 改 `docs/aaaaa/data/machines.json`（唯一可手改權威）
2. `pnpm generate:src-data` → 更新 `src/data/machines.ts`
3. 兩份測試全綠
4. JSON 與產物**同一 commit**（避免 bisect 中段資料／程式不同步）

---

## 2. 固定流程

```text
1. 從 C1 取出所有 fault=data（含 both 的資料半邊）
2. 改 docs/aaaaa/data/machines.json
   - width／height
   - modes[].input_ports／output_ports 的 side／offset／media
3. pnpm generate:src-data
4. pnpm test（machineGeometry＋dataConsistency＋既有 machines.test）
5. 更新 C1：已修列標「V10-D1 已修」
6. 同 commit：JSON + src/data 產物 + 清單更新
```

若流程要求先 sync，依 R-E1；**權威在 `docs/aaaaa/data`**，勿手改 `src/data/*.ts`。

---

## 3. 修正順序（僅影響工作節奏，不影響範圍）

全綠是硬標準，順序只為讓演示機先就緒：

| 順位 | 對象 | 理由 |
|------|------|------|
| 1 | 演示用常用加工機（粉碎機 `crusher`／塑型機 `shaping_machine`） | [E1](./E1_dev_placement_demo.md) 演示頁與 8/30 截圖需要 |
| 2 | 多 mode 機（灌裝機等） | 埠錯影響 C1 port hit／E001 下游 |
| 3 | 其餘 `fault=data` | 收尾至全綠 |

---

## 4. 全綠的三種例外情形與處置

「全綠」指**資料側**全綠。以下三類不算資料未修，但**必須在清單留列並在 PR 說明**：

| 情形 | 判定 | 處置 |
|------|------|------|
| 測試綠、畫面錯 | `fault=render` | 只記錄；owner＝待佈局層落地後轉單 |
| 錯在 `geometryUtils`／`portUtils` 本身 | 工具函式 bug | 不重構（本週唯讀）；清單 `note` 記明＋另開單；若導致測試無法綠，**當日上報 dernoson** |
| 錯在 codegen stub | 需改 `generate-src-data.mjs` | 最小改動只修錯值、不動 schema；PR 標明（見 [A1](./A1_scope_decision.md) §2.3） |

**遊戲原始數值有疑義時**（JSON 寫的與遊戲實際不同、無可靠來源可核）：不猜。以「幾何／埠合法性」為修正判準（例如 offset 超出邊長必為錯），語意層存疑者記入清單 `note` 並在 PR 列為待核項——這是唯一可能讓「全綠」需要主編裁量的情形，見 [F1](./F1_acceptance_and_pr.md) §6。

---

## 5. 禁止

- 改 `FactoryCanvas`／`FlowNodeOverlay`／Pinia action／L3
- 重構 `geometryUtils`／`portUtils`
- 為讓畫面「看起來對」而改渲染
- 手改 codegen 產物、或改產物後不跑 generate
- 用 `skip`／`todo`／allowlist 讓測試「看起來綠」

---

## 6. DoD

- [ ] `fault=data`（含 `both` 資料半邊）**全部**已改 JSON＋codegen
- [ ] `machineGeometry.test.ts`＋`dataConsistency.test.ts` **全綠、無例外標記**
- [ ] `src/data/machines.ts` 與 JSON 一致（無手改遺跡）
- [ ] JSON ＋ 產物 ＋ 清單更新為同一筆 commit
- [ ] §4 三類例外皆已在清單留列並於 PR 說明

---

## 7. 開發日誌

### 2026-08-26

- 建立細項；綁定 R-E1 codegen 紀律
- 決策 1 落版：取消「剩餘排 9/6」彈性，改本週全綠；新增 §4 例外情形與 §5 禁止 skip／allowlist
