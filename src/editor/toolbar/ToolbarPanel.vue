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
            <UBadge color="neutral" variant="soft" size="sm" label="操作" />
            <UFieldGroup size="sm" class="toolbar-row">
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

        <div class="toolbar-section">
            <UBadge color="neutral" variant="soft" size="sm" label="可擺設裝備" />
            <UFieldGroup size="sm" class="toolbar-row">
                <UButton
                    v-for="equipment in equipments"
                    :key="equipment.id"
                    color="neutral"
                    :variant="editorStore.selectedEquipment === equipment.id ? 'solid' : 'soft'"
                    :label="equipment.label"
                    @click="editorStore.setSelectedEquipment(equipment.id)"
                />
            </UFieldGroup>
        </div>
    </div>
</template>
