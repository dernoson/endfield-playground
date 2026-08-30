# W0831-S1｜shirone｜L3 學習元件＋E001 交接

| meta | value |
|------|-------|
| 週次 | 2026-08-31 → 2026-09-06 |
| 對應 | 轉調 L3（已定案）；交接給 aaaaa，支撐 [R-D2](../../../roadmap/detail/D2_e001_overlap_alert.md) |
| 等級 | **加分**（過渡；**不**列門檻必要） |
| 擋門檻 | **否** |
| 預估時數 | **6–10h**；兩件吃完即停 |
| review_gate | dernoson |
| 工單風格 | **只寫目標／邊界／驗收。不附 GUIDE、不寫步驟。** 不理解再問 |
| 狀態 | `[ ]` 未開始 |

---

## 0. 目標

1. 一個單檔展示元件（props／emit 你定）
2. 一頁 E001 現況給 aaaaa

---

## 1. 邊界

| | |
|--|--|
| **元件長相** | `/dev` 或臨時頁看得到一塊 UI；工廠主題即可 |
| **元件檔** | `src/components/` 下一新資料夾＋`Index.vue`（路徑你定，PR 寫清） |
| **交接** | `docs/shirone/` 或 PR 描述，**一頁為上限** |
| **不要碰** | store、把事件接到 `editorStore`、新 detector、改 `src/utils/layout`、再開平行驗證樹 |
| **對照實例**（不是步驟） | 已合入的 `src/components/BaseRegionSelector/Index.vue` |
| **E001 現況檔** | master 上的 `E001_deviceOverlap.ts` |

認為單檔路徑或交接範圍不可行：**回一句再改**，不要自己加 detector。

---

## 2. 驗收

元件：有 props、至少一個 emit、不 import store／`src/data/*`。  
交接：aaaaa 讀完知道 E001 在哪、測什麼、還缺什麼。

---

## 3. 未交

不計失敗。交接未交 → aaaaa 自己盤 master（成本較高）。
