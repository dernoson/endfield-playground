# W0831-S1｜shirone｜MachineCard（正式 L3）

| meta | value |
|------|-------|
| 週次 | 2026-08-31 → 2026-09-06 |
| 對應 | 轉調 L3（已定案）；[R-B1](../../../roadmap/detail/B1_toolbar_real_machines.md) L3 卡片 |
| 等級 | **加分**（**不**列門檻必要） |
| 擋門檻 | **否**（未交→aaaaa 暫時列表） |
| 預估時數 | **6–10h**；吃完即停 |
| review_gate | dernoson |
| 工單風格 | **只寫目標／邊界／驗收。不附 GUIDE、不寫步驟。** 不理解再問 |
| 狀態 | `[ ]` 未開始 |

---

## 0. 目標

交一個正式機器卡片元件：別人傳名稱與佔格進來，你顯示出來；點一下對外喊「選了這台」。

**不做** E001 交接、不做練習用臨時元件。E001 現況已由主編寫進近日 PR。

本單**不強綁**佈局 L1：可與 aaaaa 的 SVG 打底並行。L2 畫布／選取與你無關。

---

## 1. 邊界

| | |
|--|--|
| **畫面** | 卡片可見名稱＋佔格（例：「粉碎機」「3×3」）；點一下有 `pick` |
| **交哪個檔** | **只准** `src/components/MachineCard/Index.vue` |
| **props** | 必做 `id`／`name`／`sizeText`；可選 `tag`／`iconUrl` |
| **emit** | `pick(machineId: string)` |
| **不要碰** | store、`src/data/*`、`ToolbarPanel`、detector、`src/utils/layout`、新開平行驗證樹 |
| **對照實例**（不是步驟） | `src/components/BaseRegionSelector/Index.vue` |

路徑或 props 形狀不可行：**回一句再改**，不要自己加第二個元件或接 store。

---

## 2. 驗收

- 檔在指定路徑；有 props／至少一個 emit  
- 不 import store／`src/data/*`  
- 別人用假 props 掛上後看得到兩張卡、點一下收到對應 id  

## 3. 未交

不計失敗。Toolbar 維持暫時列表。
