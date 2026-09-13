/**
 * resolveConnections 單元測試
 * 測試對象：src/utils/layout/resolveConnections.ts
 */

import { describe, it, expect } from 'vitest';
import type { Machine } from '@/types/machine';
import type { PlacedDevice, Pipeline } from '@/types/layout';
import { resolvePortAnchorCell } from '@/utils/layout/portAnchors';
import { resolveDisplayGrid, rotatePort } from '@/utils/portUtils';
import { getMachineMode } from '@/types/machine';
import { resolveConnections } from '@/utils/layout/resolveConnections';

/** 1×1：左入、右出（belt） */
function stubMachine1x1(): Machine {
    return {
        id: 'stub_1x1',
        name: 'stub',
        width: 1,
        height: 1,
        power: 0,
        tags: [],
        is_source: false,
        is_sink: false,
        modes: [
            {
                id: 'default',
                label: '預設',
                input_ports: [{ side: 'left', offset: 0, media: 'belt' }],
                output_ports: [{ side: 'right', offset: 0, media: 'belt' }],
                loss: null,
            },
        ],
        onTick: null,
        onInput: null,
        onOutput: null,
        calcEfficiency: null,
    };
}

const getStub = (): ((id: string) => Machine | undefined) => {
    const def = stubMachine1x1();
    return (id) => (id === def.id ? def : undefined);
};

/** 算出設備某埠旋轉後的外側錨點（含 z，供組 waypoints） */
function portAnchor(
    device: PlacedDevice,
    machine: Machine,
    portType: 'input' | 'output',
    portIndex: number,
    z: number,
): { x: number; y: number; z: number } {
    const mode = getMachineMode(machine, device.machineMode);
    const ports = portType === 'input' ? mode.input_ports : mode.output_ports;
    const port = ports[portIndex];
    const rotated = rotatePort(
        port.side,
        port.offset,
        machine.width,
        machine.height,
        device.rotation,
    );
    const display = resolveDisplayGrid(machine.width, machine.height, device.rotation);
    const cell = resolvePortAnchorCell(
        device.position.x,
        device.position.y,
        display.widthCells,
        display.heightCells,
        rotated.side,
        rotated.offset,
    );
    return { x: cell.x, y: cell.y, z };
}

describe('resolveConnections', () => {
    const machine = stubMachine1x1();
    const getMachine = getStub();

    it('兩端對齊埠錨點 → 完整 Connection；id＝pipelineId', () => {
        const source: PlacedDevice = {
            id: 'src',
            machineType: 'stub_1x1',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
        };
        const target: PlacedDevice = {
            id: 'dst',
            machineType: 'stub_1x1',
            position: { x: 4, y: 0, z: 0 },
            rotation: 0,
        };

        const start = portAnchor(source, machine, 'output', 0, 0);
        const end = portAnchor(target, machine, 'input', 0, 0);
        /** source 右錨 (1,0)；target 左錨 (3,0) */
        expect(start).toEqual({ x: 1, y: 0, z: 0 });
        expect(end).toEqual({ x: 3, y: 0, z: 0 });

        const pipeline: Pipeline = {
            id: 'p1',
            media: 'belt',
            waypoints: [start, { x: 2, y: 0, z: 0 }, end],
        };

        const [conn] = resolveConnections([source, target], [pipeline], getMachine);

        expect(conn).toEqual({
            id: 'p1',
            pipelineId: 'p1',
            from: { deviceId: 'src', portType: 'output', portIndex: 0 },
            to: { deviceId: 'dst', portType: 'input', portIndex: 0 },
        });
    });

    it('端點錯位 → 斷線（from／to 為 null）；pipeline 仍對應一筆 Connection', () => {
        const source: PlacedDevice = {
            id: 'src',
            machineType: 'stub_1x1',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
        };
        const pipeline: Pipeline = {
            id: 'p-broken',
            media: 'belt',
            waypoints: [
                { x: 99, y: 99, z: 0 },
                { x: 100, y: 99, z: 0 },
            ],
        };

        const [conn] = resolveConnections([source], [pipeline], getMachine);

        expect(conn.id).toBe('p-broken');
        expect(conn.from).toBeNull();
        expect(conn.to).toBeNull();
    });

    it('刪設備後僅剩管線 → 兩端 null（管線仍產出 Connection）', () => {
        const orphan: Pipeline = {
            id: 'orphan',
            media: 'belt',
            waypoints: [
                { x: 1, y: 0, z: 0 },
                { x: 3, y: 0, z: 0 },
            ],
        };

        const [conn] = resolveConnections([], [orphan], getMachine);

        expect(conn).toEqual({
            id: 'orphan',
            pipelineId: 'orphan',
            from: null,
            to: null,
        });
    });

    it('僅一端對上 → 另一端 null', () => {
        const source: PlacedDevice = {
            id: 'src',
            machineType: 'stub_1x1',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
        };
        const start = portAnchor(source, machine, 'output', 0, 0);
        const pipeline: Pipeline = {
            id: 'half',
            media: 'belt',
            waypoints: [start, { x: 5, y: 0, z: 0 }],
        };

        const [conn] = resolveConnections([source], [pipeline], getMachine);

        expect(conn.from).toEqual({
            deviceId: 'src',
            portType: 'output',
            portIndex: 0,
        });
        expect(conn.to).toBeNull();
    });

    it('空 waypoints → 兩端 null', () => {
        const pipeline: Pipeline = { id: 'empty', media: 'belt', waypoints: [] };
        const [conn] = resolveConnections([], [pipeline], getMachine);
        expect(conn.from).toBeNull();
        expect(conn.to).toBeNull();
    });

    it('旋轉後埠錨點仍可對齊', () => {
        /** rotation=1：原 right 出 → 旋轉後在 bottom */
        const source: PlacedDevice = {
            id: 'src',
            machineType: 'stub_1x1',
            position: { x: 2, y: 2, z: 0 },
            rotation: 1,
        };
        const target: PlacedDevice = {
            id: 'dst',
            machineType: 'stub_1x1',
            position: { x: 2, y: 5, z: 0 },
            rotation: 1,
        };

        const start = portAnchor(source, machine, 'output', 0, 0);
        const end = portAnchor(target, machine, 'input', 0, 0);

        const pipeline: Pipeline = {
            id: 'rot',
            media: 'belt',
            waypoints: [start, end],
        };

        const [conn] = resolveConnections([source, target], [pipeline], getMachine);

        expect(conn.from).toEqual({
            deviceId: 'src',
            portType: 'output',
            portIndex: 0,
        });
        expect(conn.to).toEqual({
            deviceId: 'dst',
            portType: 'input',
            portIndex: 0,
        });
    });
});
