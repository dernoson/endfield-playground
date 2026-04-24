<script setup lang="ts">
import type { ToolMode } from '@/types/editor';
import { useEditorStore } from '@/store/editorStore';

const editorStore = useEditorStore();

const tools: Array<{ id: ToolMode; label: string }> = [
    { id: 'select', label: '選取' },
    { id: 'pan', label: '移動畫布' },
    { id: 'connect', label: '連線' },
    { id: 'box-select', label: '區域框選' },
];
</script>

<template>
    <div class="panel flex h-full flex-col gap-3 p-3">
        <h2 class="panel-title">工具列</h2>
        <div class="flex flex-col gap-2">
            <button
                v-for="tool in tools"
                :key="tool.id"
                class="btn text-left"
                :class="{ 'btn-active': editorStore.activeTool === tool.id }"
                @click="editorStore.setActiveTool(tool.id)"
            >
                {{ tool.label }}
            </button>
        </div>

        <div class="mt-2 border-t border-zinc-700 pt-3">
            <h3 class="text-xs tracking-wide text-zinc-400 uppercase">未來預留</h3>
            <ul class="mt-2 space-y-1 text-sm text-zinc-300">
                <li>Machine palette</li>
                <li>Conveyor tool</li>
                <li>Power tool</li>
            </ul>
        </div>
    </div>
</template>
