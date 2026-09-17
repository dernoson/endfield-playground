<script setup lang="ts">
import type { AlertTip } from './types';

interface Props {
    tips?: AlertTip[];
}

withDefaults(defineProps<Props>(), {
    tips: () => [
        {
            id: 'tip-1',
            level: 'error',
            message: '碎紙機單元*1位置重疊',
        },
        {
            id: 'tip-2',
            level: 'warning',
            message: '貓毛貓範圍總sb超載',
        },
    ],
});
</script>

<template>
    <section class="space-y-2">
        <h3 class="text-base font-medium tracking-wide text-zinc-300">Tips</h3>

        <div class="space-y-2">
            <div
                v-for="tip in tips"
                :key="tip.id"
                class="flex items-center space-x-2.5 rounded px-3 py-2 text-xs"
                :class="
                    tip.level === 'error'
                        ? 'bg-[#482d33] text-[#ef7878]'
                        : 'bg-[#463e2a] text-[#f2ce47]'
                "
            >
                <!-- Error Icon: 紅底白叉 -->
                <span
                    v-if="tip.level === 'error'"
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e53935] text-white"
                >
                    <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </span>

                <!-- Warning Icon: 黃色三角驚嘆號 -->
                <span
                    v-else
                    class="flex h-5 w-5 shrink-0 items-center justify-center text-[#fbc02d]"
                >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </span>

                <span class="truncate font-medium">{{ tip.message }}</span>
            </div>
        </div>
    </section>
</template>
