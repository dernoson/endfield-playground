<script lang="ts">
export * from './types';
</script>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
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
 *    - 上半部 Result (80px ~ splitPercent)
 *    - 下半部 Attention (splitPercent ~ 100%)
 * 3. 浮動物件：
 *    - Label (頂部 30px 懸浮)
 *    - Bar (貫穿白條，可拖曳調整上下畫面佔比)
 *    - Button (側邊黃色三角形指示按鈕，隨白條高度連動)
 */
defineProps<ShironeStatsPanelProps>();

const emit = defineEmits<{
    (e: 'toggle-collapse'): void;
}>();

const panelRef = ref<HTMLElement | null>(null);
const splitPercent = ref(60);
const isDragging = ref(false);

function onStartDrag(e: PointerEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    isDragging.value = true;

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
}

function onPointerMove(e: PointerEvent) {
    if (!isDragging.value || !panelRef.value) return;
    const rect = panelRef.value.getBoundingClientRect();
    if (rect.height <= 0) return;

    const offsetY = e.clientY - rect.top;
    const percent = (offsetY / rect.height) * 100;

    // 限制拖曳範圍在 30% ~ 80% 之間
    splitPercent.value = Math.min(Math.max(percent, 30), 80);
}

function onPointerUp() {
    isDragging.value = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
}

onUnmounted(() => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
});
</script>

<template>
    <div
        ref="panelRef"
        class="production-overview"
        :class="{ 'is-dragging': isDragging }"
        :style="{ '--split-percent': `${splitPercent}%` }"
    >
        <!-- 1. 卡片底板 -->
        <div class="plate" />

        <!-- 2. 卡片核心主要內容 (固定大物件) -->
        <div class="result-wrapper">
            <Result :power="power" :productions="productions" :ticket-per-hour="ticketPerHour" />
        </div>

        <div class="attention-wrapper">
            <Attention :tips="tips" />
        </div>

        <!-- 3. 貼附於 Frame 的漂浮元素 (浮動物件) -->
        <Label />
        <Bar :is-dragging="isDragging" @start-drag="onStartDrag" />
        <Button @click="emit('toggle-collapse')" />
    </div>
</template>

<style>
@font-face {
    font-family: 'HarmonyOS Sans TC';
    src: url('./fonts/HarmonyOS_Sans_TC_Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'HarmonyOS Sans TC';
    src: url('./fonts/HarmonyOS_Sans_TC_Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'HarmonyOS Sans TC';
    src: url('./fonts/HarmonyOS_Sans_TC_Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'HarmonyOS Sans TC';
    src: url('./fonts/HarmonyOS_Sans_TC_Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}
</style>

<style scoped>
.production-overview {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    position: relative;
    width: 320px;
    height: 100%;
    box-sizing: border-box;
    user-select: none;
    overflow: visible;
}

.production-overview.is-dragging {
    cursor: row-resize;
    user-select: none;
}

/* 1. 底板 */
.plate {
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    background: #4e4e4e;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
}

/* 2. 上半部 Result：往內 margin 18px，頂部在 Label 下方，底部距分界白條 18px */
.result-wrapper {
    position: absolute;
    top: 98px;
    left: 18px;
    right: 18px;
    bottom: calc(100% - var(--split-percent, 60%) + 18px);
    overflow: hidden;
    box-sizing: border-box;
}

/* 3. 下半部 Attention：往內 margin 18px，頂部距分界白條 18px，底部距 panel 18px */
.attention-wrapper {
    position: absolute;
    top: calc(var(--split-percent, 60%) + 18px);
    left: 18px;
    right: 18px;
    bottom: 18px;
    overflow: hidden;
    box-sizing: border-box;
}
</style>
