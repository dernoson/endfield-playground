<!-- Generated from Figma JSON. Regenerate through the converter instead of moving generated nodes manually. -->
<script setup lang="ts">
import { ref } from 'vue'

interface ProductDetail {
  id: string
  name: string
  produce: number
  consume: number
  profit: number
  isExpanded?: boolean
}

interface PowerData {
  used: number
  total: number
  percent: number
}

const props = withDefaults(
  defineProps<{
    power?: PowerData
    products?: ProductDetail[]
    exchangeRate?: number
    styleHeight?: number | string
  }>(),
  {
    power: () => ({
      used: 120,
      total: 180,
      percent: (120 / 180) * 100
    }),
    products: () => [
      {
        id: '1',
        name: '紫晶纖維',
        produce: 406,
        consume: 0,
        profit: 406,
        isExpanded: true
      },
      {
        id: '2',
        name: '紫晶纖維',
        produce: 0,
        consume: 799,
        profit: -799,
        isExpanded: true
      }
    ],
    exchangeRate: 799325,
    styleHeight: '582px'
  }
)

const localProducts = ref([...props.products])

const toggleExpand = (index: number) => {
  if (localProducts.value[index]) {
    localProducts.value[index].isExpanded = !localProducts.value[index].isExpanded
  }
}
</script>

<template>
<div
  data-figma-id="2302:100"
  data-figma-name="Result"
  class="box-border m-0 border-0 border-solid shrink-0 relative isolate [width:320px] overflow-hidden flex flex-col [background-color:#4e4e4e]"
  :style="{ height: typeof styleHeight === 'number' ? `${styleHeight}px` : styleHeight }"
