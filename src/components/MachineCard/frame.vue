<script setup lang="ts">
import Title from './components/Title.vue';
import Machine from './components/Machine.vue';
import Formula from './components/Formula.vue';
import Info from './components/Info.vue';
import Button from './components/Button.vue';
</script>

<template>
  <div class="frame-container">
    <div class="plate"></div>
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
  width: 451px;
  height: 686px;
}

/* plate */
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
</style>
