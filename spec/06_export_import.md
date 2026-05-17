# Feature Spec：藍圖匯入 / 匯出
# CR-06

**所屬階段：** Phase 2
**依賴：** CR-01（設備狀態）、CR-02（管線狀態）、CR-03（警示狀態）、CR-04（產能估算）、CR-05（Flow Chart 狀態）
**文件版本：** v0.2

---

## 1. 功能定位

匯出模組將目前產線的完整狀態序列化為自包含的 `.html` 記錄檔，供使用者分享與瀏覽。匯入模組從記錄檔或 `.json` 還原產線狀態，支援跨版本 migrate 邏輯。

---

## 2. 功能詳細描述

### 2.1 匯出記錄檔（.html）

#### 觸發
工具列「匯出」按鈕 → 輸入藍圖名稱、作者（選填）→ 確認後觸發瀏覽器下載

#### 記錄檔設計原則
- **視覺從簡**：靜態呈現產線狀態，不重新實作拖拉、連線等重度互動
- **資料求完整**：內嵌完整 JSON，可無損匯回模擬器繼續編輯
- **自包含**：所有資源 inline，無外部依賴，離線可瀏覽

#### 記錄檔內容（人類可讀層）

分四個 Tab 呈現：

| Tab | 內容 |
|-----|------|
| 設備藍圖 | 靜態格子圖，顯示設備位置、接口、管線走向 |
| 流程圖 | 靜態 Flow Chart（SVG 渲染），節點與連線關係 |
| 產能估算 | 產出摘要表、電力統計、調度券效率 |
| 警示列舉 | Error 與 Warning 完整清單 |

基本互動（純 JS，無框架）：
- Tab 切換
- 設備 / 節點懸停顯示詳細資訊 tooltip
- 警示項目點選時，設備藍圖 Tab 高亮對應設備

#### 記錄檔 HTML 結構

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>【AIC 藍圖】{名稱}</title>
  <style>/* 全部 inline，無外部 CSS */</style>
</head>
<body>
  <header>
    <h1>{藍圖名稱}</h1>
    <p>作者：{作者} ｜ 匯出時間：{datetime} ｜ 模擬器版本：{version}</p>
  </header>

  <!-- Tab 導覽 -->
  <nav id="tabs">
    <button data-tab="layout">設備藍圖</button>
    <button data-tab="flow">流程圖</button>
    <button data-tab="summary">產能估算</button>
    <button data-tab="alerts">警示列舉</button>
  </nav>

  <!-- Tab 內容 -->
  <section id="tab-layout"><!-- SVG 格子圖 --></section>
  <section id="tab-flow"><!-- SVG Flow Chart --></section>
  <section id="tab-summary"><!-- 產出摘要表 HTML --></section>
  <section id="tab-alerts"><!-- 警示列表 HTML --></section>

  <!-- 機器可讀層（供匯入使用，不影響視覺） -->
  <script type="application/json" id="blueprint-data">
    { ...完整藍圖 JSON... }
  </script>

  <!-- 輕量互動腳本（無框架依賴） -->
  <script>/* Tab 切換、tooltip、高亮邏輯 */</script>
</body>
</html>
```

---

### 2.2 藍圖 JSON Schema（v1.0）

```json
{
  "schema_version": "1.0",
  "simulator_version": "0.1.0",
  "metadata": {
    "name": "武陵息壤自動化產線",
    "author": "玩家名稱",
    "created_at": "2026-05-13T00:00:00Z",
    "updated_at": "2026-05-17T12:00:00Z",
    "base_region": "wuling",
    "description": "備註說明"
  },
  "canvas": {
    "width": 40,
    "height": 30
  },
  "placed_devices": [
    {
      "uid": "d_001",
      "device_id": "refinery",
      "x": 5,
      "y": 3,
      "rotation": 0,
      "active_recipe": "recipe_purple_crystal_fiber"
    }
  ],
  "connections": [
    {
      "uid": "c_001",
      "type": "conveyor",
      "from": { "device_uid": "d_001", "port_id": "output_0" },
      "to": { "device_uid": "d_002", "port_id": "input_0" },
      "waypoints": [{ "x": 7, "y": 3 }, { "x": 7, "y": 6 }]
    }
  ],
  "flow_chart": {
    "node_positions": [
      { "node_uid": "node_d_001", "x": 200, "y": 150 }
    ]
  },
  "user_settings": {
    "ticket_exchange_rates": [
      { "item_id": "industrial_explosive", "rate_per_unit": 2.5 }
    ],
    "warehouse_capacity": 1000
  }
}
```

---

### 2.3 跨版本 Migrate 邏輯

使用 **Zod** 實作 schema 定義與 migrate。每個版本的 schema 以 `z.object()` 定義，透過 `.transform()` 在 parse 同時完成欄位補全或轉換，鏈式升至最新版本。

**設計原則：**
- Migrate 靜默執行，不警示使用者——版本差異屬於系統內部處理，使用者無需感知
- 僅在 `safeParse` 失敗（parse error）時才顯示錯誤訊息，告知使用者檔案損毀或格式不合法
- 每次系統有欄位變動，新增一個版本的 Zod schema 與對應的 transform

```typescript
import { z } from 'zod'

