<script setup lang="ts">
defineProps<{
  selectedMachine?: string;
  size?: string;
  power?: string;
  selectedRecipe?: string;
}>();
</script>

<template>
  <div class="info">
    <!-- 1. selectedmachine -->
    <div class="selected-machine">
      已選取：{{ selectedMachine || '精煉爐' }}
    </div>

    <!-- 2. 3組資訊列表 (置左 a:  b 置右) -->
    <div class="info-list">
      <!-- size -->
      <div class="info-row size">
        <span class="label">尺寸</span>
        <span class="value">{{ size || '3*3' }}</span>
      </div>

      <!-- power -->
      <div class="info-row power">
        <span class="label">耗電量</span>
        <span class="value">{{ power || '10kW' }}</span>
      </div>

      <!-- selectedrecipe -->
      <div class="info-row selected-recipe">
        <span class="label">目前配方</span>
        <span class="value">{{ selectedRecipe || '紫晶纖維(15s)' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* information 容器 */
.info {
  position: absolute;
  width: 431px;
  height: 125px;
  left: 0px;
  top: 10px;
}

/* selected-machine */
.selected-machine {
  position: absolute;
  width: 190.35px;
  height: 23px;
  left: 10px;
  top: 3px;

  font-family: 'Sans TC', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;

  color: #FFFFFF;
  white-space: nowrap;
}

/* 3組 text 容器 ({some div}) */
.info-list {
  position: absolute;
  width: 230px;
  left: 20px;
  top: 35px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  width: 230px;
  height: 21px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-family: 'Sans TC';
  font-style: thin;
  font-size: 18px;
  line-height: 21px;

  color: #CFCFCF;
}

.info-row .label {
  white-space: nowrap;
}

.info-row .value {
  white-space: nowrap;
}
</style>
