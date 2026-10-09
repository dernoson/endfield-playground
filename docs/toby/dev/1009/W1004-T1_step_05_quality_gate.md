# W1004-T1 步驟 05：品質門檻與交付證據

狀態：未執行。前置：[步驟 04](./W1004-T1_step_04_visual_verification.md) 必要案例完成。

## 目標與範圍

驗證程式品質與改動邊界，整理實際證據。此步不新增產品功能，不以品質修正為由重構禁止檔案。

## 執行順序

1. 檢查 git diff、git status，分辨本次修改與實作開始前已存在的內容。
2. 若環境提供 validate-changes skill，依 AGENTS 規則使用；未提供時直接執行同等品質指令。格式修正僅針對本次修改檔案，不以全專案自動 fix 擴大 diff。
3. 依序執行以下必要指令並記錄退出碼與結果：

    ```text
    pnpm type-check
    pnpm lint-check
    pnpm format-check
    pnpm test
    ```

4. 測試包含既有 useGridViewport、deviceOccupancy、placementCheck、layoutStore 及新增的相關回歸測試。品質門檻仍要求完整 pnpm test，不能只以 targeted test 宣告交付。
5. Story 有修改時執行 `pnpm build-storybook` 並完成實際 Story 檢查；必要時以 `pnpm build` 補充正式產物驗證，build 不替代互動驗收。
6. 文件不在 package 的 format-check 範圍內，另執行：

    ```text
    pnpm exec prettier --check docs/toby/dev/1009
    git diff --check
    ```

7. 用 rg 搜尋 GridCanvas 的 store／Pinia import，並人工檢查其間接依賴。不可從 canvasStore import 常數後宣稱沒有 useStore 就合規。
8. 檢查 diff 未包含 MainLayout、ToolbarPanel template／style、StatsPanel、選取／旋轉／刪除互動、canPlaceDevice 出界拒絕、addDevice 簽章與 fixture 載入改動。
9. 複核工單 DoD：原 12×8 外可落子、自由畫布無框無 Error、選基地後框外 Error 仍可放置、GridCanvas 無 Pinia。

## 失敗處理

- 本次引入的錯誤在允許範圍內修正，再執行受影響檢查；新變更可能影響其他結果時重新跑完整必要門檻。
- 既有基準問題須記錄檔案、錯誤訊息與可重現證據，不擅自擴大本工單。
- 必須碰禁止檔案才可修正時，停止該修正並列上游阻礙；不得以旁路邏輯隱藏。
- 上游 devicesOutsideBase 未交付時，明列暫時接法與替換位置。區分「目前 T1 行為完成」與「共用函式接線待上游」兩種狀態。

## 最終交付內容

回報修改檔案、平移操作方式、基地切換與出界案例、品質指令結果、手動驗收證據與未解上游問題。更新本目錄分析與索引的實際狀態，不填入推測的測試數字。

本次文件建立不代表以上程式品質指令已執行。文件變更本身只需檢查格式、連結與 diff；程式實作階段才執行本步完整門檻。未經使用者明確指示，不 commit、push、建立 PR 或合併。
