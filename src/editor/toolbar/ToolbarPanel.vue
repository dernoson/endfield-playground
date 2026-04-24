<script setup lang="ts">
import type { EquipmentType, ToolMode } from '@/types/editor';
import { useEditorStore } from '@/store/editorStore';

const editorStore = useEditorStore();

const tools: Array<{ id: ToolMode; label: string }> = [
    { id: 'select', label: '選取' },
    { id: 'pan', label: '移動畫布' },
];

const equipments: Array<{ id: EquipmentType; label: string }> = [
    { id: 'smelter', label: '精煉爐' },
    { id: 'crusher', label: '粉碎機' },
    { id: 'assembler', label: '組裝台' },
    { id: 'conveyor-node', label: '輸送帶節點' },
    { id: 'power-node', label: '電力節點' },
];
</script>

<template>
    <div class="panel toolbar-bottom h-full px-3 py-2">
        <div class="toolbar-section">
            <span class="toolbar-label">操作</span>
            <div class="toolbar-row">
                <button
                    v-for="tool in tools"
                    :key="tool.id"
                    class="btn"
                    :class="{ 'btn-active': editorStore.activeTool === tool.id }"
                    @click="editorStore.setActiveTool(tool.id)"
                >
                    {{ tool.label }}
                </button>
            </div>
        </div>

        <div class="toolbar-section">
            <span class="toolbar-label">可擺設裝備</span>
            <div class="toolbar-row">
                <button
                    v-for="equipment in equipments"
                    :key="equipment.id"
                    class="btn"
                    :class="{ 'btn-active': editorStore.selectedEquipment === equipment.id }"
                    @click="editorStore.setSelectedEquipment(equipment.id)"
                >
                    {{ equipment.label }}
                </button>
            </div>
        </div>
    </div>
</template>
