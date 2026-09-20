<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    totalDemandKw: number;
    totalSupplyKw: number;
    deviceCount: number;
    deviceErrorCount: number;
    connectionCount: number;
}

const props = defineProps<Props>();

const surplus = computed(() => props.totalSupplyKw - props.totalDemandKw);
const demandRatio = computed(() => {
    const safeSupply = Math.max(props.totalSupplyKw, 1);
    return Math.min((props.totalDemandKw / safeSupply) * 100, 100);
});
</script>

<template>
    <section class="relative overflow-hidden bg-transparent p-0 text-sm text-[#DADADA]">
        <div
            class="absolute top-6 left-0 flex h-5.75 w-20 items-center text-base font-normal text-[#FFFFFF]"
        >
            <h3>整體統計</h3>
        </div>

        <div class="mt-15.75 space-y-1.75">
            <div class="flex items-center text-lg text-[#CFCFCF]">
                總耗電量 / 供電量
            </div>
            <div class="relative -top-px h-2.5 w-70.25 overflow-hidden rounded-[25px] bg-[#3C3C3C]">
                <div
                    class="h-full rounded-[25px] bg-[#EEFD1C]"
                    :style="{ width: `${demandRatio}%` }"
                />
            </div>
            <div class="text-[16px] text-[#CFCFCF]">{{ totalDemandKw }}kW / {{ totalSupplyKw }}kW</div>
        </div>

        <div class="mt-3 text-lg text-[#CFCFCF]">
            <span v-if="surplus >= 0">電力狀態：盈餘 {{ surplus }} kW</span>
            <span v-else>電力狀態：不足 {{ -surplus }} kW</span>
        </div>

        <div class="mt-2 text-lg text-[#DADADA]/80">
            設備數量：{{ deviceCount }} 台（含 {{ deviceErrorCount }} 台有 Error）
        </div>
        <div class="text-lg text-[#DADADA]/80">管線數量：{{ connectionCount }} 條</div>
    </section>
</template>
