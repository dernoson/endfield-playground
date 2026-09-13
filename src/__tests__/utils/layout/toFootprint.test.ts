/**
 * toFootprint 轉換單元測試
 * 測試對象：src/utils/layout/toFootprint.ts
 */

import { describe, it, expect } from 'vitest';
import type { Machine } from '@/types/machine';
import type { PlacedDevice, Pipeline } from '@/types/layout';
import {
    DEFAULT_DEVICE_OCCUPANCY_DEPTH,
    PIPELINE_OCCUPANCY_DEPTH,
    deviceSizeFromMachine,
    resolveDeviceOccupancyDepth,
    resolvePipelineOccupancyDepth,
    toDeviceFootprint,
    toPipelineFootprint,
} from '@/utils/layout/toFootprint';

function stubMachine(
    partial: Pick<Machine, 'id' | 'width' | 'height' | 'is_source' | 'is_sink'>,
): Machine {
    return {
        ...partial,
        name: partial.id,
        power: 0,
        tags: [],
        modes: [
            {
                id: 'default',
                label: '預設',
                input_ports: [],
                output_ports: [],
                loss: null,
            },
        ],
        onTick: null,
        onInput: null,
        onOutput: null,
        calcEfficiency: null,
    };
}

describe('resolveDeviceOccupancyDepth', () => {
    it('一般設備預設 d=2', () => {
        expect(
            resolveDeviceOccupancyDepth(
                stubMachine({
                    id: 'crusher',
                    width: 3,
                    height: 3,
                    is_source: false,
                    is_sink: false,
                }),
            ),
        ).toBe(DEFAULT_DEVICE_OCCUPANCY_DEPTH);
    });

    it('取貨口類 id 為 d=1', () => {
        expect(
            resolveDeviceOccupancyDepth(
                stubMachine({
                    id: 'item_access_port',
                    width: 1,
                    height: 1,
                    is_source: false,
                    is_sink: false,
                }),
            ),
        ).toBe(1);
    });

    it('is_source／is_sink 為 d=1', () => {
        expect(
            resolveDeviceOccupancyDepth(
                stubMachine({
                    id: 'material_out',
                    width: 1,
                    height: 1,
                    is_source: true,
                    is_sink: false,
                }),
            ),
        ).toBe(1);
    });
});

describe('toDeviceFootprint / deviceSizeFromMachine', () => {
    it('轉出與 footprint 契約相容的物件', () => {
        const machine = stubMachine({
            id: 'crusher',
            width: 3,
            height: 3,
            is_source: false,
            is_sink: false,
        });
        const device: PlacedDevice = {
            id: 'dev-1',
            machineType: 'crusher',
            position: { x: 10, y: 20, z: 0 },
            rotation: 1,
            machineMode: 'default',
        };

        const size = deviceSizeFromMachine(machine);
        expect(size).toEqual({ x: 3, y: 3, z: 2 });

        expect(toDeviceFootprint(device, size)).toEqual({
            id: 'dev-1',
            position: { x: 10, y: 20, z: 0 },
            rotation: 1,
            size: { x: 3, y: 3, z: 2 },
        });
    });
});

describe('toPipelineFootprint', () => {
    it('belt／pipe 深度皆為 1，並複製 waypoints', () => {
        expect(resolvePipelineOccupancyDepth('belt')).toBe(PIPELINE_OCCUPANCY_DEPTH);

        const pipeline: Pipeline = {
            id: 'pipe-1',
            media: 'belt',
            waypoints: [
                { x: 0, y: 0, z: 0 },
                { x: 3, y: 0, z: 0 },
            ],
        };

        const footprint = toPipelineFootprint(pipeline);
        expect(footprint.depth).toBe(1);
        expect(footprint.waypoints).toEqual(pipeline.waypoints);
        expect(footprint.waypoints).not.toBe(pipeline.waypoints);
    });
});
