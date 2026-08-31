<script lang="ts">
export * from './types';
</script>

<script setup lang="ts">
import Title from './components/Title.vue';
import Machine from './components/Machine.vue';
import FormulaList from './components/FormulaList.vue';
import Info from './components/Info.vue';
import Button from './components/Button.vue';
import type { MachineCardProps } from './types';

const props = defineProps<MachineCardProps>();

const emit = defineEmits<{
    (event: 'pick', machineId: string): void;
}>();

function onClick(): void {
    emit('pick', props.id);
}
</script>

<template>
    <div class="machine-card" @click="onClick">
        <!-- 1. 卡片底板 -->
        <div class="plate"></div>

        <!-- 2. 卡片核心主要內容 (Info + FormulaList) -->
        <div class="frame-body">
            <Info
                :selected-machine="name"
                :size="sizeText"
                :power="power"
                :selected-recipe="selectedRecipe"
            />
            <FormulaList :formulas="formulas" />
        </div>

        <!-- 3. 貼附於 Frame 的漂浮元素 -->
        <Title />
        <Machine :src="iconUrl" />
        <Button />
    </div>
</template>

<style scoped>
.machine-card {
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
</style>
