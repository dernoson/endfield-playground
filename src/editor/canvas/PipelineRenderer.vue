<script setup lang="ts">
// src/editor/canvas/PipelineRenderer.vue
// CR-02: 管線渲染組件

import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useVueFlow } from '@vue-flow/core';
import { usePipelineStore } from '@/store/pipelineStore';
import type { Connection } from '@/types/pipeline';
import { generatePathString } from '@/utils/pipelineUtils';

const pipelineStore = usePipelineStore();
const { connections, draftConnection, isPipelineMode, editingConnectionUid } =
    storeToRefs(pipelineStore);

// 使用 VueFlow 提供的座標轉換，與畫布 pan/zoom 保持同步
const { flowToScreenCoordinate } = useVueFlow();

interface Props {
    gridSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
    gridSize: 32,
});

/**
 * 將格子座標轉換為畫面座標（透過 VueFlow 的座標系統）
 */
function gridToSvg(gridX: number, gridY: number): { x: number; y: number } {
    // 格子中心點的 flow 座標
    const flowX = gridX * props.gridSize + props.gridSize / 2;
    const flowY = gridY * props.gridSize + props.gridSize / 2;
    return flowToScreenCoordinate({ x: flowX, y: flowY });
}

/**
 * 生成管線路徑（已確認的管線）
 */
function getConnectionPath(connection: Connection): string {
    // TODO: 需要從設備 store 獲取起終點的實際座標
    // 這裡簡化處理，假設起終點就是 waypoints 的首尾
    if (connection.waypoints.length === 0) {
        return '';
    }

    const svgPoints = connection.waypoints.map((wp) => gridToSvg(wp.x, wp.y));
    return generatePathString(svgPoints);
}

/**
 * 生成繪製中管線的路徑
 */
const draftPath = computed(() => {
    if (!draftConnection.value) {
        return '';
    }

    const points = [
        // TODO: 應該從設備獲取起點座標
        // 這裡簡化處理
        ...draftConnection.value.waypoints.map((wp) => gridToSvg(wp.x, wp.y)),
        {
            x: draftConnection.value.cursorPos.x,
            y: draftConnection.value.cursorPos.y,
        },
    ];

    return generatePathString(points);
});

/**
 * 獲取管線顏色（根據 type）
 */
function getConnectionColor(type: 'conveyor' | 'pipe'): string {
    return type === 'conveyor' ? '#fb923c' : '#3b82f6'; // 橘色 / 藍色
}

/**
 * 獲取管線樣式類名
 */
function getConnectionClass(connection: Connection): string {
    const classes = ['pipeline'];

    // 管線模式高亮
    if (isPipelineMode.value) {
        classes.push('pipeline-highlighted');
    }

    // 編輯中高亮
    if (editingConnectionUid.value === connection.uid) {
        classes.push('pipeline-editing');
    }

    return classes.join(' ');
}

/**
 * 點擊管線（進入編輯狀態）
 */
function handleConnectionClick(connection: Connection) {
    if (!isPipelineMode.value) {
        return;
    }

    pipelineStore.startEditConnection(connection.uid);
}
</script>

<template>
    <svg class="pipeline-layer absolute inset-0 pointer-events-none" style="z-index: 100">
        <!-- 已確認的管線 -->
        <g v-for="connection in connections" :key="connection.uid">
            <path
                :d="getConnectionPath(connection)"
                :stroke="getConnectionColor(connection.type)"
                :class="getConnectionClass(connection)"
                class="pointer-events-auto cursor-pointer"
                stroke-width="3"
                fill="none"
                @click="handleConnectionClick(connection)"
            />

            <!-- 方向箭頭 -->
            <!-- TODO: 在管線中點繪製箭頭 -->

            <!-- 彎折點（編輯模式下顯示） -->
            <g v-if="editingConnectionUid === connection.uid">
                <circle
                    v-for="(waypoint, index) in connection.waypoints"
                    :key="`waypoint-${index}`"
                    :cx="gridToSvg(waypoint.x, waypoint.y).x"
                    :cy="gridToSvg(waypoint.x, waypoint.y).y"
                    r="6"
                    fill="#a78bfa"
                    stroke="#ffffff"
                    stroke-width="2"
                    class="waypoint pointer-events-auto cursor-move"
                />
            </g>

            <!-- 自動節點（分流器/匯流器/物流橋）標記 -->
            <g v-for="(autoNode, index) in connection.autoNodes" :key="`auto-${index}`">
                <circle
                    :cx="gridToSvg(autoNode.gridPos.x, autoNode.gridPos.y).x"
                    :cy="gridToSvg(autoNode.gridPos.y, autoNode.gridPos.y).y"
                    r="8"
                    :fill="autoNode.kind === 'bridge' ? '#6366f1' : '#f59e0b'"
                    stroke="#ffffff"
                    stroke-width="2"
                    class="auto-node pointer-events-auto cursor-pointer"
                />
                <!-- TODO: 顯示圖示或文字標籤 -->
            </g>
        </g>

        <!-- 繪製中的管線 -->
        <g v-if="draftConnection">
            <path
                :d="draftPath"
                :stroke="getConnectionColor(draftConnection.type)"
                :class="{
                    'pipeline-draft': true,
                    'pipeline-invalid': draftConnection.hasInvalidSegment,
                }"
                stroke-width="3"
                stroke-dasharray="5,5"
                fill="none"
            />

            <!-- 已放置的彎折點 -->
            <circle
                v-for="(waypoint, index) in draftConnection.waypoints"
                :key="`draft-waypoint-${index}`"
                :cx="gridToSvg(waypoint.x, waypoint.y).x"
                :cy="gridToSvg(waypoint.x, waypoint.y).y"
                r="6"
                :fill="draftConnection.hasInvalidSegment ? '#ef4444' : '#a78bfa'"
                stroke="#ffffff"
                stroke-width="2"
                class="waypoint"
            />
        </g>
    </svg>
</template>

<style scoped>
.pipeline-layer {
    width: 100%;
    height: 100%;
}

.pipeline {
    transition: stroke-width 0.2s;
}

.pipeline:hover {
    stroke-width: 5;
}

.pipeline-highlighted {
    stroke-width: 4;
    filter: brightness(1.3);
}

.pipeline-editing {
    stroke-width: 5;
    filter: brightness(1.5);
}

.pipeline-draft {
    opacity: 0.8;
}

.pipeline-invalid {
    stroke: #ef4444 !important;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 0.8;
    }
    50% {
        opacity: 0.4;
    }
}

.waypoint {
    transition: r 0.2s;
}

.waypoint:hover {
    r: 8;
}

.auto-node {
    transition:
        r 0.2s,
        opacity 0.2s;
}

.auto-node:hover {
    r: 10;
    opacity: 0.8;
}
</style>