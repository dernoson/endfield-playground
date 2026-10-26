# 驗收工項說明｜公開 V2：C5 讀取鏈可演示（W1018-A0）

| meta | value |
|------|-------|
| 週次 | 2026-10-18 → 2026-10-25；門檻日 **M3＝10/25** |
| 對應公開驗收 | [WEEK_20261018 §0.2 **V2**](../../WEEK_20261018.md) |
| 工單 | [W1018-A0](./W1018-A0_m3_engine_lab.md) |
| 會議報告 | [INTRO_meeting_m3_engine_lab](./INTRO_meeting_m3_engine_lab.md) |
| 執行細項 | [V18-C1](../../../aaaaa/dev/dev_v18/C1_m3_acceptance_steps.md) |
| 撰寫 | aaaaa |
| 最後更新 | 2026-10-25 |

---

## 0. 這份文件在驗什麼

用一句話說：

> 在佈局資料裡替「源設備」設好要產出的基礎材料之後，經過官方約定的轉換與流量計算，**要能測到每分鐘產出數字**（示範產線為 **30／分鐘**）。

這裡不要求正式畫布上已經有漂亮的下拉選單；本週允許用**自動化測試重跑**當證明。視覺上想點按鈕看契約，請另開 [LAB 指南](./LAB_l1_contract_guide.md)。

| 名詞 | 白話 |
|------|------|
| **源設備** | 產線起點機器，本身不「加工」，只負責吐出某種基礎材料（資料裡常見 id：`material_source`，顯示名「基礎材料輸出點」）。 |
| **`primaryOutput`** | 欄位名：這台源設備「主要產出哪一種材料」（例如「源礦」）。 |
| **`sourceRatePerMin`** | 欄位名：每分鐘吐出多少個；省略設定時預設 **30**。 |
| **`toTopology`** | 函式名：把「佈局上的設備／管線／連線」翻成流量引擎看得懂的節點與邊。詳見 LAB。 |
| **流量引擎** | 依拓樸圖計算每條邊、每台機的物料速率（個／分鐘）的那套程式。 |

---

## 1. 過關標準（對齊 WEEK V2）

| # | 條件 | 過關長相 |
|---|------|----------|
| 1 | 能設定源產出 | 呼叫寫入 API 後，設備上出現 `primaryOutput`（與可選速率） |
| 2 | 經拓樸／引擎可測 | 示範產線算出源礦／加工後物料等速率為 **30／min** 量級 |
| 3 | 有書面步驟 | 本檔＋執行層 C1；主編／彩排可跟做 |
| 4 | 未踩鎖檔 | 驗收過程**不需要**改 toby 的 `GridCanvas`／`LayoutView` |

**備註：** 若只做 lab 可視化、不跑下列測試，**不足以**單獨宣告 V2 通過；lab 是輔助說明，測試是門檻證據。

---

## 2. 最快驗收（建議彩排用）

在專案根目錄、程式已含 [#72](https://github.com/dernoson/endfield-playground/pull/72)／[#74](https://github.com/dernoson/endfield-playground/pull/74) 的版本上執行：

```bash
pnpm exec vitest run src/__tests__/store/layoutStore.primaryOutput.test.ts src/__tests__/flowEngine.topology.layout.test.ts
```

| 測試檔 | 證明哪一段 | 你應看到 |
|--------|------------|----------|
| `layoutStore.primaryOutput.test.ts` | **寫入**（#72） | 設「源礦」後欄位＝源礦、速率 30；可 Undo；亂填 uid 不寫入 |
| `flowEngine.topology.layout.test.ts` | **讀取**（#74） | 英文機型 id 的三機產線 → `toTopology` → 引擎；多處 **30** |

**參考實測（2026-10-25）：** 2 個檔案、**8** 則測試通過。

---

## 3. 步驟說明（測試在模擬什麼）

### 3.1 寫入：放源並設定產出

對應 API（名稱保留英文，方便對程式）：

**`layoutStore.setDevicePrimaryOutput(uid, itemId, ratePerMin?)`**

| 參數 | 意思 |
|------|------|
| `uid` | 那一台已放置設備的唯一 id |
| `itemId` | 材料 id；傳 `null` 表示清除設定 |
| `ratePerMin` | 可省略；省略＝每分鐘 **30** |

預期：寫入進**操作歷史**（可 Ctrl+Z 還原那次設定）。找不到或重複的 uid → **什麼都不做、也不記歷史**。

> 正式頁目前**還沒有**給玩家點的下拉；測試與日後左面板都會走同一支 API。

### 3.2 讀取：佈局 → 拓樸 → 引擎

示範產線（與 #74 測試相同）：

| 角色 | 機型英文 id | 重點設定 |
|------|-------------|----------|
| 源 | `material_source` | 產出「源礦」、30／min |
| 加工 | `crusher`（粉碎機） | 預設模式 |
| 終點 | `item_sink`（物品輸入口） | 吃下游物料 |

管線用傳送帶（belt）依序串起。接著：

1. 呼叫 **`toTopology(...)`** 得到節點／邊  
2. 引擎依序建圖、檢查鏈、排序、傳播流量、彙總品項  
3. 讀數字：源吐出源礦 30；粉碎機吞吐 30；sink 收入 30  

若源**沒設** `primaryOutput`：機器仍可被辨認為「源」，但**不會出現產出數字**（這是對照行為，不是失敗例外）。

---

## 4. 失敗時怎麼查

| 你看到的現象 | 先問什麼 |
|--------------|----------|
| 源完全沒有產出數字 | 有沒有設 `primaryOutput`？ |
| 機型／配方像「全查無」 | `machineType` 是否為英文 id？查定義是否走 **`resolveMachineDef`**（見 LAB）？ |
| 寫入沒生效、歷史也沒加 | `uid` 是否存在且唯一？ |
| 速率不是 30 | 是否手動傳了別的 `ratePerMin`？ |
| 開 `/dev/flow-engine` 數字對不上佈局 | 該頁多半仍走**舊資料模型**；V2 請改跑 §2 的測試 |
| 正式頁找不到「選材料」 | 預期如此；本週不交表單 UI |

---

## 5. 與 lab、與其他人的邊界

| 對象 | 關係 |
|------|------|
| [LAB_l1_contract_guide](./LAB_l1_contract_guide.md) | 把 V14～V17 函式講清楚；**輔助**理解，不取代 §2 |
| [LAB §5.3](./LAB_l1_contract_guide.md)／[INTRO §2.1](./INTRO_meeting_m3_engine_lab.md) | 埠外錨 vs 視覺邊心、`PortRef`、同格多機時 L2 如何認來源——**給 toby C1 串接**，與本檔 V2 數字證明分開 |
| toby（公開 V1） | 拉管線 UI；aaaaa 驗收**不改**其鎖檔；起拖請用 `hitTestPortAt` 存 `PortRef` |
| 主編結算 | 以 `git`／測試結果與本檔步驟為準，不以口頭宣稱 |

---

## 6. 檢查清單（結算可勾）

- [ ] §2 指令在目標分支／master 上綠  
- [ ] 審查者理解 §3 產線與 30／min 意義  
- [ ] 未要求改 `GridCanvas`／`LayoutView`／`editorStore` 簽名  
- [ ] （加分）lab 頁可開，見 LAB 指南  
