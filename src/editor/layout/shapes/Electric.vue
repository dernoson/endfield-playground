<!-- src/editor/layout/shapes/Electric.vue -->
<script setup lang="ts">
import { computed, useId } from 'vue';
import {
    CELL_DESIGN,
    DRAG_BODY_OPACITY,
    OUTLINE_FILL_OPACITY,
    SELECTED_COLOR,
} from './deviceShapeConstants';

/**
 * 供電樁（power_pole、xi_rang_power_pole）：2×2、圓形外框、正中央放電力圖示。
 * 輸出是 SVG 的 `<g>`，原點在設備左上角，必須放進 `<svg>` 才看得到。
 * 平常由 DeviceShape.vue 依機器 id 轉交過來，不需要直接使用。
 *
 * 狀態：
 * - 預設：淡黃色底（#EEFD1C 20%）與同色描邊
 * - selected：底色與描邊改為 #1CAEFD，圖示線條也變成 #1CAEFD
 * - dragging：底框與邊線 Opacity 70%（圖示維持原樣）
 */

/**
 * 圖片一律用 import.meta.glob 讀取：檔案不存在時得到空物件，而不是讓編譯失敗。
 * svg 加上 `?url` 是為了不論專案有沒有裝 svg 轉元件的外掛，都拿到網址字串。
 */
const electricFiles = import.meta.glob<string>('@/assets/icon/icon electric.svg', {
    eager: true,
    query: '?url',
    import: 'default',
});
/** 電力圖示網址；檔案不存在時為 undefined（仍會畫圓形外框） */
const ICON_URL = Object.values(electricFiles)[0];

/** 供電樁固定為 2×2 格 */
const CELLS = 2;
/** 正中央圖示的顯示寬高（設計單位，Figma：36 × 33.77） */
const ICON_WIDTH = 36;
const ICON_HEIGHT = 33.77;

/** 未選取時的外框：底色 #EEFD1C，描邊同色 */
const FILL = '#EEFD1C';
const STROKE = 'rgba(238, 253, 28, 1)';

/** 選取時改色的 filter id */
const tintId = useId();

const props = withDefaults(
    defineProps<{
        /** 一格的像素大小；預設與佈局畫布一致 */
        gridSize?: number;
        /** 被單擊選取 */
        selected?: boolean;
        /** 拖曳中 */
        dragging?: boolean;
    }>(),
    { gridSize: 28, selected: false, dragging: false },
);

/** 設備的像素邊長（寬高相同） */
const pixelSize = computed(() => CELLS * props.gridSize);
/** 設計稿邊長（單位：設計單位） */
const designSize = CELLS * CELL_DESIGN;

/** 設計單位 → 像素；X/Y 同一個倍率，圖示才不會被拉扁 */
const shapeTransform = computed(() => `scale(${props.gridSize / CELL_DESIGN})`);

/** 圓形外框路徑：內接於 2×2 方形，路徑偏移 0.5px 讓線條落在像素中間 */
const outline = computed(() => {
    const size = pixelSize.value;
    const r = size / 2 - 0.5;
    const c = size / 2;
    return `M${c - r} ${c}A${r} ${r} 0 1 0 ${c + r} ${c}A${r} ${r} 0 1 0 ${c - r} ${c}Z`;
});

const outlineFill = computed(() => (props.selected ? SELECTED_COLOR : FILL));
const outlineStroke = computed(() => (props.selected ? SELECTED_COLOR : STROKE));
</script>

<template>
    <g data-testid="electric-shape" :data-dragging="props.dragging" :data-selected="props.selected">
        <!-- 圓形底框與邊線：拖曳中套用 Opacity 70% -->
        <g :opacity="props.dragging ? DRAG_BODY_OPACITY : 1">
            <path
                :d="outline"
                :fill="outlineFill"
                :fill-opacity="OUTLINE_FILL_OPACITY"
                :stroke="outlineStroke"
            />
        </g>
        <g :transform="shapeTransform">
            <defs>
                <!-- 先填滿藍色，再只保留原圖有顏色的部分，所以原本的線條形狀不變、顏色變藍 -->
                <filter :id="tintId" color-interpolation-filters="sRGB">
                    <feFlood :flood-color="SELECTED_COLOR" result="tint" />
                    <feComposite in="tint" in2="SourceAlpha" operator="in" />
                </filter>
            </defs>
            <image
                v-if="ICON_URL"
                :href="ICON_URL"
                :x="designSize / 2 - ICON_WIDTH / 2"
                :y="designSize / 2 - ICON_HEIGHT / 2"
                :width="ICON_WIDTH"
                :height="ICON_HEIGHT"
                :filter="props.selected ? `url(#${tintId})` : undefined"
            />
        </g>
    </g>
</template>