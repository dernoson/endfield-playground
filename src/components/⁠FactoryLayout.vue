<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>自動化工廠 UI 介面</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>
    /* ==================== 
       色彩與基礎樣式 
       ==================== */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #1a1a1a;
      color: #d1d1d1;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      user-select: none;
      overflow: hidden;
    }

    /* 容器架構 */
    .app-container {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* 1. 頂部工具列 */
    .top-bar {
      height: 48px;
      background-color: #262626;
      border-bottom: 1px solid #333333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      z-index: 10;
    }

    .left-tools, .right-tools {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* 統一按鈕與下拉選單樣式 */
    .btn-neutral {
      background-color: #333333;
      border: 1px solid #4f4f4f;
      color: #e5e5e5;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.15s ease;
    }

    .btn-neutral:hover {
      background-color: #444444;
    }

    .btn-neutral.active {
      background-color: #555555;
      border-color: #777777;
      font-weight: bold;
    }

    .select-neutral {
      background-color: #333333;
      color: #e5e5e5;
      border: 1px solid #4f4f4f;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      outline: none;
    }

    .badge-neutral {
      background-color: #2a2a2a;
      border: 1px solid #4f4f4f;
      color: #d1d1d1;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .zoom-control {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
    }

    /* 2. 中央畫布與抽屜面板 */
    .main-body {
      flex: 1;
      position: relative;
      display: flex;
      overflow: hidden;
    }

    .left-drawer {
      position: absolute;
      top: 0; 
      left: 0; 
      bottom: 0;
      width: 240px;
      background-color: rgba(38, 38, 38, 0.95);
      border-right: 1px solid #333333;
      padding: 12px;
      z-index: 5;
    }

    .drawer-section {
      margin-bottom: 16px;
    }

    .drawer-title {
      font-size: 12px;
      color: #888888;
    }

    .item-chain {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
    }

    .item-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: #444444;
      border: 1px solid #666666;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: #ffffff;
    }

    .arrow {
      font-size: 12px;
      color: #666666;
    }

    .canvas-area {
      flex: 1;
      background-color: #121212;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .grid-bg {
      background-image: radial-gradient(#333333 1px, transparent 1px);
      background-size: 20px 20px;
    }

    .canvas-hint {
      color: #555555;
      font-size: 14px;
    }

    /* 3. 底部選單 */
    .bottom-panel {
      background-color: #222222;
      border-top: 1px solid #333333;
      padding: 8px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 10;
    }

    .view-tabs {
      display: flex;
      gap: 12px;
    }

    .tab-btn {
      background: none;
      border: none;
      color: #777777;
      cursor: pointer;
      font-size: 12px;
    }

    .tab-btn.active {
      color: #ffffff;
      font-weight: bold;
      text-decoration: underline;
    }

    .category-bar {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .search-box {
      background-color: #333333;
      border-radius: 12px;
      padding: 2px 8px;
      display: flex;
      align-items: center;
    }

    .search-box input {
      background: none;
      border: none;
      color: #ffffff;
      font-size: 12px;
      outline: none;
      width: 80px;
    }

    .categories {
      display: flex;
      gap: 4px;
    }

    .item-cards {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-top: 4px;
    }

    .card-neutral {
      background-color: #2a2a2a;
      border: 1px solid #444444;
      border-radius: 4px;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      min-width: 120px;
      transition: background 0.15s ease;
    }

    .card-neutral:hover {
      background-color: #383838;
    }

    .card-neutral.selected {
      background-color: #4f4f4f;
      border-color: #777777;
    }

    .card-name {
      font-size: 12px;
      white-space: nowrap;
    }

    /* 抽屜動畫 */
    .slide-enter-active, .slide-leave-active {
      transition: transform 0.2s ease;
    }
    .slide-enter-from, .slide-leave-to {
      transform: translateX(-100%);
    }
  </style>
</head>
<body>

  <div id="app">
    <div class="app-container">
      
      <header class="top-bar">
        <div class="left-tools">
          <button 
            :class="['btn-neutral', { active: isLeftDrawerOpen }]" 
            @click="isLeftDrawerOpen = !isLeftDrawerOpen"
          >
            ⚙️
          </button>
          <button class="btn-neutral">📥</button>
          <button class="btn-neutral">📤</button>
          
          <select v-model="selectedCore" class="select-neutral">
            <option value="core4">四號谷地：主要核心</option>
            <option value="core3">三號谷地：次要核心</option>
          </select>

          <button class="btn-neutral">↩️</button>
          <button class="btn-neutral">↪️</button>
          
          <button 
            :class="['btn-neutral', { active: showGrid }]" 
            @click="showGrid = !showGrid"
          >
            #
          </button>
        </div>

        <div class="right-tools">
          <div class="zoom-control">
            <span>🔍</span>
            <input type="range" min="50" max="150" v-model="zoomValue" />
          </div>
          
          <div class="badge-neutral">❌ 799</div>
          <div class="badge-neutral">⚠️ 325</div>
        </div>
      </header>

      <main class="main-body">
        <transition name="slide">
          <aside v-if="isLeftDrawerOpen" class="left-drawer">
            <div class="drawer-section">
              <span class="drawer-title">週期 15s</span>
              <div class="item-chain">
                <div class="item-circle">紫</div>
                <span class="arrow">→</span>
                <div class="item-circle">紫</div>
                <span class="arrow">→</span>
                <div class="item-circle">紫</div>
              </div>
            </div>
            <div class="drawer-section">
              <span class="drawer-title">週期 15s</span>
              <div class="item-chain">
                <div class="item-circle">紫</div>
                <span class="arrow">→</span>
                <div class="item-circle">紫</div>
              </div>
            </div>
          </aside>
        </transition>

        <div class="canvas-area" :class="{ 'grid-bg': showGrid }">
          <div class="canvas-hint">畫布區域（縮放：{{ zoomValue }}%）</div>
        </div>
      </main>

      <footer class="bottom-panel">
        <div class="view-tabs">
          <button 
            v-for="view in views" 
            :key="view.id"
            :class="['tab-btn', { active: currentView === view.id }]"
            @click="currentView = view.id"
          >
            {{ view.label }}
          </button>
        </div>

        <div class="category-bar">
          <div class="search-box">
            🔍 <input type="text" v-model="searchKey" placeholder="搜尋設備" />
          </div>

          <div class="categories">
            <button 
              v-for="cat in categories" 
              :key="cat"
              :class="['btn-neutral', { active: activeCategory === cat }]"
              @click="activeCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="item-cards">
          <div 
            v-for="item in filteredBuildingItems" 
            :key="item.id"
            :class="['card-neutral', { selected: selectedItem === item.id }]"
            @click="selectedItem = item.id"
          >
            <div class="card-icon">🏗️</div>
            <span class="card-name">{{ item.name }}</span>
          </div>
        </div>
      </footer>

    </div>
  </div>

  <script>
    const { createApp, ref, computed } = Vue;

    createApp({
      setup() {
        const isLeftDrawerOpen = ref(true);
        const showGrid = ref(true);
        const zoomValue = ref(100);
        const selectedCore = ref('core4');
        const currentView = ref('layout');
        const activeCategory = ref('採集');
        const selectedItem = ref(null);
        const searchKey = ref('');

        const views = [
          { id: 'layout', label: '佈局視角' },
          { id: 'process', label: '流程視角' },
          { id: 'parallel', label: '並列視角' }
        ];

        const categories = ['採集', '加工', '種植', '電力', '物流', '儲存', '武器'];

        const buildingItems = [
          { id: 1, name: '電動採礦平台', category: '採集' },
          { id: 2, name: '種子採摘單位', category: '採集' },
          { id: 3, name: '種植單元', category: '種植' },
          { id: 4, name: '碎紙機設施', category: '加工' },
          { id: 5, name: '煉油單元', category: '加工' },
          { id: 6, name: '裝配單元', category: '加工' }
        ];

        const filteredBuildingItems = computed(() => {
          return buildingItems.filter(item => {
            const matchCategory = item.category === activeCategory.value;
            const matchSearch = item.name.includes(searchKey.value);
            return matchCategory && matchSearch;
          });
        });

        return {
          isLeftDrawerOpen,
          showGrid,
          zoomValue,
          selectedCore,
          currentView,
          activeCategory,
          selectedItem,
          searchKey,
          views,
          categories,
          filteredBuildingItems
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
