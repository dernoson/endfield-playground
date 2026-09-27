<!-- Generated from Figma JSON. Regenerate through the converter instead of moving generated nodes manually. -->
<script setup lang="ts">
interface TipItem {
    id: string;
    type: 'error' | 'warning';
    text: string;
}

const props = withDefaults(
    defineProps<{
        tips?: TipItem[];
        styleHeight?: number | string;
    }>(),
    {
        tips: () => [
            { id: '1', type: 'error', text: '碎紙機單元*1位置重疊' },
            { id: '2', type: 'error', text: '碎紙機單元*1位置重疊' },
            { id: '3', type: 'warning', text: '貓毛貓範圍總sb超載' },
            { id: '4', type: 'warning', text: '貓毛貓範圍總sb超載' },
            { id: '5', type: 'warning', text: '貓毛貓範圍總sb超載' },
        ],
        styleHeight: '498px',
    },
);

const emit = defineEmits<{
    (e: 'start-drag', event: MouseEvent | TouchEvent): void;
}>();

const onHandleDown = (e: MouseEvent | TouchEvent) => {
    emit('start-drag', e);
};
</script>

<template>
    <div
        data-figma-id="2302:83"
        data-figma-name="Attention"
        class="relative isolate m-0 box-border flex [width:320px] flex-1 shrink-0 flex-col overflow-hidden border-0 border-solid [background-color:#4e4e4e]"
        :style="{ height: typeof styleHeight === 'number' ? `${styleHeight}px` : styleHeight }"
    >
        <!-- 可拖曳白線（Handle） -->
        <div
            class="z-30 -mt-[3px] flex h-[6px] w-full cursor-row-resize items-center justify-center bg-transparent transition-colors select-none hover:bg-white/40 active:bg-white/70"
            @mousedown="onHandleDown"
            @touchstart.passive="onHandleDown"
            title="上下拖動調整統計與Tips區域高度"
        >
            <div class="pointer-events-none h-[1px] w-full bg-[#dadada]"></div>
        </div>

        <div class="flex shrink-0 items-center justify-between p-[18px] pb-2">
            <div
                data-figma-id="2302:94"
                data-figma-name="Title"
                class="m-0 box-border [height:23px] [width:38px] shrink-0 border-0 border-solid [text-align:left] [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:20px] [line-height:23.44px] [font-weight:400] [color:#ffffff]"
            >
                Tips
            </div>
        </div>

        <!-- 提示與警報列表（可自適應滾動） -->
        <div
            data-figma-id="2430:347"
            data-figma-name="tips"
            class="m-0 box-border flex flex-1 shrink-0 flex-col gap-[9px] overflow-x-hidden overflow-y-auto border-0 border-solid px-[21px] pb-4"
        >
            <div
                v-for="item in tips"
                :key="item.id"
                class="relative isolate m-0 box-border flex [height:35px] [min-height:35px] [width:278px] shrink-0 items-center overflow-hidden rounded border-0 border-solid"
                :class="
                    item.type === 'error'
                        ? '[background-color:rgba(255,_110,_110,_0.1)]'
                        : '[background-color:rgba(247,_217,_69,_0.1)]'
                "
            >
                <div
                    class="m-0 ml-[7px] box-border flex h-[23px] w-[24px] shrink-0 items-center justify-center border-0"
                >
                    <img
                        class="block h-full w-full object-contain"
                        :src="
                            item.type === 'error'
                                ? '/output/assets/Iconerror.svg'
                                : '/output/assets/iconwarning.svg'
                        "
                        alt=""
                    />
                </div>
                <div
                    class="m-0 ml-[11px] box-border shrink-0 truncate border-0 [font-family:'HarmonyOS_Sans_TC',sans-serif] [font-size:18px] [line-height:21.096px] [font-weight:400]"
                    :class="item.type === 'error' ? '[color:#ff6e6e]' : '[color:#f7d945]'"
                >
                    {{ item.text }}
                </div>
            </div>
        </div>
    </div>
</template>
