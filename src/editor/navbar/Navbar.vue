<script setup lang="ts">
// src/editor/navbar/Navbar.vue
import type { ToolMode } from '@/types/editor';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useEditorStore } from '@/store/editorStore';
import { usePipelineStore } from '@/store/pipelineStore';

defineProps<{
    sidebarOpen: boolean;
}>();

defineEmits<{
    (event: 'toggle-sidebar'): void;
}>();

const editorStore = useEditorStore();
const pipelineStore = usePipelineStore();
const { isPipelineMode } = storeToRefs(pipelineStore);

const fileName = ref('factory-layout-001.json');

const tools: Array<{ id: ToolMode; label: string }> = [
    { id: 'select', label: '選取' },
    { id: 'pan', label: '移動畫布' },
];
</script>

<template>
    <UHeader>
        <template #left>
            <UButton
                size="sm"
                variant="ghost"
                color="neutral"
                icon="i-lucide-panel-left"
                :aria-label="sidebarOpen ? '收合左側選單' : '展開左側選單'"
                @click="$emit('toggle-sidebar')"
            />
            <span class="text-toned text-sm font-semibold">終末地集成工業系統模擬器</span>
        </template>

        <template #right>
            <!-- 畫布工具 -->
            <UFieldGroup size="sm">
                <UButton
                    v-for="tool in tools"
                    :key="tool.id"
                    color="neutral"
                    :variant="editorStore.activeTool === tool.id ? 'solid' : 'soft'"
                    :label="tool.label"
                    @click="editorStore.setActiveTool(tool.id)"
                />
            </UFieldGroup>

            <!-- 管線模式按鈕 -->
            <UButton
                size="sm"
                icon="i-lucide-git-branch"
                label="管線 (P)"
                :variant="isPipelineMode ? 'solid' : 'soft'"
                :color="isPipelineMode ? 'primary' : 'neutral'"
                @click="pipelineStore.togglePipelineMode()"
            />

            <UBadge
                color="neutral"
                variant="outline"
                size="md"
                :label="`目前檔名：${fileName}`"
            />
        </template>
    </UHeader>
</template>