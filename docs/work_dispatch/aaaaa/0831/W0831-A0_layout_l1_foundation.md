# W0831-A0｜aaaaa｜佈局 L1 打底（SVG 自建｜**最優先**）

| meta | value |
|------|-------|
| 週次 | 2026-08-31 → 2026-09-06 |
| 對應 | 佈局自建提前開工（[EARLY_START](../../../aaaaa/LAYOUT_REWRITE_EARLY_START_0831.md) **已定案**）；解鎖 [R-B2](../../../roadmap/detail/B2_placement_chain.md) |
| 等級 | **確定** |
| 優先級 | **全隊本週最高**（時數與 B1 衝突時 **本單優先**） |
| 擋門檻 | **否**（直接擋的是後續 L2；9/27 硬綁仍是 B1） |
| 性質 | L1 純函式／型別／契約（**本週只做這一種優先**） |
| 預估時數 | **盡量吃滿**；B1 見 [A1](./W0831-A1_toolbar_real_machines.md) 為次優 |
| review_gate | dernoson（合入；**不**代寫） |
| 工單風格 | 目標＋邊界＋契約；不附教學 |
| 狀態 | `[x]` 解鎖句已發（見 V11-G1／PR）；合入待 dernoson |

---

## 0. 目標

推進佈局視角 **SVG 自建** 的 L1 打底，讓下週起 L2 **有資格**接殼——但解鎖條件是你的**完成宣告**，不是「做了一半」。

本週理想產出（能做多少算多少，**優先深度優於廣度**）：

1. `resolveConnections` 與／或 `toTopology` **至少一支可測**（或明確 PR 標進度與缺什麼）  
2. `types/layout` 或等價型別／模型草圖與 Breaking 註記（`devices`／`pipelines`）  
3. （有餘力）最小殼或 dev 頁「看得見格子」的**前置**——不要求本週完成 GridCanvas 產品化  

---

## 1. 邊界

| 欄 | 內容 |
|----|------|
| **畫面** | 本單不以主畫布美觀為驗收；以測試綠／型別可編譯／PR 可審為準。若有 dev 格點演示更好 |
| **交哪個檔** | `src/utils/layout/**`、相關 `types`、必要測試；契約說明可短寫在 PR |
| **不要碰** | 舊 `FactoryCanvas`／`FlowNodeOverlay` 加深、L3 卡片、全員派工長文、替 dernoson 寫功能 |
| **卡住找誰** | 裁示／合入：dernoson。資料機台：自己（codegen） |
| **若路線不可行** | 回報後改，不要沉默改 store 簽章散彈 |

---

## 2. L2 解鎖宣告（本單 DoD 核心）

進度夠解鎖時，Discord **或** PR 留一句（可複製）：

```text
layout-L1：<已完成項>；L2 可開 <允許的下一刀>
```

例：`layout-L1：toTopology 可測已推；L2 可開最小 GridCanvas 只讀渲染`

**未發此句 → 全隊 L2 強綁項維持等待**（含下週）。

---

## 3. DoD

- [x] 本週有可審的 L1 進度（函式／型別／測試至少一條主線）  
- [x] 未加深舊 Vue Flow 佈局畫布  
- [x] （若達解鎖條件）已發 §2 宣告；未達則 PR／Discord 寫明「尚未解鎖、缺什麼」  
- [x] `pnpm type-check`／`lint-check`／`format-check`／`test` 對你改動的範圍可過  

### 解鎖句（已發）

```text
layout-L1：types/layout + resolveConnections + toTopology 可測已推；L2 可開最小 GridCanvas 只讀渲染（仍待 store 模型另開）
```

## 4. 未交頂替

無。延誤 → 下週 L2 **不得**開強綁項；大綱 §8／§9 改期。

## 5. 與 A1（B1）關係

| 單 | 優先 |
|----|------|
| **A0（本單）** | **最優** |
| [A1](./W0831-A1_toolbar_real_machines.md) | **次優**；9/6 仍盡力演示，但時數衝突時讓位 A0 |
