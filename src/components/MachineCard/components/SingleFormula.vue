<script setup lang="ts">
import Item from './Item.vue';
import type { Formula } from '../types';

defineProps<{
    singleformula: Formula;
}>();
</script>

<template>
    <div class="single-formula">
        <div class="duration">週期 {{ singleformula.duration }}s</div>

        <div class="formula-row">
            <template v-for="(item, index) in singleformula.input" :key="`in-${index}`">
                <span v-if="index > 0" class="operator plus">+</span>
                <Item :item="item" />
            </template>

            <span class="operator arrow">→</span>

            <template v-for="(item, index) in singleformula.output" :key="`out-${index}`">
                <span v-if="index > 0" class="operator plus">+</span>
                <Item :item="item" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.single-formula {
    position: relative;
    margin: 10px 7px 0 7px;
    box-sizing: border-box;
    overflow: hidden;
}

.duration {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    color: #cfcfcf;
    margin-bottom: 6px;
    padding-left: 2px;
}

.formula-row {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 14px 8px 14px;
    gap: 3px;
    background: rgba(43, 43, 43, 0.2);
    border-radius: 4px;
    overflow-x: auto;
    overflow-y: hidden;
    color: #cfcfcf;

    /* 隱藏滾動條 */
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.formula-row::-webkit-scrollbar {
    display: none;
}

.operator {
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #cfcfcf;
    user-select: none;
    flex-shrink: 0;
}

.operator.plus {
    width: 10px;
    height: 19px;
}

.operator.arrow {
    width: 35px;
    height: 19px;
}
</style>
