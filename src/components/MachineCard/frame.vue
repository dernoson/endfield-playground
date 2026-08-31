<script setup lang="ts">
import frameSvg from './frame.svg';
import Title from './components/Title.vue';
import Machine from './components/Machine.vue';
import Formula from './components/Formula.vue';
import Info from './components/Info.vue';
import Button from './components/Button.vue';
</script>

<template>
  <div class="frame-container">
    <img :src="frameSvg" alt="frame" class="frame-svg" />
    <Title />
    <Machine />
    <Formula />
    <Info />
    <Button />
  </div>
</template>

<style scoped>
.frame-container {
  position: relative;
  display: inline-block;
}

.frame-svg {
  display: block;
}
</style>
