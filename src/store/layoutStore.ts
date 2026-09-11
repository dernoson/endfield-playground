/**
 * 佈局領域 store（V12／W0907-A0）
 *
 * 平行於 `editorStore` 落地：持有 `devices`／`pipelines`，`connections` 為 getter  \
 *（每次呼叫 {@link resolveConnections}）。放置合法性回傳 {@link PlacementResult}，不 throw。
 *
 * L2 本週仍以 props／fixture 為主；本 store 完成後 9/14 再接，勿回頭改 GridCanvas。
 *
 * @example
 * const layout = useLayoutStore()
 * layout.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('connected')))
 * console.log(layout.connections)
 */

import { computed, readonly, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Position } from '@/types/euclideanSpace';
import type { LayoutSnapshot, PlacementResult, PlacedDevice, Pipeline } from '@/types/layout';
import type { DeviceFootprint, PipelineFootprint } from '@/types/footprint';
import { getMachineById } from '@/data/machines';
import { resolveConnections } from '@/utils/layout/resolveConnections';
import { detectOverlaps } from '@/utils/layout/overlapDetection';
import {
    deviceSizeFromMachine,
    toDeviceFootprint,
    toPipelineFootprint,
} from '@/utils/layout/toFootprint';

/**
 * 深拷貝快照，避免外部持有同一參考後改寫 store 內部
 */
function cloneSnapshot(snapshot: LayoutSnapshot): LayoutSnapshot {
    return {
        devices: snapshot.devices.map((d) => ({
            ...d,
            position: { ...d.position },
        })),
        pipelines: snapshot.pipelines.map((p) => ({
            ...p,
            waypoints: p.waypoints.map((w) => ({ ...w })),
        })),
    };
}

/**
 * 將佈局設備轉成 footprint；任一機缺定義則回傳該 id（呼叫端標 invalid）
 */
function tryDeviceFootprints(
    deviceList: PlacedDevice[],
): { ok: true; footprints: DeviceFootprint[] } | { ok: false; deviceId: string } {
    const footprints: DeviceFootprint[] = [];
    for (const device of deviceList) {
        const machine = getMachineById(device.machineType);
        if (!machine) {
            return { ok: false, deviceId: device.id };
        }
        footprints.push(toDeviceFootprint(device, deviceSizeFromMachine(machine)));
    }
    return { ok: true, footprints };
}

/**
 * 候選 devices／pipelines 是否發生佔格重疊（組既有純函式，不重寫演算法）
 */
function hasOverlap(deviceList: PlacedDevice[], pipelineList: Pipeline[]): PlacementResult {
    const built = tryDeviceFootprints(deviceList);
    if (!built.ok) {
        return { ok: false, reason: 'invalid' };
    }
    const pipelineFootprints: PipelineFootprint[] = pipelineList.map((p) => toPipelineFootprint(p));
    if (detectOverlaps(built.footprints, pipelineFootprints).length > 0) {
        return { ok: false, reason: 'overlap' };
    }
    return { ok: true };
}

export const useLayoutStore = defineStore('layout', () => {
    /** 已放置設備（藍圖目標儲存形之一） */
    const devices = ref<PlacedDevice[]>([]);

    /** 管線（不含 Connection） */
    const pipelines = ref<Pipeline[]>([]);

    /**
     * 衍生連線；每次由 devices／pipelines 重算，**不是**可寫 state
     */
    const connections = computed(() => resolveConnections(devices.value, pipelines.value));

    /**
     * 覆寫目前佈局（深拷貝）
     *
     * @param snapshot 純資料快照；connections 不在內
     */
    function loadSnapshot(snapshot: LayoutSnapshot): void {
        const cloned = cloneSnapshot(snapshot);
        devices.value = cloned.devices;
        pipelines.value = cloned.pipelines;
    }

    /**
     * 匯出目前 devices／pipelines（深拷貝；不含 connections）
     */
    function toSnapshot(): LayoutSnapshot {
        return cloneSnapshot({
            devices: devices.value,
            pipelines: pipelines.value,
        });
    }

    /**
     * 新增設備；重疊或無效則不寫入
     *
     * @param device 待放置設備
     */
    function addDevice(device: PlacedDevice): PlacementResult {
        if (!device.id || devices.value.some((d) => d.id === device.id)) {
            return { ok: false, reason: 'invalid' };
        }
        if (!Number.isFinite(device.position.x) || !Number.isFinite(device.position.y)) {
            return { ok: false, reason: 'invalid' };
        }

        const nextDevices = [...devices.value, device];
        const result = hasOverlap(nextDevices, pipelines.value);
        if (!result.ok) {
            return result;
        }

        devices.value = nextDevices.map((d) => ({
            ...d,
            position: { ...d.position },
        }));
        return { ok: true };
    }

    /**
     * 刪除設備；管線保留（可變成斷線）
     *
     * @param id 設備 uid
     */
    function removeDevice(id: string): void {
        devices.value = devices.value.filter((d) => d.id !== id);
    }

    /**
     * 移動設備；重疊或找不到 uid 則不寫入
     *
     * @param id 設備 uid
     * @param position 新佔格左上角
     */
    function moveDevice(id: string, position: Position): PlacementResult {
        if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
            return { ok: false, reason: 'invalid' };
        }

        const index = devices.value.findIndex((d) => d.id === id);
        if (index < 0) {
            return { ok: false, reason: 'invalid' };
        }

        const nextDevices = devices.value.map((d, i) =>
            i === index
                ? { ...d, position: { ...position } }
                : { ...d, position: { ...d.position } },
        );
        const result = hasOverlap(nextDevices, pipelines.value);
        if (!result.ok) {
            return result;
        }

        devices.value = nextDevices;
        return { ok: true };
    }

    /**
     * 新增管線；與設備／既有管線佔格衝突則不寫入
     *
     * @param pipeline 待加入管線
     */
    function addPipeline(pipeline: Pipeline): PlacementResult {
        if (!pipeline.id || pipelines.value.some((p) => p.id === pipeline.id)) {
            return { ok: false, reason: 'invalid' };
        }
        if (pipeline.waypoints.length === 0) {
            return { ok: false, reason: 'invalid' };
        }

        const nextPipelines = [...pipelines.value, pipeline];
        const result = hasOverlap(devices.value, nextPipelines);
        if (!result.ok) {
            return result;
        }

        pipelines.value = nextPipelines.map((p) => ({
            ...p,
            waypoints: p.waypoints.map((w) => ({ ...w })),
        }));
        return { ok: true };
    }

    /**
     * 刪除管線；不維護獨立 Connection state（getter 會自然少一筆）
     *
     * @param id 管線 uid
     */
    function removePipeline(id: string): void {
        pipelines.value = pipelines.value.filter((p) => p.id !== id);
    }

    return {
        /** 已放置設備（唯讀面） */
        devices: readonly(devices),
        /** 管線（唯讀面） */
        pipelines: readonly(pipelines),
        /** 衍生連線（getter；唯讀面） */
        connections: readonly(connections),
        loadSnapshot,
        toSnapshot,
        addDevice,
        removeDevice,
        moveDevice,
        addPipeline,
        removePipeline,
    };
});
