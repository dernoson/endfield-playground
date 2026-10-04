<script setup lang="ts">
import PowerSummary from './PowerSummary.vue';
import ItemSummaryTable from './ItemSummaryTable.vue';
import TicketEstimate from './TicketEstimate.vue';
import WarehouseEstimate from './WarehouseEstimate.vue';

const demoRows = [
    { itemId: 'fiber-1', name: '紫晶纖維', iconUrl: '', produced: 799, consumed: 0, net: 799, efficiency: 1 },
    { itemId: 'fiber-2', name: '紫晶纖維', iconUrl: '', produced: 0, consumed: 799, net: -799, efficiency: 0 },
    { itemId: 'fiber-3', name: '紫晶纖維', iconUrl: '', produced: 0, consumed: 799, net: -799, efficiency: 0 },
    { itemId: 'fiber-4', name: '紫晶纖維', iconUrl: '', produced: 799, consumed: 0, net: 799, efficiency: 1 },
];
</script>

<template>
    <div class="stats-panel relative h-full w-[320px] overflow-visible bg-[#4E4E4E] text-[#DADADA]">
        <div class="absolute top-7 -left-3.25 h-13.25 w-83.25 bg-[#2B2B2B]" />
        <div class="absolute top-7 -left-3.25 z-10 h-13.25 w-1.5 bg-[#DADADA]" />
        <div
            class="absolute top-10.25 right-51.5 z-20 flex h-7 w-24 items-center font-['HarmonyOS_Sans_TC'] text-[24px] leading-7 font-light text-white"
        >
            產線總覽
        </div>

        <div class="px-4.5 pb-3 pt-19">
            <div class="stack-block">
                <PowerSummary
                    :total-demand-kw="50"
                    :total-supply-kw="100"
                    :device-count="0"
                    :device-error-count="0"
                    :connection-count="0"
                />
            </div>

            <div class="stack-block">
                <ItemSummaryTable :rows="demoRows" />
            </div>

            <div v-if="false" class="stack-block ticket-block">
                <TicketEstimate :rows="[]" :total-ticket-per-hour="0" />
            </div>

            <div v-if="false" class="stack-block">
                <WarehouseEstimate :capacity-cells="0" :rows="[]" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.stack-block {
    margin-bottom: 16px;
}

.ticket-block {
    margin-top: 8px;
}
</style>
