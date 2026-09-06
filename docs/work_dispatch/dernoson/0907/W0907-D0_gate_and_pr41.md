# W0907-D0｜dernoson｜裁 #41、守 L2 閘門

| meta | value |
|------|-------|
| 週次 | 2026-09-07 → 2026-09-13 |
| 等級 | **確定**（決策／合入，不兼功能） |
| 擋門檻 | 否（但閘門失守會撤回 L2） |
| 上游 | [WEEK_20260907](../../WEEK_20260907.md)、[personal_profile §2.4](../../../aaaaa/collaborator_survey/personal_profile/README.md) |
| 產能參考 | 3–5h，全額給守門 |

---

## 1. 本週要裁的三件事

| # | 事項 | 需要的產出 | 期限 |
|---|------|-----------|------|
| 1 | **[PR #41](https://github.com/dernoson/endfield-playground/pull/41) 的 MachineCard 路徑** | 一句話定案：留在 shirone 現行位置，或搬到 `src/components/MachineCard/`。**裁完直接寫進 PR comment**，shirone 的 [S1](../../shirone/0907/W0907-S1_machinecard_land.md) 等這句才動 | **9/09 前**（週三） |
| 2 | **L2 本週開放範圍** | 確認＝「只讀渲染＋視窗座標」，擺放／選取仍鎖。若你要放寬，改的是 [WEEK_20260907](../../WEEK_20260907.md) §2，不是口頭 | 發工單當天 |
| 3 | **踩鎖三筆的處置** | 明文退件（不是沉默不合）：goodmorning `ToolbarPanel`×3、MBD `MainLayout`、avery `FactoryLayout`（檔名含 U+2060） | 9/09 前 |

第 3 項要**寫一句理由給當事人**。上週三人都自報「已完成／已開 PR」，沉默不合會讓他們下週原樣再交一次。

---

## 2. 閘門判準（本週版）

| PR 內容 | 處置 |
|---------|------|
| 只讀渲染、視窗座標、純函式、Storybook | 可審 |
| 改 `editorStore` 簽名、擺放／選取落子、加深 `FactoryCanvas`／Vue Flow | **退回**，附一句範圍依據 |
| toby 與 harry 動到同一個檔 | **退回後到者**，不自行合併 |
| 網頁 Upload、檔名含不可見字元、檔落根目錄 | 退回，不例外 |

**退回時只寫「超出 9/06 宣告範圍」＋連結**，不要幫對方改。

---

## 3. 合入順序

**#41 → A0 → T1 → H1 → 加分。** 待審維持 ≤3 條。

---

## 4. 不做（規則 17）

上週你交了 Storybook 11 筆基建，範圍拿捏正確（未搶 layout）。本週**維持同一條線**：

- 不寫 `layoutStore`、不寫 `GridCanvas`、不補 `useGridViewport`。
- 下游交不出來的正確處置是**延壓並在 roadmap 標示**，不是自己吃下。你是全隊唯一 gate，時間吃掉的是決策品質。

---

## 5. 備援

你若本週不可用，**不指定暫代 review**——一律延壓到你回來，並在 Discord 說一聲。本週沒有任何工項的門檻條件綁在「一定要合入」。

---

## 6. DoD

- [ ] #41 路徑已裁並寫進 PR comment（9/09 前）
- [ ] 踩鎖三筆各有一句退件理由送達當事人
- [ ] 本週合入的 PR 皆在宣告範圍內；範圍外者有退回紀錄
- [ ] 週末待審 ≤3 條
- [ ] 自己的 diff 不含 `src/store/layoutStore.ts`、`src/editor/layout/*`
