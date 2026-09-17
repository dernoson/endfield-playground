<script setup lang="ts">
import iconUrl from './Icon.svg';

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
            <img :src="iconUrl" class="icon" alt="error icon" />
            <div class="text">
                <slot name="error">{{ errorMessage }}</slot>
            </div>
        </div>

        <!-- 3. Warning (Plate, Icon, Text) -->
        <div class="warning">
            <div class="plate" />
            <div class="icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                        fill-rule="evenodd"
                        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clip-rule="evenodd"
                    />
                </svg>
            </div>
            <div class="warning-text">
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
    font-size: 20px;
    line-height: 23px;
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
    position: absolute;
    left: 42px;
    top: 7px;

    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;

    color: #ff6e6e;
    white-space: nowrap;
    z-index: 1;
}

/* 3. Warning */
.warning {
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    gap: 10px;
    border-radius: 4px;
    overflow: hidden;
}

.warning .plate {
    position: absolute;
    inset: 0;
    background: #463e2a;
    z-index: 0;
}

.warning .icon {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fbc02d;
}

.warning .icon svg {
    width: 18px;
    height: 18px;
}

.warning .warning-text {
    position: relative;
    z-index: 1;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #f2ce47;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
