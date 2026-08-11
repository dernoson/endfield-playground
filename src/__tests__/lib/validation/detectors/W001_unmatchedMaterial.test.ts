import { describe, it, expect, vi } from 'vitest';
import { W001_unmatchedMaterial } from '@/lib/validation/detectors/W001_unmatchedMaterial';
import type { ValidationContext } from '@/types/validation';
import type { FactoryNode, FactoryEdge } from '@/types/graph';
import type { Machine } from '@/types/machine';

vi.mock('@/data/products', () => ({
    getRecipesForMachine: vi.fn((machineType: string) => {
        if (machineType === 'test_machine_A') {
            return [{ inputs: [{ itemId: 'itemA', quantity: 1 }], outputs: [] }];
        }
        if (machineType === 'test_machine_B') {
            return [{ inputs: [{ itemId: 'itemB', quantity: 1 }], outputs: [] }];
        }
        if (machineType === 'test_machine_AB') {
            return [
                {
                    inputs: [
                        { itemId: 'itemA', quantity: 1 },
                        { itemId: 'itemB', quantity: 1 },
                    ],
                    outputs: [],
                },
            ];
        }
        if (machineType === 'test_producer_A') {
            return [{ inputs: [], outputs: [{ itemId: 'itemA', quantity: 1 }] }];
        }
        if (machineType === 'test_producer_B') {
            return [{ inputs: [], outputs: [{ itemId: 'itemB', quantity: 1 }] }];
        }
        return [];
    }),
}));

vi.mock('@/data/machines', () => ({
    getMachine: vi.fn((machineType: string): Machine | undefined => {
        if (machineType === '分流器') {
            return {
                id: 'splitter',
                name: '分流器',
                width: 1,
                height: 1,
                input_ports: [{ side: 'top', offset: 0, type: 'item' }],
                output_ports: [{ side: 'bottom', offset: 0, type: 'item' }],
                power: 0,
                tags: [],
                is_source: false,
                is_sink: false,
                onTick: null,
                onInput: null,
                onOutput: null,
                calcEfficiency: null,
            };
        }
        return {
            id: machineType,
            name: machineType,
            width: 1,
            height: 1,
            input_ports: [{ side: 'top', offset: 0, type: 'item' }],
            output_ports: [{ side: 'bottom', offset: 0, type: 'item' }],
            power: 10,
            tags: [],
            is_source: false,
            is_sink: false,
            onTick: null,
            onInput: null,
            onOutput: null,
            calcEfficiency: null,
        };
    }),
}));

describe('W001_unmatchedMaterial', () => {
    function createDevice(id: string, machineType: string, recipeIndex = 0): FactoryNode {
        return {
            id,
            type: 'factory-node',
            position: { x: 0, y: 0 },
            data: {
                label: machineType,
                machineType,
                recipeIndex,
            },
        };
    }

    function createContext(devices: FactoryNode[], connections: FactoryEdge[]): ValidationContext {
        return {
            devices,
            connections,
            getDef: () => undefined,
            baseRegion: null as any,
        };
    }

    it('T1：無設備時不應產生錯誤', () => {
        const ctx = createContext([], []);
        const alerts = W001_unmatchedMaterial.run(ctx);
        expect(alerts).toHaveLength(0);
    });

    it('T2：完全匹配（上游產 A，下游需 A），不觸發 W001', () => {
        const prodA = createDevice('prodA', 'test_producer_A');
        const machA = createDevice('machA', 'test_machine_A');
        const edge: FactoryEdge = {
            id: 'e1',
            source: 'prodA',
            target: 'machA',
            sourceHandle: null,
            targetHandle: null,
            data: { portType: 'item' },
        };
        const ctx = createContext([prodA, machA], [edge]);
        const alerts = W001_unmatchedMaterial.run(ctx);
        expect(alerts).toHaveLength(0);
    });

    it('T3：完全不符（上游產 B，下游需 A），觸發 W001', () => {
        const prodB = createDevice('prodB', 'test_producer_B');
        const machA = createDevice('machA', 'test_machine_A');
        const edge: FactoryEdge = {
            id: 'e1',
            source: 'prodB',
            target: 'machA',
            sourceHandle: null,
            targetHandle: null,
            data: { portType: 'item' },
        };
        const ctx = createContext([prodB, machA], [edge]);
        const alerts = W001_unmatchedMaterial.run(ctx);

        expect(alerts).toHaveLength(1);
        expect(alerts[0].code).toBe('W001');
        expect(alerts[0].relatedDeviceUids).toContain('machA');
    });

    it('T4：穿透分流器匹配（上游產 A -> 分流器 -> 下游需 A），不觸發 W001', () => {
        const prodA = createDevice('prodA', 'test_producer_A');
        const splitter = createDevice('split1', '分流器');
        const machA = createDevice('machA', 'test_machine_A');
        const edge1: FactoryEdge = {
            id: 'e1',
            source: 'prodA',
            target: 'split1',
            sourceHandle: null,
            targetHandle: null,
            data: { portType: 'item' },
        };
        const edge2: FactoryEdge = {
            id: 'e2',
            source: 'split1',
            target: 'machA',
            sourceHandle: null,
            targetHandle: null,
            data: { portType: 'item' },
        };

        const ctx = createContext([prodA, splitter, machA], [edge1, edge2]);
        const alerts = W001_unmatchedMaterial.run(ctx);
        expect(alerts).toHaveLength(0);
    });

    it('T5：穿透分流器不符（上游產 B -> 分流器 -> 下游需 A），觸發 W001', () => {
        const prodB = createDevice('prodB', 'test_producer_B');
        const splitter = createDevice('split1', '分流器');
        const machA = createDevice('machA', 'test_machine_A');
        const edge1: FactoryEdge = {
            id: 'e1',
            source: 'prodB',
            target: 'split1',
            sourceHandle: null,
            targetHandle: null,
            data: { portType: 'item' },
        };
        const edge2: FactoryEdge = {
            id: 'e2',
            source: 'split1',
            target: 'machA',
            sourceHandle: null,
            targetHandle: null,
            data: { portType: 'item' },
        };

        const ctx = createContext([prodB, splitter, machA], [edge1, edge2]);
        const alerts = W001_unmatchedMaterial.run(ctx);

        expect(alerts).toHaveLength(1);
        expect(alerts[0].code).toBe('W001');
        expect(alerts[0].relatedDeviceUids).toContain('machA');
    });

    it('T6：未連接入邊不應觸發 W001（交由 E004 處理）', () => {
        const machA = createDevice('machA', 'test_machine_A');
        const ctx = createContext([machA], []);
        const alerts = W001_unmatchedMaterial.run(ctx);
        expect(alerts).toHaveLength(0);
    });
});
