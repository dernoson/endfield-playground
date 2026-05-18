// src/store/pipelineStore.ts
// CR-02: 管線連接狀態管理

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type {
    Connection,
    DraftConnection,
    PipelineType,
    AutoNode,
    PathValidation,
    MidpointTarget,
    CrossingInfo,
} from '@/types/pipeline';

export const usePipelineStore = defineStore('pipeline', () => {
    // ========== State ==========
    const connections = ref<Connection[]>([]);
    const isPipelineMode = ref(false);
    const draftConnection = ref<DraftConnection | null>(null);
    const editingConnectionUid = ref<string | null>(null);

    // ========== Computed ==========
    const activeConnections = computed(() => connections.value);
    const hasActiveConnection = computed(() => draftConnection.value !== null);
    const isEditing = computed(() => editingConnectionUid.value !== null);

    // ========== Actions ==========

    /**
     * 切換管線模式
     */
    function togglePipelineMode() {
        isPipelineMode.value = !isPipelineMode.value;
        if (!isPipelineMode.value) {
            draftConnection.value = null; // 取消進行中的繪製
            editingConnectionUid.value = null; // 退出編輯狀態
        }
    }

    /**
     * 開始繪製管線
     */
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

    /**
     * 更新游標位置
     */
    function updateCursorPos(pos: { x: number; y: number }) {
        if (!draftConnection.value) return;
        draftConnection.value.cursorPos = pos;
    }

    /**
     * 新增彎折點
     */
    function addWaypoint(pos: { x: number; y: number }) {
        if (!draftConnection.value) return;
        draftConnection.value.waypoints.push({ ...pos });
    }

    /**
     * 更新彎折點位置
     */
    function updateWaypoint(index: number, pos: { x: number; y: number }) {
        if (!draftConnection.value) return;
        if (index < 0 || index >= draftConnection.value.waypoints.length) return;
        draftConnection.value.waypoints[index] = { ...pos };
    }

    /**
     * 刪除彎折點
     */
    function removeWaypoint(index: number) {
        if (!draftConnection.value) return;
        draftConnection.value.waypoints.splice(index, 1);
    }

    /**
     * 驗證路徑是否全為 90 度轉角（無斜線）
     */
    function validatePath(points: { x: number; y: number }[]): PathValidation {
        const invalidIndices: number[] = [];

        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;

            // 斜線：dx 與 dy 同時非零
            if (dx !== 0 && dy !== 0) {
                invalidIndices.push(i);
            }
        }

        return {
            valid: invalidIndices.length === 0,
            invalidIndices,
        };
    }

    /**
     * 更新 draft connection 的驗證狀態
     */
    function updateDraftValidation(startPos: { x: number; y: number }) {
        if (!draftConnection.value) return;

        const allPoints = [
            startPos,
            ...draftConnection.value.waypoints,
            draftConnection.value.cursorPos,
        ];

        const validation = validatePath(allPoints);
        draftConnection.value.hasInvalidSegment = !validation.valid;
    }

    /**
     * 確認放置管線
     */
    function finalizeConnection(
        toDeviceUid: string,
        toPortId: string,
        autoNodes: AutoNode[] = [],
    ) {
        if (!draftConnection.value || draftConnection.value.hasInvalidSegment) {
            return null;
        }

        const newConnection: Connection = {
            uid: `conn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            type: draftConnection.value.type,
            from: {
                deviceUid: draftConnection.value.fromDeviceUid,
                portId: draftConnection.value.fromPortId,
            },
            to: {
                deviceUid: toDeviceUid,
                portId: toPortId,
            },
            waypoints: [...draftConnection.value.waypoints],
            autoNodes,
        };

        connections.value.push(newConnection);
        draftConnection.value = null;

        return newConnection;
    }

    /**
     * 取消當前管線繪製
     */
    function cancelDraft() {
        draftConnection.value = null;
    }

    /**
     * 開始編輯已放置的管線
     */
    function startEditConnection(connectionUid: string) {
        editingConnectionUid.value = connectionUid;
    }

    /**
     * 結束編輯管線
     */
    function finishEditConnection() {
        const conn = connections.value.find((c) => c.uid === editingConnectionUid.value);
        if (!conn) {
            editingConnectionUid.value = null;
            return false;
        }

        // 驗證路徑
        // TODO: 需要獲取起終點的絕對座標
        // 這裡簡化處理，實際應該從 device store 獲取
        const validation = validatePath(conn.waypoints);
        if (!validation.valid) {
            return false; // 有斜線，不允許退出編輯
        }

        editingConnectionUid.value = null;
        return true;
    }

    /**
     * 刪除管線
     */
    function deleteConnection(connectionUid: string) {
        const index = connections.value.findIndex((c) => c.uid === connectionUid);
        if (index !== -1) {
            connections.value.splice(index, 1);
        }
    }

    /**
     * 切換自動節點模式（分流器/匯流器的 auto/cut 切換）
     */
    function toggleAutoNodeMode(connectionUid: string, autoNodeIndex: number) {
        const conn = connections.value.find((c) => c.uid === connectionUid);
        if (!conn || autoNodeIndex < 0 || autoNodeIndex >= conn.autoNodes.length) {
            return;
        }

        const node = conn.autoNodes[autoNodeIndex];
        if (node.kind === 'bridge') {
            return; // 物流橋不可切換
        }

        node.mode = node.mode === 'auto' ? 'cut' : 'auto';

        // TODO: 依新模式重新計算管線結構
        // rebuildConnectionsAroundNode(connectionUid, autoNodeIndex)
    }

    /**
     * 檢查點是否在線段上
     */
    function isPointOnSegment(
        point: { x: number; y: number },
        segment: { start: { x: number; y: number }; end: { x: number; y: number } },
        tolerance = 0.5,
    ): boolean {
        const { start, end } = segment;

        // 計算點到線段的距離
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length === 0) return false;

        const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / (length * length);

        if (t < 0 || t > 1) return false;

        const projX = start.x + t * dx;
        const projY = start.y + t * dy;
        const distance = Math.sqrt(
            (point.x - projX) * (point.x - projX) + (point.y - projY) * (point.y - projY),
        );

        return distance <= tolerance;
    }

    /**
     * 檢查目標位置是否在現有管線中途
     */
    function checkMidpointTarget(
        targetPos: { x: number; y: number },
    ): MidpointTarget | null {
        for (const conn of connections.value) {
            // TODO: 需要將 waypoints 轉換為實際線段
            // 這裡簡化處理
            for (let i = 0; i < conn.waypoints.length - 1; i++) {
                const segment = {
                    start: conn.waypoints[i],
                    end: conn.waypoints[i + 1],
                };

                if (isPointOnSegment(targetPos, segment)) {
                    return {
                        connection: conn,
                        segmentIndex: i,
                    };
                }
            }
        }

        return null;
    }

    /**
     * 檢測兩條線段是否交叉
     */
    function findCrossing(
        newSegment: { start: { x: number; y: number }; end: { x: number; y: number } },
        existingConnection: Connection,
    ): CrossingInfo | null {
        // TODO: 實現線段交叉檢測邏輯
        // 需要將 connection 的 waypoints 轉換為線段列表
        // 然後檢測 newSegment 是否與任一線段交叉
        return null;
    }

    /**
     * 清空所有管線
     */
    function clearAllConnections() {
        connections.value = [];
        draftConnection.value = null;
        editingConnectionUid.value = null;
    }

    return {
        // State
        connections,
        isPipelineMode,
        draftConnection,
        editingConnectionUid,

        // Computed
        activeConnections,
        hasActiveConnection,
        isEditing,

        // Actions
        togglePipelineMode,
        startConnection,
        updateCursorPos,
        addWaypoint,
        updateWaypoint,
        removeWaypoint,
        validatePath,
        updateDraftValidation,
        finalizeConnection,
        cancelDraft,
        startEditConnection,
        finishEditConnection,
        deleteConnection,
        toggleAutoNodeMode,
        isPointOnSegment,
        checkMidpointTarget,
        findCrossing,
        clearAllConnections,
    };
});
