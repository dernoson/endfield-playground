import type { Detector, Alert, ValidationContext } from '@/types/validation';
import type { FactoryNode, FactoryEdge } from '@/types/graph';
import type { Position } from '@/types/euclideanSpace';
import type { DeviceFootprint, PipelineFootprint } from '@/types/footprint';
import type { Machine, PortMedia, PortSide } from '@/types/machine';
import { getMachineMode } from '@/types/machine';
import { parsePortHandleIndex, resolveDisplayGrid, rotatePort } from '@/utils/portUtils';
import { resolvePortAnchorCell } from '@/utils/layout/portAnchors';
import { isAxisAlignedPath } from '@/utils/layout/pipelineGeometry';
import { detectOverlaps } from '@/utils/layout/overlapDetection';

/** 設備的佔用層起點；一般設備立於地面層 */
const DEVICE_BASE_LAYER = 0;

/** 設備的佔用深度 d；一般設備自地面層貫穿至空中層 */
const DEVICE_DEPTH = 2;

/** 管線的佔用深度 d；管線只佔自己所在的那一層 */
const PIPELINE_DEPTH = 1;

/** 管線的佔用層起點：傳送帶走地面層、水管走空中層 */
const PIPELINE_LAYER: Record<PortMedia, number> = { belt: 0, pipe: 1 };

/** 端點無法自埠推算時的回退邊：出口朝右、入口朝左 */
const FALLBACK_SIDE: Record<'out' | 'in', PortSide> = { out: 'right', in: 'left' };

/**
 * 算出連線某一端在設備外側的錨點格。
 *
 * 錨點取設備佔格之外相鄰的一格：若以設備自身的格子為端點，每條連線都會與  \
 * 它的來源與目標設備同格而全面誤報。埠資訊不足時退回設備面向對方那一側的中點。
 *
 * @param node 該端所連的設備節點
 * @param def 該設備的靜態定義
 * @param handle 該端的 handle id
 * @param kind 該端是連線的出口還是入口
 * @param z 管線所在的佔用層
 * @returns 錨點格座標
 */
function resolveEndpointCell(
    node: FactoryNode,
    def: Machine,
    handle: string | null | undefined,
    kind: 'out' | 'in',
    z: number,
): Position {
    const rotation = node.data?.rotation ?? 0;
    const { widthCells: width, heightCells: height } = resolveDisplayGrid(
        def.width,
        def.height,
        rotation,
    );

    /** 埠索引解析得出時走真實埠，否則退回該側中點；此處不退回埠 0，那會產生看似有依據的錯誤端點 */
    const portIndex = parsePortHandleIndex(handle, kind);
    const mode = getMachineMode(def, node.data?.machineMode);
    const ports = (kind === 'out' ? mode?.output_ports : mode?.input_ports) ?? [];
    const port = portIndex === null ? undefined : ports[portIndex];

    const anchor = port
        ? rotatePort(port.side, port.offset, def.width, def.height, rotation)
        : { side: FALLBACK_SIDE[kind], offset: Math.floor(height / 2) };

    const cell = resolvePortAnchorCell(
        node.position.x,
        node.position.y,
        width,
        height,
        anchor.side,
        anchor.offset,
    );

    return { x: cell.x, y: cell.y, z };
}

/**
 * 把設備節點轉成佔格描述。
 *
 * @param node 已部署的設備節點；position 為格子座標
 * @param def 設備靜態定義
 * @returns 設備的佔格描述
 */
function toDeviceFootprint(node: FactoryNode, def: Machine): DeviceFootprint {
    return {
        id: node.id,
        position: { x: node.position.x, y: node.position.y, z: DEVICE_BASE_LAYER },
        rotation: node.data?.rotation ?? 0,
        size: { x: def.width, y: def.height, z: DEVICE_DEPTH },
    };
}

