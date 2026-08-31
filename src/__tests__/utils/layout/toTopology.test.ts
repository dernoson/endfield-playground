/**
 * toTopology 單元測試
 * 測試對象：src/utils/layout/toTopology.ts
 */

import { describe, it, expect } from 'vitest';
import type { Machine } from '@/types/machine';
import type { Connection, PlacedDevice, Pipeline } from '@/types/layout';
import { buildGraph } from '@/composables/useFlowEngine';
import { toTopology } from '@/utils/layout/toTopology';

function stubMachine(id: string, name: string): Machine {
    return {
        id,
        name,
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

const machines = new Map([
    ['stub_a', stubMachine('stub_a', '設備A')],
    ['stub_b', stubMachine('stub_b', '設備B')],
]);

const getMachine = (id: string) => machines.get(id);

describe('toTopology', () => {
    const devices: PlacedDevice[] = [
        {
            id: 'dev-a',
            machineType: 'stub_a',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
        },
        {
            id: 'dev-b',
            machineType: 'stub_b',
            position: { x: 4, y: 0, z: 0 },
            rotation: 0,
            machineMode: 'default',
        },
    ];

    it('兩機＋完整連線 → nodes／edges 可被 buildGraph 接受', () => {
        const pipeline: Pipeline = {
            id: 'p1',
            media: 'belt',
            waypoints: [
                { x: 1, y: 0, z: 0 },
                { x: 2, y: 0, z: 0 },
                { x: 3, y: 0, z: 0 },
            ],
        };
        const connections: Connection[] = [
            {
                id: 'p1',
                pipelineId: 'p1',
                from: { deviceId: 'dev-a', portType: 'output', portIndex: 0 },
                to: { deviceId: 'dev-b', portType: 'input', portIndex: 0 },
            },
        ];

        const { nodes, edges } = toTopology(devices, [pipeline], connections, getMachine);

        expect(nodes).toHaveLength(2);
        expect(nodes[0]).toMatchObject({
            id: 'dev-a',
            position: { x: 0, y: 0 },
            data: {
                label: '設備A',
                machineType: 'stub_a',
                rotation: 0,
            },
        });
        expect(edges).toHaveLength(1);
        expect(edges[0]).toMatchObject({
            id: 'p1',
            type: 'pipeline',
            source: 'dev-a',
            target: 'dev-b',
            sourceHandle: 'out-0',
            targetHandle: 'in-0',
            data: {
                portType: 'belt',
                bendPoints: [{ x: 2, y: 0 }],
            },
        });

        const graph = buildGraph(nodes, edges);
        expect(graph.nodes.has('dev-a')).toBe(true);
        expect(graph.nodes.has('dev-b')).toBe(true);
        expect(graph.edgeMeta.has('p1')).toBe(true);
        expect(graph.outEdges.get('dev-a')).toEqual(['p1']);
        expect(graph.inEdges.get('dev-b')).toEqual(['p1']);
    });

    it('斷線（任一端 null）→ 不進 edges；nodes 仍完整', () => {
        const pipeline: Pipeline = {
            id: 'orphan',
            media: 'pipe',
            waypoints: [
                { x: 1, y: 0, z: 0 },
                { x: 3, y: 0, z: 0 },
            ],
        };
        const connections: Connection[] = [
            {
                id: 'orphan',
                pipelineId: 'orphan',
                from: { deviceId: 'dev-a', portType: 'output', portIndex: 0 },
                to: null,
            },
        ];

        const { nodes, edges } = toTopology(devices, [pipeline], connections, getMachine);

        expect(nodes).toHaveLength(2);
        expect(edges).toHaveLength(0);
    });

    it('兩端皆 null → 不進 edges', () => {
        const { edges } = toTopology(
            devices,
            [{ id: 'x', media: 'belt', waypoints: [] }],
            [{ id: 'x', pipelineId: 'x', from: null, to: null }],
            getMachine,
        );
        expect(edges).toHaveLength(0);
    });

    it('無中間點時 bendPoints 省略', () => {
        const pipeline: Pipeline = {
            id: 'short',
            media: 'belt',
            waypoints: [
                { x: 1, y: 0, z: 0 },
                { x: 3, y: 0, z: 0 },
            ],
        };
        const connections: Connection[] = [
            {
                id: 'short',
                pipelineId: 'short',
                from: { deviceId: 'dev-a', portType: 'output', portIndex: 0 },
                to: { deviceId: 'dev-b', portType: 'input', portIndex: 0 },
            },
        ];

        const { edges } = toTopology(devices, [pipeline], connections, getMachine);
        expect(edges[0].data?.bendPoints).toBeUndefined();
    });
});
