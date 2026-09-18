<script setup lang="ts">
/**
 * 操作按鈕元件（對標 MachineCard/Button.vue）
 * 對應規格：button 位於 panel 外面，right 距離 panel left 12px
 */
</script>

<template>
    <div class="button">
        <div class="triangle" />
    </div>
</template>

<style scoped>
/* 按鈕位置定位層（固定於 50% 側邊，right 距離 panel left 12px） */
.button {
    position: absolute;
    top: 50%;
    right: calc(100% + 12px);
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

/* 三角形本體（純 CSS 刻出，寬 12px，高 24px） */
.triangle {
    width: 12px;
    height: 24px;
    background-color: #eefd1c;
    clip-path: polygon(100% 50%, 0% 0%, 0% 100%);
}
</style>
