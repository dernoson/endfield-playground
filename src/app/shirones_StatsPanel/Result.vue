<script setup lang="ts">
import { computed, ref } from 'vue';
import SingleProduction from './SingleProduction.vue';
import type { PowerStats, ProductionItem } from './types';

/**
 * Result 元件
 * 對應 Figma: Production Overview > Detail > Result (Detail, Bar)
 * 包含整體統計(含Bar)、產能估算與調度券兌換效率
 */
interface Props {
    power?: PowerStats;
    productions?: ProductionItem[];
    ticketPerHour?: number;
}

const props = withDefaults(defineProps<Props>(), {
    power: () => ({ demandKw: 120, supplyKw: 180 }),
    productions: () => [
        {
            id: '1',
            name: '紫晶纖維',
            producePerMin: 406,
            consumePerMin: 0,
            expanded: true,
        },
        {
            id: '2',
            name: '紫晶纖維',
            producePerMin: 0,
            consumePerMin: 799,
            expanded: true,
        },
    ],
    ticketPerHour: 799325,
});

const variable = computed(() => {
    const supply = props.power?.supplyKw ?? 0;
    const demand = props.power?.demandKw ?? 0;
    if (supply <= 0) return 0;
    return demand / supply;
});

const barWidth = computed(() => {
    return Math.min(100, Math.max(0, variable.value * 100));
});

const expandedMap = ref<Record<string, boolean>>(
    props.productions.reduce(
        (acc, item) => {
            acc[item.id] = item.expanded ?? true;
            return acc;
        },
        {} as Record<string, boolean>
    )
);

function toggle(id: string) {
    expandedMap.value[id] = !expandedMap.value[id];
}
</script>

<template>
    <div class="result-section">
        <div class="detail">
            <!-- 1. 整體統計 (含 Bar) -->
            <div class="overall-stats">
                <div class="overall-title">整體統計</div>
                <div class="overall-label">總耗電量/供電量</div>
                <!-- Bar -->
                <div
                    class="bar"
                    :style="{ width: `${barWidth}%` }"
                />
                <div class="overall-value">
                    {{ power.demandKw }}kW/{{ power.supplyKw }}kW
                </div>
            </div>

            <!-- 2. 產能估算 -->
            <div class="production-estimate">
                <div class="production-title">產能估算</div>

                <!-- info 容器 (動態配方項目清單，比照 FormulaList) -->
                <div class="info">
                    <SingleProduction
                        v-for="item in productions"
                        :key="item.id"
                        :item="item"
                        :expanded="expandedMap[item.id]"
                        @toggle="toggle(item.id)"
                    />
                </div>
            </div>

            <!-- 3. 調度券兌換效率 -->
            <div class="ticket-section">
                <div class="ticket-title">調度券兌換效率</div>
                <div class="ticket-value">
                    ≈ {{ ticketPerHour.toLocaleString() }}/hr
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.result-section {
    position: relative;
    width: 100%;
    height: 100%;
}

.overall-stats {
    position: relative;
    width: 100%;
    height: 103px;
}

.production-estimate {
    position: relative;
    width: 100%;
    margin-top: 20px;
    padding-top: 40px;
}

.production-title {
    position: absolute;
    top: 0px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    line-height: 23px;
    color: #ffffff;
}

.info {
    margin-bottom: 12px;
    height: auto;
    max-height: 240px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.info::-webkit-scrollbar {
    display: none;
}

.overall-title {
    position: absolute;
    top: 0px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #ffffff;
}

.overall-label {
    position: absolute;
    top: 40px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-style: normal;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #cfcfcf;
}

.bar {
    position: absolute;
    top: 70px;
    left: 0;
    height: 10px;
    max-width: 100%;
    border-radius: 25px;
    background: #eefd1c;
    z-index: 1;
}

.overall-value {
    position: absolute;
    top: 86px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-style: normal;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #a4a4a4;
}

.ticket-section {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
}

.ticket-title {
    position: absolute;
    bottom: 40px;
    left: 0px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    color: #ffffff;
    white-space: nowrap;
}

.ticket-value {
    position: absolute;
    top: 10px;
    left: 40px;
    font-family: 'HarmonyOS Sans TC', sans-serif;
    font-weight: 300;
    font-style: normal;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #cfcfcf;
    white-space: nowrap;
}
</style>
