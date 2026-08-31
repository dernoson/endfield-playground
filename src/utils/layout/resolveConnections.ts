/**
 * 由設備與管線幾何重算衍生連線
 *
 * 管線端點格（waypoints 首／末）與設備埠外側錨點（{@link resolvePortAnchorCell}）  \
 * 座標相等時掛上該埠；任一端無對上則該側為 `null`（斷線），管線本身不刪除。
 *
 * 初稿只做 **xy 幾何對齊**；媒質不相容等規則留驗證期再修。
 */

import type { Connection, PlacedDevice, Pipeline, PortDirection, PortRef } from '@/types/layout';
import type { Machine, PortDef } from '@/types/machine';
import { getMachineMode } from '@/types/machine';
import { getMachineById } from '@/data/machines';
import { resolveDisplayGrid, rotatePort } from '@/utils/portUtils';
import { resolvePortAnchorCell } from '@/utils/layout/portAnchors';

/** 以 machineType（Machine.id）查機器定義 */
export type GetMachineFn = (machineType: string) => Machine | undefined;

/** 預先展開的埠錨點（平面格） */
interface PortAnchorEntry {
    ref: PortRef;
    x: number;
    y: number;
}

/**
 * 展開所有設備的埠外側錨點。
 *
 * 查不到機器定義的設備略過（該機上的埠不會被對上）。
 */
function collectPortAnchors(devices: PlacedDevice[], getMachine: GetMachineFn): PortAnchorEntry[] {
    const anchors: PortAnchorEntry[] = [];

    for (const device of devices) {
        const def = getMachine(device.machineType);
        if (!def) {
            continue;
        }

        const mode = getMachineMode(def, device.machineMode);
        const display = resolveDisplayGrid(def.width, def.height, device.rotation);

        const pushPorts = (ports: readonly PortDef[], portType: PortDirection): void => {
            for (let portIndex = 0; portIndex < ports.length; portIndex++) {
                const port = ports[portIndex];
                const rotated = rotatePort(
                    port.side,
                    port.offset,
                    def.width,
                    def.height,
                    device.rotation,
                );
                const cell = resolvePortAnchorCell(
                    device.position.x,
                    device.position.y,
                    display.widthCells,
                    display.heightCells,
                    rotated.side,
                    rotated.offset,
                );
                anchors.push({
                    ref: {
                        deviceId: device.id,
                        portType,
                        portIndex,
                    },
                    x: cell.x,
                    y: cell.y,
                });
            }
        };

        pushPorts(mode.input_ports, 'input');
        pushPorts(mode.output_ports, 'output');
    }

    return anchors;
}

/**
 * 在錨點表中找 (x, y) 對應的埠。
 *
 * 多個埠同格時：若有 `prefer` 方向優先；否則取掃描順序第一個。
 */
function findPortAt(
    anchors: PortAnchorEntry[],
    x: number,
    y: number,
    prefer?: PortDirection,
): PortRef | null {
    const matches = anchors.filter((a) => a.x === x && a.y === y);
    if (matches.length === 0) {
        return null;
    }
    if (prefer) {
        const preferred = matches.find((m) => m.ref.portType === prefer);
        if (preferred) {
            return preferred.ref;
        }
    }
    return matches[0].ref;
}

/**
 * 重算衍生連線：一條 pipeline → 一條 Connection（id 固定＝pipelineId）。
 *
 * @param devices 已放置設備
 * @param pipelines 管線（含絕對 waypoints）
 * @param getMachine 查機器定義；預設 {@link getMachineById}
 * @returns 與 pipelines 等長、順序對齊的 Connection 陣列
 *
 * @example
 * const connections = resolveConnections(devices, pipelines);
 * // 斷線時 from／to 可為 null；pipelines 陣列不變
 */
export function resolveConnections(
    devices: PlacedDevice[],
    pipelines: Pipeline[],
    getMachine: GetMachineFn = getMachineById,
): Connection[] {
    const anchors = collectPortAnchors(devices, getMachine);

    return pipelines.map((pipeline) => {
        const waypoints = pipeline.waypoints;
        if (waypoints.length === 0) {
            return {
                id: pipeline.id,
                pipelineId: pipeline.id,
                from: null,
                to: null,
            };
        }

        const start = waypoints[0];
        const end = waypoints[waypoints.length - 1];

        /** 起點偏好輸出埠、終點偏好輸入埠（同格多埠時的穩定規則） */
        const from = findPortAt(anchors, start.x, start.y, 'output');
        const to = findPortAt(anchors, end.x, end.y, 'input');

        return {
            id: pipeline.id,
            pipelineId: pipeline.id,
            from,
            to,
        };
    });
}
