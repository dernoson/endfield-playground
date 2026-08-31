<script setup lang="ts">
import buttonSvg from './Button.svg';
</script>

<template>
  <div class="button">
    <img :src="buttonSvg" alt="button" />
  </div>
</template>

<style scoped>
.button {
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  width: 24px;
  height: 39px;
  cursor: pointer;
}
</style>
