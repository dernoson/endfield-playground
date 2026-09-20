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
    <section class="overflow-hidden bg-transparent p-0 text-sm text-[#DADADA]">
        <div class="mb-3">
            <h3 class="text-base font-semibold text-[#DADADA]">整體統計</h3>
        </div>

        <div class="space-y-2">
            <div class="text-xs text-[#CFCFCF]">總耗電量 / 供電量</div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-[#3C3C3C]">
                <div
                    class="h-full rounded-full bg-[#EEFD1C]"
                    :style="{ width: `${demandRatio}%` }"
                />
            </div>
            <div class="text-xs text-[#CFCFCF]">{{ totalDemandKw }}kW / {{ totalSupplyKw }}kW</div>
        </div>

        <div class="mt-3 text-xs text-[#CFCFCF]">
            <span v-if="surplus >= 0">電力狀態：盈餘 {{ surplus }} kW</span>
            <span v-else>電力狀態：不足 {{ -surplus }} kW</span>
        </div>

        <div class="mt-2 text-xs text-[#DADADA]/80">
            設備數量：{{ deviceCount }} 台（含 {{ deviceErrorCount }} 台有 Error）
        </div>
        <div class="text-xs text-[#DADADA]/80">管線數量：{{ connectionCount }} 條</div>
    </section>
</template>
