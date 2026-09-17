<script lang="ts">
export * from './types';
</script>

<script setup lang="ts">
import CollapseButton from './CollapseButton.vue';
import Bar from './Bar.vue';
import Label from './Label.vue';
import Result from './Result.vue';
import Attention from './Attention.vue';
import type { ShironeStatsPanelProps } from './types';

/**
 * Production Overview 主面板
 * 結構劃分：
 * 1. 浮動物件：CollapseButton, Bar, Label
 * 2. 固定大物件：Result, Attention
 */
defineProps<ShironeStatsPanelProps>();

const emit = defineEmits<{
    (e: 'toggle-collapse'): void;
}>();
</script>

<template>
    <div class="production-overview">
        <!-- 2. 固定大物件 (主要內容流) -->
        <div class="panel-body">
            <Result
                :power="power"
                :productions="productions"
                :ticket-per-hour="ticketPerHour"
            />
            <Attention :tips="tips" />
        </div>

        <!-- 1. 浮動物件 (絕對定位漂浮層) -->
        <CollapseButton @toggle="emit('toggle-collapse')" />
        <Bar />
        <Label />
    </div>
</template>

<style scoped>
.production-overview {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 240px;
    background-color: #4e4e4e;
    user-select: none;
    overflow: visible;
}

/* 固定大物件的容器，避開頂部 30px~80px 的 Label 區域 */
.panel-body {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 95px 16px 16px 16px;
    box-sizing: border-box;
}
</style>
