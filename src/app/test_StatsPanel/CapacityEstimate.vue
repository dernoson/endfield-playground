<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useScroll, useResizeObserver } from '@vueuse/core';
import type { CapacityEstimateRow } from './types';

interface Props {
    rows?: CapacityEstimateRow[];
}

const props = withDefaults(defineProps<Props>(), {
    rows: () => [
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
});

const expandedMap = ref<Record<string, boolean>>(
    (props.rows || []).reduce(
        (acc, item, idx) => {
            const key = item.itemId || String(idx);
            acc[key] = item.isExpanded ?? true;
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
    () => props.rows,
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

function toggle(key: string) {
    expandedMap.value[key] = !expandedMap.value[key];
    nextTick(() => {
        updateOverflow();
        measure();
    });
}
</script>

<template>
    <div class="production-estimate">
        <div class="production-title">產能估算</div>

        <div class="info-wrapper">
            <div ref="infoRef" class="info">
                <div v-for="(row, idx) in rows" :key="row.itemId || idx" class="production-item">
                    <div class="item-header" @click="toggle(row.itemId || String(idx))">
                        <div class="header-left">
                            <button class="collapse-btn" type="button" aria-label="收合">
                                <svg
                                    class="chevron"
                                    :class="{
                                        'is-collapsed': !expandedMap[row.itemId || String(idx)],
                                    }"
                                    viewBox="0 0 13 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 1.5L6.5 6.5L12 1.5"
                                        stroke="currentColor"
                                        stroke-width="1.6"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                            <span class="text-product">{{ row.name }}</span>
                        </div>
                        <div class="text-balance" :class="row.net >= 0 ? 'positive' : 'negative'">
                            收益{{ row.net >= 0 ? `+${row.net}` : row.net }}
                        </div>
                    </div>

                    <div v-if="expandedMap[row.itemId || String(idx)]" class="item-detail">
                        <div class="product-row">
                            <span class="label">生產</span>
                            <span class="value">{{ row.produced }}{{ row.unit ?? '/min' }}</span>
                        </div>
                        <div class="consume-row">
                            <span class="label">消耗</span>
                            <span class="value">{{ row.consumed }}{{ row.unit ?? '/min' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 上方滾動提示 -->
            <div v-if="canScrollTop" class="scroll-hint top">
                <div class="hint-plate" />
                <div class="hint-arrow" />
            </div>

            <!-- 下方滾動提示 -->
            <div v-if="canScrollBottom" class="scroll-hint bottom">
                <div class="hint-plate" />
                <div class="hint-arrow" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.production-estimate {
    flex: 1;
    min-height: 0;
    position: relative;
    width: 224px;
    margin-left: 3px;
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
    font-size: 20px;
    line-height: 23px;
    color: #ffffff;
    margin-bottom: 16px;
    margin-left: -3px;
}

.info-wrapper {
    position: relative;
    flex: 1;
    min-height: 0;
    width: 224px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.info {
    flex: 1;
    min-height: 0;
    width: 224px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.info::-webkit-scrollbar {
    display: none;
}

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

.production-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-shrink: 0;
    width: 224px;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
    width: 224px;
    height: 21px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 5px;
}

.collapse-btn {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 8px;
    color: #cfcfcf;
    cursor: pointer;
    flex-shrink: 0;
}

.chevron {
    width: 13px;
    height: 8px;
    transition: transform 0.2s ease;
}

.chevron.is-collapsed {
    transform: rotate(-90deg);
}

.text-product {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    color: #cfcfcf;
}

.text-balance {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 19px;
    text-align: right;
}

.text-balance.positive {
    color: #a3fd1c;
}

.text-balance.negative {
    color: #ff6e6e;
}

.item-detail {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-left: 18px;
}

.product-row,
.consume-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 19px;
    width: 125px;
}

.product-row .label,
.consume-row .label {
    color: #f5f5f5;
    width: 32px;
}

.product-row .value,
.consume-row .value {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 19px;
    text-align: right;
    color: #f5f5f5;
}
</style>
