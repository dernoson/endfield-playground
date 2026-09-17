<script setup lang="ts">
import type { ProductionItem } from './types';

/** 單一產能項目規格屬性 */
const props = withDefaults(
    defineProps<{
        /** 產能項目資料 */
        item: ProductionItem;
        /** 是否展開明細 */
        expanded?: boolean;
    }>(),
    {
        expanded: true,
    }
);

const emit = defineEmits<{
    (e: 'toggle', id: string): void;
}>();
</script>

<template>
    <div class="production-item">
        <!-- 每格: [收合button + text product + 收支] -->
        <div class="item-header" @click="emit('toggle', item.id)">
            <div class="header-left">
                <button class="collapse-btn" type="button" aria-label="收合">
                    <svg
                        class="chevron"
                        :class="{ 'is-collapsed': !expanded }"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path d="M4 6l4 4 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <span class="text-product">{{ item.name }}</span>
            </div>
            <div
                class="text-balance"
                :class="item.producePerMin - item.consumePerMin >= 0 ? 'positive' : 'negative'"
            >
                收益{{ item.producePerMin - item.consumePerMin >= 0 ? `+${item.producePerMin - item.consumePerMin}` : item.producePerMin - item.consumePerMin }}
            </div>
        </div>

        <!-- 展開明細: [product + consume] where product, consume = [text 生產/消耗 + text {number}/min] -->
        <div v-if="expanded" class="item-detail">
            <div class="product-row">
                <span class="label">生產</span>
                <span class="value">{{ item.producePerMin }}/min</span>
            </div>
            <div class="consume-row">
                <span class="label">消耗</span>
                <span class="value">{{ item.consumePerMin }}/min</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.production-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 6px;
}

.collapse-btn {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a4a4a4;
    cursor: pointer;
}

.chevron {
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
}

.chevron.is-collapsed {
    transform: rotate(-90deg);
}

.text-product {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 100%;
    color: #dadada;
}

.text-balance {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 100%;
}

.text-balance.positive {
    color: #7ee14d;
}

.text-balance.negative {
    color: #f87171;
}

.item-detail {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 20px;
}

.product-row,
.consume-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-size: 14px;
    line-height: 18px;
}

.product-row .label,
.consume-row .label {
    font-weight: 300;
    color: #a4a4a4;
}

.product-row .value,
.consume-row .value {
    font-weight: 300;
    color: #dadada;
}
</style>
