<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import { useScroll, useResizeObserver } from '@vueuse/core';
import SingleProduction from './SingleProduction.vue';
import type { PowerStats, ProductionItem } from './types';

/**
 * Result 元件
 * 對應 Figma: Production Overview > Detail > Result (Detail, Bar)
 * 包含整體統計(含Bar)、產能估算與調度券兌換效率
 */
interface Props {
    power?: PowerStats;
    productions?: ProductionItem[];
    ticketPerHour?: number;
}

const props = withDefaults(defineProps<Props>(), {
    productions: () => [],
});

const variable = computed(() => {
    const supply = props.power?.supplyKw ?? 0;
    const demand = props.power?.demandKw ?? 0;
    if (supply <= 0) return 0;
    return demand / supply;
});

const barWidth = computed(() => {
    return Math.min(100, Math.max(0, variable.value * 100));
});

const expandedMap = ref<Record<string, boolean>>(
    (props.productions || []).reduce(
        (acc, item) => {
            acc[item.id] = item.expanded ?? true;
            return acc;
        },
        {} as Record<string, boolean>,
    ),
);

const infoRef = ref<HTMLElement | null>(null);
const isOverflowing = ref(false);

const { arrivedState, measure } = useScroll(infoRef, {
    offset: { bottom: 3 },
});

function updateOverflow() {
    const el = infoRef.value;
    if (el) {
        isOverflowing.value = el.scrollHeight > el.clientHeight;
    }
}

useResizeObserver(infoRef, () => {
    updateOverflow();
    measure();
});

onMounted(() => {
    updateOverflow();
    measure();
});

watch(
    () => props.productions,
    () => {
        nextTick(() => {
            updateOverflow();
            measure();
        });
    },
    { deep: true },
);

const canScrollTop = computed(() => {
    if (!isOverflowing.value) return false;
    return !arrivedState.top;
});

const canScrollBottom = computed(() => {
    if (!isOverflowing.value) return false;
    return !arrivedState.bottom;
});

function toggle(id: string) {
    expandedMap.value[id] = !expandedMap.value[id];
    nextTick(() => {
        updateOverflow();
        measure();
    });
}
</script>

<template>
    <div class="result-section">
        <div class="detail">
            <!-- 1. 整體統計 (含 Bar) -->
            <div class="overall-stats">
                <div class="overall-title">整體統計</div>
                <div class="overall-label">總耗電量/供電量</div>
                <!-- Bar (空條 #3C3C3C + 進度條 #EEFD1C) -->
                <div class="bar">
                    <div
                        v-if="barWidth > 0"
                        class="bar-fill"
                        :style="{ width: `${barWidth}%` }"
                    />
                </div>
                <div class="overall-value">
                    {{ power ? `${power.demandKw}kW/${power.supplyKw}kW` : '' }}
                </div>
            </div>

            <!-- 2. 產能估算 -->
            <div class="production-estimate">
                <div class="production-title">產能估算</div>

                <!-- info 容器 (動態配方項目清單，比照 FormulaList 與 SingleFormula 滾動提示) -->
                <div class="info-wrapper">
                    <div ref="infoRef" class="info">
                        <SingleProduction
                            v-for="item in productions"
                            :key="item.id"
                            :item="item"
                            :expanded="expandedMap[item.id]"
                            @toggle="toggle(item.id)"
                        />
                    </div>

                    <!-- 上方滾動提示 (有上方滾動空間時顯示) -->
                    <div v-if="canScrollTop" class="scroll-hint top">
                        <div class="hint-plate" />
                        <div class="hint-arrow" />
                    </div>

                    <!-- 下方滾動提示 (有下方滾動空間時顯示) -->
                    <div v-if="canScrollBottom" class="scroll-hint bottom">
                        <div class="hint-plate" />
                        <div class="hint-arrow" />
                    </div>
                </div>
            </div>

            <!-- 3. 調度券兌換效率 -->
            <div class="ticket-section">
                <div class="ticket-title">調度券兌換效率</div>
                <div class="ticket-value">
                    {{
                        ticketPerHour !== undefined ? `≈ ${ticketPerHour.toLocaleString()}/hr` : ''
                    }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.result-section {
    position: relative;
    width: 100%;
    height: 100%;
}

.overall-stats {
    position: relative;
    width: 100%;
    height: 103px;
}

.production-estimate {
    flex: 1;
    min-height: 0;
    position: relative;
    width: auto;
    margin-right: 60px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.production-title {
    position: relative;
    flex-shrink: 0;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    line-height: 23px;
    color: #ffffff;
    margin-bottom: 17px;
}

.info-wrapper {
    position: relative;
    flex: 1;
    min-height: 0;
    width: 100%;
    margin-bottom: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.info {
    flex: 1;
    min-height: 0;
    width: 100%;

    /* 超出高度自動滾動，橫向嚴格裁切（仿照 FormulaList.vue） */
    overflow-y: auto;
    overflow-x: hidden;

    /* 隱藏滾動條 */
    scrollbar-width: none;
    -ms-overflow-style: none;

    display: flex;
    flex-direction: column;
    gap: 10px;
}

.info::-webkit-scrollbar {
    display: none;
}

/* 滾動提示容器 (上下側，仿照 SingleFormula.vue) */
.scroll-hint {
    position: absolute;
    left: 0;
    right: 0;
    height: 14px;
    pointer-events: none;
    z-index: 10;
}

.scroll-hint.top {
    top: 0;
}

.scroll-hint.bottom {
    bottom: 0;
}

.scroll-hint.top .hint-plate {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 12px;
    background: linear-gradient(180deg, #4e4e4e 0%, rgba(78, 78, 78, 0) 100%);
}

.scroll-hint.bottom .hint-plate {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 12px;
    background: linear-gradient(0deg, #4e4e4e 0%, rgba(78, 78, 78, 0) 100%);
}

.scroll-hint.top .hint-arrow {
    position: absolute;
    top: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 13px;
    height: 6.5px;
    background: #ffffff;
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.scroll-hint.bottom .hint-arrow {
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 13px;
    height: 6.5px;
    background: #ffffff;
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
}

.overall-title {
    position: absolute;
    top: 0px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #ffffff;
}

.overall-label {
    position: absolute;
    top: 40px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-style: normal;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #cfcfcf;
}

.bar {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    height: 10px;
    border-radius: 25px;
    background: #3c3c3c;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    max-width: 100%;
    border-radius: 25px;
    background: #eefd1c;
}

.overall-value {
    position: absolute;
    top: 88px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-style: normal;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #a4a4a4;
}

.detail {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
}

.ticket-section {
    position: relative;
    margin-top: auto;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 4px;
}

.ticket-title {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    color: #ffffff;
    white-space: nowrap;
}

.ticket-value {
    margin-top: 10px;
    padding-left: 40px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-style: normal;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #cfcfcf;
    white-space: nowrap;
}
</style>
