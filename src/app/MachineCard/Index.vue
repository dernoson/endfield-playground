<script lang="ts">
import { ref } from 'vue';
export * from './types';

const DEFAULT_CARD_HEIGHT = 686;
const MIN_CARD_HEIGHT = 260;
const MAX_CARD_HEIGHT = 1200;

/**
 * 切換設備或收合重開時是否保留使用者拉伸後的面板高度。
 * - `true`：保留上次拉伸的高度（預設）
 * - `false`：每次切換設備或重新開啟皆重置為 `DEFAULT_CARD_HEIGHT`
 */
const PERSIST_RESIZED_HEIGHT = true;

/** 跨卸載／切換設備保存的拉伸高度（模組層級，僅於 `PERSIST_RESIZED_HEIGHT === true` 使用） */
const persistedCardHeight = ref(DEFAULT_CARD_HEIGHT);
</script>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue';
import Title from './Title.vue';
import Machine from './Machine.vue';
import FormulaList from './FormulaList.vue';
import Info from './Info.vue';
import Button from './Button.vue';
import type { MachineCardProps } from './types';

/** 元件傳入之機器卡片屬性 */
const props = defineProps<MachineCardProps>();

/** 元件對外觸發之事件定義 */
const emit = defineEmits<{
    /**
     * 當使用者點擊卡片時對外觸發，通知上層選取該機器。
     * @param event 事件名稱 'pick'
     * @param machineId 被選取的機器唯一識別碼
     */
    (event: 'pick', machineId: string): void;
    /**
     * 點擊右緣黃色三角形時對外觸發，通知上層收起卡片。
     * @param event 事件名稱 'collapse'
     */
    (event: 'collapse'): void;
}>();

const cardHeight = PERSIST_RESIZED_HEIGHT ? persistedCardHeight : ref(DEFAULT_CARD_HEIGHT);

if (!PERSIST_RESIZED_HEIGHT) {
    watch(
        () => props.id,
        () => {
            cardHeight.value = DEFAULT_CARD_HEIGHT;
        },
    );
}

let isResizing = false;
let resizeStartY = 0;
let resizeStartHeight = DEFAULT_CARD_HEIGHT;
let suppressNextClick = false;
let clearSuppressTimer: ReturnType<typeof setTimeout> | null = null;

/** 開始拖曳調整卡片高度；阻止預設與冒泡以避開外層 useDragScroll */
function onResizeMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    isResizing = true;
    suppressNextClick = false;
    if (clearSuppressTimer !== null) {
        clearTimeout(clearSuppressTimer);
        clearSuppressTimer = null;
    }
    resizeStartY = event.clientY;
    resizeStartHeight = cardHeight.value;

    window.addEventListener('mousemove', onResizeMouseMove);
    window.addEventListener('mouseup', onResizeMouseUp);
}

/** 拖曳過程即時限制並更新卡片高度 */
function onResizeMouseMove(event: MouseEvent): void {
    if (!isResizing) return;
    const dy = event.clientY - resizeStartY;
    if (Math.abs(dy) > 2) {
        suppressNextClick = true;
    }
    cardHeight.value = Math.round(
        Math.min(MAX_CARD_HEIGHT, Math.max(MIN_CARD_HEIGHT, resizeStartHeight + dy)),
    );
}

/** 結束拖曳調整並於事件輪結束後歸零防誤觸旗標（避免卡片外放開滑鼠殘留） */
function onResizeMouseUp(): void {
    if (!isResizing) return;
    isResizing = false;
    window.removeEventListener('mousemove', onResizeMouseMove);
    window.removeEventListener('mouseup', onResizeMouseUp);
    if (suppressNextClick) {
        clearSuppressTimer = setTimeout(() => {
            suppressNextClick = false;
            clearSuppressTimer = null;
        }, 0);
    }
}

/** 拖曳拉伸結束後放開滑鼠若落在卡片內，阻斷誤觸選取事件 */
function onClickCapture(event: MouseEvent): void {
    if (!suppressNextClick) return;
    suppressNextClick = false;
    if (clearSuppressTimer !== null) {
        clearTimeout(clearSuppressTimer);
        clearSuppressTimer = null;
    }
    event.stopPropagation();
}

onUnmounted(() => {
    window.removeEventListener('mousemove', onResizeMouseMove);
    window.removeEventListener('mouseup', onResizeMouseUp);
    if (clearSuppressTimer !== null) {
        clearTimeout(clearSuppressTimer);
    }
});

/**
 * 處理卡片點擊互動，向外部發送選取事件與機器 ID。
 *
 * @example
 * // 於模板中綁定點擊事件
 * onClick()
 */
function onClick(): void {
    emit('pick', props.id);
}
</script>

<template>
    <div
        class="machine-card"
        :style="{ height: `${cardHeight}px` }"
        @click.capture="onClickCapture"
        @click="onClick"
    >
        <!-- 1. 卡片底板 -->
        <div class="plate"></div>

        <!-- 2. 卡片核心主要內容 (Info + FormulaList) -->
        <div class="frame-body">
            <Info
                :selected-machine="name"
                :sizeText="sizeText"
                :power="power"
                :selected-recipe="selectedRecipe"
            />
            <FormulaList :formulas="formulas" />
        </div>

        <!-- 3. 貼附於 Frame 的漂浮元素 -->
        <Title />
        <Machine :src="iconUrl" />
        <!-- 根節點是 div：click 經屬性穿透掛上；.stop 避免同時觸發卡片的 pick -->
        <Button role="button" aria-label="收起物件資訊面板" @click.stop="emit('collapse')" />

        <!-- 4. 底緣拉伸把手 -->
        <div
            class="resize-handle"
            role="separator"
            aria-orientation="horizontal"
            aria-label="上下拖曳調整面板高度"
            @mousedown="onResizeMouseDown"
            @click.stop
        />
    </div>
</template>

<style scoped>
.machine-card {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    position: relative;
    width: 451px;
    height: 686px;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
}

/* 底板 */
.plate {
    box-sizing: border-box;

    position: absolute;
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;

    background: #4e4e4e;
    border-left: 3px solid #eefd1c;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 0px 40px 0px 0px;
}

/* 卡片主體內容區 (設定明確寬高與右邊界，避免 absolute 容器寬度塌陷為 0) */
.frame-body {
    position: absolute;
    left: 9px;
    right: 6px;
    top: 52px;
    bottom: 0px;
}

/* 底緣拉伸熱區 */
.resize-handle {
    position: absolute;
    left: 3px;
    right: 0;
    bottom: 0;
    height: 10px;
    cursor: ns-resize;
    z-index: 2;
}
</style>
