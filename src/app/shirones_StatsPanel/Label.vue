<template>
    <div class="label-container">
        <!-- 1. width 6 的灰條 -->
        <div class="grey-bar" />

        <!-- 2. penal.width + 14 的黑條 -->
        <div class="black-bar" />

        <!-- 3. 文字 (高度置中，距離 penal 左側 20px) -->
        <div class="label-text">
            <slot>產線總覽</slot>
        </div>
    </div>
</template>

<style scoped>
.label-container {
    position: absolute;
    top: 30px;
    left: 0;
    height: 50px;
    width: 100%;
    z-index: 10;
}

/* 灰條 */
.grey-bar {
    position: absolute;
    left: -20px;
    top: 0;
    width: 6px;
    height: 50px;
    background: #dadada;
    z-index: 2;
}

/* 黑條 */
.black-bar {
    position: absolute;
    left: -14px;
    top: 0;
    width: calc(100% + 14px);
    height: 50px;
    background: #2b2b2b;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    z-index: 1;
}

/* 文字 */
.label-text {
    position: absolute;
    left: 20px;
    top: 0;
    height: 50px;
    display: flex;
    align-items: center;
    z-index: 3;

    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 28px;
    color: #ffffff;
    white-space: nowrap;
}
</style>
