<script setup lang="ts">
import Title from './components/Title.vue';
import Machine from './components/Machine.vue';
import Formula from './components/Formula.vue';
import Info from './components/Info.vue';
import Button from './components/Button.vue';
</script>

<template>
  <div class="frame-container">
    <!-- 1. 卡片底板 -->
    <div class="plate"></div>

    <!-- 2. 卡片核心主要內容 (Info + Formula) -->
    <div class="frame-body">
      <Info />
      <Formula />
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

/* 卡片主體內容區 (避開最左側 3px 黃條，margin-top 52px 對齊 title 下緣) */
.frame-body {
  position: absolute;
  left: 3px;
  top: 0px;
  margin-left: 6px;
  margin-top: 52px;
}
</style>
