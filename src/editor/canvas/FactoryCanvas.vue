<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import type { EquipmentType } from '@/types/editor';
import type { FactoryNode } from '@/types/graph';
import { useEditorStore } from '@/store/editorStore';
import { useSelectionStore } from '@/store/selectionStore';
import { usePipelineStore } from '@/store/pipelineStore';
import PipelineRenderer from './PipelineRenderer.vue';

const editorStore = useEditorStore();
const selectionStore = useSelectionStore();
const pipelineStore = usePipelineStore();

const { nodes, edges, snapToGrid, activeTool, selectedEquipment, placementArmed } =
    storeToRefs(editorStore);
const { isPipelineMode, draftConnection } = storeToRefs(pipelineStore);

const { screenToFlowCoordinate, addNodes } = useVueFlow();

// 畫布容器 ref，用於計算滑鼠的相對座標
const canvasEl = ref<HTMLDivElement | null>(null);

const equipmentLabelMap: Record<EquipmentType, string> = {
    smelter: '精煉爐',
    crusher: '粉碎機',
    assembler: '組裝台',
    'conveyor-node': '輸送帶節點',
    'power-node': '電力節點',
};
const equipmentTypes = Object.keys(equipmentLabelMap) as EquipmentType[];

function handleSelectionChange(selection: { nodes?: Array<{ id: string }> }) {
    selectionStore.setSelection((selection.nodes ?? []).map((node) => node.id));
}

function buildFactoryNode(equipment: EquipmentType, clientX: number, clientY: number): FactoryNode {
    const position = screenToFlowCoordinate({ x: clientX, y: clientY });
    return {
        id: `node-${equipment}-${Date.now()}-${Math.round(Math.random() * 10000)}`,
        type: 'default',
        position,
        data: {
            label: equipmentLabelMap[equipment],
            machineType: equipment,
        },
    };
}

function placeNodeAtPointer(equipment: EquipmentType, clientX: number, clientY: number) {
    addNodes([buildFactoryNode(equipment, clientX, clientY)]);
}

function isEquipmentType(value: string): value is EquipmentType {
    return equipmentTypes.includes(value as EquipmentType);
}

function getRelativePos(event: MouseEvent): { x: number; y: number } {
    const rect = canvasEl.value?.getBoundingClientRect();
    if (!rect) return { x: event.clientX, y: event.clientY };
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function handlePaneClick(event: MouseEvent) {
    // 管線模式下：點選空格新增彎折點
    if (isPipelineMode.value && draftConnection.value) {
        pipelineStore.addWaypoint(getRelativePos(event));
        return;
    }

    if (!placementArmed.value || activeTool.value !== 'select') return;
    placeNodeAtPointer(selectedEquipment.value, event.clientX, event.clientY);
    editorStore.disarmPlacement();
}

function handleCanvasMouseMove(event: MouseEvent) {
    if (!isPipelineMode.value || !draftConnection.value) return;
    pipelineStore.updateCursorPos(getRelativePos(event));
}

function handleCanvasDrop(event: DragEvent) {
    const droppedEquipment = event.dataTransfer?.getData('application/x-endfield-equipment') ?? '';
    if (!isEquipmentType(droppedEquipment)) return;
    event.preventDefault();
    placeNodeAtPointer(droppedEquipment, event.clientX, event.clientY);
    editorStore.disarmPlacement();
}
</script>

<template>
    <div
        ref="canvasEl"
        class="panel relative h-full overflow-hidden"
        @dragover.prevent
        @drop="handleCanvasDrop"
        @mousemove="handleCanvasMouseMove"
    >
        <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :fit-view-on-init="true"
            :nodes-draggable="true"
            :zoom-on-scroll="true"
            :pan-on-drag="activeTool === 'pan'"
            :selection-on-drag="activeTool === 'box-select'"
            :snap-to-grid="snapToGrid"
            class="factory-flow"
            @selection-change="handleSelectionChange"
            @pane-click="handlePaneClick"
        >
            <Background :size="1.2" pattern-color="#3f3f46" />
            <Controls />
            <MiniMap />
        </VueFlow>

        <!--
            PipelineRenderer 放在 VueFlow 外部（同層 sibling），
            使用 absolute inset-0 覆蓋畫布，
            並且不依賴 useVueFlow() context（已改用螢幕座標直接渲染）
        -->
        <PipelineRenderer />
    </div>
</template>