// ── v1.0 Schema ──────────────────────────────────────────
const BlueprintV1_0 = z.object({
  schema_version: z.literal('1.0'),
  metadata: z.object({
    name: z.string(),
    author: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    base_region: z.enum(['wuling', 'valley4']).nullable(),
    description: z.string().optional()
  }),
  canvas: z.object({ width: z.number(), height: z.number() }),
  placed_devices: z.array(z.object({
    uid: z.string(),
    device_id: z.string(),
    x: z.number(),
    y: z.number(),
    rotation: z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)]),
    active_recipe: z.string().nullable()
  })),
  connections: z.array(z.object({
    uid: z.string(),
    type: z.enum(['conveyor', 'pipe']),
    from: z.object({ device_uid: z.string(), port_id: z.string() }),
    to: z.object({ device_uid: z.string(), port_id: z.string() }),
    waypoints: z.array(z.object({ x: z.number(), y: z.number() }))
  })),
  flow_chart: z.object({
    node_positions: z.array(z.object({
      node_uid: z.string(),
      x: z.number(),
      y: z.number()
    }))
  }).optional(),
  user_settings: z.object({
    ticket_exchange_rates: z.array(z.object({
      item_id: z.string(),
      rate_per_unit: z.number()
    })),
    warehouse_capacity: z.number().optional()
  }).optional()
})

// ── v1.0 → v1.1 migrate（範例：connections 新增 auto_nodes 欄位）──
const BlueprintV1_1 = BlueprintV1_0
  .omit({ schema_version: true })
  .extend({
    schema_version: z.literal('1.1'),
    connections: z.array(z.object({
      uid: z.string(),
      type: z.enum(['conveyor', 'pipe']),
      from: z.object({ device_uid: z.string(), port_id: z.string() }),
      to: z.object({ device_uid: z.string(), port_id: z.string() }),
      waypoints: z.array(z.object({ x: z.number(), y: z.number() })),
      auto_nodes: z.array(z.object({   // 新增欄位
        kind: z.enum(['splitter', 'merger', 'bridge']),
        grid_pos: z.object({ x: z.number(), y: z.number() }),
        device_uid: z.string(),
        mode: z.enum(['auto', 'cut'])
      }))
    }))
  })

// ── 從 v1.0 原始資料 migrate 至 v1.1 ──
const migrateV1_0toV1_1 = BlueprintV1_0.transform((data) => ({
  ...data,
  schema_version: '1.1' as const,
  connections: data.connections.map(c => ({
    ...c,
    auto_nodes: []  // 舊版無此欄位，補空陣列
  }))
}))

// ── 主入口：依 schema_version 選擇 migrate 路徑 ──
export const parseBlueprint = (raw: unknown) => {
  // 先取得版本號
  const versionResult = z.object({ schema_version: z.string() }).safeParse(raw)
  if (!versionResult.success) {
    throw new Error('檔案格式錯誤：無法讀取藍圖版本資訊')
  }

  const version = versionResult.data.schema_version

  // 依版本鏈式 migrate 至最新
  if (version === '1.0') {
    const result = migrateV1_0toV1_1.safeParse(raw)
    if (!result.success) {
      throw new Error(`藍圖解析失敗：${z.prettifyError(result.error)}`)
    }
    return result.data  // 已是 v1.1 格式
  }

  if (version === '1.1') {
    const result = BlueprintV1_1.safeParse(raw)
    if (!result.success) {
      throw new Error(`藍圖解析失敗：${z.prettifyError(result.error)}`)
    }
    return result.data
  }

  throw new Error(`不支援的藍圖版本：${version}`)
}
```

> **新增版本時的維護步驟：**
> 1. 定義新版本的 Zod schema（`BlueprintV_X_Y`）
> 2. 撰寫前一版本至新版本的 `.transform()` migrate 函式
> 3. 在 `parseBlueprint` 的版本判斷中新增對應分支
> 4. 更新 `CURRENT_SCHEMA_VERSION` 常數

---

### 2.4 匯入流程

**支援格式：** `.html`（含 `#blueprint-data`）、`.json`（直接為藍圖 JSON）

