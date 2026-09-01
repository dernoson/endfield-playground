# V11-H1 — 工具列接真實機器（R-B1｜次優）

**對應工項：** V11-H1  
**狀態：** `[ ]` 未開始  
**依賴：** 無硬依賴 A0；**時數衝突讓位 A0**  
**最後更新：** 2026-08-31  
**正式依據：** [W0831-A1](../../../work_dispatch/aaaaa/0831/W0831-A1_toolbar_real_machines.md)

---

## 1. 背景

工具列現綁封閉 `EquipmentType` 五值；真實機器 id 不在聯集內。本週**不得**擴張落子鏈（屬 B2＋store）。定案：新增真實機器分類列表與五顆按鈕**並存**；點選＝本地態或 `console`。

---

## 2. 技術決策（工單已定，不重選）

| 做 | 不做 |
|----|------|
| ≥1 分類 Tab（建議「基礎生產」） | 刪改既有五顆 |
| `getMachinesByTag`／`MACHINE_TAGS` | 新查詢 API |
| 佔格 `` `${width}×${height}` `` | 文檔舊稱 `size` |
| 本地選取／console | `armPlacement`／`dataTransfer`／store 簽名 |
| 薄 TS selector 可加同目錄 | L3 卡片讀 `src/data` |

參考契約實例：`MachineCatalogPanel.vue`（不複製 UI）。

---

## 3. 檔案計畫

| 動作 | 檔案 |
|------|------|
| 主改 | `src/editor/toolbar/ToolbarPanel.vue` |
| 可選 | `src/editor/toolbar/toolbarMachines.ts`（純 selector） |
| 不碰 | `FactoryCanvas`／`FlowNodeOverlay`／`EquipmentType`／detector |

---

## 4. 驗證標準（對照 A1 DoD）

- [ ] ≥1 分類真實機器名＋佔格；抽查粉碎機 3×3 等
- [ ] 點選下一步於 PR 註明；未呼叫 store 落子
- [ ] 既有五顆落子／拖曳仍可用
- [ ] L3 未讀 `src/data`
- [ ] PR 下游消費者（含 S1／G1／B2 邊界）

---

## 5. 未交

不擋 L1 解鎖；9/6 演示弱化；9/27 B1 整包仍硬綁。

---

## 6. 開發日誌

### 2026-08-31

- 列為 V11 次優群組；契約照抄 W0831-A1
