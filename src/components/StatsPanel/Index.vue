<template>
    <div class="stats-panel relative h-full w-[320px] overflow-visible bg-[#4E4E4E] text-[#DADADA]">
        <div class="absolute top-7 -left-3.25 h-13.25 w-83.25 bg-[#2B2B2B]" />
        <div class="absolute top-7 -left-3.25 z-10 h-13.25 w-1.5 bg-[#DADADA]" />
        <div
            class="absolute top-10.25 right-51.5 z-20 flex h-7 w-24 items-center font-['HarmonyOS_Sans_TC'] text-[24px] leading-7 font-light text-white"
        >
            產線總覽
        </div>

        <div class="space-y-4 px-4.5 pb-3 pt-19">
            <PowerSummary
                :total-demand-kw="50"
                :total-supply-kw="100"
                :device-count="0"
                :device-error-count="0"
                :connection-count="0"
            />
            <ItemSummaryTable :rows="[]" />
            <TicketEstimate :rows="[]" :total-ticket-per-hour="0" />
            <WarehouseEstimate :capacity-cells="0" :rows="[]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import PowerSummary from './PowerSummary.vue';
import ItemSummaryTable from './ItemSummaryTable.vue';
import TicketEstimate from './TicketEstimate.vue';
import WarehouseEstimate from './WarehouseEstimate.vue';
</script>
