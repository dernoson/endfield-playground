// src/store/pipelineStore.ts
// CR-02: 管線連接狀態管理
// 管線渲染策略：將 Connection 同步為 VueFlow edges，由 VueFlow 負責在正確座標渲染

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useEditorStore } from '@/store/editorStore';
import type {
    Connection,
    DraftConnection,
    PipelineType,
    AutoNode,
    PathValidation,
} from '@/types/pipeline';

export const usePipelineStore = defineStore('pipeline', () => {
    const connections = ref<Connection[]>([]);
    const isPipelineMode = ref(false);
    const draftConnection = ref<DraftConnection | null>(null);
    const editingConnectionUid = ref<string | null>(null);

    const hasActiveConnection = computed(() => draftConnection.value !== null);
    const isEditing = computed(() => editingConnectionUid.value !== null);

    // ── 私有：把單一 Connection 轉成 VueFlow edge ──────────
    function _toVueFlowEdge(conn: Connection, highlighted: boolean) {
        const baseColor = conn.type === 'conveyor' ? '#fb923c' : '#3b82f6';
        return {
            id: `pipeline-${conn.uid}`,
            source: conn.from.deviceUid,
            target: conn.to.deviceUid,
            sourceHandle: null,
            targetHandle: null,
            type: 'default',
            animated: false,
            deletable: true,
            focusable: true,
            style: {
                stroke: baseColor,
                strokeWidth: highlighted ? 4 : 3,
            },
            data: {
                connectionUid: conn.uid,
                pipelineType: conn.type,
            },
        };
    }

    // ── 管線模式切換 ────────────────────────────────────────
    function togglePipelineMode() {
        isPipelineMode.value = !isPipelineMode.value;
        if (!isPipelineMode.value) {
            draftConnection.value = null;
            editingConnectionUid.value = null;
        }
        // 更新所有管線 edge 的高亮樣式
        const editorStore = useEditorStore();
        editorStore.updateAllPipelineEdgeStyles(isPipelineMode.value);
    }

    // ── 新增管線（VueFlow connect 事件觸發） ────────────────
    function addConnection(
        fromDeviceUid: string,
        fromPortId: string,
        toDeviceUid: string,
        toPortId: string,
        type: PipelineType = 'conveyor',
        waypoints: { x: number; y: number }[] = [],
        autoNodes: AutoNode[] = [],
    ): Connection {
        const newConn: Connection = {
            uid: `conn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            type,
            from: { deviceUid: fromDeviceUid, portId: fromPortId },
            to: { deviceUid: toDeviceUid, portId: toPortId },
            waypoints,
            autoNodes,
        };

        connections.value.push(newConn);

        // 同步至 VueFlow edge
        const editorStore = useEditorStore();
        editorStore.upsertPipelineEdge(_toVueFlowEdge(newConn, isPipelineMode.value));

        return newConn;
    }

    // ── 刪除管線 ────────────────────────────────────────────
    // skipEdgeRemoval: 由 VueFlow onEdgesChange 觸發時傳 true，
    // 因為 VueFlow 自己已處理 edge 移除，不需再呼叫 removePipelineEdge
    function deleteConnection(connectionUid: string, skipEdgeRemoval = false) {
        const idx = connections.value.findIndex((c) => c.uid === connectionUid);
        if (idx !== -1) connections.value.splice(idx, 1);

        if (!skipEdgeRemoval) {
            const editorStore = useEditorStore();
            editorStore.removePipelineEdge(`pipeline-${connectionUid}`);
        }
    }

    // ── 從 VueFlow onConnect 事件快速建立管線 ───────────────
    // VueFlow 拖拉 handle 連線後呼叫此方法
    function onVueFlowConnect(params: {
        source: string;
        target: string;
        sourceHandle: string | null;
        targetHandle: string | null;
    }) {
        addConnection(
            params.source,
            params.sourceHandle ?? '',
            params.target,
            params.targetHandle ?? '',
            'conveyor',
        );
    }

    // ── Draft（繪製中，供未來 Phase 1 手動彎折點使用） ──────
    function startConnection(
        deviceUid: string,
        portId: string,
        portType: PipelineType,
        startPos: { x: number; y: number },
    ) {
        draftConnection.value = {
            type: portType,
            fromDeviceUid: deviceUid,
            fromPortId: portId,
            waypoints: [],
            cursorPos: startPos,
            hasInvalidSegment: false,
        };
    }

    function updateCursorPos(pos: { x: number; y: number }) {
        if (!draftConnection.value) return;
        draftConnection.value = { ...draftConnection.value, cursorPos: pos };
    }

    function addWaypoint(pos: { x: number; y: number }) {
        if (!draftConnection.value) return;
        draftConnection.value.waypoints.push({ ...pos });
    }

    function cancelDraft() {
        draftConnection.value = null;
    }

    function validatePath(points: { x: number; y: number }[]): PathValidation {
        const invalidIndices: number[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            if (dx !== 0 && dy !== 0) invalidIndices.push(i);
        }
        return { valid: invalidIndices.length === 0, invalidIndices };
    }

    function startEditConnection(uid: string) {
        editingConnectionUid.value = uid;
    }

    function finishEditConnection(): boolean {
        editingConnectionUid.value = null;
        return true;
    }

    function toggleAutoNodeMode(connectionUid: string, autoNodeIndex: number) {
        const conn = connections.value.find((c) => c.uid === connectionUid);
        if (!conn) return;
        const node = conn.autoNodes[autoNodeIndex];
        if (!node || node.kind === 'bridge') return;
        node.mode = node.mode === 'auto' ? 'cut' : 'auto';
    }

    function clearAllConnections() {
        connections.value = [];
        draftConnection.value = null;
        editingConnectionUid.value = null;
        const editorStore = useEditorStore();
        editorStore.edges = editorStore.edges.filter((e) => !e.id.startsWith('pipeline-'));
    }

    return {
        connections,
        isPipelineMode,
        draftConnection,
        editingConnectionUid,
        hasActiveConnection,
        isEditing,
        togglePipelineMode,
        addConnection,
        deleteConnection,
        onVueFlowConnect,
        startConnection,
        updateCursorPos,
        addWaypoint,
        cancelDraft,
        validatePath,
        startEditConnection,
        finishEditConnection,
        toggleAutoNodeMode,
        clearAllConnections,
    };
});