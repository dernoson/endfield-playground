<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import FormulaItem from '@/components/FormulaItem/Index.vue';
import type { Formula } from './types';

/** 單一配方展示元件之屬性定義 */
const props = defineProps<{
    /** 所要呈現的單一配方資料（包含週期、原料與產物） */
    singleformula: Formula;
}>();

const rowRef = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

/** 偵測目前水平捲動進度，動態切換左右提示顯示狀態 */
function updateScrollState(): void {
    const el = rowRef.value;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth;

    // 容許 1px 渲染誤差
    canScrollLeft.value = scrollLeft > 1;
    canScrollRight.value = maxScrollLeft > 1 && scrollLeft < maxScrollLeft - 1;
}

/** 點選箭頭時提供平滑滾動操作 */
function scrollByDirection(direction: 'left' | 'right'): void {
    const el = rowRef.value;
    if (!el) return;
    const offset = direction === 'left' ? -90 : 90;
    el.scrollBy({ left: offset, behavior: 'smooth' });
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
    nextTick(() => {
        updateScrollState();
        if (typeof ResizeObserver !== 'undefined' && rowRef.value) {
            resizeObserver = new ResizeObserver(() => {
                updateScrollState();
            });
            resizeObserver.observe(rowRef.value);
        }
    });
});

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
});

watch(
    () => props.singleformula,
    () => {
        nextTick(updateScrollState);
    },
    { deep: true },
);
</script>

<template>
    <div class="single-formula">
        <div class="duration">週期 {{ singleformula.duration }}s</div>

        <div class="formula-row-wrapper">
            <div ref="rowRef" class="formula-row" @scroll.passive="updateScrollState">
                <template v-for="(item, index) in singleformula.input" :key="`in-${index}`">
                    <span v-if="index > 0" class="operator plus">+</span>
                    <FormulaItem :item="item" />
                </template>

                <span class="operator arrow">→</span>

                <template v-for="(item, index) in singleformula.output" :key="`out-${index}`">
                    <span v-if="index > 0" class="operator plus">+</span>
                    <FormulaItem :item="item" />
                </template>
            </div>

            <!-- 左側捲動提示 -->
            <div
                v-show="canScrollLeft"
                class="scroll-hint left"
                role="button"
                aria-label="向左捲動"
                @click="scrollByDirection('left')"
            >
                <div class="plate" />
                <div class="arrow" />
            </div>

            <!-- 右側捲動提示 -->
            <div
                v-show="canScrollRight"
                class="scroll-hint right"
                role="button"
                aria-label="向右捲動"
                @click="scrollByDirection('right')"
            >
                <div class="plate" />
                <div class="arrow" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.single-formula {
    position: relative;
    margin: 10px 7px 0 7px;
    box-sizing: border-box;
    overflow: hidden;
}

.duration {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    color: #cfcfcf;
    margin-bottom: 6px;
    padding-left: 2px;
}

.formula-row-wrapper {
    position: relative;
    width: 100%;
}

.formula-row {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 14px 8px 14px;
    gap: 3px;
    background: rgba(43, 43, 43, 0.2);
    border-radius: 4px;
    overflow-x: auto;
    overflow-y: hidden;
    color: #cfcfcf;

    /* 隱藏滾動條 */
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.formula-row::-webkit-scrollbar {
    display: none;
}

/* 捲動提示指示層 */
.scroll-hint {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 5;
    user-select: none;
}

.scroll-hint.left {
    left: 0;
}

.scroll-hint.right {
    right: 0;
    justify-content: flex-end;
}

/* 提示底板漸層 */
.scroll-hint.left .plate {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 10px;
    background: linear-gradient(270deg, rgba(71, 71, 71, 0) 0%, #3c3c3c 100%);
    border-radius: 4px 0 0 4px;
}

.scroll-hint.right .plate {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 10px;
    background: linear-gradient(90deg, rgba(71, 71, 71, 0) 0%, #3c3c3c 100%);
    border-radius: 0 4px 4px 0;
}

/* 提示三角形箭頭 (13 x 6.5) */
.scroll-hint.left .arrow {
    position: relative;
    margin-left: 4.88px;
    width: 6.5px;
    height: 13px;
    background: #ffffff;
    clip-path: polygon(100% 0%, 100% 100%, 0% 50%);
    z-index: 1;
}

.scroll-hint.right .arrow {
    position: relative;
    margin-right: 4.88px;
    width: 6.5px;
    height: 13px;
    background: #ffffff;
    clip-path: polygon(0% 0%, 0% 100%, 100% 50%);
    z-index: 1;
}

.operator {
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #cfcfcf;
    user-select: none;
    flex-shrink: 0;
}

.operator.plus {
    width: 10px;
    height: 19px;
}

.operator.arrow {
    width: 35px;
    height: 19px;
}
</style>
