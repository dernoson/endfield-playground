import type { Detector, Alert, ValidationContext } from '@/types/validation';
import type { FactoryNode } from '@/types/graph';
import type { shironesMachine, shironesPipeline } from '@/types/shironesinterface';
import type { Rotation } from '@/types/editor';
import { detectOverlaps } from './overlapDetector';

/**
 * E001 設備與管線空間重疊偵測器
 *
 * 遵循 Detector 純函式契約：
 * 1. 讀取 ValidationContext 中的 devices 與 connections
 * 2. 轉換為 shironesMachine 與 shironesPipeline 資料格式
 * 3. 呼叫底層 detectOverlaps 取得重疊配對
 * 4. 將重疊配對包裝為 Alert 陣列回傳
 */
export const E001_deviceOverlap: Detector = {
    code: 'E001',
    level: 'error',
    run(ctx: ValidationContext): Alert[] {
        const deviceMap = new Map<string, FactoryNode>();
        const machines: shironesMachine[] = [];

        // 轉換設備節點
        for (const device of ctx.devices) {
            const machineType = device.data?.machineType;
            if (!machineType) continue;

            const def = ctx.getDef(machineType);
            if (!def) continue;

            deviceMap.set(device.id, device);

            machines.push({
                id: device.id,
                position: [device.position.x, device.position.y, 0],
                rotation: (device.data?.rotation ?? 0) as Rotation,
                size: [def.width, def.height, 1],
            });
        }

        // 轉換管線（若有）
        const pipelines: shironesPipeline[] = [];
        const connectionIds = new Set<string>();

        for (const conn of ctx.connections) {
            connectionIds.add(conn.id);
            if (conn.data?.bendPoints && conn.data.bendPoints.length > 0) {
                pipelines.push({
                    id: conn.id,
                    waypoints: conn.data.bendPoints.map((bp) => [bp.x, bp.y, 0]),
                });
            }
        }

        // 執行底層純幾何重疊偵測
        const overlapPairs = detectOverlaps(machines, pipelines);

        if (overlapPairs.length === 0) {
            return [];
        }

        const alerts: Alert[] = [];

        for (const [idA, idB] of overlapPairs) {
            const devA = deviceMap.get(idA);
            const devB = deviceMap.get(idB);

            const nameA = devA
                ? (ctx.getDef(devA.data?.machineType ?? '')?.name ?? devA.data?.label ?? idA)
                : idA;
            const nameB = devB
                ? (ctx.getDef(devB.data?.machineType ?? '')?.name ?? devB.data?.label ?? idB)
                : idB;

            const message =
                idA === idB
                    ? `管線「${nameA}」與自身路徑重疊`
                    : `設備「${nameA}」與「${nameB}」位置重疊`;

            const relatedDeviceUids: string[] = [];
            const relatedConnectionUids: string[] = [];

            if (deviceMap.has(idA)) relatedDeviceUids.push(idA);
            else if (connectionIds.has(idA)) relatedConnectionUids.push(idA);

            if (idA !== idB) {
                if (deviceMap.has(idB)) relatedDeviceUids.push(idB);
                else if (connectionIds.has(idB)) relatedConnectionUids.push(idB);
            }

            alerts.push({
                uid: crypto.randomUUID(),
                code: 'E001',
                level: 'error',
                message,
                relatedDeviceUids,
                relatedConnectionUids,
            });
        }

        return alerts;
    },
};
