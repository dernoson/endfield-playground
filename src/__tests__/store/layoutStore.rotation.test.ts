/**
 * V18 — layoutStore.rotateDevice
 *
 * 對齊 #78 需求（L1 重審）：單一設備旋轉、進歷史、原點／管線座標不動；  \
 * 重疊不擋寫入（POC／E001）。
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useLayoutStore } from '@/store/layoutStore';
import { useHistoryStore } from '@/store/historyStore';
import type { PlacedDevice } from '@/types/layout';
import type { Rotation } from '@/types/editor';
import { HistoryRecordType } from '@/types/history';
import { getDeviceOccupiedCells } from '@/utils/layout/deviceOccupancy';
import { deviceSizeFromMachine, toDeviceFootprint } from '@/utils/layout/toFootprint';
import { getMachineById } from '@/data/machines';

/** 非正方形設備，可驗旋轉後長寬交換 */
const source: PlacedDevice = {
    id: 'src',
    machineType: 'filling_machine',
    position: { x: 3, y: 3, z: 0 },
    rotation: 0,
};

describe('layoutStore.rotateDevice', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        useLayoutStore().loadSnapshot({ devices: [source], pipelines: [] });
        useHistoryStore().clear();
    });

    it('四次旋轉回到原角度；每次一筆旋轉歷史；原點不動', () => {
        const layout = useLayoutStore();
        const history = useHistoryStore();
        for (const rotation of [1, 2, 3, 0] as const) {
            expect(layout.rotateDevice('src', rotation)).toEqual({ ok: true });
            expect(layout.devices[0].rotation).toBe(rotation);
            expect(layout.devices[0].position).toEqual(source.position);
        }
        expect(history.undoDepth).toBe(4);
        expect(history.undoStack.map((command) => command.type)).toEqual(
            Array(4).fill(HistoryRecordType.MachineRotation),
        );
    });

    it('90 度交換非正方形設備佔格長寬', () => {
        const layout = useLayoutStore();
        layout.rotateDevice('src', 1);
        const machine = getMachineById(source.machineType)!;
        const cells = getDeviceOccupiedCells(
            toDeviceFootprint(
                { ...layout.devices[0], position: { ...layout.devices[0].position } },
                deviceSizeFromMachine(machine),
            ),
        );
        expect(new Set(cells.map((cell) => cell.x)).size).toBe(4);
        expect(new Set(cells.map((cell) => cell.y)).size).toBe(6);
    });

    it('undo／redo 還原角度；既有管線座標跟隨不變', () => {
        const layout = useLayoutStore();
        const history = useHistoryStore();
        expect(
            layout.addPipeline({
                id: 'line',
                media: 'belt',
                waypoints: [
                    { x: 8, y: 7, z: 0 },
                    { x: 8, y: 10, z: 0 },
                ],
            }),
        ).toEqual({ ok: true });
        history.clear();
        const pipelines = layout.toSnapshot().pipelines;
        expect(layout.rotateDevice('src', 1)).toEqual({ ok: true });
        expect(layout.connections[0].from).toBeNull();
        history.undo();
        expect(layout.devices[0].rotation).toBe(0);
        expect(layout.connections[0].from?.deviceId).toBe('src');
        history.redo();
        expect(layout.devices[0].rotation).toBe(1);
        expect(layout.connections[0].from).toBeNull();
        expect(layout.toSnapshot().pipelines).toEqual(pipelines);
    });

    it('同角度不寫歷史', () => {
        expect(useLayoutStore().rotateDevice('src', 0)).toEqual({ ok: true });
        expect(useHistoryStore().undoDepth).toBe(0);
    });

    it.each([-1, 4, 1.5, NaN])('非法角度 %s 且不寫入', (rotation) => {
        const layout = useLayoutStore();
        const before = layout.toSnapshot();
        expect(layout.rotateDevice('src', rotation as Rotation)).toEqual({
            ok: false,
            reason: 'invalid',
            invalidIds: ['src'],
        });
        expect(layout.toSnapshot()).toEqual(before);
        expect(useHistoryStore().undoDepth).toBe(0);
    });

    it('找不到設備 → invalid 且不產歷史', () => {
        expect(useLayoutStore().rotateDevice('missing', 1)).toEqual({
            ok: false,
            reason: 'invalid',
            invalidIds: ['missing'],
        });
        expect(useHistoryStore().undoDepth).toBe(0);
    });

    it('重複 id 不猜測目標設備', () => {
        const layout = useLayoutStore();
        layout.loadSnapshot({
            devices: [source, { ...source, position: { x: 20, y: 20, z: 0 } }],
            pipelines: [],
        });
        useHistoryStore().clear();
        expect(layout.rotateDevice('src', 1)).toMatchObject({ ok: false, reason: 'invalid' });
        expect(useHistoryStore().undoDepth).toBe(0);
    });

    it('旋轉後與他機重疊仍寫入；layoutIssues 有 conflicts（POC）', () => {
        const layout = useLayoutStore();
        layout.addDevice({
            id: 'blocker',
            machineType: 'splitter',
            position: { x: 3, y: 7, z: 0 },
            rotation: 0,
        });
        useHistoryStore().clear();
        expect(layout.rotateDevice('src', 1)).toEqual({ ok: true });
        expect(layout.devices.find((d) => d.id === 'src')?.rotation).toBe(1);
        expect(useHistoryStore().undoDepth).toBe(1);
        expect(layout.layoutIssues.conflicts.length).toBeGreaterThan(0);
    });

    it('旋轉後與既有管線重疊仍寫入', () => {
        const layout = useLayoutStore();
        expect(
            layout.addPipeline({
                id: 'blocker',
                media: 'belt',
                waypoints: [
                    { x: 3, y: 8, z: 0 },
                    { x: 4, y: 8, z: 0 },
                ],
            }),
        ).toEqual({ ok: true });
        useHistoryStore().clear();
        expect(layout.rotateDevice('src', 1)).toEqual({ ok: true });
        expect(layout.devices[0].rotation).toBe(1);
        expect(useHistoryStore().undoDepth).toBe(1);
    });
});
