/**
 * V12-C1 — useLayoutStore 契約測試
 *
 * 釘 W0907-A0 §3 四點：
 *   1. connections 為 getter（隨 devices／pipelines 變）
 *   2. 放置重疊回傳 ok:false，不 throw
 *   3. 讀取面 readonly（外部 mutate 不影響內部）
 *   4. loadSnapshot(toLayoutSnapshot(scenario)) → toSnapshot 等值
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLayoutStore } from '@/store/layoutStore';
import { getMockLayoutScenario, toLayoutSnapshot } from '@/data/mockLayout';
import type { PlacedDevice, Pipeline } from '@/types/layout';

function freshStore() {
    setActivePinia(createPinia());
    return useLayoutStore();
}

function makeSplitter(id: string, x: number, y: number): PlacedDevice {
    return {
        id,
        machineType: 'splitter',
        position: { x, y, z: 0 },
        rotation: 0,
        label: id,
    };
}

describe('useLayoutStore — snapshot 對稱', () => {
    beforeEach(() => freshStore());

    it('loadSnapshot(toLayoutSnapshot(connected)) 後 toSnapshot 等值', () => {
        const store = useLayoutStore();
        const scenario = getMockLayoutScenario('connected');
        const input = toLayoutSnapshot(scenario);

        store.loadSnapshot(input);

        expect(store.toSnapshot()).toEqual(input);
    });

    it('loadSnapshot(toLayoutSnapshot(broken)) 後 toSnapshot 等值', () => {
        const store = useLayoutStore();
        const input = toLayoutSnapshot(getMockLayoutScenario('broken'));

        store.loadSnapshot(input);

        expect(store.toSnapshot()).toEqual(input);
    });

    it('toSnapshot 不含 connections 欄位', () => {
        const store = useLayoutStore();
        store.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('connected')));

        expect(store.toSnapshot()).not.toHaveProperty('connections');
    });
});

describe('useLayoutStore — connections getter', () => {
    beforeEach(() => freshStore());

    it('connected fixture：connections 端點非全 null', () => {
        const store = useLayoutStore();
        store.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('connected')));

        expect(store.connections).toHaveLength(1);
        expect(store.connections[0].from).not.toBeNull();
        expect(store.connections[0].to).not.toBeNull();
    });

    it('broken fixture：connections 端點為 null，管線仍在', () => {
        const store = useLayoutStore();
        store.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('broken')));

        expect(store.pipelines).toHaveLength(1);
        expect(store.connections).toHaveLength(1);
        expect(store.connections[0].from).toBeNull();
        expect(store.connections[0].to).toBeNull();
    });

    it('removeDevice 後 connections 重算（可斷線），管線保留', () => {
        const store = useLayoutStore();
        store.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('connected')));

        store.removeDevice('src');

        expect(store.devices.map((d) => d.id)).toEqual(['dst']);
        expect(store.pipelines).toHaveLength(1);
        expect(store.connections[0].from).toBeNull();
    });

    it('removePipeline 後 connections 變短', () => {
        const store = useLayoutStore();
        store.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('connected')));

        store.removePipeline('pipe-ok');

        expect(store.pipelines).toHaveLength(0);
        expect(store.connections).toHaveLength(0);
    });
});

describe('useLayoutStore — PlacementResult（不 throw）', () => {
    beforeEach(() => freshStore());

    it('addDevice 成功回傳 ok:true 並寫入', () => {
        const store = useLayoutStore();
        const result = store.addDevice(makeSplitter('a', 0, 0));

        expect(result).toEqual({ ok: true });
        expect(store.devices).toHaveLength(1);
        expect(store.devices[0].id).toBe('a');
    });

    it('addDevice 重疊回傳 ok:false reason:overlap，不寫入', () => {
        const store = useLayoutStore();
        expect(store.addDevice(makeSplitter('a', 0, 0)).ok).toBe(true);

        const result = store.addDevice(makeSplitter('b', 0, 0));

        expect(result).toEqual({ ok: false, reason: 'overlap' });
        expect(store.devices).toHaveLength(1);
        expect(store.devices[0].id).toBe('a');
    });

    it('moveDevice 重疊回傳 overlap，位置不變', () => {
        const store = useLayoutStore();
        store.addDevice(makeSplitter('a', 0, 0));
        store.addDevice(makeSplitter('b', 3, 0));

        const result = store.moveDevice('b', { x: 0, y: 0, z: 0 });

        expect(result).toEqual({ ok: false, reason: 'overlap' });
        expect(store.devices.find((d) => d.id === 'b')?.position).toEqual({ x: 3, y: 0, z: 0 });
    });

    it('moveDevice 成功更新座標', () => {
        const store = useLayoutStore();
        store.addDevice(makeSplitter('a', 0, 0));

        const result = store.moveDevice('a', { x: 5, y: 2, z: 0 });

        expect(result).toEqual({ ok: true });
        expect(store.devices[0].position).toEqual({ x: 5, y: 2, z: 0 });
    });

    it('找不到 uid／未知機器 → invalid，不 throw', () => {
        const store = useLayoutStore();

        expect(store.moveDevice('missing', { x: 0, y: 0, z: 0 })).toEqual({
            ok: false,
            reason: 'invalid',
        });
        expect(
            store.addDevice({
                id: 'bad',
                machineType: 'not_a_real_machine_zzz',
                position: { x: 0, y: 0, z: 0 },
                rotation: 0,
            }),
        ).toEqual({ ok: false, reason: 'invalid' });
        expect(store.addDevice(makeSplitter('dup', 0, 0)).ok).toBe(true);
        expect(store.addDevice(makeSplitter('dup', 10, 0))).toEqual({
            ok: false,
            reason: 'invalid',
        });
    });

    it('addPipeline 重複 id → invalid；成功路徑 ok', () => {
        const store = useLayoutStore();
        const pipe: Pipeline = {
            id: 'p1',
            media: 'belt',
            waypoints: [
                { x: 10, y: 10, z: 0 },
                { x: 11, y: 10, z: 0 },
            ],
        };

        expect(store.addPipeline(pipe)).toEqual({ ok: true });
        expect(store.addPipeline(pipe)).toEqual({ ok: false, reason: 'invalid' });
        expect(store.pipelines).toHaveLength(1);
    });
});

describe('useLayoutStore — 讀取面 readonly', () => {
    beforeEach(() => freshStore());

    it('直接 mutate devices 陣列不影響 store 內部長度', () => {
        const store = useLayoutStore();
        store.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('connected')));
        const before = store.devices.length;

        try {
            // readonly proxy：dev 可能 warn；不得改變內部
            (store.devices as PlacedDevice[]).push(makeSplitter('hack', 99, 99));
        } catch {
            // 部分環境對 readonly 賦值會 throw，亦可接受
        }

        expect(store.devices).toHaveLength(before);
        expect(store.devices.map((d) => d.id)).not.toContain('hack');
    });

    it('改 toSnapshot 回傳值不回寫 store', () => {
        const store = useLayoutStore();
        store.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('connected')));

        const snap = store.toSnapshot();
        snap.devices.push(makeSplitter('hack', 99, 99));

        expect(store.devices.map((d) => d.id)).not.toContain('hack');
    });
});
