<script setup lang="ts">
import errorIconUrl from './ErrorIcon.svg';
import warningIconUrl from './WarningIcon.svg';
import type { AlertTip } from './types';

interface Props {
    tips?: AlertTip[];
    errorMessage?: string;
    warningMessage?: string;
}

withDefaults(defineProps<Props>(), {
    tips: () => [],
    errorMessage: '',
    warningMessage: '',
});
</script>

<template>
    <div class="attention">
        <!-- 1. Text -->
        <div class="text">Tips</div>

        <!-- 2. 動態 Tips 列表（若有傳入 tips 陣列） -->
        <template v-if="tips && tips.length > 0">
            <div
                v-for="tip in tips"
                :key="tip.id"
                :class="tip.level === 'error' ? 'error' : 'warning'"
            >
                <div class="plate" />
                <img
                    :src="tip.level === 'error' ? errorIconUrl : warningIconUrl"
                    class="icon"
                    :alt="`${tip.level} icon`"
                />
                <div class="text">
                    {{ tip.message || '-' }}
                </div>
            </div>
        </template>

        <!-- 3. 單一 errorMessage / warningMessage 或 Slot 兼容模式 -->
        <template v-else-if="errorMessage || warningMessage">
            <div v-if="errorMessage" class="error">
                <div class="plate" />
                <img :src="errorIconUrl" class="icon" alt="error icon" />
                <div class="text">
                    <slot name="error">{{ errorMessage }}</slot>
                </div>
            </div>

            <div v-if="warningMessage" class="warning">
                <div class="plate" />
                <img :src="warningIconUrl" class="icon" alt="warning icon" />
                <div class="text">
                    <slot name="warning">{{ warningMessage }}</slot>
                </div>
            </div>
        </template>

        <!-- 4. 無任何資料時顯示 placeholder '-' -->
        <div v-else class="empty-placeholder">
            -
        </div>
    </div>
</template>

<style scoped>
.attention {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* 1. Text */
.text {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    color: #ffffff;
}

/* 2. Error = [plate + icon + text + text + text ... ] */
.error {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    padding-left: 36px;
    padding-right: 8px;
    overflow: hidden;
}

/* Plate */
.error .plate {
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    height: 35px;
    background: rgba(255, 110, 110, 0.1);
    z-index: 0;
}

/* Icon */
.error .icon {
    position: absolute;
    top: 7px;
    left: 7px;
    width: 23px;
    height: 23px;
    z-index: 1;
}

/* Text inside Error */
.error .text {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    
    position: absolute;
    left: 42px;
    top: 7px;

    color: #ff6e6e;
    white-space: nowrap;
    z-index: 1;
}

/* 3. Warning = [plate + icon + text + text + text ... ] */
.warning {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    padding-left: 36px;
    padding-right: 8px;
    overflow: hidden;
}

/* Plate */
.warning .plate {
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    height: 35px;
    background: #f7d9451a;
    z-index: 0;
}

/* Icon */
.warning .icon {
    position: absolute;
    top: 7px;
    left: 7px;
    width: 26px;
    height: 23px;
    z-index: 1;
}

/* Text inside Warning */
.warning .text {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;

    position: absolute;
    left: 42px;
    top: 7px;

    color: #f7d945;
    white-space: nowrap;
    z-index: 1;
}

.empty-placeholder {
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-size: 16px;
    color: #cfcfcf;
}
</style>
