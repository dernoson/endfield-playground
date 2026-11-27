# W1109-T1 右欄 Tips 接線分析與修法

正式編輯器的 `StatsPanel` 已能讀取 `ProductionStats` 提供的總覽。右欄 Tips 有兩處接線需要補齊：在總覽提供警示清單，並在 `StatsPanel` 將清單傳給 `AttentionPanel`。

## 目前的資料流

1. 正式路由以 `<ProductionStats overview>` 包住 `MainLayout`。`ProductionStats` 透過 `statsOverviewKey` 提供響應式總覽，`StatsPanel` 用 `inject` 取得它。 [正式路由](../../../src/router/index.ts#L11) · [總覽來源](../../../src/editor/stats/ProductionStats.vue#L80) · [總覽注入](../../../src/app/StatsPanel/Index.vue#L17)
2. `MainLayout` 掛載 `<StatsPanel />` 時省略 props。上方電力和產耗使用 `props.power ?? overview?.power`、`props.products ?? overview?.products`，所以仍會顯示總覽資料。Vue 模板會自動解包 `overview` 這個 ref。 [正式掛載點](../../../src/app/layouts/MainLayout.vue#L147) · [電力與產耗接線](../../../src/app/StatsPanel/Index.vue#L85)
3. 下方目前使用 `<AttentionPanel :tips="props.tips" />`。正式頁省略 `tips` prop，子元件就收到 `undefined`，`v-for` 無項目可渲染。即使上游開始提供 `overview.tips`，這一行仍需要讀取該欄位。目前工作樹的總覽物件也尚缺 `tips`。 [Tips 傳入點](../../../src/app/StatsPanel/Index.vue#L111) · [列表渲染](../../../src/app/StatsPanel/AttentionPanel.vue#L42) · [總覽物件](../../../src/editor/stats/ProductionStats.vue#L81)

## 建議修法

### 1. 在 `ProductionStats.vue` 提供警示清單

從 `@/store/validationStore` 匯入 `useValidationStore`，並在 `if (props.overview)` 內、`provide` 前取得 `const validationStore = useValidationStore()`。在現有總覽 `computed` 回傳的物件中加入以下欄位。`level` 對應顯示類型，`message` 對應顯示文字。警示更新時會重新映射，清除全部警示時會得到空陣列。 [警示來源](../../../src/store/validationStore.ts#L24) · [Tips 型別](../../../src/app/StatsPanel/types.ts#L29) · [插入位置](../../../src/editor/stats/ProductionStats.vue#L80)

```ts
tips: validationStore.alerts.map(({ level, message }) => ({
    type: level,
    text: message,
})),
```

### 2. 在 `StatsPanel/Index.vue` 轉交清單

將第 111 行改為下列寫法。正式頁省略 prop 時會使用 `overview.tips`。Storybook 等獨立呼叫端可以直接傳入清單，傳入 `[]` 時也會保留刻意指定的空清單。`AttentionPanel` 透過原有的 `tips` prop 渲染。 [修改位置](../../../src/app/StatsPanel/Index.vue#L111) · [展示元件 prop](../../../src/app/StatsPanel/AttentionPanel.vue#L6)

```vue
<AttentionPanel :tips="props.tips ?? overview?.tips" />
```

### 3. 確認正式驗證有註冊 detector

`MainLayout` 已呼叫 `useValidation()`，它會在初始化時執行已註冊的 detector。目前查到 E001（設備重疊）與 E005（缺少輸出連線）只在 dev 驗證頁註冊。正式頁若要顯示這兩種警示，需要在正式驗證首次執行前註冊對應 detector。現有 FlowEngine 會略過有阻擋性錯誤的設備，驗收也要涵蓋解除警示後的產耗重算。 [正式驗證入口](../../../src/app/layouts/MainLayout.vue#L89) · [驗證初始化](../../../src/composables/useValidation.ts#L109) · [dev 註冊點](../../../src/app/dev/ValidationTest.vue#L212) · [FlowEngine 過濾](../../../src/composables/useFlowEngine.ts#L1337)

## 驗收案例

| 操作                                                 | 預期結果                                                 |
| ---------------------------------------------------- | -------------------------------------------------------- |
| 在正式頁觸發已註冊的 E001 或 E005                    | Tips 顯示對應的訊息與錯誤圖示。                          |
| 移開重疊設備或補接輸出                               | 對應的 Tips 消失，其餘警示仍顯示。有效產線重新計算產耗。 |
| 解除全部警示或清空畫布                               | Tips 列表為空。                                          |
| 在獨立呼叫端傳入 `tips`，分別測試有項目的清單與 `[]` | 清單原樣顯示，`[]` 顯示空列表。                          |

## 工單範圍與實作狀態

既有工單分析把 `StatsPanel/Index.vue` 列為排除項目。若沿用總覽資料流與展示元件的 props 契約，需要將第 111 行的單行接線納入實作範圍。本文件記錄程式碼核對結果與建議修法，程式變更與瀏覽器驗收待實作階段執行。 [工單分析](../dev/1120/W1109-T1_alerts_analysis.md) · [展示元件分層規範](./AGENTS.md#a1-三層架構)
