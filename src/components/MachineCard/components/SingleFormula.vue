<script setup lang="ts">
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
            {{ singleformula.duration }}s
        </div>

        <div class="formula-row">
            <template
                v-for="(item, index) in singleformula.input"
                :key="`in-${index}`"
            >
                <span v-if="index > 0" class="operator">+</span>

                <div class="item">
                    <span class="item-name">{{ item.name }}</span>

                    <div class="item-icon">
                        <img v-if="item.image" :src="item.image">
                    </div>

                    <div class="item-amount">
                        {{ item.amount }}
                    </div>
                </div>
            </template>

            <span class="operator arrow">→</span>

            <template
                v-for="(item, index) in singleformula.output"
                :key="`out-${index}`"
            >
                <span v-if="index > 0" class="operator">+</span>

                <div class="item">
                    <span class="item-name">{{ item.name }}</span>

                    <div class="item-icon">
                        <img v-if="item.image" :src="item.image">
                    </div>

                    <div class="item-amount">
                        {{ item.amount }}
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.single-formula {
  position: relative;
  margin: 10px 7px 0 7px;
  padding: 10px 14px;
  background: rgba(43, 43, 43, 0.2);
  border-radius: 4px;
  box-sizing: border-box;
}

.duration {
  font-size: 14px;
  color: #CFCFCF;
  margin-bottom: 6px;
}

.formula-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  color: #CFCFCF;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 45px;
}

.item-name {
  font-size: 12px;
  color: #CFCFCF;
  white-space: nowrap;
}

.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid #EEFD1C;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.item-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-amount {
  font-size: 12px;
  color: #FFFFFF;
  font-weight: 500;
}

.operator {
  font-size: 16px;
  color: #CFCFCF;
  user-select: none;
  padding: 0 2px;
}

.operator.arrow {
  font-size: 18px;
  color: #EEFD1C;
}
</style>