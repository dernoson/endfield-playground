import type { DeepReadonly } from 'vue';
import { getMachineById } from '@/data/machines';
import type { Position } from '@/types/euclideanSpace';
import type { DeviceFootprint, PipelineFootprint } from '@/types/footprint';
import type { LayoutIssues, PlacementResult, PlacedDevice, Pipeline } from '@/types/layout';
import type { Rotation } from '@/types/editor';
import { detectOverlaps } from '@/utils/layout/overlapDetection';
import { isAxisAlignedPath } from '@/utils/layout/pipelineGeometry';
import {
    deviceSizeFromMachine,
    toDeviceFootprint,
    toPipelineFootprint,
} from '@/utils/layout/toFootprint';

/** 尚未落子的設備在衝突結果中的保留識別 */
export const DRAFT_ID = '__draft__';

/** 尚未落子的設備資料；預檢不需要也不產生實例 id */
export interface DeviceDraft {
    /** 機器定義 id */
    machineType: string;
    /** 佔格左上角，含 z 層起點 */
    position: Position;
    /** 順時針旋轉次數 */
    rotation: Rotation;
    /** 缺省時採用機器第一個模式 */
    machineMode?: string;
}

/** 預檢所需的唯讀佈局資料 */
export interface LayoutView {
    /** 已放置設備 */
    devices: readonly DeepReadonly<PlacedDevice>[];
    /** 已放置管線 */
    pipelines: readonly DeepReadonly<Pipeline>[];
}

/**
 * 檢查三軸座標是否皆為有限數，避免佔格展開後出現無效格點。
 *
 * @param position 待檢查座標
 * @returns 三軸皆有限時為 true
 */
export function positionFinite(position: DeepReadonly<Position>): boolean {
    return (
        Number.isFinite(position.x) && Number.isFinite(position.y) && Number.isFinite(position.z)
    );
}

/**
 * 檢查管線是否具備可展開的軸對齊路徑。
 *
 * @param pipeline 待檢查管線
 * @returns 路徑合法時為 true
 */
export function pipelineWaypointsValid(pipeline: DeepReadonly<Pipeline>): boolean {
    if (pipeline.waypoints.length < 2) return false;
    if (!pipeline.waypoints.every(positionFinite)) return false;
    return isAxisAlignedPath(pipeline.waypoints.map((waypoint) => ({ ...waypoint })));
}

/**
 * 全量檢查佈局，保留所有 invalid 與 overlap；無法歸屬 id 的物件不參與佔格。
 *
 * @param deviceList 設備清單
 * @param pipelineList 管線清單
 * @returns 全部佈局問題
 */
export function collectLayoutIssues(
    deviceList: readonly DeepReadonly<PlacedDevice>[],
    pipelineList: readonly DeepReadonly<Pipeline>[],
): LayoutIssues {
    const idCounts = new Map<string, number>();
    for (const item of [...deviceList, ...pipelineList]) {
        idCounts.set(item.id, (idCounts.get(item.id) ?? 0) + 1);
    }

    /** 共用 id 命名空間，空白或重複 id 無法可靠歸屬佔格 */
    const idUsable = (id: string): boolean => Boolean(id) && (idCounts.get(id) ?? 0) === 1;

    const invalidIds = new Set<string>();
    const deviceFootprints: DeviceFootprint[] = [];
    for (const device of deviceList) {
        const machine = getMachineById(device.machineType);
        if (!idUsable(device.id) || !positionFinite(device.position) || !machine) {
            invalidIds.add(device.id);
            continue;
        }
        deviceFootprints.push(
            toDeviceFootprint(
                { ...device, position: { ...device.position } },
                deviceSizeFromMachine(machine),
            ),
        );
    }

    const pipelineFootprints: PipelineFootprint[] = [];
    for (const pipeline of pipelineList) {
        if (!idUsable(pipeline.id) || !pipelineWaypointsValid(pipeline)) {
            invalidIds.add(pipeline.id);
            continue;
        }
        pipelineFootprints.push(
            toPipelineFootprint({
                ...pipeline,
                waypoints: pipeline.waypoints.map((waypoint) => ({ ...waypoint })),
            }),
        );
    }

    const conflicts = detectOverlaps(deviceFootprints, pipelineFootprints);
    return {
        ok: invalidIds.size === 0 && conflicts.length === 0,
        invalidIds: [...invalidIds],
        conflicts,
    };
}

/**
 * 只將本次操作引入的 invalid 或 overlap 回報給呼叫端。
 *
 * @param deviceList 操作後設備清單
 * @param pipelineList 操作後管線清單
 * @param involvedIds 本次操作涉及的 id
 * @returns 本次操作的合法性結果
 */
export function assessInvolving(
    deviceList: readonly DeepReadonly<PlacedDevice>[],
    pipelineList: readonly DeepReadonly<Pipeline>[],
    involvedIds: ReadonlySet<string>,
): PlacementResult {
    const issues = collectLayoutIssues(deviceList, pipelineList);
    const involvedInvalid = issues.invalidIds.filter((id) => involvedIds.has(id));
    if (involvedInvalid.length > 0) {
        return { ok: false, reason: 'invalid', invalidIds: involvedInvalid };
    }

    const conflicts = issues.conflicts.filter(([a, b]) => involvedIds.has(a) || involvedIds.has(b));
    if (conflicts.length > 0) {
        return { ok: false, reason: 'overlap', conflicts };
    }
    return { ok: true };
}

/**
 * 落子前檢查佔格；不產生 uid、不寫入 store 或 history。
 * 設備數超過約 200 時，呼叫端應自行 debounce 或改增量判定。
 *
 * @param draft 尚未落子的設備
 * @param layout 目前佈局
 * @returns 與實際新增共用判定的結果；衝突中的新設備以 DRAFT_ID 表示
 */
export function canPlaceDevice(draft: DeviceDraft, layout: LayoutView): PlacementResult {
    const candidate: PlacedDevice = {
        id: DRAFT_ID,
        machineType: draft.machineType,
        position: { ...draft.position },
        rotation: draft.rotation,
        ...(draft.machineMode === undefined ? {} : { machineMode: draft.machineMode }),
    };
    return assessInvolving([...layout.devices, candidate], layout.pipelines, new Set([DRAFT_ID]));
}
