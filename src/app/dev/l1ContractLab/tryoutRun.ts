/**
 * V21-C1 試玩執行器。
 *
 * 只呼叫既有 `hitTestPortAt`／`findPortAt`／`canConnect`，不改簽名、不寫 store。
 */
import type { PlacedDevice, PortDirection } from '@/types/layout';
import type { PortMedia } from '@/types/machine';
import { getMachineById } from '@/data/machines';
import { hitTestPortAt } from '@/utils/layout/portHitTest';
import { collectPortAnchors, findPortAt } from '@/utils/layout/portAnchorIndex';
import {
    canConnect,
    describeConnectFailure,
    type ConnectResult,
} from '@/utils/layout/connectRules';
import type {
    TryoutApiId,
    TryoutFixtureId,
    TryoutMedia,
    TryoutPrefer,
} from '@/app/dev/l1ContractLab/contractCatalog';

/** 唯讀錨點表一列 */
export interface TryoutAnchorRow {
    /** 設備 id */
    deviceId: string;
    /** 埠方向 */
    portType: PortDirection;
    /** 埠索引 */
    portIndex: number;
    /** 外側錨點格 x */
    x: number;
    /** 外側錨點格 y */
    y: number;
}

/** 一次試玩請求 */
export interface TryoutRequest {
    /** 白名單 API */
    api: TryoutApiId;
    /** 查詢 x */
    x: number;
    /** 查詢 y */
    y: number;
    /** 空字串表示不傳 prefer */
    prefer: TryoutPrefer;
    /** 固定裝置 */
    fixture: TryoutFixtureId;
    /** 情境說明（可選，原樣放進 JSON） */
    hint?: string;
    /** canConnect 終點 x */
    endX?: number;
    /** canConnect 終點 y */
    endY?: number;
    /** canConnect 管線媒質 */
    media?: TryoutMedia;
}

/** 寫進輸出面板的結果 */
export interface TryoutRunResult {
    /** 面板標題 */
    title: string;
    /** JSON 本體 */
    value: unknown;
}

/**
 * 粉碎機放在原點，對齊既有熱區／錨點案例。
 */
export function crusherAtOrigin(): PlacedDevice {
    return {
        id: 'c',
        machineType: 'crusher',
        position: { x: 0, y: 0, z: 0 },
        rotation: 0,
        label: 'c',
    };
}

/**
 * 左右相鄰的兩台分流器。右出與左入的視覺邊心都在 (1, 0.5)。
 */
export function adjacentSplitters(): PlacedDevice[] {
    return [
        {
            id: 'a',
            machineType: 'splitter',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            label: 'a',
        },
        {
            id: 'b',
            machineType: 'splitter',
            position: { x: 1, y: 0, z: 0 },
            rotation: 0,
            label: 'b',
        },
    ];
}

/**
 * 依場景取出固定裝置。
 *
 * @param fixture 場景 id
 */
export function devicesForFixture(fixture: TryoutFixtureId): PlacedDevice[] {
    if (fixture === 'crusher-origin') {
        return [crusherAtOrigin()];
    }
    return adjacentSplitters();
}

/**
 * 展開場景的外側錨點，供試玩頁唯讀表。
 *
 * @param fixture 場景 id
 */
export function anchorsForFixture(fixture: TryoutFixtureId): TryoutAnchorRow[] {
    return collectPortAnchors(devicesForFixture(fixture)).map((entry) => ({
        deviceId: entry.ref.deviceId,
        portType: entry.ref.portType,
        portIndex: entry.ref.portIndex,
        x: entry.x,
        y: entry.y,
    }));
}

/**
 * 場景的人話說明。
 *
 * @param fixture 場景 id
 */
export function fixtureCaption(fixture: TryoutFixtureId): string {
    if (fixture === 'crusher-origin') {
        return '一台粉碎機，代號 c，放在原點，沒有旋轉。頂邊三個是進料口，底邊三個是出料口。';
    }
    return '兩台分流器緊貼著放：a 在左邊、b 在右邊。a 右邊的出料口和 b 左邊的進料口，畫面上是同一個點 (1, 0.5)。';
}

/**
 * 把埠編號說成人話，並保留程式裡的寫法供對照。
 *
 * @param portType 進料或出料
 * @param portIndex 從 0 開始的編號
 */
function describePort(portType: PortDirection, portIndex: number): string {
    const kind = portType === 'input' ? '進料' : '出料';
    return `第 ${portIndex + 1} 個${kind}口（${portType}[${portIndex}]）`;
}

