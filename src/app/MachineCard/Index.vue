<script lang="ts">
export * from './types';
</script>

<script setup lang="ts">
import Title from './Title.vue';
import Machine from './Machine.vue';
import FormulaList from './FormulaList.vue';
import Info from './Info.vue';
import Button from './Button.vue';
import type { MachineCardProps } from './types';

/** 元件傳入之機器卡片屬性 */
const props = defineProps<MachineCardProps>();

/** 元件對外觸發之事件定義 */
const emit = defineEmits<{
    /**
     * 當使用者點擊卡片時對外觸發，通知上層選取該機器。
     * @param event 事件名稱 'pick'
     * @param machineId 被選取的機器唯一識別碼
     */
    (event: 'pick', machineId: string): void;
    /**
     * 點擊右緣黃色三角形時對外觸發，通知上層收起卡片。
     * @param event 事件名稱 'collapse'
     */
    (event: 'collapse'): void;
}>();

/**
 * 處理卡片點擊互動，向外部發送選取事件與機器 ID。
 *
 * @example
 * // 於模板中綁定點擊事件
 * onClick()
 */
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
                :sizeText="sizeText"
                :power="power"
                :selected-recipe="selectedRecipe"
            />
            <FormulaList :formulas="formulas" />
        </div>

        <!-- 3. 貼附於 Frame 的漂浮元素 -->
        <Title />
        <Machine :src="iconUrl" />
        <!-- 根節點是 div：click 經屬性穿透掛上；.stop 避免同時觸發卡片的 pick -->
        <Button role="button" aria-label="收起物件資訊面板" @click.stop="emit('collapse')" />
    </div>
</template>

<style scoped>
.machine-card {
    font-family: 'HarmonyOS Sans TC', sans-serif;
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
