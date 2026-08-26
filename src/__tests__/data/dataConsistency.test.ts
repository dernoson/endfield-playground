/**
 * V10-B1／R-E1 — 資料一致性（8/30 檢查點）
 *
 * 1. docs/aaaaa/data/machines.json ↔ src/data/machines.ts（排除 codegen stub）
 * 2. 無頂層 input_ports／output_ports
 * 3. width／height 為正整數
 * 4. materials 皆有 form ∈ {solid,liquid,gas}
 * 5. tags ⊆ MACHINE_TAGS
 *
 * 等價於「重跑 codegen 無 diff」的測試層驗法；不在本檔跑 codegen 子程序。
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { machineList, MACHINE_TAGS } from '@/data/machines';
import { getAllMaterials } from '@/data/materials';
import type { Machine, PortDef } from '@/types/machine';

/** FlowEngine 專用 stub：僅存在於 codegen，不在 machines.json */
const CODEGEN_STUB_IDS = new Set(['item_source', 'item_sink']);

interface JsonMachine {
    name: string;
    width: number;
    height: number;
    power: number;
    tags: string[];
    is_source: boolean;
    is_sink: boolean;
    modes: Array<{
        id: string;
        label: string;
        input_ports: PortDef[];
        output_ports: PortDef[];
        loss: unknown;
    }>;
}

const root = join(__dirname, '../../..');
const machinesJson = JSON.parse(
    readFileSync(join(root, 'docs/aaaaa/data/machines.json'), 'utf8'),
) as JsonMachine[];

function portsSignature(ports: readonly PortDef[]): string {
    return ports.map((p) => `${p.side}@${p.offset}:${p.media}`).join('|');
}

function modeSignature(mode: {
    id: string;
    input_ports: readonly PortDef[];
    output_ports: readonly PortDef[];
}): string {
    return [
        mode.id,
        `in:${portsSignature(mode.input_ports)}`,
        `out:${portsSignature(mode.output_ports)}`,
    ].join(';');
}

describe('dataConsistency', () => {
    describe('1. JSON ↔ src/data machines（排除 stub）', () => {
        const fromSrc = machineList.filter((m) => !CODEGEN_STUB_IDS.has(m.id));
        const byName = new Map(fromSrc.map((m) => [m.name, m]));

        it('JSON 筆數與非 stub 產物筆數一致', () => {
            expect(fromSrc.length).toBe(machinesJson.length);
        });

        it('產物不含未對應 JSON 的非 stub 機器', () => {
            const jsonNames = new Set(machinesJson.map((m) => m.name));
            for (const m of fromSrc) {
                expect(jsonNames.has(m.name), `src has extra machine name=${m.name} id=${m.id}`).toBe(
                    true,
                );
            }
        });

        it('逐台比對 name／width／height／power／tags／modes 埠', () => {
            for (const raw of machinesJson) {
                const m = byName.get(raw.name);
                expect(m, `missing in src/data: name=${raw.name}`).toBeDefined();
                const machine = m as Machine;

                expect(machine.name, `[${raw.name}] name`).toBe(raw.name);
                expect(machine.width, `[${raw.name}] width`).toBe(raw.width);
                expect(machine.height, `[${raw.name}] height`).toBe(raw.height);
                expect(machine.power, `[${raw.name}] power`).toBe(raw.power);
                expect([...machine.tags], `[${raw.name}] tags`).toEqual([...raw.tags]);
                expect(machine.is_source, `[${raw.name}] is_source`).toBe(raw.is_source);
                expect(machine.is_sink, `[${raw.name}] is_sink`).toBe(raw.is_sink);
                expect(machine.modes.length, `[${raw.name}] modes.length`).toBe(raw.modes.length);

                for (let i = 0; i < raw.modes.length; i++) {
                    const expected = modeSignature(raw.modes[i]);
                    const actual = modeSignature(machine.modes[i]);
                    expect(
                        actual,
                        `[${raw.name}] mode[${i}] id=${raw.modes[i].id} port mismatch`,
                    ).toBe(expected);
                }
            }
        });

        it('stub 僅為 item_source／item_sink 兩筆', () => {
            const stubs = machineList.filter((m) => CODEGEN_STUB_IDS.has(m.id));
            expect(stubs.map((m) => m.id).sort()).toEqual(['item_sink', 'item_source']);
        });
    });

    describe('2. 無頂層 ports（modes-only）', () => {
        it('每台機器無頂層 input_ports／output_ports', () => {
            for (const m of machineList) {
                expect(m, `[${m.id}]`).not.toHaveProperty('input_ports');
                expect(m, `[${m.id}]`).not.toHaveProperty('output_ports');
            }
        });
    });

    describe('3. width／height 為正整數', () => {
        it('全機器 width／height > 0 且為整數', () => {
            for (const m of machineList) {
                expect(Number.isInteger(m.width), `[${m.id}] width not integer`).toBe(true);
                expect(Number.isInteger(m.height), `[${m.id}] height not integer`).toBe(true);
                expect(m.width, `[${m.id}] width`).toBeGreaterThan(0);
                expect(m.height, `[${m.id}] height`).toBeGreaterThan(0);
            }
        });
    });

    describe('4. materials 皆有 form', () => {
        it('form ∈ {solid, liquid, gas}', () => {
            const allowed = new Set(['solid', 'liquid', 'gas']);
            for (const mat of getAllMaterials()) {
                expect(mat.form, `[material ${mat.id} ${mat.name}] missing form`).toBeTruthy();
                expect(
                    allowed.has(mat.form),
                    `[material ${mat.id} ${mat.name}] form=${mat.form}`,
                ).toBe(true);
            }
        });
    });

    describe('5. tags ⊆ MACHINE_TAGS', () => {
        it('全機器 tags 皆在 MACHINE_TAGS 內', () => {
            const allowed = new Set<string>(MACHINE_TAGS);
            for (const m of machineList) {
                for (const tag of m.tags) {
                    expect(
                        allowed.has(tag),
                        `[${m.id}] unknown tag=${tag}; allowed=${[...allowed].join(',')}`,
                    ).toBe(true);
                }
            }
        });
    });
});
