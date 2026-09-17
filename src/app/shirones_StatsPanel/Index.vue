<script lang="ts">
export * from './types';
</script>

<script setup lang="ts">
import Label from './Label.vue';
import Bar from './Bar.vue';
import Button from './Button.vue';
import Result from './Result.vue';
import Attention from './Attention.vue';
import type { ShironeStatsPanelProps } from './types';

/**
 * Production Overview (產線總覽面板)
 * 1. 卡片底板 (.plate)
 * 2. 固定大物件：
 *    - 上半部 Result (80px ~ 50%)
 *    - 下半部 Attention (50% ~ 100%)
 * 3. 浮動物件：
 *    - Label (頂部 30px 懸浮)
 *    - Bar (固定於 50% 貫穿白條)
 *    - Button (固定於 50% 側邊黃色三角形指示按鈕)
 */
defineProps<ShironeStatsPanelProps>();

const emit = defineEmits<{
    (e: 'toggle-collapse'): void;
}>();
</script>

<template>
    <div class="production-overview">
        <!-- 1. 卡片底板 -->
        <div class="plate" />

        <!-- 2. 卡片核心主要內容 (固定大物件) -->
        <div class="result-wrapper">
            <Result
                :power="power"
                :productions="productions"
                :ticket-per-hour="ticketPerHour"
            />
        </div>

        <div class="attention-wrapper">
            <Attention :tips="tips" />
        </div>

        <!-- 3. 貼附於 Frame 的漂浮元素 (浮動物件) -->
        <Label />
        <Bar />
        <Button @click="emit('toggle-collapse')" />
    </div>
</template>

<style scoped>
.production-overview {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 240px;
    box-sizing: border-box;
    user-select: none;
    overflow: visible;
}

/* 1. 底板 */
.plate {
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    background: #4E4E4E;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
}

/* 2. 上半部 Result：往內 margin 18px，頂部在 Label 下方，底部距 50% 白條 18px */
.result-wrapper {
    position: absolute;
    top: 98px;
    left: 18px;
    right: 18px;
    bottom: calc(50% + 18px);
    overflow-y: auto;
    box-sizing: border-box;
}

/* 3. 下半部 Attention：往內 margin 18px，頂部距 50% 白條 18px，底部距 panel 18px */
.attention-wrapper {
    position: absolute;
    top: calc(50% + 18px);
    left: 18px;
    right: 18px;
    bottom: 18px;
    overflow-y: auto;
    box-sizing: border-box;
}
</style>
