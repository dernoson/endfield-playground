以下為第一階段規劃文件（Markdown）。

---

# Factory Planner – Phase 1 規劃文件

## 目標

建立「純前端編輯器 UI 骨架」，完成使用者可操作的編排畫面，但**尚未實作產線計算與物件部署邏輯**。

本階段重點為：

* 編輯器框架
* 操作體驗
* 狀態管理
* 快捷鍵與面板架構
* 未來模擬系統的預留接口

---

# 技術選型

## 核心框架

* Vue 3
* Nuxt UI（版面與元件）
* Vue Flow（圖形編輯器）
* VueUse（快捷鍵與工具函式）
* TypeScript
* TailwindCSS
* pnpm

---

# 專案初始化

## 建立專案

```bash
pnpm create vue@latest factory-planner
cd factory-planner
pnpm add @vue-flow/core @vue-flow/background @vue-flow/controls
pnpm add @vueuse/core
pnpm add -D tailwindcss postcss autoprefixer
pnpm add @nuxt/ui
```

## 啟用 Tailwind

建立 `tailwind.config.ts` 並設定：

* content 指向 src
* 啟用 dark mode（未來可能需要）

---

# 目錄結構規劃

```
src/
├─ app/
│  ├─ App.vue
│  ├─ layouts/
│  │   └─ MainLayout.vue
│
├─ editor/
│  ├─ canvas/
│  │   └─ FactoryCanvas.vue
│  ├─ toolbar/
│  │   └─ ToolbarPanel.vue
│  ├─ navbar/
│  │   └─ Navbar.vue
│  ├─ inspector/
│  │   └─ InspectorPanel.vue
│  └─ stats/
│      └─ ProductionStats.vue
│
├─ store/
│  ├─ editorStore.ts
│  ├─ selectionStore.ts
│  └─ shortcutStore.ts
│
├─ types/
│  ├─ graph.ts
│  └─ editor.ts
│
└─ composables/
   └─ useShortcuts.ts
```

---

# 畫面佈局設計

## 主畫面 Layout

```
┌──────────────────────── Navbar ────────────────────────┐
│ Toolbar │                 Canvas                       │ Inspector │
│         │                                               │           │
│         │                                               │           │
│         │                                               │           │
│         │                                               │           │
│         └────────────── Production Stats ───────────────┘
```

使用 CSS Grid 實作：

* 上方：Navbar（固定高度）
* 左側：Toolbar（可折疊）
* 中央：Vue Flow Canvas
* 右側：Inspector / 模擬檔設定
* 下方：Production Stats

---

# 功能模組規劃

---

# 1. Navbar

## 功能

提供專案與檔案層級操作入口。

### 預計功能

* 新建專案
* 匯入設計檔（先做 UI）
* 匯出設計檔（先做 UI）
* 重設畫布
* 顯示目前檔名

### 元件

`editor/navbar/Navbar.vue`

### 技術

Nuxt UI：

* Dropdown menu
* Button group

---

# 2. 工具列（Toolbar）

## 功能

提供可拖曳的工具與未來機器類型入口。

目前僅建立 UI 骨架。

### 預計工具分類

* 選取工具（Select）
* 移動畫布（Pan）
* 連線工具（Connect）
* 區域框選（Box Select）

### 未來預留

* Machine palette
* Conveyor tool
* Power tool

### 元件

`editor/toolbar/ToolbarPanel.vue`

---

# 3. Factory Canvas（Vue Flow）

## 功能

核心畫布，負責：

* 顯示 grid
* 支援 zoom / pan
* 顯示節點與連線（暫為測試資料）

### 必做功能

* 顯示背景格線
* 支援拖曳節點
* 支援框選
* 支援縮放與平移

### 技術

Vue Flow plugins：

* Background
* Controls
* MiniMap（可先預留）

### 元件

`editor/canvas/FactoryCanvas.vue`

---

# 4. 快捷鍵系統

## 目標

建立全域快捷鍵架構，後續可擴充。

### 必做快捷鍵

| 快捷鍵          | 功能     |
| ------------ | ------ |
| Delete       | 刪除選取物件 |
| Ctrl + C     | 複製     |
| Ctrl + V     | 貼上     |
| Ctrl + Z     | Undo   |
| Ctrl + Y     | Redo   |
| Space + Drag | 畫布平移   |

### 技術

VueUse：

* useMagicKeys
* useEventListener

### 檔案

`composables/useShortcuts.ts`

### 架構設計

建立集中式 Shortcut Store：

```
shortcutStore.ts
```

負責：

* 註冊快捷鍵
* 分派事件

---

# 5. Inspector（模擬檔設定區）

右側面板，負責顯示整體設定。

## 本階段顯示內容

### Map 設定

* 工廠寬度
* 工廠高度
* Snap to grid 開關

### 未來預留

* 電力模式
* 模擬速度
* 生產目標

### 元件

`editor/inspector/InspectorPanel.vue`

---

# 6. Production Stats（產能統計區）

目前僅建立 UI 與資料結構。

## 顯示內容（暫為 mock）

* 總機器數量
* 總功耗（placeholder）
* 節點數量
* 連線數量

### 元件

`editor/stats/ProductionStats.vue`

---

# 7. 狀態管理（Pinia）

本階段建立三個 Store。

---

## editorStore

管理：

* nodes
* edges
* 畫布設定
* map size

```ts
interface EditorState {
  nodes: Node[]
  edges: Edge[]
  mapWidth: number
  mapHeight: number
}
```

---

## selectionStore

管理：

* 目前選取節點
* 多選狀態

---

## shortcutStore

管理：

* Undo / Redo stack
* 快捷鍵註冊

---

# Phase 1 完成條件（Milestone）

完成以下功能即達成第一階段：

1. 畫面具備完整編輯器 layout
2. Vue Flow 畫布可操作（zoom / pan / drag）
3. 左側工具列顯示並可切換工具（UI）
4. Navbar 顯示並具備檔案操作入口（UI）
5. 右側 Inspector 可修改地圖尺寸
6. 下方 Production Stats 顯示統計資訊（mock）
7. 快捷鍵系統可偵測 Delete / Copy / Paste / Undo / Redo

完成後將進入 Phase 2：Import / Export 與資料序列化。
