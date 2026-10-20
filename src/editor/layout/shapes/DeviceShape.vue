<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        /** 設備寬度（像素） */
        width: number;
        /** 設備高度（像素） */
        height: number;
        /** 可選的設備名稱 */
        label?: string;
        /** 拖曳中以淺藍色標示 */
        dragging?: boolean;
    }>(),
    { dragging: false },
);

const outline = computed(
    () =>
        `M0.5 0.5H${props.width - 0.5}V${props.height - 0.5}H0.5V0.5Z`,
);
</script>

<template>
    <g data-testid="device-shape" :data-dragging="props.dragging">
        <path
            :d="outline"
            :fill="props.dragging ? '#7dd3fc' : 'white'"
            fill-opacity="0.2"
            stroke="white"
        />
        <text
            v-if="props.label"
            :x="props.width / 2"
            :y="props.height / 2"
            fill="white"
            font-size="14"
            text-anchor="middle"
            dominant-baseline="middle"
        >
            {{ props.label }}
        </text>
    </g>
</template>
