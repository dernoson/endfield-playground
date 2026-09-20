<template>
    <div class="stats-panel relative overflow-hidden rounded-xl bg-[#4E4E4E] text-[#DADADA]">
        <div class="bg-[#2B2B2B] px-4 py-2 text-lg font-semibold text-[#DADADA]">
            產線總覽
        </div>

        <div class="space-y-4 px-3 pb-3 pt-3">
            <PowerSummary
                :total-demand-kw="0"
                :total-supply-kw="0"
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
