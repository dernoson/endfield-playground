# W0823-S1｜shirone｜E001 設備重疊純函式（R-D2 提前打底）

| meta | value |
|------|-------|
| 週次 | 2026-08-23 → 2026-08-30 |
| 對應 roadmap | [R-D2](../../roadmap/detail/D2_e001_overlap_alert.md) §6 切片「08/23」 |
| 等級 | **確定**（加分打底；**不**列 8/30 門檻） |
| 擋 8/30 門檻 | **否**（失敗可延 9 月；11/8 才需接右側 UI） |
| 性質 | 純函式＋測試（**本週只做這一種**） |
| 預估時數 | **本週只給這一塊**，吃完即停（勿順手擴 E002／右側列表） |
| review_gate | dernoson（**必查**：有無 AI dump、是否 import Vue／Pinia、是否走官方型別） |
| **先讀** | [GUIDE_e001_context_pitfalls](./GUIDE_e001_context_pitfalls.md)（座標語意、測試 fixture、PR 步驟） |
| 狀態 | `[x]` 已完成 |

---

## 0. 一句話

交一份**可 review 的單一 PR**：官方契約下的 `E001_deviceOverlap`（`Detector.run(ctx)`）＋ Vitest；兩個物件佔同一格且佔用層有交集就產出一條繁中 alert。**不接右側 UI、不做 E002。**

---

## 1. 四欄工單

| 欄 | 內容 |
|----|------|
| **畫面** | （本週無正式 UI）在測試裡：兩台重疊 → 有 `code: 'E001'` 的 alert；分開 → 空陣列。另在 `/dev/validation-test` 註冊後可實際看到警示筆數變動 |
| **交哪個檔** | 重建／完成 `src/lib/validation/detectors/E001_deviceOverlap.ts`；`src/__tests__/lib/validation/detectors/E001_deviceOverlap.test.ts`（重疊／不重疊／含 rotation） |
| **不要碰** | Vue／Pinia、`FactoryCanvas`、右側 Tips、E002／E003／azure 的 W001、任何 `opus.ts`／`sonnet.ts`／AI 草稿檔進正式樹 |
| **卡住找誰** | dernoson（PR／format／合入）；幾何／佔格展開行為問 aaaaa |

---

## 2. 為何是你、範圍怎麼切

| 依據 | 結論 |
|------|------|
| 本週可做 | detector 純函式＋Vitest；此域可當 Owner |
| 本週不做 | store action、Vue 事件、L3、Flow 結果顯示 → **全禁** |
| 要避開的失敗模式 | AI 草稿先進樹、平行路徑、commit 訊息空 → 工單硬性禁止（見 §5） |
| 與 azure 的分工 | 同域不同 ID → 本週**只做 E001**；代碼唯一性由 `spec/03_validation.md` §2.2 代碼表約束 |
| 註冊在哪 | detector 由使用端顯式 `registerDetector`；本階段唯一使用端是 `src/app/dev/ValidationTest.vue`，不動主畫布組裝 |
| 想找範例的話 | `src/lib/validation/detectors/E001_deviceOverlap.ts` 本身即為官方契約的範例；測試骨架見 [GUIDE §3](./GUIDE_e001_context_pitfalls.md) |

**本週不做：** 右側警訊列表、點擊導覽、E002。

> **2026-08-24 修訂（dernoson 與 shirone 合議）：** 原列於本行的「管線重疊（那是實驗 API 的事）」已自「本週不做」移除。
> 合議結論：管線重疊與設備重疊在格點佔用層級是同一件事，共用同一張稀疏格點表即可同時判定；
> 拆成兩個 detector 會讓同一段碰撞邏輯出現兩份實作。故 E001 涵蓋管線重疊屬範圍內，不計為違規。
> 詳見 §9 的 2026-08-24 條目。

---

## 3. 名詞（L2 引導：只講本週會碰到的）

