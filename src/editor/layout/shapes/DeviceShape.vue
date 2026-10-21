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
        <foreignObject
            v-if="props.label === '種植機'"
            x="77.23"
            y="132.23"
            width="71.16"
            height="18.25"
        >
            <div
                xmlns="http://www.w3.org/1999/xhtml"
                style="
                    width: 71.16px;
                    height: 18.25px;
                    color: rgba(207, 207, 207, 1);
                    font-family: 'HarmonyOS Sans TC', sans-serif;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 19px;
                    letter-spacing: 0;
                    text-align: center;
                    white-space: nowrap;
                "
            >
                {{ props.label }}
            </div>
        </foreignObject>
        <text
            v-else-if="props.label"
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
