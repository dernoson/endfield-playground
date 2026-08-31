<script setup lang="ts">
import defaultItemImage from './item.png';

interface formula_item
{
    name:   string;
    image:  string;
    amount: number;
}
type item = any;
interface formula
{
    duration: number;
    input:    item[];
    output:   item[];
}

defineProps<{
    singleformula: formula
}>();
</script>

<template>
    <div class="single-formula">
        <div class="duration">
            週期 {{ singleformula.duration }}s
        </div>

        <div class="formula-row">
            <template
                v-for="(item, index) in singleformula.input"
                :key="`in-${index}`"
            >
                <span v-if="index > 0" class="operator plus">+</span>

                <div class="item">
                    <div class="plate">
                        <img :src="item.image || defaultItemImage" class="item-image" alt="item">

                        <div v-if="item.amount !== undefined" class="num">
                            <span class="num-text">{{ item.amount }}</span>
                        </div>
                    </div>

                    <span v-if="item.name" class="item-name">{{ item.name }}</span>
                </div>
            </template>

            <span class="operator arrow">→</span>

            <template
                v-for="(item, index) in singleformula.output"
                :key="`out-${index}`"
            >
                <span v-if="index > 0" class="operator plus">+</span>

                <div class="item">
                    <div class="plate">
                        <img :src="item.image || defaultItemImage" class="item-image" alt="item">

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
  color: #CFCFCF;
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
  color: #CFCFCF;
  scrollbar-width: thin;
  scrollbar-color: #666 transparent;
}

.formula-row::-webkit-scrollbar {
  height: 4px;
}
.formula-row::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 2px;
}
.formula-row::-webkit-scrollbar-track {
  background: transparent;
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
  color: #CFCFCF;
  white-space: nowrap;
}

/* plate */
.plate {
  box-sizing: border-box;
  position: relative;
  width: 55.1px;
  height: 55.1px;
  background: #2B2B2B;
  border: 3px solid #EEFD1C;
  border-radius: 50%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 4px rgba(0, 0, 0, 0.25);
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
  background: #EEFD1C;
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
  color: #2B2B2B;
}

.operator.plus {
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #CFCFCF;
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
  color: #CFCFCF;
}
</style>