| 詞 | 意思 | 你要做的 |
|----|------|----------|
| **Detector** | 純函式規則物件：`{ code, level, run(ctx) }` | 匯出 `E001_deviceOverlap` 符合 `src/types/validation.ts` |
| **ValidationContext** | 輸入：`devices`、`connections`、`getDef`、`baseRegion` | `run` 只讀這些，不讀 store |
| **Alert** | 輸出一筆警示：`uid`、`level`、`code`、`message`、`relatedDeviceUids`… | `message` 用繁中完整句，含設備名；L3 不拼字串 |
| **純函式** | 同輸入同輸出；不改全域、不碰 DOM | **禁止** `import` 任何 `vue`／`pinia`／`*.vue` |
| **registerDetector** | 把 detector 掛進 `validationStore` | 由使用端顯式呼叫；本階段在 `src/app/dev/ValidationTest.vue` 註冊，不動主畫布組裝 |
| **幾何模組** | `src/utils/layout/`：`deviceOccupancy`（設備佔格）、`pipelineGeometry`（管線路徑）、`overlapDetection`（格點表與配對） | 佔格與路徑展開的單一來源，直接用，不要自寫 |
| **(z, d)** | 佔用層起點與佔用深度；`occupiedLayers = { z … z+d-1 }` | 見 `spec/03_validation.md` §2.2.1 |

---

## 4. 開工前檢查

- [ ] 已讀 [D2](../../roadmap/detail/D2_e001_overlap_alert.md) §4.2–§4.3、§6（08/23 切片）、§7 不做
- [ ] 打開型別：`src/types/validation.ts` 的 `Detector`／`Alert`／`ValidationContext`
- [ ] 打開幾何：`src/utils/layout/` 的 `deviceOccupancy`、`pipelineGeometry`、`overlapDetection`（**用這套，不要自寫格子展開**）
- [ ] 打開佔格型別：`src/types/footprint.ts` 的 `DeviceFootprint`、`PipelineFootprint`

---

## 5. 步驟

### 5.1 實作 `E001_deviceOverlap.ts`

契約（對齊 D2 §4.3）：

```text
把 ctx 轉成佔格描述後交給格點表：
  設備：ctx.getDef(device.data.machineType) 缺定義 → skip
        → DeviceFootprint { position: {x, y, z}, size: {width, height, d} }
  管線：依 data.portType 決定 z，waypoints = 起點埠 + bendPoints + 終點埠
        → PipelineFootprint
  detectOverlaps(devices, pipelines) → 回傳去重後的重疊配對 [idA, idB]
  每組配對推一筆 Alert
```

Alert 建議欄位：

| 欄 | 值 |
|----|-----|
| `code` | `'E001'` |
| `level` | `'error'` |
| `message` | 例如「設備「粉碎機」與「塑型機」位置重疊」（用 `def.name` 或 label，勿只丟 uid） |
| `relatedDeviceUids` | `[idA, idB]` |
| `relatedConnectionUids` | `[]` |
| `uid` | `crypto.randomUUID()` 或測試可注入的穩定策略 |

同一對物件只報**一條**——`detectOverlaps` 已把配對以字典序正規化後去重。

**座標語意：** `ctx.devices[].position` 與 `data.bendPoints` 都是格子座標，換算在 `useValidation.buildContext()` 完成。detector 內不做任何單位換算（ctx 沒有 `gridSize`，硬取就得 import store）。

### 5.2 測試 `E001_deviceOverlap.test.ts`

至少覆蓋：

1. 兩台分開 → `run` 回傳 `[]`
2. 兩台重疊 → 恰好一條，`code === 'E001'`，`relatedDeviceUids` 含兩者
3. **rotation** 造成重疊／不重疊各至少一例（佔格展開已處理 0/1/2/3）
4. 缺 `getDef` → 不炸、該對 skip

測試裡組最小 `ValidationContext`（假 `devices`＋假 `getDef` 即可），**不要**啟動 Vue。

