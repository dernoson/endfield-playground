# L1 契約實驗室（V14–V17）— 串接／呼叫端說明

| meta | value |
|------|-------|
| 頁面 | `http://localhost:5173/dev/l1-contract-lab` |
| 對象 | 畫布 L2、驗證、引擎、週會聽眾 |
| 對應 | [todolist_v14](./todolist_v14.md)～[todolist_v17](./todolist_v17.md) |
| 最後更新 | 2026-10-25 |
| 公開長文（建議先讀） | [LAB_l1_contract_guide](../../work_dispatch/aaaaa/1018/LAB_l1_contract_guide.md)（詞彙表＋各函式用途／串接） |

---

## 0. 為什麼有這頁

近幾版 PR（#54／#55／#60／#65／#72／#74／#76）多半是**底層純函式或 store 契約**，畫面上不容易「看出來」。  
本頁把契約做成：

1. **定義表**（符號／模組／誰呼叫／不要做什麼）
2. **一鍵案例**（呼叫真實 API，JSON 輸出）

方便其他串接者對照與自測，而不必只讀 diff。  
若需要「高中～大學程度」的完整說明與專有名詞解釋，請改讀公開 [LAB 指南](../../work_dispatch/aaaaa/1018/LAB_l1_contract_guide.md)。

---

## 1. 怎麼開

```bash
pnpm dev
# 左側 Dev 導覽 →「L1 契約實驗室」
# 或直接：http://localhost:5173/dev/l1-contract-lab
```

| 分頁 | 內容 |
|------|------|
| 總覽 | 四版一句話＋誤用對照 |
| V14 | `canPlaceDevice`／`canMoveDevice`／`canConnect` |
| V15 | `devicesOutsideBase`／`hitTestPortAt` |
| V16 | `toTopology` 映射 `primaryOutput`；可選 store 寫入（⚠） |
| V17 | `resolveMachineDef`、配方鍵、引擎 30/min、history 情境 |

深鏈專頁（更完整視覺卡）：

- V14 綠／紅卡：`/dev/placement-connect-check.html`
- layoutStore：`/dev/layout-store-preview.html`
- FlowEngine：`/dev/flow-engine`

---

## 2. 契約金句（務必記住）

| 主題 | 正確 | 錯誤 |
|------|------|------|
| 機型鍵（新模型） | 英文 `id`（`crusher`） | 以為引擎／驗證只認中文名 |
| 查定義 | `resolveMachineDef` | 新碼直接 `getMachine` 當權威 |
| 查配方 | `getRecipesForMachine(def.name, mode)` | `getRecipesForMachine('crusher')` |
| 落子預覽 | `canPlaceDevice` 回傳 | 自算 `detectOverlaps` |
| 埠熱區 | `hitTestPortAt`（連續格） | 用 `findPortAt` 當滑鼠熱區 |
| 源素材 | `layoutStore.setDevicePrimaryOutput` | 雙寫 `editorStore` |
| 引擎讀 | `toTopology` → 建圖 | 以為引擎直接 watch layoutStore |
| 正式頁開頁 | 空白（#58／H1） | 依賴自動 `connected` fixture |

---

## 3. 目錄資料來源

頁面文案集中在：

`src/app/dev/l1ContractLab/contractCatalog.ts`

改契約說明時優先改此檔，避免 Vue 模板散落。
