import { describe, it, expect } from 'vitest';
import type { FactoryNode, FactoryEdge } from '@/types/graph';
import type { Machine, PortMedia } from '@/types/machine';
import type { ValidationContext } from '@/types/validation';
import { E001_deviceOverlap } from '@/lib/validation/detectors/E001_deviceOverlap';

/**
 * 建立最小機器定義測試 fixture。
 * 只填幾何與埠欄位，其餘欄位不影響重疊判定，故以斷言略過型別完整性。
 */
function makeDef(name: string, width: number, height: number): Machine {
    return {
        name,
        width,
        height,
        modes: [
            {
                id: 'default',
                label: 'default',
                input_ports: [{ side: 'left', offset: 0, media: 'belt' }],
                output_ports: [{ side: 'right', offset: 0, media: 'belt' }],
                loss: null,
            },
        ],
    } as unknown as Machine;
}

/** 建立最小節點測試 fixture；position 為格子座標 */
function makeNode(
    id: string,
    machineType: string,
    x: number,
    y: number,
    rotation: 0 | 1 | 2 | 3 = 0,
): FactoryNode {
    return {
        id,
        position: { x, y },
        data: { label: machineType, machineType, rotation },
    } as FactoryNode;
}

/** 建立最小連線測試 fixture；bendPoints 為格子座標 */
function makeEdge(
    id: string,
    source: string,
    target: string,
    portType: PortMedia = 'belt',
    bendPoints?: { x: number; y: number }[],
): FactoryEdge {
    return {
        id,
        source,
        target,
        sourceHandle: 'out-0',
        targetHandle: 'in-0',
        data: bendPoints ? { portType, bendPoints } : { portType },
    } as FactoryEdge;
}

/** 建立最小驗證上下文 */
function makeCtx(
    devices: FactoryNode[],
    defs: Record<string, Machine>,
    connections: FactoryEdge[] = [],
): ValidationContext {
    return {
        devices,
        connections,
        getDef: (type: string) => defs[type],
        baseRegion: null,
    };
}

describe('E001_deviceOverlap Detector', () => {
    const defs = {
        粉碎機: makeDef('粉碎機', 3, 2),
        塑型機: makeDef('塑型機', 2, 2),
    };

    describe('設備之間', () => {
        it('兩台設備分開時不產生警示', () => {
            const ctx = makeCtx(
                [makeNode('dev_a', '粉碎機', 0, 0), makeNode('dev_b', '塑型機', 10, 10)],
                defs,
            );
            expect(E001_deviceOverlap.run(ctx)).toEqual([]);
        });

        it('兩台設備重疊時產生一筆 E001 Alert', () => {
            const ctx = makeCtx(
                [makeNode('dev_a', '粉碎機', 0, 0), makeNode('dev_b', '塑型機', 1, 0)],
                defs,
            );
            const alerts = E001_deviceOverlap.run(ctx);

            expect(alerts).toHaveLength(1);
            expect(alerts[0].code).toBe('E001');
            expect(alerts[0].level).toBe('error');
            expect(alerts[0].relatedDeviceUids).toEqual(expect.arrayContaining(['dev_a', 'dev_b']));
            expect(alerts[0].message).toContain('粉碎機');
            expect(alerts[0].message).toContain('塑型機');
        });

        it('考慮旋轉時能正確判定重疊', () => {
            // 粉碎機 3x2 旋轉 90 度（rotation 1）變成 2x3，佔用 x: 0..1、y: 0..2
            // 塑型機 2x2 在 (0, 2) 與其在 y=2 處相撞
            const ctxCollide = makeCtx(
                [makeNode('dev_rot', '粉碎機', 0, 0, 1), makeNode('dev_b', '塑型機', 0, 2, 0)],
                defs,
            );
            expect(E001_deviceOverlap.run(ctxCollide)).toHaveLength(1);

            // 不旋轉時 3x2 的 y 只佔用 0..1，與 (0, 2) 不重疊
            const ctxSafe = makeCtx(
                [makeNode('dev_norot', '粉碎機', 0, 0, 0), makeNode('dev_b', '塑型機', 0, 2, 0)],
                defs,
            );
            expect(E001_deviceOverlap.run(ctxSafe)).toEqual([]);
        });

        it('缺 getDef 定義時安全略過該節點而不崩潰', () => {
            const ctx = makeCtx(
                [makeNode('dev_unknown', '不存在的機器', 0, 0), makeNode('dev_b', '塑型機', 0, 0)],
                defs,
            );
            expect(() => E001_deviceOverlap.run(ctx)).not.toThrow();
            expect(E001_deviceOverlap.run(ctx)).toEqual([]);
        });
    });

    describe('管線', () => {
        it('連線只連自己兩端時不產生警示', () => {
            // 端點取埠外側一格，不落在來源與目標設備自身的佔格內
            const ctx = makeCtx(
                [makeNode('dev_a', '塑型機', 0, 0), makeNode('dev_b', '塑型機', 6, 0)],
                defs,
                [makeEdge('conn_1', 'dev_a', 'dev_b')],
            );
            expect(E001_deviceOverlap.run(ctx)).toEqual([]);
        });

        it('無彎折點的直線連線穿越第三台設備時產生警示', () => {
            // dev_mid 佔 x: 3..4、y: 0..1，落在出口 (2,0) 到入口 (5,0) 的直線上
            const ctx = makeCtx(
                [
                    makeNode('dev_a', '塑型機', 0, 0),
                    makeNode('dev_b', '塑型機', 6, 0),
                    makeNode('dev_mid', '塑型機', 3, 0),
                ],
                defs,
                [makeEdge('conn_1', 'dev_a', 'dev_b')],
            );
            const alerts = E001_deviceOverlap.run(ctx);

            expect(alerts).toHaveLength(1);
            expect(alerts[0].relatedDeviceUids).toEqual(['dev_mid']);
            expect(alerts[0].relatedConnectionUids).toEqual(['conn_1']);
        });

        it('水管走空中層時與傳送帶互不阻擋', () => {
            const ctx = makeCtx(
                [makeNode('dev_a', '塑型機', 0, 0), makeNode('dev_b', '塑型機', 6, 0)],
                defs,
                [
                    makeEdge('belt_1', 'dev_a', 'dev_b', 'belt'),
                    makeEdge('pipe_1', 'dev_a', 'dev_b', 'pipe'),
                ],
            );
            expect(E001_deviceOverlap.run(ctx)).toEqual([]);
        });

        it('水管穿越一般設備時產生警示', () => {
            // 一般設備佔用層為 {0, 1}，水管在 z=1，交集非空
            const ctx = makeCtx(
                [
                    makeNode('dev_a', '塑型機', 0, 0),
                    makeNode('dev_b', '塑型機', 6, 0),
                    makeNode('dev_mid', '塑型機', 3, 0),
                ],
                defs,
                [makeEdge('pipe_1', 'dev_a', 'dev_b', 'pipe')],
            );
            const alerts = E001_deviceOverlap.run(ctx);

            expect(alerts).toHaveLength(1);
            expect(alerts[0].relatedConnectionUids).toEqual(['pipe_1']);
        });

        it('連線端點指向不存在的節點時安全略過', () => {
            const ctx = makeCtx([makeNode('dev_a', '塑型機', 0, 0)], defs, [
                makeEdge('conn_1', 'dev_a', 'dev_missing'),
            ]);
            expect(() => E001_deviceOverlap.run(ctx)).not.toThrow();
            expect(E001_deviceOverlap.run(ctx)).toEqual([]);
        });
    });
});
