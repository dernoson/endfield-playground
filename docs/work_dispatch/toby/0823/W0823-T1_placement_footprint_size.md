# W0823-T1｜toby｜選取設備資訊上 Inspector（R-B4 提前切片）

> **⚠ 2026-08-25 改指向：本單的交付標的已更換。**
> 原標的（`FlowNodeOverlay.vue` 節點佔格尺寸）因渲染層方案調整，該檔已排入 9 月廢除清單，本週再改會白做。
> 新標的見 §1，性質（接線）、時數（≤2h）、驗收方式與加分等級**全部不變**。
> 檔名維持不變，是為了讓 8/23 已發出的連結不失效——**不是**忘了改。
>
> **你已於 8/25 回覆「還沒開工」，本單即以新標的為準**，直接從 §1 開始看即可。

| meta | value |
|------|-------|
| 週次 | 2026-08-23 → 2026-08-30 |
| 對應 roadmap | [R-B4](../../../roadmap/detail/B4_selection_inspector.md)（提前做「選取 → 顯示設備資訊」；完整選取面板門檻在 9/27） |
| 原對應 | ~~R-B2 預覽佔格讀真實 size~~（8/25 改指向，見頁首） |
| 依賴提醒 | [R-A2](../../../roadmap/detail/A2_grid_and_port_alignment.md) 本週由 aaaaa 修資料；你顯示出來的 `width`/`height` 以 codegen 後為準 |
| 等級 | **確定**（加分項；**不**列 8/30 必要條件） |
| 擋 8/30 門檻 | **否**（未交不擋；頂替＝Inspector 維持現況） |
| 性質 | 接線（**本週只做這一種**） |
| 預估時數 | **≤2h**（假日為主；一週**只這一塊**） |
| review_gate | dernoson（**必查 AI 直推**；禁改 store 簽章） |
| mentor | dernoson（Vue／三層）；尺寸資料 aaaaa |
| **先讀** | 本檔 §5 有完整程式骨架，照抄即可。~~[GUIDE_node_footprint_notes](./GUIDE_node_footprint_notes.md)~~ 已隨舊標的暫停適用 |
| 狀態 | `[ ]` 未開始 |

---

## 0. 一句話

在畫布上點一台設備，**左側 Inspector 就顯示那台機器的名稱、佔格（`寬×高`）與耗電**——全程只讀 store、不呼叫任何 action、不碰畫布檔，**兩小時內能演示完就收工**。

### 0.1 開工狀態（已確認，無須再處理）

2026-08-25 你回覆「還沒開工」→ **走新標的，舊標的作廢。**

原本準備的回退條款（已開工者照舊完成 overlay）**不再適用**。`FlowNodeOverlay.vue`／`FactoryCanvas.vue` 本週**不要動**，那兩個檔已排 9 月廢除。

---

## 1. 四欄工單

| 欄 | 內容 |
|----|------|
| **畫面** | 點畫布上一台設備 → 左側 Inspector 出現「設備資訊」區塊，顯示機器名稱、佔格 `3×3`、耗電；點空白處或多選時顯示「未選取設備」之類的空狀態；截圖或 ≤30 秒錄影 |
| **交哪個檔** | **只有一個：** `src/editor/inspector/InspectorPanel.vue` |
| **不要碰** | `FactoryCanvas.vue`／`FlowNodeOverlay.vue`（已排廢除，改了也是白改）、`editorStore` 簽章與任何 action、`nodes.push`、自組 Command、`historyStore.execute`、`selectionStore` 內容、管線、`ToolbarPanel.vue`（見 §2 末）、新元件、長文件 |
| **卡住找誰** | Vue／三層：dernoson；`getMachine`／尺寸不對：aaaaa。**卡超過一次就問，不要硬做** |
| **範例 PR** | 你自己 8/12 那次（`BaseRegionSelector/Index.vue` 接進 `Navbar.vue`）就是本週要的形狀：改正式路徑、單一主題、可截圖驗收——照同樣節奏做即可 |

---

## 2. 為何改成這塊

| 依據 | 結論 |
|------|------|
| 原標的已排廢除 | `FlowNodeOverlay.vue`（141 行）與 `FactoryCanvas.vue`（499 行）都在 9 月的廢除清單上 |
| 新標的**確定保留** | `InspectorPanel.vue` 在渲染層變更的盤點裡屬「不動」——你這次寫的東西不會被刪 |
| 性質沒變 | 一樣是「接線」：把 store 裡的資料攤成畫面。符合「同一人同一週一種性質」 |
| 時數沒變 | ≤2h；而且比原標的**更單純**（全唯讀，沒有 CSS 旋轉與 `transform-origin` 的坑） |
| 一樣是提前切片 | 原本是 R-B2 的提前切片，現在是 [R-B4](../../../roadmap/detail/B4_selection_inspector.md) 的提前切片，結構相同 |
| 額外好處 | aaaaa 本週在修機器資料，**你這塊是全隊最快看出資料對不對的地方**——點一台機器就知道佔格數字有沒有修對 |

