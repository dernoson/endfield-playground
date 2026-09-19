<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useScroll, useResizeObserver } from '@vueuse/core';
import type { TipItem } from './types';

interface Props {
    tips?: TipItem[];
}

const props = withDefaults(defineProps<Props>(), {
    tips: () => [
        { id: 'e1', type: 'error', message: '碎紙機單元*1位置重疊' },
        { id: 'e2', type: 'error', message: '碎紙機單元*1位置重疊' },
        { id: 'w1', type: 'warning', message: '貓毛貓範圍總sb超載' },
        { id: 'w2', type: 'warning', message: '貓毛貓範圍總sb超載' },
        { id: 'w3', type: 'warning', message: '貓毛貓範圍總sb超載' },
    ],
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
        <div class="title-text">Tips</div>

        <div class="tips-wrapper">
            <div ref="tipsListRef" class="tips-list">
                <div
                    v-for="tip in tips"
                    :key="tip.id"
                    :class="tip.type === 'error' ? 'error' : 'warning'"
                >
                    <div class="plate" />
                    <!-- Error Icon -->
                    <svg
                        v-if="tip.type === 'error'"
                        class="icon"
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.5 0C5.14868 0 0 5.14868 0 11.5C0 17.8513 5.14868 23 11.5 23C17.8513 23 23 17.8513 23 11.5C23 5.14868 17.8513 0 11.5 0ZM17.9738 16.691L16.6909 17.9739C16.4547 18.2101 16.0718 18.2101 15.8356 17.9739L11.4999 13.6382L7.16413 17.9739C6.92796 18.2101 6.54506 18.2101 6.30877 17.9739L5.02607 16.6909C4.7899 16.4547 4.7899 16.0718 5.02607 15.8356L9.36182 11.4999L5.02618 7.16425C4.79001 6.92807 4.79001 6.54517 5.02618 6.309L6.30911 5.02607C6.54528 4.7899 6.92818 4.7899 7.16436 5.02607L11.5001 9.36171L15.8358 5.02607C16.0719 4.7899 16.4548 4.7899 16.691 5.02607L17.9739 6.309C18.2101 6.54517 18.2101 6.92807 17.9739 7.16425L13.6383 11.4999L17.974 15.8356C18.2101 16.0718 18.2101 16.4547 17.9738 16.691Z"
                            fill="#FF6E6E"
                        />
                    </svg>

                    <!-- Warning Icon -->
                    <svg
                        v-else
                        class="icon"
                        width="26"
                        height="23"
                        viewBox="0 0 26 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M25.537 18.4608L15.5971 1.47957C15.0611 0.564023 14.0707 0 12.9988 0C11.9269 0 10.9366 0.564023 10.4006 1.47957L0.401959 18.5613C-0.133987 19.4768 -0.133987 20.6049 0.401959 21.5204C0.937905 22.436 1.92828 23 3.00018 23H22.9976H22.9999C24.6569 23 26 21.6752 26 20.0409C26 19.4599 25.8303 18.9181 25.537 18.4608ZM13 20.3635C12.1348 20.3635 11.4335 19.6717 11.4335 18.8183C11.4335 17.965 12.1348 17.2733 13 17.2733C13.8651 17.2733 14.5665 17.9651 14.5665 18.8183C14.5665 19.6718 13.8651 20.3635 13 20.3635ZM14.5665 14.2275C14.5665 15.0809 13.8651 15.7727 13 15.7727C12.1348 15.7727 11.4335 15.0809 11.4335 14.2275V6.3033C11.4335 5.44995 12.1348 4.75819 13 4.75819C13.8651 4.75819 14.5665 5.44995 14.5665 6.3033V14.2275Z"
                            fill="#F7D945"
                        />
                    </svg>

                    <div class="text">
                        {{ tip.message }}
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
.attention {
    position: relative;
    width: 278px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.title-text {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    color: #ffffff;
    flex-shrink: 0;
    margin-bottom: 15px;
    margin-left: -3px;
}

.tips-wrapper {
    position: relative;
    flex: 1;
    min-height: 0;
    width: 278px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.tips-list {
    flex: 1;
    min-height: 0;
    width: 278px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.tips-list::-webkit-scrollbar {
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

.error,
.warning {
    box-sizing: border-box;
    position: relative;
    width: 278px;
    height: 35px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.error .plate {
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    height: 35px;
    background: rgba(255, 110, 110, 0.1);
    z-index: 0;
}

.warning .plate {
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    height: 35px;
    background: rgba(247, 217, 69, 0.1);
    z-index: 0;
}

.error .icon {
    position: absolute;
    top: 6px;
    left: 7px;
    width: 23px;
    height: 23px;
    z-index: 1;
}

.warning .icon {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 26px;
    height: 23px;
    z-index: 1;
}

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
