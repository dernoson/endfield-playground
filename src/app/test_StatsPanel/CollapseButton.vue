<!-- Generated from Figma JSON. Regenerate through the converter instead of moving generated nodes manually. -->
<script setup lang="ts">
import collapseButtonUrl from '@/assets/icon/collapse button.svg';

const props = withDefaults(
    defineProps<{
        isCollapsed?: boolean;
        topPercent?: number;
    }>(),
    {
        isCollapsed: false,
        topPercent: (559 / 1080) * 100, // 約 51.759%
    },
);

const emit = defineEmits<{
    (e: 'toggle'): void;
}>();
</script>

<template>
    <div
        data-figma-id="2302:187"
        data-figma-name="collapse button"
        class="absolute [left:-36px] isolate [z-index:30] m-0 box-border [height:39px] [width:24px] shrink-0 cursor-pointer overflow-visible border-0 border-solid [box-shadow:0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] transition-transform select-none hover:brightness-110 active:scale-95"
        :style="{
            top: `${topPercent}%`,
            transform: `translateY(-50%) ${isCollapsed ? 'rotate(180deg)' : ''}`,
        }"
        :title="isCollapsed ? '展開面板' : '收合面板'"
        @click="emit('toggle')"
    >
        <img
            class="pointer-events-none block h-full w-full object-fill"
            :src="collapseButtonUrl"
            alt=""
        />
    </div>
</template>
