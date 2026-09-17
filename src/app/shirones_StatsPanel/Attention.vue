<script setup lang="ts">
import errorIconUrl from './ErrorIcon.svg';
import warningIconUrl from './WarningIcon.svg';

interface Props {
    errorMessage?: string;
    warningMessage?: string;
}

withDefaults(defineProps<Props>(), {
    errorMessage: '碎紙機單元*1位置重疊',
    warningMessage: '貓毛貓範圍總sb超載',
});
</script>

<template>
    <div class="attention">
        <!-- 1. Text -->
        <div class="text">Tips</div>

        <!-- 2. Error = [plate + icon + text + text + text ... ] -->
        <div class="error">
            <div class="plate" />
            <img :src="errorIconUrl" class="icon" alt="error icon" />
            <div class="text">
                <slot name="error">{{ errorMessage }}</slot>
            </div>
        </div>

        <!-- 3. Warning = [plate + icon + text + text + text ... ] -->
        <div class="warning">
            <div class="plate" />
            <img :src="warningIconUrl" class="icon" alt="warning icon" />
            <div class="text">
                <slot name="warning">{{ warningMessage }}</slot>
            </div>
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
</style>
