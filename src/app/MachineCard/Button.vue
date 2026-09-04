<script setup lang="ts">
import buttonSvg from './Button.svg';

/**
 * 機器卡片邊緣操作按鈕元件，展示展開或切換操作圖示。
 */
</script>

<template>
    <div class="button">
        <img :src="buttonSvg" alt="button" />
    </div>
</template>

<style scoped>
.button {
    position: absolute;
    top: 45%;
    right: -10px;
    cursor: pointer;
}
</style>
