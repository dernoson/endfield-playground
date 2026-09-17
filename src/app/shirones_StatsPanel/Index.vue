<script lang="ts">
export * from './types';
</script>

<script setup lang="ts">
import CollapseButton from './CollapseButton.vue';
import Label from './Label.vue';
import Detail from './Detail.vue';
import type { ShironeStatsPanelProps } from './types';

/**
 * Production Overview 元件
 * 對應 Figma 根圖層: # Production Overview
 * 子圖層包含:
 *  - collapse button (側邊黃色收合按鈕)
 *  - Lable (頂部標籤與底板)
 *  - Detail (Result, Attention, Bar)
 */
defineProps<ShironeStatsPanelProps>();

const emit = defineEmits<{
    (e: 'toggle-collapse'): void;
}>();
</script>

<template>
    <div class="production-overview relative flex flex-col w-full h-full select-none bg-[#4E4E4E] text-white shadow-xl">
        <!-- 1. collapse button -->
        <CollapseButton @toggle="emit('toggle-collapse')" />

        <!-- 2. Lable -->
        <Label />

        <!-- 3. Detail (Result + Attention + Bar) -->
        <Detail
            :power="power"
            :productions="productions"
            :ticket-per-hour="ticketPerHour"
            :tips="tips"
        />
    </div>
</template>

<style scoped>
.production-overview {
    position: relative;
    min-width: 240px;
}
</style>
