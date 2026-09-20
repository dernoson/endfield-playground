<template>
    <div class="stats-panel relative h-full w-[320px] overflow-visible bg-[#4E4E4E] text-[#DADADA]">
        <div class="absolute top-[28px] left-[-13px] h-[53px] w-[333px] bg-[#2B2B2B]" />
        <div class="absolute top-[28px] left-[-13px] z-10 h-[53px] w-[6px] bg-[#DADADA]" />
        <div
            class="absolute top-[41px] left-[18px] z-20 flex  items-center text-2xl font-normal text-[#FFFFFF]"
        >
            產線總覽
        </div>

        <div class="space-y-4 px-[18px] pb-3 pt-[76px]">
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
