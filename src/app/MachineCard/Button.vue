<script setup lang="ts">
/**
 * 三角形按鈕 / 指示圖形元件（取代原本的 Button.svg，作為純展示通用圖形元件）。
 * 本元件僅負責形狀本體渲染，不包含定位樣式；位置由上游容器負責。
 */
</script>

<template>
    <div class="triangle" />
</template>

<style scoped>
/* 三角形本體（純 CSS 刻出，取代原本 Button.svg） */
.triangle {
    width: 20px;
    height: 40px;
    background-color: #eefd1c;
    clip-path: polygon(100% 0%, 100% 100%, 0% 50%);
}
</style>
