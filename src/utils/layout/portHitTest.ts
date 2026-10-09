/**
 * 埠熱區命中（V15／W1004-A0 ③｜R-C1）
 *
 * 供 L2 draft 連線呼叫：輸入為**格點座標**（像素 ↔ 格點由 L2 換算）。  \
 * 錨點與 {@link collectPortAnchors} 同源；勿與格點精確匹配的 {@link findPortAt} 混淆。
 *
 * draft 狀態不在本模組（C1 §4.1 方案 C＝L2 local ref）。
 */

import type { PlacedDevice, PortRef } from '@/types/layout';
import type { PortMedia, PortSide } from '@/types/machine';
import { getMachineMode } from '@/types/machine';
import { rotatePort } from '@/utils/portUtils';
import {
    collectPortAnchors,
    defaultGetMachine,
    type GetMachineFn,
    type PortAnchorEntry,
} from '@/utils/layout/portAnchorIndex';

/** 預設熱區半徑（格）；C1 §4.3 凍結 ≥ 半格 */
export const DEFAULT_HIT_RADIUS_CELLS = 0.5;

/**
 * 熱區命中結果＝{@link PortRef}＋旋轉後 `side`＋`media`
 */
export type PortHitResult = PortRef & {
    /** 旋轉後的埠邊（與錨點計算同源） */
    side: PortSide;
    media: PortMedia;
};

/** {@link hitTestPortAt} 可選參數 */
export interface HitTestPortOptions {
    /**
     * 熱區半徑（格）；預設 {@link DEFAULT_HIT_RADIUS_CELLS}（0.5）。
     * 呼叫端若需更大熱區可覆寫；螢幕像素下限由 L2 換算進 `point` 後再呼叫。
     */
    hitRadiusCells?: number;
}

/**
 * 在設備埠錨點的熱區內找命中埠。
 *
 * - 距離＝點到錨點格座標的歐氏距離（格）
 * - 多埠同時在半徑內：**距離最近**者勝；距離相同則取 {@link collectPortAnchors} **掃描順序較前者**
 * - 查不到機器／無法還原 side／media 的錨點略過（不應發生於合法展開）
 *
 * @param point 格點座標（可為非整數）
 * @param devices 已放置設備
 * @param getMachine 機器查表；預設與 resolveConnections 相同
 * @param options 熱區等
 */
export function hitTestPortAt(
    point: { x: number; y: number },
    devices: readonly PlacedDevice[],
    getMachine: GetMachineFn = defaultGetMachine,
    options?: HitTestPortOptions,
): PortHitResult | null {
    const radius = options?.hitRadiusCells ?? DEFAULT_HIT_RADIUS_CELLS;
    const radiusSq = radius * radius;
    const anchors = collectPortAnchors(devices, getMachine);

    let best: PortAnchorEntry | null = null;
    let bestDistSq = Infinity;

    for (const anchor of anchors) {
        const dx = point.x - anchor.x;
        const dy = point.y - anchor.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > radiusSq) {
            continue;
        }
        if (distSq < bestDistSq) {
            bestDistSq = distSq;
            best = anchor;
        }
    }

    if (!best) {
        return null;
    }

    return enrichPortHit(best, devices, getMachine);
}

/**
 * 由錨點 PortRef 補齊旋轉後 side 與 media。
 */
function enrichPortHit(
    anchor: PortAnchorEntry,
    devices: readonly PlacedDevice[],
    getMachine: GetMachineFn,
): PortHitResult | null {
    const device = devices.find((d) => d.id === anchor.ref.deviceId);
    if (!device) {
        return null;
    }

    const def = getMachine(device.machineType);
    if (!def) {
        return null;
    }

    const mode = getMachineMode(def, device.machineMode);
    const ports = anchor.ref.portType === 'input' ? mode.input_ports : mode.output_ports;
    const port = ports[anchor.ref.portIndex];
    if (!port) {
        return null;
    }

    const rotated = rotatePort(port.side, port.offset, def.width, def.height, device.rotation);

    return {
        deviceId: anchor.ref.deviceId,
        portType: anchor.ref.portType,
        portIndex: anchor.ref.portIndex,
        side: rotated.side,
        media: port.media,
    };
}
