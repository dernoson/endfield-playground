# V12-C1 — layoutStore 契約

**對應工項：** V12-C1  
**狀態：** `[ ]` 未開始  
**日期：** 2026-09-11  
**開發分支：** `dev/aaaaa0907`  
**正式依據：** [W0907-A0](../../../work_dispatch/aaaaa/0907/W0907-A0_layout_store_model.md) §2–§3、[A1_scope_decision](./A1_scope_decision.md)

---

## 1. 背景與動機

L2 本週可用 props／fixture 畫只讀殼，但 9/14 整合需要**單一讀寫入口**。  
平行新建 `layoutStore`，組既有純函式，**不**改 `editorStore`。

---

## 2. 技術決策

| 項 | 選擇 | 理由 |
|----|------|------|
| 形狀 | 單一 Pinia setup store | 契約面單純；不必多一層 composable |
| 衍生連線 | `computed`／getter 呼叫 `resolveConnections` | 對齊 `types/layout` 開頭約定 |
| 唯讀 | return 對 devices／pipelines／connections 包 `readonly()` | L2 不應直接 mutate |
| 放置失敗 | `PlacementResult`，不 throw | UI 要畫紅框需回傳值 |
| 演算法 | 只組 `utils/layout/*` | 禁止在 store 重寫幾何 |

### 2.1 讀取面簽章（PR body 用；實作可微調命名）

```ts
function useLayoutStore(): {
  readonly devices: Readonly<PlacedDevice[]>;
  readonly pipelines: Readonly<Pipeline[]>;
  readonly connections: Readonly<Connection[]>; // getter
  loadSnapshot(snapshot: LayoutSnapshot): void;
  toSnapshot(): LayoutSnapshot;
  addDevice(device: PlacedDevice): PlacementResult;
  removeDevice(id: string): void;
  moveDevice(id: string, position: Position): PlacementResult;
  addPipeline(pipeline: Pipeline): PlacementResult; // 或 void＋另檢；初稿建議回傳
  removePipeline(id: string): void;
};
```

> 實作時若 `addPipeline` 不做佔格檢查，可回 `{ ok: true }` 或改 `void`——**須在測試與 PR 簽章寫死**，並 Discord 一行通知。

### 2.2 Action 行為摘要

| Action | 行為 |
|--------|------|
| `loadSnapshot` | 覆寫 devices／pipelines（深拷貝建議） |
| `toSnapshot` | 匯出 `{ devices, pipelines }`（不含 connections） |
| `addDevice`／`moveDevice` | 重疊 → `{ ok: false, reason: 'overlap' }`；成功才寫入 |
| `removeDevice` | 刪設備；管線保留（可斷線） |
| `addPipeline`／`removePipeline` | 管線 CRUD；不維護 Connection state |

---

## 3. 檔案修改計畫

| 檔 | 動作 |
|----|------|
| `src/store/layoutStore.ts` | **新建** |
| `src/__tests__/store/layoutStore.test.ts` | **新建** |
| `src/types/layout.ts` | 必要時補 `PlacementResult`／`PlacementFailReason` |
| `src/store/editorStore.ts` | **不碰** |
| `src/editor/layout/GridCanvas.vue` | **不碰** |
| `src/editor/toolbar/ToolbarPanel.vue` | **不碰** |

---

## 4. 驗證標準（釘 W0907-A0 §3 四點）

1. `connections` 隨 devices／pipelines 變；非獨立可寫 state  
2. 重疊放置回傳 `ok: false`，不 throw；成功路徑 `ok: true`  
3. 讀取面不可直接 mutate（或 mutate 不影響 store 內部——以選定 `readonly` 策略測死）  
4. `loadSnapshot(toLayoutSnapshot(scenario))` → `toSnapshot()` 與輸入等值（devices／pipelines）

另：`editorStore` 既有測試原樣綠。

```bash
pnpm type-check
pnpm test src/__tests__/store/layoutStore.test.ts
pnpm test src/__tests__/store/editorStore.test.ts
```

---

## 5. DoD

- [ ] `layoutStore.ts` 可編譯
- [ ] 四點測試綠
- [ ] editorStore 測原樣綠
- [ ] type-check 綠
- [ ] 未改硬鎖檔

---

## 6. 開發日誌

### 2026-09-11

- 細項落檔；簽章與 PlacementResult 初稿寫入 A1／本檔