**本週不做：** 編輯設備屬性（改配方／改環境／改名稱）、多選時的彙總、刪除按鈕、管線資訊、把面板拆成新元件。**唯讀顯示就好。**

**為什麼不是工具列（`ToolbarPanel.vue`）：** 那看起來像個好目標，但工具列的五個按鈕綁在一個叫 `EquipmentType` 的封閉型別上，要讓它顯示真實機器就得同時改 `editorStore` 的函式簽章與畫布的型別守衛——那是 9 月 R-B1 整包的範圍，塞不進 2 小時。**不要自己跑去改它。**

---

## 3. 名詞（L2 引導：只講這塊會碰到的）

| 詞 | 白話 | 你要遵守的 |
|----|------|------------|
| **L2（容器）** | 接滑鼠／鍵盤，讀 store，把資料攤成畫面 | `InspectorPanel.vue` 就是 L2，**可以** import store（L3 才禁止） |
| **`selectionStore.selectedNodeIds`** | 目前選取的設備 uid 陣列，空陣列＝沒選 | **只讀**，不要呼叫 `setSelection` 之類的寫入 |
| **`editorStore.nodes`** | 畫布上所有設備節點 | **只讀**，用 `.find()` 撈出選取那台 |
| **`node.data.machineType`** | 機器的**中文名**（例如 `'粉碎機'`），可能是 `undefined` | 拿它去查機器資料；記得處理查不到的情況 |
| **`getMachine(name)`** | 用**中文名**查機器定義（含 `width`／`height`／`power`） | 從 `@/data/machines` import。注意是 `getMachine`（吃中文名），**不是** `getMachineById`（吃英文 id） |
| **唯讀 computed** | 從 store 算出畫面要的值 | 本週全部用 `computed`，**不需要**任何 `function` 去寫入 |

你寫過的踩坑筆記仍有效：`docs/toby/README.md`。本週不必新寫長文。

---

## 4. 開工前檢查（約 10 分鐘）

- [ ] Discord **先回報**：「W0823-T1 我要改 `InspectorPanel.vue`」
- [ ] 本機 `pnpm dev` 能開（你已可跑）
- [ ] 打開並**只讀**：
  - `src/editor/inspector/InspectorPanel.vue`（現況：工廠寬高輸入框＋snap 勾選＋「未來預留」清單＋產能資訊）
  - `src/store/selectionStore.ts` 的 `selectedNodeIds`
  - `src/data/machines.ts` 的 `getMachine`（**不要手改這個檔**，它是自動產生的）
- [ ] 確認本週**不要**開第二個功能

---

## 5. 步驟（目標塞進 ≤2h）

### 5.1 實作

在 `InspectorPanel.vue` 的 `<script setup>` 既有內容**後面**加上（現有的工廠寬高那幾段不要動）：

```ts
import { useSelectionStore } from '@/store/selectionStore';
import { getMachine } from '@/data/machines';

/** 選取狀態 store：本面板唯讀目前選取的設備 uid */
const selectionStore = useSelectionStore();
const { selectedNodeIds } = storeToRefs(selectionStore);

/** 目前選取的單一設備節點；未選取或多選時為 undefined（多選彙總不在本切片範圍） */
const selectedDevice = computed(() => {
    if (selectedNodeIds.value.length !== 1) return undefined;
    return editorStore.nodes.find((node) => node.id === selectedNodeIds.value[0]);
});

/** 選取設備對應的機器定義；節點缺 machineType 或查無資料時為 undefined */
const selectedMachine = computed(() => {
    const machineType = selectedDevice.value?.data?.machineType;
    return machineType ? getMachine(machineType) : undefined;
});
```

`computed`、`storeToRefs`、`editorStore` 檔案頂部**已經 import 過了**，不必重複。

template 部分，建議放在「未來預留」區塊**前面**：

```vue
<div class="mt-2 border-t border-zinc-700 pt-3">
    <h3 class="text-xs tracking-wide text-zinc-400 uppercase">設備資訊</h3>

    <dl v-if="selectedMachine" class="mt-2 space-y-1 text-sm">
        <div class="flex justify-between">
            <dt class="text-zinc-400">名稱</dt>
            <dd class="text-zinc-100">{{ selectedMachine.name }}</dd>
        </div>
        <div class="flex justify-between">
            <dt class="text-zinc-400">佔格</dt>
            <dd class="text-zinc-100">{{ selectedMachine.width }}×{{ selectedMachine.height }}</dd>
        </div>
        <div class="flex justify-between">
            <dt class="text-zinc-400">耗電</dt>
            <dd class="text-zinc-100">{{ selectedMachine.power }}</dd>
        </div>
    </dl>

    <p v-else class="mt-2 text-sm text-zinc-500">未選取設備</p>
</div>
```

