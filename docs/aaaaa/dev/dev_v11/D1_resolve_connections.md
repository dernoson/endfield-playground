# V11-D1 — resolveConnections

**對應工項：** V11-D1  
**狀態：** `[x]` 完成（2026-08-31）  
**依賴：** B1（型別）、C1（`portAnchors` 路徑）  
**最後更新：** 2026-08-31  
**正式依據：** A1 決策 6；評估文 §1（連接為衍生值）

---

## 1. 背景

Vue Flow 邊綁死兩端節點，無法表達「刪設備後管線留在原地、斷線」。新模型：管線獨立；**連接每次重算**。

---

## 2. 技術決策

### 2.1 判定規則（已定案）

1. 對每條 `Pipeline`，取其 **waypoints 首／末** 為端點格  
2. 對每台 `PlacedDevice`，依 machine mode 埠＋rotation，用 `resolvePortAnchorCell` 得外側錨點格  
3. 端點格與某埠錨點**座標相等**（初稿比 **xy**）→ 該端掛上該埠  
4. 兩端皆掛上 → 產出一條衍生 `Connection`  
5. 任一端無對上 → **斷線**（`from`／`to` 對應側為 `null`）；**Pipeline 物件仍保留**

媒質／埠 media 不相容：初稿只做幾何；驗證期再修。

### 2.2 落地簽章

```ts
function resolveConnections(
  devices: PlacedDevice[],
  pipelines: Pipeline[],
  getMachine?: GetMachineFn, // 預設 getMachineById
): Connection[]
```

| 規則 | 值 |
|------|-----|
| Connection.id | `＝ pipelineId`（1:1） |
| 同格多埠 | 起點偏好 `output`、終點偏好 `input` |
| 未知 machineType | 該設備埠不進錨點表 |

### 2.3 不做

- 不寫入 store；不刪管線；不自動插入物流橋
- 不改 FlowEngine

---

## 3. 檔案計畫（已落地）

| 動作 | 檔案 |
|------|------|
| 新建 | `src/utils/layout/resolveConnections.ts` |
| 新建 | `src/__tests__/utils/layout/resolveConnections.test.ts` |

---

## 4. 驗證標準

- [x] 對齊→Connection；錯位→斷線且仍產出 Connection
- [x] 刪設備／空 devices：兩端 null
- [x] 單元測試綠（6）；layout 全測 53 綠；type-check 過

---

## 5. 開發日誌

### 2026-08-31

- 落地幾何對齊；id＝pipelineId；可注入 getMachine
- 測試：對齊／斷線／ orphan／半連／空 path／旋轉