/**
 * 給頁面與 JSON 的第一句答案，不要求讀者先看欄位名。
 *
 * @param api 問的是滑鼠熱區還是端點格
 * @param result 命中的埠；沒有則為 null
 */
function describeResult(
    api: TryoutApiId,
    result: { deviceId: string; portType: PortDirection; portIndex: number } | null,
): string {
    if (!result) {
        if (api === 'hitTestPortAt') {
            return '沒有點到任何埠。這個位置不在任何埠旁邊的圓形範圍裡。';
        }
        return '沒有對上任何接管子的格子。小數點的位置多半是給滑鼠用的，不是整數格。';
    }
    const which = describePort(result.portType, result.portIndex);
    if (api === 'hitTestPortAt') {
        return `有點到。機器 ${result.deviceId} 的${which}。`;
    }
    return `對上了。機器 ${result.deviceId} 的${which}，就在這個整數格上。`;
}

/**
 * 把媒質說成人話。
 *
 * @param media 皮帶或水管
 */
function describeMedia(media: PortMedia): string {
    return media === 'belt' ? '皮帶' : '水管';
}

/**
 * canConnect 成功時的人話。失敗句用 describeConnectFailure，不在這裡重寫。
 *
 * @param result 已通過的連線結果
 */
function describeConnectOk(result: Extract<ConnectResult, { ok: true }>): string {
    if (result.from && result.to) {
        return `可以接。從機器 ${result.from.deviceId} 的${describePort(result.from.portType, result.from.portIndex)}，接到機器 ${result.to.deviceId} 的${describePort(result.to.portType, result.to.portIndex)}。`;
    }
    return '這條線沒有被擋下，但還沒接到兩端。懸空的那一端本身不算錯誤。';
}

/**
 * 真呼叫白名單 API，回傳可 JSON 化的結果。
 *
 * @param request 表單現值
 */
export function runTryout(request: TryoutRequest): TryoutRunResult {
    const devices = devicesForFixture(request.fixture);
    const prefer = request.prefer === '' ? undefined : request.prefer;
    const point = { x: request.x, y: request.y };
    const deviceBrief = devices.map((device) => ({
        id: device.id,
        machineType: device.machineType,
        position: device.position,
    }));

    if (request.api === 'canConnect') {
        const endX = request.endX ?? request.x;
        const endY = request.endY ?? request.y;
        const media: PortMedia = request.media ?? 'belt';
        const start = { x: request.x, y: request.y, z: 0 };
        const end = { x: endX, y: endY, z: 0 };
        const result = canConnect({ media, waypoints: [start, end] }, { devices, pipelines: [] });
        const failure = describeConnectFailure(result);
        const plain = result.ok ? describeConnectOk(result) : failure;
        return {
            title: '試玩 · 這條線能不能接上',
            value: {
                plain,
                api: 'canConnect',
                media: describeMedia(media),
                waypoints: [start, end],
                fixture: fixtureCaption(request.fixture),
                devices: deviceBrief,
                hint: request.hint ?? '',
                failure,
                result,
            },
        };
    }

    if (request.api === 'hitTestPortAt') {
        const result = hitTestPortAt(
            point,
            devices,
            getMachineById,
            prefer ? { prefer } : undefined,
        );
        return {
            title: '試玩 · 滑鼠有沒有點到埠',
            value: {
                plain: describeResult('hitTestPortAt', result),
                api: 'hitTestPortAt',
                point,
                prefer: prefer
                    ? prefer === 'input'
                        ? '進料（input）'
                        : '出料（output）'
                    : '不指定',
                fixture: fixtureCaption(request.fixture),
                devices: deviceBrief,
                hint: request.hint ?? '',
                result,
            },
        };
    }

    const anchors = collectPortAnchors(devices);
    const result = findPortAt(anchors, request.x, request.y, prefer);
    return {
        title: '試玩 · 這個格子能不能接管子',
        value: {
            plain: describeResult('findPortAt', result),
            api: 'findPortAt',
            point,
            prefer: prefer ? (prefer === 'input' ? '進料（input）' : '出料（output）') : '不指定',
            fixture: fixtureCaption(request.fixture),
            devices: deviceBrief,
            hint: request.hint ?? '',
            note: '只有 x、y 和下面表格裡的整數完全一樣才算對上。小數的滑鼠位置通常是空的。',
            result,
        },
    };
}
