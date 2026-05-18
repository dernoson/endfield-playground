<script setup lang="ts">
// src/editor/canvas/PipelineToolbar.vue
// CR-02: 管線模式工具欄

import { storeToRefs } from 'pinia';
import { usePipelineStore } from '@/store/pipelineStore';

const pipelineStore = usePipelineStore();
const { isPipelineMode, hasActiveConnection, isEditing } = storeToRefs(pipelineStore);

/**
 * 切換管線模式
 */
function toggleMode() {
    pipelineStore.togglePipelineMode();
}

/**
 * 取消當前操作
 */
function cancelCurrent() {
    if (hasActiveConnection.value) {
        pipelineStore.cancelDraft();
    } else if (isEditing.value) {
        pipelineStore.finishEditConnection();
    }
}
</script>

<template>
    <div class="pipeline-toolbar flex items-center gap-2">
        <!-- 管線模式切換按鈕 -->
        <UButton
            :variant="isPipelineMode ? 'solid' : 'soft'"
            :color="isPipelineMode ? 'primary' : 'neutral'"
            icon="i-lucide-git-branch"
            label="管線模式 (P)"
            size="sm"
            @click="toggleMode"
        />

        <!-- 狀態指示 -->
        <div v-if="isPipelineMode" class="flex items-center gap-2">
            <UBadge v-if="hasActiveConnection" color="amber" variant="soft" size="sm">
                <template #label>
                    <div class="flex items-center gap-1">
                        <span class="i-lucide-pencil h-3 w-3" />
                        <span>繪製中</span>
                    </div>
                </template>
            </UBadge>

            <UBadge v-if="isEditing" color="violet" variant="soft" size="sm">
                <template #label>
                    <div class="flex items-center gap-1">
                        <span class="i-lucide-edit-3 h-3 w-3" />
                        <span>編輯中</span>
                    </div>
                </template>
            </UBadge>

            <!-- 取消按鈕 -->
            <UButton
                v-if="hasActiveConnection || isEditing"
                variant="ghost"
                color="neutral"
                icon="i-lucide-x"
                label="取消 (Esc)"
                size="sm"
                @click="cancelCurrent"
            />
        </div>

        <!-- 使用提示 -->
        <div v-if="isPipelineMode" class="ml-auto text-xs text-zinc-400">
            <template v-if="!hasActiveConnection && !isEditing">
                點選設備接口開始繪製管線
            </template>
            <template v-else-if="hasActiveConnection">
                點選空格新增彎折點 | 點選接口完成連接 | Esc 取消
            </template>
            <template v-else-if="isEditing">
                拖動彎折點調整路徑 | 點選線段新增彎折點 | Enter 完成編輯
            </template>
        </div>
    </div>
</template>

<style scoped>
.pipeline-toolbar {
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid rgba(63, 63, 70, 0.5);
    backdrop-filter: blur(8px);
}
</style>