**流程：**
1. 使用者點選工具列「匯入」按鈕，選擇檔案
2. 系統讀取檔案，偵測格式（HTML or JSON）
3. 解析 `#blueprint-data` 或直接解析 JSON 取得原始資料
4. 呼叫 `parseBlueprint(raw)` 進行版本偵測、migrate、Zod 驗證
5. 若 `parseBlueprint` 拋出錯誤（parse error），顯示錯誤訊息給使用者
6. 成功後顯示確認對話框：「匯入將覆蓋當前畫布，確定繼續？」
7. 確認後，將解析結果還原至 Pinia store，觸發流量重算與驗證

---

## 3. 狀態管理（Pinia Store）

匯出時從以下 store 序列化：

| Store | 對應 JSON 欄位 |
|-------|---------------|
| `usePlacedDeviceStore` | `placed_devices` |
| `usePipelineStore` | `connections` |
| `useFlowChartStore`（節點位置） | `flow_chart.node_positions` |
| 使用者設定（票券率、倉庫容量） | `user_settings` |
| `useCanvasStore`（基地、畫布大小） | `canvas`、`metadata.base_region` |

匯入時，反向還原各 store，順序：
1. `usePlacedDeviceStore`
2. `usePipelineStore`
3. `useCanvasStore`
4. `useFlowChartStore`（節點位置）
5. 使用者設定
6. 觸發 `runValidation()` + `runFlowEngine()`

---

## 4. 實作範例

### 4.1 匯出觸發

```typescript
const exportBlueprint = (name: string, author: string) => {
  const json = serializeToBlueprint(name, author)
  const html = renderBlueprintHtml(json)

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name.replace(/\s+/g, '_')}_blueprint.html`
  a.click()
  URL.revokeObjectURL(url)
}
```

### 4.2 匯入解析

```typescript
const importBlueprint = async (file: File) => {
  const text = await file.text()
  let raw: unknown

  if (file.name.endsWith('.html')) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')
    const scriptEl = doc.querySelector('#blueprint-data')
    if (!scriptEl?.textContent) throw new Error('找不到藍圖資料，檔案可能已損毀')
    raw = JSON.parse(scriptEl.textContent)
  } else {
    raw = JSON.parse(text)
  }

  // parseBlueprint 內部處理版本偵測、migrate、Zod 驗證
  // 任何 parse error 會 throw，由呼叫端顯示錯誤訊息給使用者
  const blueprint = parseBlueprint(raw)
  return blueprint
}
```

### 4.3 靜態 Flow Chart SVG 渲染（匯出用）

```typescript
const renderFlowChartSvg = (nodes: FlowChartNode[], edges: FlowChartEdge[]): string => {
  // 產生靜態 SVG 字串，嵌入 HTML 記錄檔
  const svgNodes = nodes.map(n => `
    <g transform="translate(${n.position.x}, ${n.position.y})">
      <rect width="120" height="40" rx="6" fill="${efficiencyColor(n.efficiency)}" />
      <text x="60" y="24" text-anchor="middle">${escapeHtml(n.label)}</text>
    </g>
  `).join('')

  const svgEdges = edges.map(e => {
    const from = nodes.find(n => n.uid === e.fromNodeUid)!
    const to = nodes.find(n => n.uid === e.toNodeUid)!
    return `<line x1="${from.position.x + 120}" y1="${from.position.y + 20}"
                  x2="${to.position.x}" y2="${to.position.y + 20}"
                  stroke="#888" stroke-width="2" marker-end="url(#arrow)" />`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <defs><marker id="arrow" ...></marker></defs>
    ${svgEdges}${svgNodes}
  </svg>`
}
```

---

## 5. 驗證方式

| 驗證項目 | 方法 |
|----------|------|
| 匯出觸發下載 | 點選匯出按鈕，確認瀏覽器下載 `.html` 檔案 |
| 記錄檔可瀏覽 | 開啟匯出的 `.html`，確認四個 Tab 內容正確渲染 |
| Tab 切換互動 | 點選各 Tab，確認內容正確切換 |
| 機器可讀層存在 | 以文字編輯器開啟 `.html`，確認 `#blueprint-data` 存在且為合法 JSON |
| 匯回還原完整 | 匯出後匯入，確認設備位置、管線、配方、使用者設定完全還原 |
| 跨版本 migrate 靜默執行 | 使用舊版 schema JSON 匯入，確認自動升級成功、無任何警示訊息 |
| Parse error 顯示錯誤 | 匯入損毀或格式錯誤的檔案，確認顯示明確錯誤訊息 |
| Zod 型別保護 | 匯入缺少必要欄位的 JSON，確認 `parseBlueprint` 拋出 Zod 錯誤並顯示給使用者 |
| 匯入覆蓋確認 | 在有現有配置的情況下匯入，確認出現確認對話框 |
| 離線瀏覽 | 斷網情況下開啟匯出的 `.html`，確認正常顯示 |

---

*本文件為 CR-06 Feature Spec，系統整體架構見 `00_top_spec.md`。*