/**
 * 把連線轉成佔格描述，並把彎折點補上起訖埠錨點成為完整路徑。
 *
 * 路徑不良構時回傳 null 而不判定：斜向的一段代表這條連線缺一個轉角點，
 * 它實際走哪條路徑並未被指定，對未定義的路徑做重疊判定只會產生假陽性。
 *
 * @param edge 已部署的管線；data.bendPoints 為格子座標
 * @param ctx 驗證上下文，用於查兩端設備與其定義
 * @param nodeById 設備節點索引
 * @returns 管線的佔格描述；兩端設備或定義缺失、或路徑不良構時回傳 null
 */
function toPipelineFootprint(
    edge: FactoryEdge,
    ctx: ValidationContext,
    nodeById: Map<string, FactoryNode>,
): PipelineFootprint | null {
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    if (!sourceNode || !targetNode) return null;

    const sourceDef = ctx.getDef(sourceNode.data?.machineType ?? '');
    const targetDef = ctx.getDef(targetNode.data?.machineType ?? '');
    if (!sourceDef || !targetDef) return null;

    const z = PIPELINE_LAYER[edge.data?.portType ?? 'belt'];
    const start = resolveEndpointCell(sourceNode, sourceDef, edge.sourceHandle, 'out', z);
    const end = resolveEndpointCell(targetNode, targetDef, edge.targetHandle, 'in', z);
    const bends = (edge.data?.bendPoints ?? []).map((point) => ({ x: point.x, y: point.y, z }));
    const waypoints = [start, ...bends, end];
    if (!isAxisAlignedPath(waypoints)) return null;

    return { id: edge.id, waypoints, depth: PIPELINE_DEPTH };
}

/**
 * E001 空間重疊偵測器
 *
 * 設備與管線的重疊在格點層級是同一個判定，因此共用同一張格點表一次算完。  \
 * 本 detector 只做兩件事：把 `ValidationContext` 轉成佔格描述，以及把偵測器  \
 * 回傳的重疊配對包裝成 Alert。幾何本身在 `@/utils/layout`。
 *
 * 佔用層目前以類別預設值指派：設備 (z=0, d=2)，管線依傳輸媒質決定 z、d=1。  \
 * 待 `Machine` 補上層別欄位後改由定義決定。
 */
export const E001_deviceOverlap: Detector = {
    code: 'E001',
    level: 'error',
    run(ctx: ValidationContext): Alert[] {
        /** 設備節點索引，供連線兩端查詢 */
        const nodeById = new Map<string, FactoryNode>();
        /** 設備定義索引，供組訊息時取顯示名 */
        const defById = new Map<string, Machine>();
        const devices: DeviceFootprint[] = [];

        for (const node of ctx.devices) {
            const def = ctx.getDef(node.data?.machineType ?? '');
            if (!def) continue;

            nodeById.set(node.id, node);
            defById.set(node.id, def);
            devices.push(toDeviceFootprint(node, def));
        }

        const pipelines: PipelineFootprint[] = [];
        const connectionIds = new Set<string>();

        for (const edge of ctx.connections) {
            const footprint = toPipelineFootprint(edge, ctx, nodeById);
            if (!footprint) continue;

            connectionIds.add(edge.id);
            pipelines.push(footprint);
        }

        /**
         * 取物件在訊息中的稱謂：設備用機器定義的中文名，管線統一稱「管線」。
         *
         * @param id 物件 uid
         * @returns 可讀名稱
         */
        const displayName = (id: string): string => {
            const def = defById.get(id);
            if (def) return `設備「${def.name}」`;
            if (connectionIds.has(id)) return '管線';
            return id;
        };

        return detectOverlaps(devices, pipelines).map(([idA, idB]) => {
            const relatedDeviceUids: string[] = [];
            const relatedConnectionUids: string[] = [];

            for (const id of idA === idB ? [idA] : [idA, idB]) {
                if (nodeById.has(id)) relatedDeviceUids.push(id);
                else if (connectionIds.has(id)) relatedConnectionUids.push(id);
            }

            const message =
                idA === idB
                    ? '管線與自身路徑重疊'
                    : `${displayName(idA)}與${displayName(idB)}佔用相同格子`;

            return {
                uid: crypto.randomUUID(),
                code: 'E001',
                level: 'error',
                message,
                relatedDeviceUids,
                relatedConnectionUids,
            };
        });
    },
};
