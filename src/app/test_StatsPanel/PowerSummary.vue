<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    totalDemandKw?: number;
    totalSupplyKw?: number;
}

const props = withDefaults(defineProps<Props>(), {
    totalDemandKw: 120,
    totalSupplyKw: 180,
});

const progressPercent = computed(() => {
    if (!props.totalSupplyKw || props.totalSupplyKw <= 0) return 0;
    const ratio = (props.totalDemandKw / props.totalSupplyKw) * 100;
    return Math.min(Math.max(ratio, 0), 100);
});
</script>

<template>
    <div class="overall-stats">
        <div class="overall-title">整體統計</div>
        <div class="overall-label">總耗電量/供電量</div>
        <div class="bar">
            <div
                v-if="progressPercent > 0"
                class="bar-fill"
                :style="{ width: `${progressPercent}%` }"
            />
        </div>
        <div class="overall-value">{{ totalDemandKw }}kW/{{ totalSupplyKw }}kW</div>
    </div>
</template>

<style scoped>
.overall-stats {
    position: relative;
    width: 281px;
    height: 102px;
    flex-shrink: 0;
}

.overall-title {
    position: absolute;
    top: 0px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    color: #ffffff;
}

.overall-label {
    position: absolute;
    top: 39px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-size: 18px;
    line-height: 21px;
    color: #cfcfcf;
}

.bar {
    position: absolute;
    top: 67px;
    left: 0;
    width: 281px;
    height: 10px;
    border-radius: 25px;
    background: #3c3c3c;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    max-width: 100%;
    border-radius: 25px;
    background: #eefd1c;
    transition: width 0.3s ease;
}

.overall-value {
    position: absolute;
    top: 83px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 19px;
    color: #a4a4a4;
}
</style>
