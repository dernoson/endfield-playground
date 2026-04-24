<script setup lang="ts">
import type { ToolMode } from '@/types/editor';
import { ref } from 'vue';
import { useEditorStore } from '@/store/editorStore';

defineProps<{ inspectorOpen: boolean }>();
defineEmits<{ (event: 'toggle-inspector'): void }>();

const editorStore = useEditorStore();
const fileName = ref('factory-layout-001.json');

const tools: Array<{ id: ToolMode; label: string }> = [
    { id: 'select', label: '選取' },
    { id: 'pan', label: '移動畫布' },
];
</script>

<template>
    <div class="panel flex h-full items-center gap-3 px-4 py-2">
        <UFieldGroup size="sm" class="min-w-0 flex-1">
            <UButton variant="soft" color="neutral" label="新建專案" />
            <UButton variant="soft" color="neutral" label="匯入設計檔" />
            <UButton variant="soft" color="neutral" label="匯出設計檔" />
            <UButton variant="soft" color="error" label="重設畫布" @click="editorStore.resetCanvas" />
        </UFieldGroup>
        <div class="flex min-w-0 flex-1 items-center justify-center">
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
        </div>
        <div class="flex min-w-0 flex-1 items-center justify-end gap-3">
            <UBadge color="neutral" variant="outline" size="md" :label="`目前檔名：${fileName}`" />
            <UButton
                size="sm"
                variant="outline"
                color="neutral"
                :label="inspectorOpen ? '收起右側面板' : '打開右側面板'"
                @click="$emit('toggle-inspector')"
            />
        </div>
    </div>
</template>
