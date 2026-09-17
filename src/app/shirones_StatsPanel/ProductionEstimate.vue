<script setup lang="ts">
import { ref } from 'vue';
import type { ProductionItem } from './types';

interface Props {
    productions?: ProductionItem[];
}

const props = withDefaults(defineProps<Props>(), {
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
});

// 管理展開/收合狀態
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
    <section class="space-y-2">
        <h3 class="text-base font-medium tracking-wide text-zinc-100">產能估算</h3>

        <div class="space-y-3 text-sm">
            <div
                v-for="item in productions"
                :key="item.id"
                class="space-y-1 select-none"
            >
                <!-- 標題與收益 -->
                <div
                    class="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-90"
                    @click="toggle(item.id)"
                >
                    <div class="flex items-center space-x-1.5 text-zinc-200">
                        <svg
                            class="h-3.5 w-3.5 transition-transform duration-200"
                            :class="{ '-rotate-90': !expandedMap[item.id] }"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2.5"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        <span class="font-normal">{{ item.name }}</span>
                    </div>

                    <div
                        class="font-mono text-xs font-medium"
                        :class="item.producePerMin - item.consumePerMin >= 0 ? 'text-[#7ee14d]' : 'text-[#f87171]'"
                    >
                        收益{{ item.producePerMin - item.consumePerMin >= 0 ? `+${item.producePerMin - item.consumePerMin}` : item.producePerMin - item.consumePerMin }}
                    </div>
                </div>

                <!-- 展開細項：生產與消耗 -->
                <div
                    v-if="expandedMap[item.id]"
                    class="space-y-0.5 pl-5 text-xs text-zinc-300"
                >
                    <div class="flex justify-between pr-2">
                        <span class="text-zinc-400">生產</span>
                        <span class="font-mono text-zinc-200">{{ item.producePerMin }}/min</span>
                    </div>
                    <div class="flex justify-between pr-2">
                        <span class="text-zinc-400">消耗</span>
                        <span class="font-mono text-zinc-200">{{ item.consumePerMin }}/min</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
