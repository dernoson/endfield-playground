<script setup lang="ts">
import { computed, ref } from 'vue';
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

const powerPercent = computed(() => {
    if (!props.power.supplyKw || props.power.supplyKw <= 0) return 0;
    return Math.min(100, Math.round((props.power.demandKw / props.power.supplyKw) * 100));
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
    <div class="result-section space-y-4">
        <!-- 1. 整體統計 (含 Bar) -->
        <div class="overall-stats space-y-1.5">
            <div class="text-sm font-medium text-white">整體統計</div>
            <div class="text-xs text-zinc-400">總耗電量/供電量</div>
            <!-- Bar -->
            <div class="power-bar-track h-2 w-full overflow-hidden rounded-full bg-zinc-950/70">
                <div
                    class="h-full rounded-full bg-[#d7e338]"
                    :style="{ width: `${powerPercent}%` }"
                />
            </div>
            <div class="text-xs text-zinc-400">
                {{ power.demandKw }}kW/{{ power.supplyKw }}kW
            </div>
        </div>

        <!-- 2. 產能估算 -->
        <div class="production-estimate space-y-2">
            <div class="text-sm font-medium text-white">產能估算</div>

            <div class="space-y-2.5">
                <div
                    v-for="item in productions"
                    :key="item.id"
                    class="space-y-1 text-xs"
                >
                    <div
                        class="flex cursor-pointer items-center justify-between hover:opacity-90"
                        @click="toggle(item.id)"
                    >
                        <div class="flex items-center space-x-1.5 text-zinc-200">
                            <span class="text-[10px] text-zinc-400">{{ expandedMap[item.id] ? '▼' : '▶' }}</span>
                            <span>{{ item.name }}</span>
                        </div>
                        <div
                            class="font-mono font-medium"
                            :class="item.producePerMin - item.consumePerMin >= 0 ? 'text-[#7ee14d]' : 'text-[#f87171]'"
                        >
                            收益{{ item.producePerMin - item.consumePerMin >= 0 ? `+${item.producePerMin - item.consumePerMin}` : item.producePerMin - item.consumePerMin }}
                        </div>
                    </div>

                    <div v-if="expandedMap[item.id]" class="space-y-0.5 pl-4 text-zinc-300">
                        <div class="flex justify-between pr-2">
                            <span class="text-zinc-400">生產</span>
                            <span class="font-mono">{{ item.producePerMin }}/min</span>
                        </div>
                        <div class="flex justify-between pr-2">
                            <span class="text-zinc-400">消耗</span>
                            <span class="font-mono">{{ item.consumePerMin }}/min</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. 調度券兌換效率 -->
        <div class="ticket-section space-y-1">
            <div class="text-sm font-medium text-white">調度券兌換效率</div>
            <div class="py-0.5 text-center font-mono text-xs tracking-wide text-zinc-300">
                ≈ {{ ticketPerHour.toLocaleString() }}/hr
            </div>
        </div>
    </div>
</template>
