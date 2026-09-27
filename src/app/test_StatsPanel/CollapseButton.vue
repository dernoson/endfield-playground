<!-- Generated from Figma JSON. Regenerate through the converter instead of moving generated nodes manually. -->
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isCollapsed?: boolean
    topPercent?: number
  }>(),
  {
    isCollapsed: false,
    topPercent: (559 / 1080) * 100 // 約 51.759%
  }
)

const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<template>
<div
  data-figma-id="2302:187"
  data-figma-name="collapse button"
  class="box-border m-0 border-0 border-solid shrink-0 absolute isolate [z-index:30] [left:-36px] [width:24px] [height:39px] overflow-visible [box-shadow:0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] cursor-pointer select-none transition-transform hover:brightness-110 active:scale-95"
  :style="{ top: `${topPercent}%`, transform: `translateY(-50%) ${isCollapsed ? 'rotate(180deg)' : ''}` }"
  :title="isCollapsed ? '展開面板' : '收合面板'"
  @click="emit('toggle')"
>
  <img class="block w-full h-full object-fill pointer-events-none" src="/output/assets/collapse button.svg" alt="" />
</div>
</template>
