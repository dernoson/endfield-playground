import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { FactoryEdge, FactoryNode } from '@/types/graph';
import type { EquipmentType, ToolMode } from '@/types/editor';

const mockNodes: FactoryNode[] = [
    {
        id: 'node-iron',
        type: 'default',
        position: { x: 160, y: 120 },
        data: { label: 'Iron Miner' },
    },
    {
        id: 'node-smelter',
        type: 'default',
        position: { x: 420, y: 240 },
        data: { label: 'Smelter' },
    },
];

const mockEdges: FactoryEdge[] = [
    {
        id: 'edge-1',
        source: 'node-iron',
        target: 'node-smelter',
        animated: true,
    },
];

export const useEditorStore = defineStore('editor', () => {
    const nodes = ref<FactoryNode[]>(mockNodes);
    const edges = ref<FactoryEdge[]>(mockEdges);
    const mapWidth = ref(256);
    const mapHeight = ref(256);
    const snapToGrid = ref(true);
    const activeTool = ref<ToolMode>('select');
    const selectedEquipment = ref<EquipmentType>('smelter');

    const machineCount = computed(() => nodes.value.length);
    const nodeCount = computed(() => nodes.value.length);
    const edgeCount = computed(() => edges.value.length);

    function setMapSize(width: number, height: number) {
        mapWidth.value = Math.max(64, width);
        mapHeight.value = Math.max(64, height);
    }

    function setSnapToGrid(enabled: boolean) {
        snapToGrid.value = enabled;
    }

    function setActiveTool(tool: ToolMode) {
        activeTool.value = tool;
    }

    function setSelectedEquipment(equipment: EquipmentType) {
        selectedEquipment.value = equipment;
    }

    function resetCanvas() {
        nodes.value = structuredClone(mockNodes);
        edges.value = structuredClone(mockEdges);
    }

    return {
        nodes,
        edges,
        mapWidth,
        mapHeight,
        snapToGrid,
        activeTool,
        selectedEquipment,
        machineCount,
        nodeCount,
        edgeCount,
        setMapSize,
        setSnapToGrid,
        setActiveTool,
        setSelectedEquipment,
        resetCanvas,
    };
});
