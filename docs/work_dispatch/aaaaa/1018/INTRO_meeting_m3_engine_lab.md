# 會議報告｜aaaaa｜W1018：M3 引擎讀證明＋L1 契約 lab

| meta | value |
|------|-------|
| 週次 | 2026-10-18 → 2026-10-25（連線月第三週；**M3＝10/25**） |
| 對象 | 週會／協作者（aaaaa 本線） |
| 工單 | [W1018-A0](./W1018-A0_m3_engine_lab.md) |
| 公開驗收 | [WEEK §0.2 **V2**](../../WEEK_20261018.md)（C5 讀取鏈可演示） |
| 驗收說明 | [ACCEPTANCE_V2_c5_chain](./ACCEPTANCE_V2_c5_chain.md) |
| Lab 說明 | [LAB_l1_contract_guide](./LAB_l1_contract_guide.md) |
| 執行計畫 | [todolist_v18](../../../aaaaa/dev/todolist_v18.md)（分支 `dev/aaaaa1018`） |
| 上游已合 | [#72](https://github.com/dernoson/endfield-playground/pull/72) 寫入；[#74](https://github.com/dernoson/endfield-playground/pull/74) 引擎讀／機型 id；[#76](https://github.com/dernoson/endfield-playground/pull/76) 歷史隔離 |
| 撰寫 | aaaaa |
| 最後更新 | 2026-10-25（補埠幾何／L2 串接 FAQ） |

---

## 0. 三十秒結論

上週把「源設備能寫產出材料」和「引擎能用英文機型 id 算出每分鐘產量」都送進 master 了。  
**本週 aaaaa 不做新引擎大改**，只補兩件讓門檻日說得清楚的東西：

| # | 交什麼 | 為什麼 |
|---|--------|--------|
| **A** | **驗收步驟短文** | 別人能照做、重跑測試，證明「設完源素材 → 能測到產出」 |
| **B** | **L1 契約實驗室**（`/dev/l1-contract-lab`） | 把近幾版底層函式攤開給串接者看，不必只啃 PR diff |

負責人已裁 **A＋B 都交**。正式畫布上的「選材料下拉」與右側產耗大表**仍不做**（排後面）。  
toby 本週在做「兩台設備埠對埠拉管線」（公開 **V1**）；aaaaa **不改**他的畫布檔。

```text
本週要證明的資料流（碼已在 master；本週寫「怎麼驗」＋「怎麼看」）：

  設定源產出（#72）
        │  setDevicePrimaryOutput
        ▼
  設備上的 primaryOutput／每分鐘速率
        │
        ▼
  toTopology（把佈局翻成引擎看得懂的圖）
        │
        ▼
  流量引擎算出 30／min（#74 測試產線）
```

---

## 1. 本週工項（對週會講）

### 1.1 對照公開 WEEK

| WEEK | 誰 | aaaaa 關係 |
|------|-----|------------|
| **V1** 兩 port 拉線 | toby | **零檔案交集**（不碰 `GridCanvas`／`LayoutView`） |
| **V2** C5 鏈可演示 | **aaaaa** | 本報告主線＝A 步驟＋B lab |
| V3～V6 | 其餘 | 不擋、不串 aaaaa 鎖檔 |

### 1.2 兩件交付長什麼樣

| 件 | 過關長相 | 詳細檔 |
|----|----------|--------|
| A 驗收 | 指令重跑兩份單元測試全綠；或照步驟理解「寫入→拓樸→30/min」 | [ACCEPTANCE](./ACCEPTANCE_V2_c5_chain.md) |
| B Lab | `pnpm dev` 開 `/dev/l1-contract-lab`；有分頁說明與一鍵案例 | [LAB 指南](./LAB_l1_contract_guide.md) |

### 1.3 明確不做

- 正式頁「源素材下拉」UI  
- 右側產耗表整包接線  
- 再改一輪引擎／查表大重構  
- 發「解鎖句」（本週是證明與說明，不是放行新畫面能力）

---

## 2. 建議口頭節奏（約 3–5 分鐘）

1. **開場（15 秒）：** 寫入跟引擎讀都在 master；這週交「可重跑證明」和「給串接者看的 lab」。  
2. **為什麼現在（1 分）：** M3 要能講「源設完會有數字」；正式 UI 還來不及，所以用測試＋lab。  
3. **怎麼驗（1 分）：** 貼 ACCEPTANCE 裡那一行 `vitest` 指令；過＝V2 有證據。  
4. **lab 給誰用（1 分）：** L2／驗證／引擎串接；分頁 V14～V17；專有名詞見 LAB 指南詞彙表。  
5. **（可選 30 秒）埠怎麼認：** 拉線靠 `hitTestPortAt` 回傳的 `deviceId`＋`portIndex`，不是猜外一格；詳見 §2.1／LAB §5.3。  
6. **收尾：** 不擋 toby 拉線；本週文件＋lab 開 PR 合入。

---

## 2.1 給 L2（拉管線）的 FAQ｜埠幾何與「來源是哪台」

週會若被問到「線從設備外哪裡畫、怎麼知道是第幾個埠／哪一台機」，用這張表即可；完整說明見 [LAB §5.3](./LAB_l1_contract_guide.md)。

| 問 | 答（白話） |
|----|------------|
| port 資料存什麼？ | 機型上是 `side`＋`offset`＋`media`；連線存 **`PortRef`**＝`{ deviceId, portType, portIndex }`，**不是**只存座標。 |
| 「外一格」是什麼？ | **連線錨點格**（`resolvePortAnchorCell`）：刻意在佔格**外側**相鄰一格，給 `canConnect`／解析路徑用，避免管線端點跟設備同格誤報。 |
| 畫面上埠點在哪？ | **設備邊上的邊心**（`portPointOnMachine`）；滑鼠熱區圓心也在這裡（`hitTestPortAt`），**不是**外錨格心。 |
| L2 怎知是「第 2 個 port」？ | 按下時呼叫 `hitTestPortAt` → 回傳裡的 **`portIndex`** 存進 draft；整條線語意跟這份走。 |
| 兩台機外錨同格，怎知來源機？ | 起拖仍用 `hitTestPortAt`（比**視覺邊心**距離）；回傳的 **`deviceId`** 就是來源。不要只用外錨格 `findPortAt` 當起拖。 |
| L3 要自己查嗎？ | **通常不用**；L2 把高亮／線段起點做成 props 傳給 L3。 |

```text
起拖（L2）                          規則／存檔
  滑鼠點
    → hitTestPortAt  （邊心熱區）
    → 得到 PortRef（含 deviceId、portIndex）
    → draft 線帶著走
         → 放開：canConnect／addPipeline（外錨＋同一 PortRef）
```

---

## 3. 狀態速查（2026-10-25）

| 項 | 狀態 |
|----|------|
| 執行分支 | `dev/aaaaa1018` |
| A 驗收短文 | 已寫（執行層 [V18-C1](../../../aaaaa/dev/dev_v18/C1_m3_acceptance_steps.md)；公開層本資料夾 ACCEPTANCE） |
| B lab 碼 | 已 merge 進本週分支；隨本 PR 合入 |
| 埠／L2 FAQ | 本檔 §2.1＋[LAB §5.3](./LAB_l1_contract_guide.md) |

---

## 4. 相關連結

| 用途 | 連結 |
|------|------|
| 工單 | [W1018-A0](./W1018-A0_m3_engine_lab.md) |
| 週大綱 | [WEEK_20261018](../../WEEK_20261018.md) |
| C5 細項 | [C5_source_primary_output](../../../roadmap/detail/C5_source_primary_output.md) |
| 埠幾何／L2 串接（長文） | [LAB §5.3](./LAB_l1_contract_guide.md) |
| 上週會議檔（寫入／查表脈絡） | [INTRO_meeting_c5_primary_output](../1011/INTRO_meeting_c5_primary_output.md) |
