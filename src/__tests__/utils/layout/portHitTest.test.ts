/**
 * V15-D1／W1004-A0 ③ — hitTestPortAt 單元測試
 *
 * 釘：錨點上／熱區邊緣／區外／四向旋轉／多埠最近／無 store。
 */

import { describe, expect, it } from 'vitest';
import type { PlacedDevice } from '@/types/layout';
import { collectPortAnchors } from '@/utils/layout/portAnchorIndex';
import { DEFAULT_HIT_RADIUS_CELLS, hitTestPortAt } from '@/utils/layout/portHitTest';

function makeSplitter(id: string, x: number, y: number, rotation: 0 | 1 | 2 | 3 = 0): PlacedDevice {
    return {
        id,
        machineType: 'splitter',
        position: { x, y, z: 0 },
        rotation,
        label: id,
    };
}

function firstOutputAnchor(device: PlacedDevice) {
    const anchors = collectPortAnchors([device]);
    const out = anchors.find((a) => a.ref.portType === 'output');
    if (!out) throw new Error('expected output anchor');
    return out;
}

describe('hitTestPortAt', () => {
    it('預設熱區半徑為半格', () => {
        expect(DEFAULT_HIT_RADIUS_CELLS).toBe(0.5);
    });

    it('點在埠錨點上 → 命中（含 PortRef 三鍵＋side＋media）', () => {
        const device = makeSplitter('s', 10, 10, 0);
        const anchor = firstOutputAnchor(device);
        const hit = hitTestPortAt({ x: anchor.x, y: anchor.y }, [device]);

        expect(hit).not.toBeNull();
        expect(hit).toMatchObject({
            deviceId: 's',
            portType: anchor.ref.portType,
            portIndex: anchor.ref.portIndex,
            media: 'belt',
        });
        expect(hit!.side).toMatch(/^(top|right|bottom|left)$/);
    });

    it('點在熱區邊緣內（距離＝0.5）→ 命中', () => {
        const device = makeSplitter('s', 10, 10, 0);
        const anchor = firstOutputAnchor(device);
        const hit = hitTestPortAt({ x: anchor.x + 0.5, y: anchor.y }, [device]);
        expect(hit?.deviceId).toBe('s');
    });

    it('點在熱區外 → null', () => {
        const device = makeSplitter('s', 10, 10, 0);
        const anchor = firstOutputAnchor(device);
        expect(hitTestPortAt({ x: anchor.x + 0.51, y: anchor.y }, [device])).toBeNull();
        expect(hitTestPortAt({ x: 100, y: 100 }, [device])).toBeNull();
    });

    it('四種 rotation 皆可命中各自錨點', () => {
        for (const rotation of [0, 1, 2, 3] as const) {
            const device = makeSplitter(`r${rotation}`, 20, 20, rotation);
            const anchors = collectPortAnchors([device]);
            expect(anchors.length).toBeGreaterThan(0);

            for (const anchor of anchors) {
                const hit = hitTestPortAt({ x: anchor.x, y: anchor.y }, [device]);
                expect(hit, `rot=${rotation} @(${anchor.x},${anchor.y})`).toMatchObject({
                    deviceId: device.id,
                    portType: anchor.ref.portType,
                    portIndex: anchor.ref.portIndex,
                });
            }
        }
    });

    it('多埠同時在熱區內 → 取距離最近者', () => {
        const a = makeSplitter('a', 0, 0, 0);
        const b = makeSplitter('b', 5, 0, 0);
        const aOut = firstOutputAnchor(a);
        /** 點落在 a 錨點上、且離 b 更遠 */
        const hit = hitTestPortAt({ x: aOut.x, y: aOut.y }, [a, b]);
        expect(hit?.deviceId).toBe('a');
    });

    it('同距離時取 collectPortAnchors 掃描序較前者', () => {
        /**
         * 兩台 splitter 擺成某錨點對稱距離困難；改用自訂 getMachine 不易。
         * 改驗：同一設備多埠時，點在兩錨點正中且等距 → 掃描序先出現者。
         * splitter rot0：left input @ (9,10)、若有 output 與之等距則比序。
         */
        const device = makeSplitter('s', 10, 10, 0);
        const anchors = collectPortAnchors([device]);
        const left = anchors.find((a) => a.x === 9 && a.y === 10);
        const top = anchors.find((a) => a.x === 10 && a.y === 9);
        expect(left && top).toBeTruthy();

        /** 中點 (9.5, 9.5) 到兩錨距離皆 √0.5 ≈ 0.707 > 0.5 → 預設半徑無命中 */
        expect(hitTestPortAt({ x: 9.5, y: 9.5 }, [device])).toBeNull();

        /** 放大半徑後等距；掃描序：input 先於 output → left input 勝 */
        const hit = hitTestPortAt({ x: 9.5, y: 9.5 }, [device], undefined, {
            hitRadiusCells: 1,
        });
        expect(hit).toMatchObject({
            deviceId: 's',
            portType: 'input',
            portIndex: 0,
        });
    });

    it('未知機型設備不產生命中', () => {
        const ghost: PlacedDevice = {
            id: 'ghost',
            machineType: 'not_a_real_machine_zzz',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
        };
        expect(hitTestPortAt({ x: 0, y: 0 }, [ghost])).toBeNull();
    });

    it('空設備列表 → null', () => {
        expect(hitTestPortAt({ x: 0, y: 0 }, [])).toBeNull();
    });
});

describe('hitTestPortAt — 無 store 依賴', () => {
    it('模組原始碼不含 pinia／store import', async () => {
        const fs = await import('node:fs/promises');
        const path = await import('node:path');
        const src = await fs.readFile(path.resolve('src/utils/layout/portHitTest.ts'), 'utf8');
        expect(src).not.toMatch(/from ['"]@\/store\//);
        expect(src).not.toMatch(/from ['"]pinia['"]/);
        expect(src).not.toMatch(/defineStore|useLayoutStore|useEditorStore/);
    });
});