### 5.2 三個可能踩到的點

| 狀況 | 說明 | 怎麼辦 |
|------|------|--------|
| 點了設備但面板沒反應 | 畫布的選取事件是否有寫進 `selectionStore` | 先在 `selectedNodeIds` 旁邊放個 `{{ selectedNodeIds }}` 印出來看。**若畫布根本沒寫入，不是你的 bug**——截圖回報，本單改以「多選／未選取顯示空狀態」驗收即可 |
| 顯示「未選取設備」但明明選了 | `node.data.machineType` 可能是 `undefined`（舊的 mock 資料沒填） | 換一台設備試；仍不行就截圖問 aaaaa，不要自己去改 mock |
| 佔格數字看起來不對 | 那是機器 JSON 的問題 | **截圖給 aaaaa**，那正是他本週 A1 在修的東西，不是你的 bug |

### 5.3 驗收前自查

- [ ] 全檔搜尋：沒有 `nodes.push`、沒有 `historyStore.execute`、沒有呼叫任何 `editorStore.xxx(...)` 寫入函式
- [ ] 只碰 `InspectorPanel.vue` 一個檔
- [ ] `pnpm type-check`／`lint-check`／`format-check`／`test` 通過
- [ ] 跑得起來；有截圖／短錄影

### 5.4 交件

1. 開 PR（或依你習慣推 `dev/toby` 請 dernoson 合入）
2. PR／訊息寫：**改了哪個檔、畫面完成長相一句、怎麼操作再現**
3. 可在 `docs/toby/README.md` **加 3–5 行**踩坑（可選）

---

## 6. DoD（本週切片，非 9/27 整包 B4）

- [ ] 選取單一設備後，Inspector 顯示該機**名稱＋佔格＋耗電**，數值與機器資料一致
- [ ] 未選取或多選時顯示空狀態，**不報錯、不顯示上一台的殘留資料**
- [ ] 全程唯讀：未呼叫任何 store 寫入 action、無 `nodes.push`、無自組 Command
- [ ] 只改 `InspectorPanel.vue`
- [ ] 開工前有 Discord 檔名回報
- [ ] 單一性質、未順便做編輯功能或管線

---

## 7. 未交頂替

不擋 8/30。未交 → Inspector 維持現況（只有工廠寬高與產能資訊）；B4 正式切片改排 9/13 起。
**不要**為了趕工一次改很多檔——寧可本週零合併，也不要交無法 review 的大包。

---

## 8. 回報

| 時機 | 動作 |
|------|------|
| ~~收到改指向~~ | ✅ 已於 8/25 回覆「還沒開工」，標的確定為 `InspectorPanel.vue` |
| 開工前 | Discord 報檔名（必做）：「W0823-T1 我要改 `InspectorPanel.vue`」 |
| 卡住 >1 次嘗試 | 立刻問 dernoson／aaaaa（本週請改成早問，別硬撐） |
| 週中 | 會有人 ping 一次進度（預期內） |
| 完成 | PR ＋截圖 |

---

## 9. 開發日誌（派工側）

### 2026-08-23

- 依 B2 預覽尺寸切片正式派工；時數上限 ≤2h、一週一塊、開工前報檔名
- 本週 toby 獨占 canvas／overlay 尺寸相關改動；harry 另檔
- 不擋 8/30

### 2026-08-25

- **改指向**：原標的 `FlowNodeOverlay.vue`／`FactoryCanvas.vue` 已排入 9 月廢除清單，本週再改會白做
- 新標的 `InspectorPanel.vue`（R-B4 提前切片）：渲染層變更盤點中屬「不動」，且全程唯讀，不觸 store 簽章與畫布
- 曾評估改指向 `ToolbarPanel.vue`，因其綁定封閉型別 `EquipmentType`，改動須連帶 `editorStore` 簽章與 `FactoryCanvas` 型別守衛（屬 9 月 R-B1 範圍），**不可行，已排除**
- 等級、性質、時數、擋門檻與未交頂替**均維持不變**；檔名維持不變以免 8/23 已發出的連結失效
- 加註 §0.1 回退條款：主編於 8/25 詢問 toby 開工狀態時尚未取得回覆，若其已開工則照舊標的完成
- **當日稍晚 toby 回覆「還沒開工」** → 回退條款解除，改指向定案；§0.1 改為狀態紀錄，canvas／overlay 本週不得再動
