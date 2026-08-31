<script setup lang="ts">
import defaultItemImage from './item.png';

export interface FormulaItem {
    /** 材料或產物名稱（顯示於圓形底板正下方） */
    name: string;
    /** 圖示路徑或已 import 之圖片（選填，未提供時自動採用預設 item.png） */
    image?: string;
    /** 數量（選填，顯示於右下角黃色圓圈標籤） */
    amount?: number;
}

/** 單筆可用配方 */
export interface Formula {
    /** 配方週期秒數（顯示於配方區塊上方「週期 Xs」） */
    duration: number;
    /** 輸入材料清單 */
    input: FormulaItem[];
    /** 輸出產物清單 */
    output: FormulaItem[];
}

/** MachineCard 對外 Props 介面 */

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

                <div class="item">
                    <div class="plate">
                        <img :src="item.image || defaultItemImage" class="item-image" alt="item" />

                        <div v-if="item.amount !== undefined" class="num">
                            <span class="num-text">{{ item.amount }}</span>
                        </div>
                    </div>

                    <span v-if="item.name" class="item-name">{{ item.name }}</span>
                </div>
            </template>

            <span class="operator arrow">→</span>

            <template v-for="(item, index) in singleformula.output" :key="`out-${index}`">
                <span v-if="index > 0" class="operator plus">+</span>

                <div class="item">
                    <div class="plate">
                        <img :src="item.image || defaultItemImage" class="item-image" alt="item" />

                        <div v-if="item.amount !== undefined" class="num">
                            <span class="num-text">{{ item.amount }}</span>
                        </div>
                    </div>

                    <span v-if="item.name" class="item-name">{{ item.name }}</span>
                </div>
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

/* item */
.item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    width: 71.63px;
    flex-shrink: 0;
    box-sizing: border-box;
}

/* item-name */
.item-name {
    width: 71.63px;
    min-height: 18.37px;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #cfcfcf;
    white-space: nowrap;
}

/* plate */
.plate {
    box-sizing: border-box;
    position: relative;
    width: 55.1px;
    height: 55.1px;
    background: #2b2b2b;
    border: 3px solid #eefd1c;
    border-radius: 50%;
    box-shadow:
        0px 4px 4px rgba(0, 0, 0, 0.25),
        inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* image */
.item-image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 55.1px;
    height: 55.1px;
    display: block;
    z-index: 1;
}

/* num (數量標籤) */
.num {
    position: absolute;
    right: -5px;
    bottom: -2px;
    width: 19px;
    height: 20px;
    background: #eefd1c;
    border-radius: 50%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.num-text {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: #2b2b2b;
}

.operator.plus {
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #cfcfcf;
    user-select: none;
    flex: none;
    flex-grow: 0;
    flex-shrink: 0;
}

.operator.arrow {
    margin-left: 10px;
    margin-right: 10px;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #cfcfcf;
}
</style>
