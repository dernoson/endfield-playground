<script setup lang="ts">
// src/editor/canvas/PipelineRenderer.vue
// CR-02: 管線渲染組件
// 注意：waypoints / cursorPos 均為相對於畫布容器的螢幕座標（px），非格子座標

import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePipelineStore } from '@/store/pipelineStore';
import type { Connection } from '@/types/pipeline';

const pipelineStore = usePipelineStore();
const { connections, draftConnection, isPipelineMode, editingConnectionUid } =
    storeToRefs(pipelineStore);

/** 將點陣列轉換為 SVG polyline points 字串 */
function toPolylinePoints(pts: { x: number; y: number }[]): string {
    return pts.map((p) => `${p.x},${p.y}`).join(' ');
}

/** 生成已確認管線的 polyline points（目前 waypoints 即螢幕座標） */
function getConnectionPoints(conn: Connection): string {
    if (conn.waypoints.length < 2) return '';
    return toPolylinePoints(conn.waypoints);
}

/** 繪製中管線的完整點列（waypoints + 目前游標位置） */
const draftPoints = computed(() => {
    if (!draftConnection.value) return '';
    const pts = [...draftConnection.value.waypoints, draftConnection.value.cursorPos];
    if (pts.length < 2) return '';
    return toPolylinePoints(pts);
});

function getColor(type: 'conveyor' | 'pipe'): string {
    return type === 'conveyor' ? '#fb923c' : '#3b82f6';
}

function connClass(conn: Connection): Record<string, boolean> {
    return {
        'pipeline-highlighted': isPipelineMode.value,
        'pipeline-editing': editingConnectionUid.value === conn.uid,
    };
}

function handleConnectionClick(conn: Connection) {
    if (!isPipelineMode.value) return;
    pipelineStore.startEditConnection(conn.uid);
}
</script>

<template>
    <!--
        absolute inset-0：完整覆蓋父容器（FactoryCanvas 的 relative div）
        pointer-events-none：預設不攔截，子元素視需要加回 pointer-events-auto
    -->
    <svg class="pipeline-layer pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <!-- ── 已確認的管線 ── -->
        <g v-for="conn in connections" :key="conn.uid">
            <polyline
                v-if="conn.waypoints.length >= 2"
                :points="getConnectionPoints(conn)"
                :stroke="getColor(conn.type)"
                :class="connClass(conn)"
                class="pipeline pointer-events-auto cursor-pointer"
                stroke-width="3"
                fill="none"
                stroke-linejoin="round"
                stroke-linecap="round"
                @click="handleConnectionClick(conn)"
            />

            <!-- 彎折點（編輯模式下顯示） -->
            <g v-if="editingConnectionUid === conn.uid">
                <circle
                    v-for="(wp, i) in conn.waypoints"
                    :key="`wp-${i}`"
                    :cx="wp.x"
                    :cy="wp.y"
                    r="6"
                    fill="#a78bfa"
                    stroke="#ffffff"
                    stroke-width="2"
                    class="waypoint pointer-events-auto cursor-move"
                />
            </g>

            <!-- 自動節點標記 -->
            <circle
                v-for="(autoNode, i) in conn.autoNodes"
                :key="`auto-${i}`"
                :cx="autoNode.gridPos.x"
                :cy="autoNode.gridPos.y"
                r="8"
                :fill="autoNode.kind === 'bridge' ? '#6366f1' : '#f59e0b'"
                stroke="#ffffff"
                stroke-width="2"
                class="auto-node pointer-events-auto cursor-pointer"
            />
        </g>

        <!-- ── 繪製中的管線（虛線預覽） ── -->
        <g v-if="draftConnection && draftPoints">
            <polyline
                :points="draftPoints"
                :stroke="getColor(draftConnection.type)"
                :class="{ 'pipeline-invalid': draftConnection.hasInvalidSegment }"
                class="pipeline-draft"
                stroke-width="3"
                stroke-dasharray="8 4"
                fill="none"
                stroke-linejoin="round"
                stroke-linecap="round"
            />

            <!-- 已放置的彎折點 -->
            <circle
                v-for="(wp, i) in draftConnection.waypoints"
                :key="`draft-wp-${i}`"
                :cx="wp.x"
                :cy="wp.y"
                r="6"
                :fill="draftConnection.hasInvalidSegment ? '#ef4444' : '#a78bfa'"
                stroke="#ffffff"
                stroke-width="2"
            />

            <!-- 游標端點 -->
            <circle
                :cx="draftConnection.cursorPos.x"
                :cy="draftConnection.cursorPos.y"
                r="5"
                :fill="getColor(draftConnection.type)"
                stroke="#ffffff"
                stroke-width="2"
                opacity="0.7"
            />
        </g>
    </svg>
</template>

<style scoped>
.pipeline-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
}

.pipeline {
    transition: stroke-width 0.15s;
}

.pipeline:hover {
    stroke-width: 5;
}

.pipeline-highlighted {
    stroke-width: 4;
    filter: brightness(1.4);
}

.pipeline-editing {
    stroke-width: 5;
    filter: brightness(1.6);
}

.pipeline-draft {
    opacity: 0.85;
}

.pipeline-invalid {
    stroke: #ef4444 !important;
    animation: blink 0.8s ease-in-out infinite;
}

@keyframes blink {
    0%,
    100% {
        opacity: 0.9;
    }
    50% {
        opacity: 0.3;
    }
}

.waypoint {
    transition: r 0.15s;
}
.waypoint:hover {
    r: 9;
}

.auto-node {
    transition: r 0.15s;
}
.auto-node:hover {
    r: 11;
}
</style>
