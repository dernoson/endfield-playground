<!-- Generated from Figma JSON. Regenerate through the converter instead of moving generated nodes manually. -->
<script setup lang="ts">
interface TipItem {
  id: string
  type: 'error' | 'warning'
  text: string
}

const props = withDefaults(
  defineProps<{
    tips?: TipItem[]
    styleHeight?: number | string
  }>(),
  {
    tips: () => [
      { id: '1', type: 'error', text: '碎紙機單元*1位置重疊' },
      { id: '2', type: 'error', text: '碎紙機單元*1位置重疊' },
      { id: '3', type: 'warning', text: '貓毛貓範圍總sb超載' },
      { id: '4', type: 'warning', text: '貓毛貓範圍總sb超載' },
      { id: '5', type: 'warning', text: '貓毛貓範圍總sb超載' }
    ],
    styleHeight: '498px'
  }
)

const emit = defineEmits<{
  (e: 'start-drag', event: MouseEvent | TouchEvent): void
}>()

const onHandleDown = (e: MouseEvent | TouchEvent) => {
  emit('start-drag', e)
}
</script>

<template>
<div
  data-figma-id="2302:83"
  data-figma-name="Attention"
  class="box-border m-0 border-0 border-solid shrink-0 relative isolate [width:320px] flex flex-col flex-1 overflow-hidden [background-color:#4e4e4e]"
  :style="{ height: typeof styleHeight === 'number' ? `${styleHeight}px` : styleHeight }"
>
  <!-- 可拖曳白線（Handle） -->
  <div
    class="w-full h-[6px] -mt-[3px] bg-transparent hover:bg-white/40 active:bg-white/70 cursor-row-resize z-30 select-none flex items-center justify-center transition-colors"
    @mousedown="onHandleDown"
    @touchstart.passive="onHandleDown"
    title="上下拖動調整統計與Tips區域高度"
  >
    <div class="w-full h-[1px] bg-[#dadada] pointer-events-none"></div>
  </div>

  <div class="p-[18px] pb-2 flex items-center justify-between shrink-0">
    <div data-figma-id="2302:94" data-figma-name="Title" class="box-border m-0 border-0 border-solid shrink-0 [width:38px] [height:23px] [color:#ffffff] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:20px] [font-weight:400] [line-height:23.44px] [text-align:left]">Tips</div>
  </div>

  <!-- 提示與警報列表（可自適應滾動） -->
  <div data-figma-id="2430:347" data-figma-name="tips" class="box-border m-0 border-0 border-solid shrink-0 px-[21px] pb-4 flex flex-col gap-[9px] flex-1 overflow-y-auto overflow-x-hidden">
    <div
      v-for="item in tips"
      :key="item.id"
      class="box-border m-0 border-0 border-solid shrink-0 relative isolate [width:278px] [min-height:35px] [height:35px] flex items-center rounded overflow-hidden"
      :class="item.type === 'error' ? '[background-color:rgba(255,_110,_110,_0.1)]' : '[background-color:rgba(247,_217,_69,_0.1)]'"
    >
      <div class="box-border m-0 border-0 shrink-0 ml-[7px] w-[24px] h-[23px] flex items-center justify-center">
        <img
          class="block w-full h-full object-contain"
          :src="item.type === 'error' ? '/output/assets/Iconerror.svg' : '/output/assets/iconwarning.svg'"
          alt=""
        />
      </div>
      <div
        class="box-border m-0 border-0 shrink-0 ml-[11px] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:18px] [font-weight:400] [line-height:21.096px] truncate"
        :class="item.type === 'error' ? '[color:#ff6e6e]' : '[color:#f7d945]'"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</div>
</template>
