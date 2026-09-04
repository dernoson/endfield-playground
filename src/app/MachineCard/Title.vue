<script setup lang="ts">
/**
 * 機器卡片頂部標題列元件，展示面板名稱底板與標題文字。
 */
</script>

<template>
    <div class="title">
        <div class="plate"></div>
        <div class="text">
            <slot>物件資訊面板</slot>
        </div>
    </div>
</template>

<style scoped>
/* Title */
.title {
    position: absolute;
    left: 3px;
    right: 0px;
    height: 52px;
    top: 0px;
}

/* Plate */
.plate {
    position: absolute;
    height: 52px;
    left: 0px;
    right: 0px;
    top: 0px;

    background: #3d3d3d;
    border-radius: 0px 40px 0px 0px;
}

/* Text */
.text {
    position: absolute;
    height: 28px;
    left: 19px;
    top: 12px;

    font-size: 24px;
    line-height: 28px;

    color: #ffffff;
    white-space: nowrap;
}
</style>