>
  <div data-figma-id="2302:102" data-figma-name="Detail" class="box-border m-0 border-0 border-solid shrink-0 relative isolate [margin-left:18px] [margin-top:100px] [width:281px] flex flex-col flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-4">
    <!-- 整體統計標題 -->
    <div data-figma-id="2302:103" data-figma-name="Title" class="box-border m-0 border-0 border-solid shrink-0 [width:80px] [height:23px] [color:#ffffff] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:20px] [font-weight:400] [line-height:23.44px] [letter-spacing:0px] [text-align:left] mb-4">整體統計</div>

    <!-- 耗電量進度條 -->
    <div data-figma-id="2974:124" data-figma-name="power consumption" class="box-border m-0 border-0 border-solid shrink-0 relative isolate [width:281px] [height:63px] mb-6">
      <div data-figma-id="2302:107" data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:0px] [top:0px] [width:133px] [height:21px] [color:#cfcfcf] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:18px] [font-weight:300] [line-height:21.096px] [text-align:left]">總耗電量/供電量</div>
      <div data-figma-id="2302:104" data-figma-name="Bar" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:0px] [top:28px] [width:281px] [height:10px] [border-radius:25px] [background-color:#3c3c3c] overflow-hidden">
        <div
          data-figma-id="2302:106"
          data-figma-name="Bar"
          class="h-full [border-radius:25px] [background-color:#eefd1c] transition-all duration-300"
          :style="{ width: `${Math.min(100, Math.max(0, power.percent))}%` }"
        ></div>
      </div>
      <div data-figma-id="2302:132" data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:0px] [top:44px] [width:105px] [height:19px] [color:#a4a4a4] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:16px] [font-weight:300] [line-height:18.752px] [text-align:left]">{{ power.used }}kW/{{ power.total }}kW</div>
    </div>

    <!-- 產能估算標題 -->
    <div data-figma-id="2302:131" data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 [width:80px] [height:23px] [color:#ffffff] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:20px] [font-weight:400] [line-height:23.44px] [text-align:left] mb-4">產能估算</div>

    <!-- 產能產品列表 -->
    <div data-figma-id="2430:348" data-figma-name="imformation" class="box-border m-0 border-0 border-solid shrink-0 relative isolate [width:224px] flex flex-col gap-3 mb-6">
      <div
        v-for="(item, index) in localProducts"
        :key="item.id"
        class="box-border m-0 border-0 border-solid shrink-0 relative isolate [width:224px] transition-all"
        :class="item.isExpanded ? '[height:66px]' : '[height:24px]'"
      >
        <!-- 展開按鈕 -->
        <div
          data-figma-name="botton"
          class="box-border m-0 border-0 border-solid shrink-0 absolute isolate [left:0px] [top:7px] [width:13px] [height:8px] cursor-pointer select-none transition-transform"
          :class="{ 'rotate-180': !item.isExpanded }"
          @click="toggleExpand(index)"
        >
          <img class="block w-full h-full object-fill pointer-events-none" src="/output/assets/botton.svg" alt="" />
        </div>

        <!-- 產品名稱 -->
        <div data-figma-name="product" class="box-border m-0 border-0 border-solid shrink-0 absolute isolate [left:18px] [top:0px] [width:72px] [height:21px] [color:#cfcfcf] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:18px] [font-weight:400] [line-height:21.096px] [text-align:left] cursor-pointer" @click="toggleExpand(index)">{{ item.name }}</div>

        <!-- 收益 -->
        <div
          data-figma-name="Text"
          class="box-border m-0 border-0 border-solid shrink-0 absolute isolate [left:156px] [top:2px] [height:19px] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:16px] [font-weight:300] [line-height:18.752px] [text-align:left]"
          :class="item.profit >= 0 ? '[color:#a3fd1c]' : '[color:#ff6e6e]'"
        >
          {{ item.profit >= 0 ? `收益+${item.profit}` : `收益${item.profit}` }}
        </div>

        <!-- 展開時顯示詳細生產與消耗 -->
        <template v-if="item.isExpanded">
          <!-- 生產 -->
          <div data-figma-name="produce" class="box-border m-0 border-0 border-solid shrink-0 absolute isolate [left:18px] [top:26px] [width:125px] [height:19px]">
            <div data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:0px] [top:0px] [width:32px] [height:19px] [color:#f5f5f5] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:16px] [font-weight:300] [line-height:18.752px] [text-align:left]">生產</div>
            <div data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:66px] [top:0px] [width:59px] [height:19px] [color:#f5f5f5] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:16px] [font-weight:300] [line-height:18.752px] [text-align:right]">{{ item.produce }}/min</div>
          </div>

          <!-- 消耗 -->
          <div data-figma-name="consume" class="box-border m-0 border-0 border-solid shrink-0 absolute isolate [left:18px] [top:47px] [width:125px] [height:19px]">
            <div data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:0px] [top:0px] [width:32px] [height:19px] [color:#f5f5f5] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:16px] [font-weight:300] [line-height:18.752px] [text-align:left]">消耗</div>
            <div data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:66px] [top:0px] [width:59px] [height:19px] [color:#f5f5f5] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:16px] [font-weight:300] [line-height:18.752px] [text-align:right]">{{ item.consume }}/min</div>
          </div>
        </template>
      </div>
    </div>

    <!-- 兌換效率 -->
    <div data-figma-id="2974:108" data-figma-name="Exchange" class="box-border m-0 border-0 border-solid shrink-0 relative isolate [width:146px] [height:50px] mt-auto">
      <div data-figma-id="2302:110" data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:0px] [top:0px] [width:140px] [height:23px] [color:#ffffff] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:20px] [font-weight:400] [line-height:23.44px] [text-align:left]">調度券兌換效率</div>
      <div data-figma-id="2302:108" data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:48px] [top:29px] [width:10px] [height:21px] [color:#cfcfcf] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:18px] [font-weight:300] [line-height:21.096px] [text-align:left]">≈ </div>
      <div data-figma-id="2302:109" data-figma-name="Text" class="box-border m-0 border-0 border-solid shrink-0 absolute [left:63px] [top:29px] [width:83px] [height:21px] [color:#cfcfcf] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:18px] [font-weight:300] [line-height:21.096px] [text-align:right]">{{ exchangeRate }}/hr</div>
    </div>
  </div>
</div>
</template>
