<script setup lang="ts">
import Result from './Result.vue';
import Attention from './Attention.vue';
import Bar from './Bar.vue';
import type { ShironeStatsPanelProps } from './types';

/**
 * Detail 元件
 * 對應 Figma: Production Overview > Detail (Result, Attention, Bar)
 */
defineProps<ShironeStatsPanelProps>();
</script>

<template>
    <div class="detail-container relative flex-1 flex flex-col p-4 justify-between">
        <!-- Result: 整體統計、產能估算、調度券 -->
        <Result
            :power="power"
            :productions="productions"
            :ticket-per-hour="ticketPerHour"
        />

        <!-- Bar: 0.6 height 白條 #DADADA (對應 Figma: Detail > Bar) -->
        <Bar />

        <!-- Attention: Tips (Error, Warning) -->
        <Attention :tips="tips" class="pt-4" />
    </div>
</template>

<style scoped>
.detail-container {
    position: relative;
    width: 100%;
}
</style>
