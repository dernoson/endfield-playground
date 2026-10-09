# V15-D1 — 埠命中判定（`hitTestPortAt`｜W1004-A0 ③）

**對應工項：** V15-D1
**狀態：** `[x]` 完成（2026-10-10）
**日期：** 2026-10-10
**依賴：** [A1](./A1_scope_decision.md) `[x]`、[B1](./B1_v14_residue_close.md) `[x]`
**正式工單：** [W1004-A0 §2](../../../work_dispatch/aaaaa/1004/W1004-A0_dispatch_and_e003.md)、[C1 §4.2–4.3](../../../roadmap/detail/C1_port_hit_and_draft.md)
**對照公開驗收：** WEEK §0.2 **V10**
**開發分支：** `dev/aaaaa1004`
**產物：** `src/utils/layout/portHitTest.ts`、`src/__tests__/utils/layout/portHitTest.test.ts`

---

## 1. 背景與動機

C1 要「按埠拖線」。命中判定必須吃 rotation／mode／格點，與 A2／`rotatePort` 同源。放在 L2 容器會變成第三套埠算法。

**本版只交純函式。** draft 狀態＝L2 local ref（C1 §4.1 方案 C），不是本項。

---

## 2. 與既有 `findPortAt` 的關係

| API | 位置 | 語意 |
|-----|------|------|
| **既有** `findPortAt(anchors, x, y, prefer?)` | `portAnchorIndex.ts` | 格點**精確匹配**；供 `resolveConnections`／`canConnect` |
| **本項** `hitTestPortAt` | `portHitTest.ts` | 滑鼠／點的**熱區**命中（半徑 ≥ 半格） |

**已決（A-1＝A）：** 兩支並存；舊函式不動。

---

## 3. 技術決策

| 決定 | 狀態 | 說明 |
|------|------|------|
| 函式名／檔 | **已決** | `hitTestPortAt`＠`src/utils/layout/portHitTest.ts` |
| 熱區半徑 ≥ 半格 | **已凍結** | 預設 `DEFAULT_HIT_RADIUS_CELLS = 0.5` |
| 輸入座標 | **已決＝格點** | 像素下限由 L2 換算 |
| 錨點 | **共用** `collectPortAnchors` | 不另寫第三套 |
| 回傳 | **PortRef＋side＋media** | `PortHitResult` |
| 多埠 | 最近距離；並列→掃描序較前 | JSDoc 已釘 |

### 3.1 簽章（已決／已實作）

```text
hitTestPortAt(
  point: { x: number; y: number },
  devices: readonly PlacedDevice[],
  getMachine?: GetMachineFn,
  options?: { hitRadiusCells?: number }
) → PortHitResult | null
// PortHitResult = PortRef & { side, media }
```

---

## 4. 檔案

| 動作 | 檔案 |
|------|------|
| 新建 | `src/utils/layout/portHitTest.ts` |
| 新建 | `src/__tests__/utils/layout/portHitTest.test.ts` |
| **不碰** | `portAnchorIndex.findPortAt`、`GridCanvas`、C1 UI、`layoutStore` |

---

## 5. 測試

| # | 案例 | 狀態 |
|---|------|------|
| 1 | 點在埠錨點上 → 命中 | `[x]` |
| 2 | 熱區邊緣（距離＝0.5）→ 命中 | `[x]` |
| 3 | 熱區外 → null | `[x]` |
| 4 | 四種 rotation | `[x]` |
| 5 | 多埠取最近；等距取掃描序 | `[x]` |
| 6 | 無 store import（讀檔斷言） | `[x]` |

回歸：`connectRules`／`devicesOutsideBase` 同跑綠。

---

## 6. 驗證標準（DoD）

- [x] B-1＝PortRef 擴充
- [x] 匯出 `hitTestPortAt`＋測試；熱區 ≥ 半格；輸入格點；回傳 PortRef＋side＋media
- [x] 共用 `collectPortAnchors`／`rotatePort`
- [x] 無 Pinia import；未實作 draft UI
- [x] 相關 vitest／eslint／prettier 綠
- [x] 給 C1 L2 一句（見下）

### 6.1 給 C1 L2（PR／USAGE）

```text
hitTestPortAt(gridPoint, devices) → PortHitResult | null
gridPoint＝格點（非整數可）；預設熱區 0.5 格。
命中後用 deviceId/portType/portIndex 組 PortRef；side/media 已附帶。
放開連線仍走 waypoints → canConnect（精確 findPortAt）；本函式只負責「點中哪一埠」。
```

---

## 7. 開發日誌

### 2026-10-10｜完成

- 實作＋10 測綠；舊 `findPortAt` 未改
- 下一刀＝V15-E1（驗收／PR）

### 2026-10-10｜B-1 定案

- 負責人裁回傳＝PortRef＋side＋media；簽章釘死

### 2026-10-10

- 建檔
