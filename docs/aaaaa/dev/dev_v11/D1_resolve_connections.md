# V11-D1 — resolveConnections

**對應工項：** V11-D1  
**狀態：** `[ ]` 未開始  
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
3. 端點格與某埠錨點**座標相等** → 該端掛上該埠  
4. 兩端皆掛上 → 產出一條衍生 `Connection`  
5. 任一端無對上 → **斷線**（`from`／`to` 對應側為 `null`）；**Pipeline 物件仍保留**

媒質／埠 media 不相容：初稿可先只做幾何對齊，不相容標註於 Connection 或測試待決；**驗證階段再修**（見 A1 §2.1）。

### 2.2 建議簽章（初稿）

```ts
function resolveConnections(
  devices: PlacedDevice[],
  pipelines: Pipeline[],
  // 查埠所需：getMachine 或預先解析的 port layout 表
): Connection[]
```

實作細節（埠列表取 `modes[].input_ports`／`output_ports`、旋轉用既有 `rotatePort*`）依原定演算法先寫；fixture 釘死再對行為。

### 2.3 不做

- 不寫入 store；不刪管線；不自動插入物流橋
- 不改 FlowEngine

---

## 3. 檔案計畫

| 動作 | 檔案 |
|------|------|
| 新建 | `src/utils/layout/resolveConnections.ts` |
| 新建 | `src/__tests__/utils/layout/resolveConnections.test.ts` |

---

## 4. 驗證標準

- [ ] 對齊→Connection；錯位→斷線且 pipeline 仍在（測試）
- [ ] 刪設備情境：僅剩管線、兩端 null（或一端 null）可表達
- [ ] 單元測試綠

---

## 5. 開發日誌

### 2026-08-31

- 規則依決策 6 落檔；簽章初稿驗證期可修
