<!-- Generated from Figma JSON. Regenerate through the converter instead of moving generated nodes manually. -->
<script lang="ts">
export * from './types';
</script>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import HeaderLabel from './HeaderLabel.vue';
import ResultPanel from './ResultPanel.vue';
import AttentionPanel from './AttentionPanel.vue';
import CollapseButton from './CollapseButton.vue';
import type { TestStatsPanelProps } from './types';

const props = withDefaults(defineProps<TestStatsPanelProps>(), {
    isCollapsed: undefined,
});

const emit = defineEmits<{
    (e: 'update:isCollapsed', value: boolean): void;
    (e: 'toggle-collapse'): void;
}>();

// 1. 面板收合狀態
const isCollapsed = ref(props.isCollapsed ?? false);

watch(
    () => props.isCollapsed,
    (val) => {
        if (val !== undefined) {
            isCollapsed.value = val;
        }
    },
);

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
    emit('update:isCollapsed', isCollapsed.value);
    emit('toggle-collapse');
};

// 2. 白線上下拖動分割狀態 (預設上半部高度 582px)
const containerRef = ref<HTMLElement | null>(null);
const topHeight = ref(582);
const isDragging = ref(false);

const startDrag = () => {
    isDragging.value = true;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';

    window.addEventListener('mousemove', onDragging);
    window.addEventListener('touchmove', onDragging);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
};

const onDragging = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !containerRef.value) return;
    const rect = containerRef.value.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const relativeY = clientY - rect.top;

    // 限制拖曳範圍：最小保留頂部 220px，底部保留 150px
    const minHeight = 220;
    const maxHeight = rect.height - 150;

    topHeight.value = Math.max(minHeight, Math.min(maxHeight, relativeY));
};

const stopDrag = () => {
    isDragging.value = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', onDragging);
    window.removeEventListener('touchmove', onDragging);
    window.removeEventListener('mouseup', stopDrag);
    window.removeEventListener('touchend', stopDrag);
};

// 3. 箭頭高度比例 (559 / 1080 ≈ 51.759%)
const arrowTopPercent = ref((559 / 1080) * 100);

onUnmounted(() => {
    stopDrag();
});
</script>

<template>
    <div
        ref="containerRef"
        data-figma-id="2302:81"
        data-figma-name="Production Overview"
        class="relative isolate m-0 box-border flex h-full min-h-screen [width:320px] shrink-0 flex-col overflow-visible border-0 border-solid transition-transform duration-300"
        :class="{ 'translate-x-[320px]': isCollapsed }"
    >
        <!-- 固定頂部名稱與裝飾標籤 -->
        <HeaderLabel />

        <!-- 主體工作區域 (向下延伸、可自適應高度) -->
        <div
            data-figma-id="2302:82"
            data-figma-name="Detail"
            class="relative isolate m-0 box-border flex [width:320px] flex-1 shrink-0 flex-col overflow-hidden border-0 border-solid [background-color:#4e4e4e]"
        >
            <!-- 上半部：整體統計與產能估算 -->
            <ResultPanel
                :power="props.power"
                :products="props.products"
                :exchange-rate="props.exchangeRate"
                :style-height="topHeight"
            />

            <!-- 分割白線（Handle） -->
            <div
                class="z-30 relative -my-[3px] flex h-[6px] w-full cursor-row-resize items-center justify-center bg-transparent transition-colors select-none hover:bg-white/40 active:bg-white/70"
                @mousedown="startDrag"
                @touchstart.passive="startDrag"
                title="上下拖動調整統計與Tips區域高度"
            >
                <div class="pointer-events-none h-[1px] w-full bg-[#dadada]"></div>
            </div>

            <!-- 下半部：Attention 與 Tips 警告清單 -->
            <AttentionPanel :tips="props.tips" />
        </div>

        <!-- 彈窗箭頭/收合按鈕：依高度百分比等比置中與 RWD -->
        <CollapseButton
            :is-collapsed="isCollapsed"
            :top-percent="arrowTopPercent"
            @toggle="toggleCollapse"
        />
    </div>
</template>
