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

const demandRatio = computed(() => {
    const safeSupply = Math.max(props.totalSupplyKw, 1);
    return Math.min((props.totalDemandKw / safeSupply) * 100, 100);
});
</script>

<template>
    <section class="relative overflow-hidden bg-transparent p-0 text-sm text-[#DADADA]">
        <div
            class="absolute top-6 left-0 flex h-5.75 w-20 items-center text-base font-normal text-[20px] text-[#FFFFFF]"
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
            <div class="text-[16px] text-[#A4A4A4]">{{ totalDemandKw }}kW / {{ totalSupplyKw }}kW</div>
        </div>

     

        
       
    </section>
</template>
