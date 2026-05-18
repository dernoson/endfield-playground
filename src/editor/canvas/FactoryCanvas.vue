<script setup lang="ts">
// src/editor/canvas/FactoryCanvas.vue
import { storeToRefs } from 'pinia';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import type { Connection as VueFlowConnection } from '@vue-flow/core';
import type { EquipmentType } from '@/types/editor';
import type { FactoryNode } from '@/types/graph';
import { useEditorStore } from '@/store/editorStore';
import { useSelectionStore } from '@/store/selectionStore';
import { usePipelineStore } from '@/store/pipelineStore';

const editorStore = useEditorStore();
const selectionStore = useSelectionStore();
const pipelineStore = usePipelineStore();

const { nodes, edges, snapToGrid, activeTool, selectedEquipment, placementArmed } =
    storeToRefs(editorStore);
const { isPipelineMode } = storeToRefs(pipelineStore);

const { screenToFlowCoordinate, addNodes } = useVueFlow();

const equipmentLabelMap: Record<EquipmentType, string> = {
    smelter: '精煉爐',
    crusher: '粉碎機',
    assembler: '組裝台',
    'conveyor-node': '輸送帶節點',
    'power-node': '電力節點',
};
const equipmentTypes = Object.keys(equipmentLabelMap) as EquipmentType[];

function handleSelectionChange(selection: { nodes?: Array<{ id: string }> }) {
    selectionStore.setSelection((selection.nodes ?? []).map((n) => n.id));
}

function buildFactoryNode(equipment: EquipmentType, clientX: number, clientY: number): FactoryNode {
    const position = screenToFlowCoordinate({ x: clientX, y: clientY });
    return {
        id: `node-${equipment}-${Date.now()}-${Math.round(Math.random() * 10000)}`,
        type: 'default',
        position,
        data: { label: equipmentLabelMap[equipment], machineType: equipment },
    };
}

function isEquipmentType(value: string): value is EquipmentType {
    return equipmentTypes.includes(value as EquipmentType);
}

function handlePaneClick(event: MouseEvent) {
    if (!placementArmed.value || activeTool.value !== 'select') return;
    addNodes([buildFactoryNode(selectedEquipment.value, event.clientX, event.clientY)]);
    editorStore.disarmPlacement();
}

function handleCanvasDrop(event: DragEvent) {
    const dropped = event.dataTransfer?.getData('application/x-endfield-equipment') ?? '';
    if (!isEquipmentType(dropped)) return;
    event.preventDefault();
    addNodes([buildFactoryNode(dropped, event.clientX, event.clientY)]);
    editorStore.disarmPlacement();
}

/**
 * VueFlow 原生拖拉連線事件
 * 使用者從節點的 handle 拖拉到另一個節點時觸發
 * → 建立管線 connection 並同步為 edge
 */
function handleConnect(params: VueFlowConnection) {
    if (!params.source || !params.target) return;
    pipelineStore.onVueFlowConnect({
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle ?? null,
        targetHandle: params.targetHandle ?? null,
    });
}
</script>

<template>
    <div
        class="panel relative h-full overflow-hidden"
        :class="{ 'cursor-crosshair': isPipelineMode }"
        @dragover.prevent
        @drop="handleCanvasDrop"
    >
        <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :fit-view-on-init="true"
            :nodes-draggable="!isPipelineMode"
            :nodes-connectable="isPipelineMode"
            :zoom-on-scroll="true"
            :pan-on-drag="activeTool === 'pan'"
            :selection-on-drag="activeTool === 'box-select'"
            :snap-to-grid="snapToGrid"
            class="factory-flow"
            @selection-change="handleSelectionChange"
            @pane-click="handlePaneClick"
            @connect="handleConnect"
        >
            <Background :size="1.2" pattern-color="#3f3f46" />
            <Controls />
            <MiniMap />
        </VueFlow>
    </div>
</template>