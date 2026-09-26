# V14-D1 — 連線規則純函式（`connectRules`｜W0921-A1・次優）

**對應工項：** V14-D1
**狀態：** `[ ]` 未開始
**日期：** 2026-09-27
**依賴：** [C1](./C1_placement_precheck.md) 已交且有餘裕
**正式工單：** [W0921-A1](../../../work_dispatch/aaaaa/0921/W0921-A1_connect_rules.md)
**契約依據：** [roadmap/detail/C2 §4.1／§4.3／§4.4](../../../roadmap/detail/C2_add_connection_contract.md)
**擋門檻：** 否（原排 10/04；未交零影響）

---

## 1. 背景與動機

C2 規則表與 `ConnectResult` 形狀已於 V13／#51 凍結。本項**不做設計**，只把 §4 寫成程式。

排本週的理由：10/04 第一刀是錨點判定提共用（§4.4）——提前一週可降風險。但不得拖住 A0。

---

## 2. 技術決策

| 決定 | 理由 |
|------|------|
| **順序：先提共用，再寫 `canConnect`** | 反過來＝兩份錨點判定 |
| 回傳＝detail/C2 的 discriminated union | 與 `PlacementResult` 同形；`message` 不進 union |
| `describeConnectFailure` 另出 | L3 不組文案；L2 呼叫描述函式 |
| 規則 7 斷線放行必測 | 最容易被實作者照舊直覺擋掉 |
| 媒質判定共用引擎函式 | 禁止與 `useFlowEngine` 各寫一份 |
| **本週不動 `layoutStore`** | A0 同週在動；`addPipeline` 防線排 10/11 |
| **與 A0 分開 PR** | 標題帶 `W0921-A1` |

### 2.1 本週不做

| 不做 | 排程 |
|------|------|
| `addPipeline` 內部呼叫 `canConnect` | 10/11 |
| L2 draft highlight | toby／10/18 |
| 環路偵測 | 明確排除 |
| `createPlacedDevice` | WEEK §2.1 |

---

## 3. 檔案修改計畫

| 動作 | 檔案 | 說明 |
|------|------|------|
| 重構 | `src/utils/layout/resolveConnections.ts` | **先做**；錨點展開／命中提共用；對外行為不變 |
| 新建 | `src/utils/layout/connectRules.ts` | `canConnect`＋`describeConnectFailure` |
| 新建 | `src/__tests__/utils/layout/connectRules.test.ts` | 四條規則各一正一反、斷線放行、`malformed` |
| **不碰** | `src/store/layoutStore.ts`、`editorStore`、`src/editor/*` | |

型別可隨實作落在 `connectRules.ts` 或 `types/layout.ts`；以 detail/C2 §4.3 為準，不另開契約討論。

---

## 4. 測試計畫

- 方向／媒質／單埠單線／自連：各一正一反
- 規則 7：`from`／`to` 為 `null` → `ok: true`
- `malformed` waypoints
- `resolveConnections` 既有測試：**未修改**且全綠

---

## 5. 驗證標準（DoD）

對照 [W0921-A1 §4](../../../work_dispatch/aaaaa/0921/W0921-A1_connect_rules.md)：

- [ ] 錨點共用已提；`resolveConnections` 測試未改且全綠
- [ ] `canConnect` 回傳 union；無 `message` 欄
- [ ] 規則 7 專門測試
- [ ] 媒質判定與引擎共用（review 確認無複製）
- [ ] 品質閘全綠
- [ ] 與 A0 分開 PR；diff 不含 `layoutStore.ts`

---

## 6. 未交頂替

回到原排程 10/04，**零影響**。本項存在意義是提前吃掉 10 月首週風險，不是本週責任。

---

## 7. 開發日誌

### 2026-09-27

- 開版；列為正式次優項；契約指向 detail/C2，不重寫規則表
- 現況：`connectRules.ts` 不存在於 master
