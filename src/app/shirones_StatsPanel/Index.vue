<script setup lang="ts">
import PowerSummary from './PowerSummary.vue';
import ProductionEstimate from './ProductionEstimate.vue';
import TicketEfficiency from './TicketEfficiency.vue';
import AlertTips from './AlertTips.vue';
import type { ShironeStatsPanelProps } from './types';

defineProps<ShironeStatsPanelProps>();
</script>

<template>
    <div class="shirones-stats-panel flex flex-col w-full h-full select-none bg-[#414144] text-white shadow-xl overflow-y-auto">
        <!-- 頂部標籤 Header Tab -->
        <div class="bg-[#242426] px-4 py-2.5 shadow-md">
            <h2 class="text-lg font-medium tracking-wide text-zinc-100">產線總覽</h2>
        </div>

        <!-- 內容區域 -->
        <div class="flex-1 space-y-5 px-4 py-4">
            <!-- 整體統計 -->
            <PowerSummary :power="power" />

            <!-- 產能估算 -->
            <ProductionEstimate :productions="productions" />

            <!-- 調度券兌換效率 -->
            <TicketEfficiency :ticket-per-hour="ticketPerHour" />

            <!-- 分隔線 -->
            <hr class="border-t border-zinc-600/80 my-2" />

            <!-- Tips 警示清單 -->
            <AlertTips :tips="tips" />
        </div>
    </div>
</template>
