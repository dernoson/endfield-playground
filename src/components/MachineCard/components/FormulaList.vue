<script setup lang="ts">
import SingleFormula from './SingleFormula.vue';
import type { Formula } from '../types';
import defaultItemImage from './item.png';

const props = defineProps<{
    title?: string;
    duration?: number | string;
    formulas?: Formula[];
}>();

const sampleFormula: Formula = {
    duration: 15,
    input: [
        { name: '粗製紫晶', image: defaultItemImage, amount: 2 },
        { name: '纖維原料', image: defaultItemImage, amount: 1 },
    ],
    output: [
        { name: '紫晶纖維', image: defaultItemImage, amount: 1 },
        { name: '結構基板', image: defaultItemImage, amount: 2 },
        { name: '活性催化劑', image: defaultItemImage, amount: 1 },
    ],
};

const defaultFormulas: Formula[] = [
    sampleFormula,
    sampleFormula,
    sampleFormula,
    sampleFormula,
    sampleFormula,
    sampleFormula,
];
</script>

<template>
    <div class="formula-list">
        <!-- Text 標題 -->
        <div class="title-text">
            {{ title || '可用配方一覽' }}
        </div>

        <!-- 配方內容容器 -->
        <div class="list-container">
            <slot>
                <!-- 預設 formula 項目 -->
                <SingleFormula
                    v-for="(formula, index) in props.formulas || defaultFormulas"
                    :key="index"
                    :singleformula="formula"
                />
            </slot>
        </div>
    </div>
</template>

<style scoped>
/* frame / formula-list 容器 (含頂部細線) */
.formula-list {
    box-sizing: border-box;

    position: absolute;
    left: 0px;
    right: 0px;
    width: 100%;
    top: 140px;
    bottom: 14px;

    border-top: 1px solid #dadada;
}

/* Text */
.title-text {
    position: absolute;
    padding-left: 13px;
    padding-top: 16px;

    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;

    color: #ffffff;
    white-space: nowrap;
}

/* 配方內容容器 */
.list-container {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;

    /* 超出高度自動滾動，橫向嚴格裁切 */
    overflow-y: auto;
    overflow-x: hidden;

    /* 隱藏滾動條 */
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.list-container::-webkit-scrollbar {
    display: none;
}
</style>
