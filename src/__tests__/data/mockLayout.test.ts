/**
 * mockLayout fixture 與 resolveConnections 對齊抽查
 */

import { describe, it, expect } from 'vitest';
import { getMockLayoutScenario } from '@/data/mockLayout';
import { resolveConnections } from '@/utils/layout/resolveConnections';
import { toTopology } from '@/utils/layout/toTopology';

describe('mockLayout fixtures', () => {
    it('connected：兩端皆掛埠且 toTopology 產出 1 邊', () => {
        const s = getMockLayoutScenario('connected');
        const conns = resolveConnections(s.devices, s.pipelines);
        expect(conns).toHaveLength(1);
        expect(conns[0].from).toEqual({
            deviceId: 'src',
            portType: 'output',
            portIndex: 1,
        });
        expect(conns[0].to).toEqual({
            deviceId: 'dst',
            portType: 'input',
            portIndex: 0,
        });
        expect(toTopology(s.devices, s.pipelines, conns).edges).toHaveLength(1);
    });

    it('broken：兩端 null 且 toTopology 無邊', () => {
        const s = getMockLayoutScenario('broken');
        const conns = resolveConnections(s.devices, s.pipelines);
        expect(conns[0].from).toBeNull();
        expect(conns[0].to).toBeNull();
        expect(toTopology(s.devices, s.pipelines, conns).edges).toHaveLength(0);
    });
});
