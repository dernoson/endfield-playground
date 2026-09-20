<script setup lang="ts">
interface TicketRow {
    itemId: string;
    name: string;
    ratePerMin: number; // 每分鐘速率
    ticketPerHour: number; // 每小時工單數
}

interface Props {
    rows: TicketRow[];
    totalTicketPerHour: number; // 每小時總工單數
}

defineProps<Props>();
</script>

<template>
    <div class="space-y-3 bg-transparent p-0 text-[#DADADA]">
        <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-[#DADADA]">工單預估 TicketEstimate</h3>
        </div>

        <!-- 總計數據區塊 -->
        <div class="rounded-md bg-[#3C3C3C] p-3">
            <p class="text-sm font-medium text-[#DADADA]">
                每小時總工單數：
                <span class="text-base font-bold text-[#DADADA]">{{ totalTicketPerHour }}</span>
                張/小時
            </p>
        </div>
        <!-- 表格區塊 -->
        <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left">
                <thead>
                    <tr
                        class="border-b border-[#3C3C3C] text-xs tracking-wider uppercase text-[#DADADA]/70"
                    >
                        <th class="pb-2 font-medium">項目名稱</th>
                        <th class="pb-2 text-right font-medium">每分鐘速率 (/min)</th>
                        <th class="pb-2 text-right font-medium">每小時工單 (/hr)</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-[#4E4E4E] text-sm text-[#DADADA]">
                    <tr v-for="row in rows" :key="row.itemId" class="hover:bg-[#4E4E4E]/20">
                        <td class="py-2.5 font-medium text-[#DADADA]">{{ row.name }}</td>
                        <td class="py-2.5 text-right font-mono text-[#DADADA]">{{ row.ratePerMin }}</td>
                        <td class="py-2.5 text-right font-mono font-semibold text-[#DADADA]">
                            {{ row.ticketPerHour }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
