# W0907-D0｜dernoson｜守閘、白紙審、合入順序

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | **確定**（決策／合入，不兼功能） |
| 擋門檻 | 否（但閘門失守會撤回 L2） |
| 上游 | [WEEK_20260907](../../WEEK_20260907.md) |
| 產能參考 | 3–5h，全額給守門 |

---

## 1. 本週定案（已裁，不用再等）

| # | 事項 | 結論 |
|---|------|------|
| 1 | **MachineCard 路徑** | **維持** `src/app/MachineCard/`（主編 9/07 確認）。[S1](../../shirone/0907/W0907-S1_machinecard_land.md) 改為「對白紙＋拆配方素材」，不再搬路徑 |
| 2 | **L2 本週開放範圍** | 「只讀渲染＋視窗座標」；擺放／選取仍鎖 |
| 3 | **L3 過審** | goodmorning G1、shirone S1：**白紙過審**是合入前提之一；你管技術／範圍，paper 管對稿 |

---

## 2. 仍要處理

| # | 事項 | 產出 | 期限 |
|---|------|------|------|
| A | 踩鎖三筆明文退件 | goodmorning `ToolbarPanel`×3、MBD `MainLayout`、avery `FactoryLayout`（U+2060）各一句理由 | 9/09 前 |
| B | #41 範圍對齊新 S1 | PR comment 寫明：路徑不動；本週加「對白紙」＋「素材拆到 `src/components`＋獨立 story」 | 發工單後盡快 |
| C | G1／S1 合入前確認 | 技術綠＋**paper 已回「過」** | 隨 PR |

---

## 3. 閘門判準（本週版）

| PR 內容 | 處置 |
|---------|------|
| 只讀渲染、視窗座標、純函式、Storybook（含 Toolbar／按鈕 story） | 可審 |
| G1／S1 視覺對稿未得 paper「過」 | **先掛著**，不硬合 |
| 改 `editorStore` 簽名、擺放／選取、加深 `FactoryCanvas`／Vue Flow | **退回** |
| toby 與 harry 同檔 | **退回後到者** |
| 網頁 Upload、檔名含不可見字元、檔落根目錄 | 退回，不例外 |
| G1 去改 `ToolbarPanel` 或做主 app 接線 | **退回**（交付只到 Storybook） |

---

## 4. 合入順序

**A0 → T1 → H1 →（paper 過後的）S1／G1 → 其餘加分。**  
#41 等 S1 兩項做完＋白紙過再合。待審維持 ≤3 條。

---

## 5. 不做（規則 17）

不寫 `layoutStore`、`GridCanvas`、`useGridViewport`。下游交不出來就延壓標 roadmap，不要自己吃。

---

## 6. DoD

- [ ] 踩鎖三筆各有退件理由送達
- [ ] #41 comment 已對齊「路徑不動＋本週兩項」
- [ ] 合入的 L3 皆有 paper「過」紀錄（G1／S1）
- [ ] 本週合入皆在宣告範圍內
- [ ] 自己的 diff 不含 layout 功能實作
