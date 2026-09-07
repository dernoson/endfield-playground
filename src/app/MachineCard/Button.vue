<script setup lang="ts">
/**
 * 機器卡片邊緣操作按鈕元件，展示展開或切換操作圖示。
 * 將按鈕外層位置定位（.button）與三角形形狀本體（.triangle）分開處理。
 */
</script>

<template>
    <div class="button">
        <div class="triangle" />
    </div>
</template>

<style scoped>
/* 按鈕位置定位層 */
.button {
    position: absolute;
    top: 45%;
    right: -10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 三角形本體（純 CSS 刻出，不依賴 SVG 檔案） */
.triangle {
    width: 20px;
    height: 39px;
    background-color: #eefd1c;
    clip-path: polygon(100% 0%, 100% 100%, 0% 50%);
}
</style>
