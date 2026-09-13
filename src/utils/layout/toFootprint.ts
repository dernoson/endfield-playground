/**
 * 佈局領域 → 幾何 footprint 轉換
 *
 * 佔格展開／重疊偵測只吃 {@link DeviceFootprint}／{@link PipelineFootprint}；  \
 * 呼叫端先用本模組填好 `size.z`（佔用深度 d）再丟給 `deviceOccupancy` 等。
 *
 * 機器 JSON 尚無 `d` 欄時，深度依評估文 §1／§3.2 常數表 stub；驗證期可改。
 */

import type { Position } from '@/types/euclideanSpace';
import type { DeviceFootprint, PipelineFootprint } from '@/types/footprint';
import type { PlacedDevice, Pipeline } from '@/types/layout';
import type { Machine, PortMedia } from '@/types/machine';

/** 一般設備預設佔用深度 d（佔用層 z .. z+d-1） */
export const DEFAULT_DEVICE_OCCUPANCY_DEPTH = 2;

/** 傳送帶／水管路徑預設佔用深度 */
export const PIPELINE_OCCUPANCY_DEPTH = 1;

/**
 * 已知佔用深度為 1 的機器 id（取貨口／埠類等；驗證期可補）
 *
 * 分流器／匯流器／物流橋依評估文為 d=2，不列於此。
 */
const DEVICE_OCCUPANCY_DEPTH_ONE = new Set<string>(['item_access_port', 'pipe_access_port']);

/**
 * 解析設備佔用深度 d。
 *
 * 優先順序：明確 id 表 → `is_source`／`is_sink` → 預設 2。
 *
 * @param machine 機器定義（或具備 id／source／sink 旗標的子集）
 * @returns 佔用深度 d（≥1）
 */
export function resolveDeviceOccupancyDepth(
    machine: Pick<Machine, 'id' | 'is_source' | 'is_sink'>,
): number {
    if (DEVICE_OCCUPANCY_DEPTH_ONE.has(machine.id)) {
        return 1;
    }
    if (machine.is_source || machine.is_sink) {
        return 1;
    }
    return DEFAULT_DEVICE_OCCUPANCY_DEPTH;
}

/**
 * 管線佔用深度；現行 belt／pipe 皆為 1。
 *
 * @param _media 傳輸媒質（保留參數供日後差異化）
 * @returns 佔用深度 d
 */
export function resolvePipelineOccupancyDepth(_media: PortMedia): number {
    return PIPELINE_OCCUPANCY_DEPTH;
}

/**
 * 由機器定義組出 footprint 的 `size`（宽×高×d）。
 *
 * @param machine 機器定義
 * @param depth 覆寫佔用深度；缺省走 {@link resolveDeviceOccupancyDepth}
 */
export function deviceSizeFromMachine(machine: Machine, depth?: number): Position {
    return {
        x: machine.width,
        y: machine.height,
        z: depth ?? resolveDeviceOccupancyDepth(machine),
    };
}

/**
 * PlacedDevice → DeviceFootprint
 *
 * @param device 佈局設備
 * @param size 佔格尺寸（格）；z＝d。通常由 {@link deviceSizeFromMachine} 取得
 */
export function toDeviceFootprint(device: PlacedDevice, size: Position): DeviceFootprint {
    return {
        id: device.id,
        position: { ...device.position },
        rotation: device.rotation,
        size: { ...size },
    };
}

/**
 * Pipeline → PipelineFootprint
 *
 * @param pipeline 佈局管線
 * @param depth 佔用深度；缺省 {@link resolvePipelineOccupancyDepth}
 */
export function toPipelineFootprint(
    pipeline: Pipeline,
    depth: number = resolvePipelineOccupancyDepth(pipeline.media),
): PipelineFootprint {
    return {
        id: pipeline.id,
        waypoints: pipeline.waypoints.map((p) => ({ ...p })),
        depth,
    };
}
