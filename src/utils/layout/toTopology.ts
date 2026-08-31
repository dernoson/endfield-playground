/**
 * 佈局模型 → FlowEngine／Vue Flow 相容拓樸（Adapter）
 *
 * 將 `PlacedDevice`／`Pipeline`／衍生 `Connection` 轉成 {@link FactoryNode}／{@link FactoryEdge}，  \
 * **不**改 `useFlowEngine` 本體。節點 `position` 本版先寫**格子座標**（非像素）；  \
 * 引擎入口若仍假設像素，由後續換欄／縮放處理（見檔頭註記）。
 *
 * ## 邊納入規則（測試釘死）
 *
 * - 僅當 `Connection.from` 與 `Connection.to` **皆非 null** 時產出 edge
 * - 斷線管線（任一端 null）**不進** `edges`（pipeline 資料仍可由呼叫端保留）
 */

import type { FactoryEdge, FactoryNode } from '@/types/graph';
import type { Connection, PlacedDevice, Pipeline, PortRef } from '@/types/layout';
import { getMachineById } from '@/data/machines';
import type { GetMachineFn } from '@/utils/layout/resolveConnections';

/** toTopology 輸出 */
export interface TopologyResult {
    /** 與 devices 對應的節點（順序與輸入 devices 一致） */
    nodes: FactoryNode[];
    /** 僅含兩端皆連接的邊 */
    edges: FactoryEdge[];
}

/**
 * 埠參照 → Vue Flow handle id（`out-N`／`in-N`）
 */
function toPortHandle(ref: PortRef): string {
    return ref.portType === 'output' ? `out-${ref.portIndex}` : `in-${ref.portIndex}`;
}

/**
 * PlacedDevice → FactoryNode
 *
 * `data.machineType` 存 {@link Machine.id}（方案 B）。  \
 * `position` 為格子座標（取 device.position 的 x／y；z 不進 Vue Flow Node）。
 */
function toFactoryNode(device: PlacedDevice, getMachine: GetMachineFn): FactoryNode {
    const def = getMachine(device.machineType);
    const label = device.label ?? def?.name ?? device.machineType;

    return {
        id: device.id,
        type: 'default',
        position: { x: device.position.x, y: device.position.y },
        data: {
            label,
            machineType: device.machineType,
            machineMode: device.machineMode,
            recipeIndex: device.recipeIndex,
            environment: device.environment,
            primaryOutput: device.primaryOutput,
            sourceRatePerMin: device.sourceRatePerMin,
            rotation: device.rotation,
        },
    };
}

/**
 * 中間 waypoints → bendPoints（去掉首尾端點格）
 *
 * 座標單位與 node.position 相同（本版＝格）。
 */
function toBendPoints(pipeline: Pipeline): { x: number; y: number }[] | undefined {
    if (pipeline.waypoints.length <= 2) {
        return undefined;
    }
    return pipeline.waypoints.slice(1, -1).map((p) => ({ x: p.x, y: p.y }));
}

/**
 * 將佈局快照轉成引擎可消費的 nodes／edges。
 *
 * @param devices 已放置設備
 * @param pipelines 管線（用於 bendPoints；以 id 索引）
 * @param connections 通常為 {@link resolveConnections} 結果
 * @param getMachine 查機器定義（標籤用）；預設 {@link getMachineById}
 */
export function toTopology(
    devices: PlacedDevice[],
    pipelines: Pipeline[],
    connections: Connection[],
    getMachine: GetMachineFn = getMachineById,
): TopologyResult {
    const pipelineById = new Map(pipelines.map((p) => [p.id, p]));

    const nodes = devices.map((d) => toFactoryNode(d, getMachine));

    const edges: FactoryEdge[] = [];
    for (const conn of connections) {
        if (!conn.from || !conn.to) {
            continue;
        }

        const pipeline = pipelineById.get(conn.pipelineId);
        const bendPoints = pipeline ? toBendPoints(pipeline) : undefined;

        edges.push({
            id: conn.id,
            type: 'pipeline',
            source: conn.from.deviceId,
            target: conn.to.deviceId,
            sourceHandle: toPortHandle(conn.from),
            targetHandle: toPortHandle(conn.to),
            data: {
                portType: pipeline?.media ?? 'belt',
                ...(bendPoints && bendPoints.length > 0 ? { bendPoints } : {}),
            },
        });
    }

    return { nodes, edges };
}
