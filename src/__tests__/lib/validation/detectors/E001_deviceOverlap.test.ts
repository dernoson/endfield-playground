import { describe, it, expect } from 'vitest';
import type { FactoryNode, FactoryEdge } from '@/types/graph';
import type { Machine } from '@/types/machine';
import type { ValidationContext } from '@/types/validation';
import { E001_deviceOverlap } from '@/lib/validation/detectors/E001_deviceOverlap';

/** 建立最小機器定義測試 fixture */
function makeDef(name: string, width: number, height: number): Machine {
    return { name, width, height, modes: [] } as unknown as Machine;
}

/** 建立最小節點測試 fixture */
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

    it('兩台設備分開時不產生警示', () => {
        const ctx = makeCtx(
            [makeNode('dev_a', '粉碎機', 0, 0), makeNode('dev_b', '塑型機', 10, 10)],
            defs,
        );
        const alerts = E001_deviceOverlap.run(ctx);
        expect(alerts).toEqual([]);
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
        // 粉碎機 (3x2) 旋轉 90° (rotation 1) 變成 2x3，佔用 x: 0..1, y: 0..2
        // 塑型機 (2x2) 在 (0, 2) 與其在 y=2 處相撞
        const ctxCollide = makeCtx(
            [makeNode('dev_rot', '粉碎機', 0, 0, 1), makeNode('dev_b', '塑型機', 0, 2, 0)],
            defs,
        );
        expect(E001_deviceOverlap.run(ctxCollide)).toHaveLength(1);

        // 如果不旋轉 (3x2)，y 只佔用 0..1，與 (0, 2) 不重疊
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
