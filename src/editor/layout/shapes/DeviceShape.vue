<script setup lang="ts">
import { computed, useId } from 'vue';
import planterPatternUrl from '@/assets/icon/planter-pattern.png';

const planterClipId = useId();
const markerXs = [2.977, 215.08];
const markerYs = [17.17, 61.97, 106.77, 151.57, 196.37];

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
            fill="white"
            fill-opacity="0.2"
            stroke="white"
        />
        <g v-for="x in markerXs" :key="x">
            <path
                v-for="y in markerYs"
                :key="y"
                :transform="`translate(${x} ${y})`"
                d="M4.60201 5.84476L0.00194907 1.2447L1.246 3.8147e-06L7.09141 5.84476L1.2447 11.6934L0 10.4481L4.60201 5.84476Z"
                fill="white"
            />
        </g>
        <path
            v-if="props.dragging"
            :d="outline"
            fill="rgba(28, 174, 253, 0.3)"
            stroke="rgba(28, 174, 253, 1)"
        />
        <template v-if="props.label === '種植機'">
            <defs>
                <clipPath :id="planterClipId">
                    <circle cx="110.81" cy="102.5" r="27.5" />
                </clipPath>
            </defs>
            <foreignObject x="83.31" y="75" width="55" height="55">
                <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    style="
                        width: 55px;
                        height: 55px;
                        border-radius: 50%;
                        background: rgba(43, 43, 43, 1);
                    "
                />
            </foreignObject>
            <image
                :href="planterPatternUrl"
                x="83.31"
                y="75"
                width="55"
                height="55"
                :clip-path="`url(#${planterClipId})`"
            />
            <circle
                cx="110.81"
                cy="102.5"
                r="27.5"
                fill="none"
                stroke="rgba(0, 0, 0, 0.5)"
                stroke-width="3"
                transform="translate(0 4)"
                style="filter: blur(4px)"
            />
            <circle
                cx="110.81"
                cy="102.5"
                r="27.5"
                fill="none"
                stroke="rgba(238, 253, 28, 1)"
                stroke-width="3"
            />
        </template>
        <foreignObject
            v-if="props.label === '種植機'"
            x="83.31"
            y="132.47"
            width="55"
            height="18.25"
        >
            <div
                xmlns="http://www.w3.org/1999/xhtml"
                style="
                    width: 55px;
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
