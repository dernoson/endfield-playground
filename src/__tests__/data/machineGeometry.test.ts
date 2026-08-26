/**
 * V10-B1 — 機器佔格與埠合法性
 *
 * 對全部 machineList × rotation ∈ {0,1,2,3} 斷言：
 * 1. getOccupiedCells 格數＝旋轉後寬×高，且四角落在預期矩形內
 * 2. 各 mode 埠經 rotate 後 offset 不得超出對應邊（不得靠 clamp 掩蓋）
 *
 * 本檔不修資料；失敗案例供錯機清單（V10-C1）轉錄。
 */

import { describe, it, expect } from 'vitest';
import { machineList } from '@/data/machines';
import type { Machine } from '@/types/machine';
import type { FactoryNode } from '@/types/graph';
import { getOccupiedCells } from '@/utils/geometryUtils';
import { rotatePortSide, rotatePortOffset } from '@/utils/portUtils';
import { resolveDisplayGrid, clampPortOffset } from '@/app/dev/topologyPortUtils';

type Rotation = 0 | 1 | 2 | 3;
const ROTATIONS: Rotation[] = [0, 1, 2, 3];

function makeFakeNode(machine: Machine, rotation: Rotation): FactoryNode {
    return {
        id: `geo-${machine.id}`,
        position: { x: 0, y: 0 },
        data: {
            label: machine.name,
            machineType: machine.name,
            rotation,
        },
    } as FactoryNode;
}

function expectedFootprint(machine: Machine, rotation: Rotation): {
    width: number;
    height: number;
    cellCount: number;
} {
    const display = resolveDisplayGrid(machine.width, machine.height, rotation);
    return {
        width: display.widthCells,
        height: display.heightCells,
        cellCount: display.widthCells * display.heightCells,
    };
}

describe('machineGeometry', () => {
    describe.each(machineList)('$id $name', (machine) => {
        it.each(ROTATIONS)('rotation=%s occupied cell count and corners', (rotation) => {
            const node = makeFakeNode(machine, rotation);
            const cells = getOccupiedCells(node, machine);
            const { width, height, cellCount } = expectedFootprint(machine, rotation);

            expect(
                cells.size,
                `[${machine.id}] rotation=${rotation} occupied size !== ${width}×${height}`,
            ).toBe(cellCount);

            const corners = [
                '0,0',
                `${width - 1},0`,
                `0,${height - 1}`,
                `${width - 1},${height - 1}`,
            ];
            for (const corner of corners) {
                expect(
                    cells.has(corner),
                    `[${machine.id}] rotation=${rotation} missing corner ${corner}`,
                ).toBe(true);
            }
        });

        it.each(ROTATIONS)('rotation=%s port offsets in-range (no clamp)', (rotation) => {
            const display = resolveDisplayGrid(machine.width, machine.height, rotation);

            for (const mode of machine.modes) {
                const ports = [
                    ...mode.input_ports.map((p, i) => ({ ...p, kind: 'in' as const, index: i })),
                    ...mode.output_ports.map((p, i) => ({ ...p, kind: 'out' as const, index: i })),
                ];

                for (const port of ports) {
                    const rotatedSide = rotatePortSide(port.side, rotation);
                    const rotatedOffset = rotatePortOffset(
                        port.side,
                        port.offset,
                        machine.width,
                        machine.height,
                        rotation,
                    );
                    const { wasClamped } = clampPortOffset(
                        rotatedSide,
                        rotatedOffset,
                        display.widthCells,
                        display.heightCells,
                    );

                    expect(
                        wasClamped,
                        [
                            `[${machine.id}]`,
                            `mode=${mode.id}`,
                            `${port.kind}[${port.index}]`,
                            `side=${port.side}@${port.offset}`,
                            `rotation=${rotation}`,
                            `→ ${rotatedSide}@${rotatedOffset}`,
                            `display=${display.widthCells}×${display.heightCells}`,
                            'offset out of range (would clamp)',
                        ].join(' '),
                    ).toBe(false);
                }
            }
        });
    });
});
