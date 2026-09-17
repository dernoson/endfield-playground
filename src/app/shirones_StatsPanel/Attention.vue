<script setup lang="ts">
import type { AlertTip } from './types';

/**
 * Attention 元件
 * 對應 Figma: Production Overview > Detail > Attention (Text, Frame 2 > Error, Warning)
 * 包含 Tips 標題與警報卡片
 */
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
    <div class="attention-section space-y-2">
        <!-- 標題 Text: Tips -->
        <div class="attention-title text-sm font-medium text-zinc-300">
            Tips
        </div>

        <!-- Frame 2: Error 與 Warning 清單 -->
        <div class="frame-2 space-y-2">
            <div
                v-for="tip in tips"
                :key="tip.id"
                class="tip-item relative flex items-center space-x-2.5 overflow-hidden rounded px-3 py-2 text-xs"
                :class="
                    tip.level === 'error'
                        ? 'error-row text-[#ef7878]'
                        : 'warning-row text-[#f2ce47]'
                "
            >
                <!-- Plate 底板 -->
                <div
                    class="plate-bg absolute inset-0 -z-10"
                    :class="tip.level === 'error' ? 'bg-[#482d33]' : 'bg-[#463e2a]'"
                />

                <!-- Icon -->
                <span
                    v-if="tip.level === 'error'"
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e53935] text-white"
                >
                    <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </span>

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

                <!-- Text -->
                <span class="tip-text truncate font-medium">{{ tip.message }}</span>
            </div>
        </div>
    </div>
</template>
