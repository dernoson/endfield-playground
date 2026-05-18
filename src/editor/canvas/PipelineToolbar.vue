<script setup lang="ts">
// src/editor/canvas/PipelineToolbar.vue
// CR-02: 管線模式狀態列，掛在 Navbar 右側工具區
import { storeToRefs } from 'pinia';
import { usePipelineStore } from '@/store/pipelineStore';

const pipelineStore = usePipelineStore();
const { isPipelineMode, hasActiveConnection, isEditing } = storeToRefs(pipelineStore);
</script>

<template>
    <!-- 管線模式切換按鈕 -->
    <UButton
        :variant="isPipelineMode ? 'solid' : 'soft'"
        :color="isPipelineMode ? 'primary' : 'neutral'"
        size="sm"
        label="管線 (P)"
        icon="i-lucide-git-branch"
        @click="pipelineStore.togglePipelineMode()"
    />

    <!-- 管線模式啟用時顯示的狀態提示 -->
    <template v-if="isPipelineMode">
        <UBadge
            v-if="hasActiveConnection"
            color="amber"
            variant="soft"
            size="sm"
            label="繪製中"
        />
        <UBadge
            v-else-if="isEditing"
            color="violet"
            variant="soft"
            size="sm"
            label="編輯中"
        />
        <UBadge
            v-else
            color="primary"
            variant="subtle"
            size="sm"
            label="管線模式"
        />

        <UButton
            v-if="hasActiveConnection"
            size="sm"
            variant="ghost"
            color="neutral"
            icon="i-lucide-x"
            label="取消 (Esc)"
            @click="pipelineStore.cancelDraft()"
        />
        <UButton
            v-if="isEditing"
            size="sm"
            variant="ghost"
            color="neutral"
            icon="i-lucide-check"
            label="完成 (Enter)"
            @click="pipelineStore.finishEditConnection()"
        />
    </template>
</template>