<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useScroll, useResizeObserver } from '@vueuse/core';
import errorIconUrl from './ErrorIcon.svg';
import warningIconUrl from './WarningIcon.svg';
import type { AlertTip } from './types';

interface Props {
    tips?: AlertTip[];
    errorMessage?: string;
    warningMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
    tips: () => [],
    errorMessage: '',
    warningMessage: '',
});

const tipsListRef = ref<HTMLElement | null>(null);
const isOverflowing = ref(false);

const { arrivedState, measure } = useScroll(tipsListRef, {
    offset: { bottom: 3 },
});

function updateOverflow() {
    const el = tipsListRef.value;
    if (el) {
        isOverflowing.value = el.scrollHeight > el.clientHeight;
    }
}

useResizeObserver(tipsListRef, () => {
    updateOverflow();
    measure();
});

onMounted(() => {
    updateOverflow();
    measure();
});

watch(
    () => props.tips,
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
</script>

<template>
    <div class="attention">
        <!-- 1. Text -->
        <div class="title-text">Tips</div>

        <div class="tips-wrapper">
            <div ref="tipsListRef" class="tips-list">
                <!-- 2. 動態 Tips 列表（若有傳入 tips 陣列） -->
                <template v-if="tips && tips.length > 0">
                    <div
                        v-for="tip in tips"
                        :key="tip.id"
                        :class="tip.level === 'error' ? 'error' : 'warning'"
                    >
                        <div class="plate" />
                        <img
                            :src="tip.level === 'error' ? errorIconUrl : warningIconUrl"
                            class="icon"
                            :alt="`${tip.level} icon`"
                        />
                        <div class="text">
                            {{ tip.message }}
                        </div>
                    </div>
                </template>

                <!-- 3. 單一 errorMessage / warningMessage 或 Slot 兼容模式 -->
                <template v-else-if="errorMessage || warningMessage">
                    <div v-if="errorMessage" class="error">
                        <div class="plate" />
                        <img :src="errorIconUrl" class="icon" alt="error icon" />
                        <div class="text">
                            <slot name="error">{{ errorMessage }}</slot>
                        </div>
                    </div>

                    <div v-if="warningMessage" class="warning">
                        <div class="plate" />
                        <img :src="warningIconUrl" class="icon" alt="warning icon" />
                        <div class="text">
                            <slot name="warning">{{ warningMessage }}</slot>
                        </div>
                    </div>
                </template>
            </div>

            <!-- 上方滾動提示 (有上方滾動空間時顯示，仿照 SingleFormula.vue) -->
            <div v-if="canScrollTop" class="scroll-hint top">
                <div class="hint-plate" />
                <div class="hint-arrow" />
            </div>

            <!-- 下方滾動提示 (有下方滾動空間時顯示，仿照 SingleFormula.vue) -->
            <div v-if="canScrollBottom" class="scroll-hint bottom">
                <div class="hint-plate" />
                <div class="hint-arrow" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.attention {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* 1. Text */
.title-text {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    color: #ffffff;
    flex-shrink: 0;
    margin-bottom: 12px;
}

.tips-wrapper {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.tips-list {
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.tips-list::-webkit-scrollbar {
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

/* 2. Error = [plate + icon + text + text + text ... ] */
.error {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 35px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding-left: 36px;
    padding-right: 8px;
    overflow: hidden;
}

/* Plate */
.error .plate {
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    height: 35px;
    background: rgba(255, 110, 110, 0.1);
    z-index: 0;
}

/* Icon */
.error .icon {
    position: absolute;
    top: 7px;
    left: 7px;
    width: 23px;
    height: 23px;
    z-index: 1;
}

/* Text inside Error */
.error .text {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;

    position: absolute;
    left: 42px;
    top: 7px;

    color: #ff6e6e;
    white-space: nowrap;
    z-index: 1;
}

/* 3. Warning = [plate + icon + text + text + text ... ] */
.warning {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 35px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding-left: 36px;
    padding-right: 8px;
    overflow: hidden;
}

/* Plate */
.warning .plate {
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    height: 35px;
    background: #f7d9451a;
    z-index: 0;
}

/* Icon */
.warning .icon {
    position: absolute;
    top: 7px;
    left: 7px;
    width: 26px;
    height: 23px;
    z-index: 1;
}

/* Text inside Warning */
.warning .text {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;

    position: absolute;
    left: 42px;
    top: 7px;

    color: #f7d945;
    white-space: nowrap;
    z-index: 1;
}
</style>
