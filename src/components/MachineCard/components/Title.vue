<script setup lang="ts">
defineProps<{
  name?: string;
}>();
</script>

<template>
  <div class="title">
    <div class="plate"></div>
    <div class="text">
      <slot>{{ name || '裝配機' }}</slot>
    </div>
  </div>
</template>

<style scoped>
/* Title */
.title {
  position: absolute;
  width: 448px;
  height: 52px;
  left: 3px;
  top: 0px;
}

/* Plate */
.plate {
  position: absolute;
  height: 52px;
  left: 0px;
  right: 0px;
  top: 0px;

  background: #3D3D3D;
  border-radius: 0px 50px 0px 0px;
}

/* Text */
.text {
  position: absolute;
  height: 28px;
  left: 19px;
  right: 234.1px;
  top: 12px;

  font-family: 'HarmonyOS Sans TC', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 24px;
  line-height: 28px;

  color: #FFFFFF;
  white-space: nowrap;
}
</style>
