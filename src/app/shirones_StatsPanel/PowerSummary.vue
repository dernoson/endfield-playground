<script setup lang="ts">
import { computed } from 'vue';
import type { PowerStats } from './types';

interface Props {
    power?: PowerStats;
}

const props = withDefaults(defineProps<Props>(), {
    power: () => ({ demandKw: 120, supplyKw: 180 }),
});

const percent = computed(() => {
    if (!props.power.supplyKw || props.power.supplyKw <= 0) return 0;
    return Math.min(100, Math.round((props.power.demandKw / props.power.supplyKw) * 100));
});
</script>

<template>
    <section class="space-y-2">
        <h3 class="text-base font-medium tracking-wide text-zinc-100">整體統計</h3>

        <div class="space-y-1">
            <div class="text-xs text-zinc-400">總耗電量/供電量</div>

            <!-- 進度條 (黃綠色) -->
            <div class="h-2 w-full overflow-hidden rounded-full bg-zinc-950/70">
                <div
                    class="h-full rounded-full bg-[#d7e338] transition-all duration-300"
                    :style="{ width: `${percent}%` }"
                />
            </div>

            <div class="text-xs text-zinc-400">
                {{ power.demandKw }}kW/{{ power.supplyKw }}kW
            </div>
        </div>
    </section>
</template>
