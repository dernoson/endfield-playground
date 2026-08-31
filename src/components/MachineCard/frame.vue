<script setup lang="ts">
import Title from './components/Title.vue';
import Machine from './components/Machine.vue';
import FormulaList from './components/FormulaList.vue';
import Info from './components/Info.vue';
import Button from './components/Button.vue';
</script>

<template>
  <div class="frame-container">
    <!-- 1. 卡片底板 -->
    <div class="plate"></div>

    <!-- 2. 卡片核心主要內容 (Info + FormulaList) -->
    <div class="frame-body">
      <Info />
      <FormulaList />
    </div>

    <!-- 3. 貼附於 Frame 的漂浮元素 -->
    <Title />
    <Machine />
    <Button />
  </div>
</template>

<style scoped>
.frame-container {
  position: relative;
  width: 451px;
  height: 686px;
  box-sizing: border-box;
}

/* 底板 */
.plate {
  box-sizing: border-box;

  position: absolute;
  left: 0%;
  right: 0%;
  top: 0%;
  bottom: 0%;

  background: #4E4E4E;
  border-left: 3px solid #EEFD1C;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 0px 40px 0px 0px;
}

/* 卡片主體內容區 (設定明確寬高與右邊界，避免 absolute 容器寬度塌陷為 0) */
.frame-body {
  position: absolute;
  left: 9px;
  right: 6px;
  top: 52px;
  bottom: 0px;
}
</style>
