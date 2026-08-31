<script setup lang="ts">
defineProps<{
  title?: string;
  cycleTime?: number | string;
}>();
</script>

<template>
  <div class="formula-list">
    <!-- Text 標題 -->
    <div class="title-text">
      {{ title || '可用配方一覽' }}
    </div>

    <!-- {some div} 配方內容容器 -->
    <div class="list-container">
      <slot>
        <!-- 預設 formula 項目（由 title + recipe 組成） -->
        <div class="formula">
          <div class="formula-title">週期 {{ cycleTime || 15 }}s</div>

          <!-- formula-recipe: { item + ... + item } -> { item + ... + item } -->
          <div class="formula-recipe">
            <!-- 輸入物品組 (Inputs) -->
            <div class="recipe-group inputs">
              <div class="item">
                <div class="item-box"></div>
              </div>
              <!-- 待處理：+ 符號目前先以文字代替 -->
              <span class="operator plus" title="待處理：加號圖示">+</span>
              <div class="item">
                <div class="item-box"></div>
              </div>
            </div>

            <!-- 待處理：-> 箭頭目前先以文字代替 -->
            <span class="operator arrow" title="待處理：箭頭圖示">→</span>

            <!-- 輸出物品組 (Outputs) -->
            <div class="recipe-group outputs">
              <div class="item">
                <div class="item-box"></div>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
/* frame / formula-list 容器 (含頂部細線) */
.formula-list {
  box-sizing: border-box;

  position: absolute;
  left: 0px;
  right: 0px;
  width: 100%;
  top: 140px;
  bottom: 14px;

  border-top: 1px solid #DADADA;
}

/* Text */
.title-text {
  position: absolute;
  left: 13px;
  top: 16px;

  font-family: 'HarmonyOS Sans TC', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;

  color: #FFFFFF;
  white-space: nowrap;
}

/* {some div} 配方內容容器 */
.list-container {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;

  /* 超出高度自動滾動，橫向嚴格裁切 */
  overflow-y: auto;
  overflow-x: hidden;

  /* 自訂細緻滾動條（符合遊戲深色風格） */
  scrollbar-width: thin;
  scrollbar-color: #666 transparent;
}

/* Chrome / Safari / Edge 滾動條美化 */
.list-container::-webkit-scrollbar {
  width: 4px;
}
.list-container::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 2px;
}
.list-container::-webkit-scrollbar-track {
  background: transparent;
}

/* formula 項目樣式 (title + recipe) */
.formula {
  position: relative;
  margin-left: 7px;
  margin-right: 5px;
  height: 120px;
  margin-top: 10px;
  box-sizing: border-box;
}

/* formula title (靠左上) */
.formula-title {
  position: absolute;
  left: 0px;
  top: 0px;
  font-size: 16px;
  line-height: 19px;
  text-align: left;
  color: #CFCFCF;
}

/* formula recipe 背景區塊 */
.formula-recipe {
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 14px;
  padding-top: 10px;
  padding-bottom: 7px;
  gap: 8px;

  position: absolute;
  width: 100%;
  height: 93px;
  left: 0px;
  top: 24px;
  overflow-x: auto;

  background: rgba(43, 43, 43, 0.2);
}

/* recipe-group (輸入組 / 輸出組) */
.recipe-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

/* 單個 item 結構 */
.item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-box {
  width: 55px;
  height: 55px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  border: 1.5px solid #EEFD1C;
}

/* 運算子 (+, ->) */
.operator {
  font-size: 16px;
  color: #CFCFCF;
  user-select: none;
  padding: 0 2px;
}

.operator.arrow {
  font-size: 18px;
  color: #EEFD1C;
}
</style>