### 5.3 開 PR（沒開過也沒關係，照下面五步）

1. 分支建議：`dev/shirone-e001`（或主編慣例）
2. **一個 detector 一個 PR**；標題示例：`feat(validation): E001 device overlap detector + tests`
3. PR 描述至少三行：做了什麼／怎麼測（`pnpm test` 指令）／**明確寫「未接右側 UI」**
4. 跑過：`pnpm type-check`／`lint-check`／`format-check`／`test`
5. 請 dernoson review；他可能幫 format——這是預期，不是失敗

### 5.4 硬性禁止（review 一票否決）

- 提交 `opus.ts`／`sonnet.ts`／大型 AI dump
- 在 detector 內 `import` Vue／Pinia
- 本週順便做 E002／右側列表／點擊導覽
- 新增平行目錄代替 `src/lib/validation/detectors/`

---

## 6. DoD（本週切片；非整包 D2）

- [ ] `E001_deviceOverlap.ts` 存在且匯出符合 `Detector`
- [ ] `E001_deviceOverlap.test.ts` 通過（含旋轉案例）
- [ ] detector **不** import Vue／Pinia（PR 自檢＋ review）
- [ ] 單一 PR，無 AI dump 檔
- [ ] `pnpm type-check`／`lint-check`／`format-check`／`test` 通過
- [ ] PR 描述註明：右側正式 UI 不在本週，並附上 `/dev/validation-test` 的實測結果  

（完整 D2 門檻「右側出現訊息」屬 11 月，**不是**本週 DoD。）

---

## 7. 未交頂替

不擋 8/30。未交 → 延到 9 月同一塊；必要時由 aaaaa 接手（幾何已是 CR-04 產出，接手成本低，見 D2 §10）。

---

## 8. 回報

| 時機 | 動作 |
|------|------|
| 開工 | Discord 丟一句「開始 E001」即可 |
| PR 開好 | @ dernoson；附測試指令 |
| 卡住超過一天 | 直接問 dernoson／aaaaa，不要再開平行檔「先做著」 |

---

## 9. 開發日誌（派工側）

### 2026-08-23

- 依 D2 §6（08/23）切片正式派工
- 註明現況：E001 已自正式樹移除；`overlapDetector` 為非官方契約 → 本週重立官方 E001
- 不擋 8/30；禁止 AI 大檔與平行樹擴張

### 2026-08-24

- **合議修訂（dernoson × shirone）：管線重疊納入 E001 範圍。** 原 §2「本週不做」列有「管線重疊（那是實驗 API 的事）」，經雙方討論後撤銷。理由：管線與設備的重疊在格點層級是同一個判定，共用同一張格點表即可同時得出，拆成兩個 detector 只會產生重複的碰撞邏輯。
- 據此，`dev/shirone0824` 交付的 `E001_deviceOverlap` 會產出管線自我重疊 Alert 一事 **不計為違反工單**，review 不得以此項退件。
- 本次合議**只處理範圍問題**。§1「不要碰 `overlapDetector.ts`」與 §5.4 第三條（`overlapDetector`／`shironesMachine` 不得作為 E001 實作基礎）**仍然有效、狀態未定**，實作要走哪一套幾何待另行裁決。

### 2026-08-30

- 幾何收斂：佔格與路徑展開遷入 `src/utils/layout/`，成為佔格計算的單一來源
- 座標語意統一：`useValidation.buildContext()` 完成像素到格子的換算，`ValidationContext` 對外保證格子座標
- 佔用層編碼採 (z, d)，`spec/03_validation.md` §2.2.1 同步
- E001 於 `/dev/validation-test` 註冊，警示可實際觀察；工單狀態結案
- 08-24 條目留下的「實作走哪一套幾何」已裁決：`src/utils/layout/` 為單一來源，§1 與 §5.4 的相關限制隨之解除
