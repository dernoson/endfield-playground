<script setup lang="ts">
import { ref, watch } from 'vue';
import type { CapacityEstimateRow, TipItem } from './types';
import CollapseButton from './CollapseButton.vue';
import PowerSummary from './PowerSummary.vue';
import CapacityEstimate from './CapacityEstimate.vue';
import TicketEfficiency from './TicketEfficiency.vue';
import TipsList from './TipsList.vue';

interface Props {
    title?: string;
    totalDemandKw?: number;
    totalSupplyKw?: number;
    capacityRows?: CapacityEstimateRow[];
    ticketPerHour?: number;
    tips?: TipItem[];
    collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: '產線總覽',
    totalDemandKw: 120,
    totalSupplyKw: 180,
    capacityRows: () => [
        {
            itemId: '1',
            name: '紫晶纖維',
            produced: 406,
            consumed: 0,
            net: 406,
            isExpanded: true,
        },
        {
            itemId: '2',
            name: '紫晶纖維',
            produced: 0,
            consumed: 799,
            net: -799,
            isExpanded: true,
        },
    ],
    ticketPerHour: 799325,
    tips: () => [
        { id: 'e1', type: 'error', message: '碎紙機單元*1位置重疊' },
        { id: 'e2', type: 'error', message: '碎紙機單元*1位置重疊' },
        { id: 'w1', type: 'warning', message: '貓毛貓範圍總sb超載' },
        { id: 'w2', type: 'warning', message: '貓毛貓範圍總sb超載' },
        { id: 'w3', type: 'warning', message: '貓毛貓範圍總sb超載' },
    ],
    collapsed: false,
});

const emit = defineEmits<{
    (e: 'update:collapsed', value: boolean): void;
    (e: 'toggle-collapse'): void;
}>();

const isCollapsed = ref(props.collapsed);

watch(
    () => props.collapsed,
    (val) => {
        isCollapsed.value = val;
    },
);

function handleToggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
    emit('update:collapsed', isCollapsed.value);
    emit('toggle-collapse');
}
</script>

<template>
    <div class="production-overview" :class="{ 'is-collapsed': isCollapsed }">
        <!-- 1. 卡片底板 -->
        <div class="plate" />

        <!-- 2. 頂部漂浮標籤 (Lable) -->
        <div class="label-container">
            <div class="black-bar" />
            <div class="grey-bar" />
            <div class="label-text">
                {{ title }}
            </div>
        </div>

        <!-- 3. 上半部：統計、產能與效率 (Result) -->
        <div class="result-wrapper">
            <PowerSummary :total-demand-kw="totalDemandKw" :totalSupplyKw="totalSupplyKw" />
            <CapacityEstimate :rows="capacityRows" />
            <TicketEfficiency :ticket-per-hour="ticketPerHour" />
        </div>

        <!-- 4. 分界白線與左側三角形按鈕 -->
        <div class="bar-line" />
        <CollapseButton :collapsed="isCollapsed" @toggle="handleToggleCollapse" />

        <!-- 5. 下半部：Tips 警示與錯誤 (Attention) -->
        <div class="attention-wrapper">
            <TipsList :tips="tips" />
        </div>
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
    height: 1080px;
    box-sizing: border-box;
    user-select: none;
    overflow: visible;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.production-overview.is-collapsed {
    transform: translateX(100%);
}

/* 1. 底板 */
.plate {
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    width: 320px;
    height: 1080px;
    background: #4e4e4e;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
}

/* 2. 標籤 */
.label-container {
    position: absolute;
    top: 28px;
    left: -13px;
    width: 333px;
    height: 53px;
    z-index: 10;
}

.grey-bar {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 6px;
    height: 53px;
    background: #dadada;
    z-index: 2;
}

.black-bar {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 333px;
    height: 53px;
    background: #2b2b2b;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    z-index: 1;
}

.label-text {
    position: absolute;
    left: 31px;
    top: 13px;
    height: 28px;
    display: flex;
    align-items: center;
    z-index: 3;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 28px;
    color: #ffffff;
    white-space: nowrap;
}

/* 3. 上半部 Result 區塊 */
.result-wrapper {
    position: absolute;
    top: 100px;
    left: 18px;
    width: 281px;
    height: 465px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

/* 4. 分界白線 */
.bar-line {
    position: absolute;
    top: 582px;
    left: 0;
    width: 320px;
    height: 1px;
    background-color: #dadada;
    z-index: 5;
}

/* 5. 下半部 Attention 區塊 */
.attention-wrapper {
    position: absolute;
    top: 600px;
    left: 21px;
    width: 278px;
    bottom: 18px;
    overflow: hidden;
    box-sizing: border-box;
}
</style>
