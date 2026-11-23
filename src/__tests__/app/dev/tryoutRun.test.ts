/**
 * V21-C1：試玩執行器打到真實 hitTestPortAt／findPortAt。
 */
import { describe, expect, it } from 'vitest';
import { anchorsForFixture, runTryout } from '@/app/dev/l1ContractLab/tryoutRun';

describe('runTryout', () => {
    it('單機熱區命中粉碎機 input[0]', () => {
        const ran = runTryout({
            api: 'hitTestPortAt',
            x: 0.5,
            y: 0.1,
            prefer: 'input',
            fixture: 'crusher-origin',
        });
        expect(ran.value).toMatchObject({
            api: 'hitTestPortAt',
            result: { deviceId: 'c', portType: 'input', portIndex: 0 },
        });
    });

    it('緊貼埠對埠：prefer 決定 output 或 input', () => {
        const asOutput = runTryout({
            api: 'hitTestPortAt',
            x: 1,
            y: 0.5,
            prefer: 'output',
            fixture: 'splitters-adjacent',
        });
        const asInput = runTryout({
            api: 'hitTestPortAt',
            x: 1,
            y: 0.5,
            prefer: 'input',
            fixture: 'splitters-adjacent',
        });
        expect(asOutput.value).toMatchObject({
            result: { deviceId: 'a', portType: 'output', portIndex: 1 },
        });
        expect(asInput.value).toMatchObject({
            result: { deviceId: 'b', portType: 'input', portIndex: 0 },
        });
    });

    it('整數錨點命中，熱區小數點為 null', () => {
        const anchors = anchorsForFixture('crusher-origin');
        expect(anchors).toContainEqual({
            deviceId: 'c',
            portType: 'input',
            portIndex: 0,
            x: 0,
            y: -1,
        });

        const hit = runTryout({
            api: 'findPortAt',
            x: 0,
            y: -1,
            prefer: 'input',
            fixture: 'crusher-origin',
        });
        const miss = runTryout({
            api: 'findPortAt',
            x: 0.5,
            y: 0.1,
            prefer: '',
            fixture: 'crusher-origin',
        });
        expect(hit.value).toMatchObject({
            result: { deviceId: 'c', portType: 'input', portIndex: 0 },
        });
        expect(miss.value).toMatchObject({ result: null });
    });

    it('合法皮帶：a 的右出料接到 b 的左進料', () => {
        const ran = runTryout({
            api: 'canConnect',
            x: 1,
            y: 0,
            endX: 0,
            endY: 0,
            media: 'belt',
            prefer: '',
            fixture: 'splitters-adjacent',
        });
        expect(ran.value).toMatchObject({
            api: 'canConnect',
            failure: null,
            result: {
                ok: true,
                from: { deviceId: 'a', portType: 'output', portIndex: 1 },
                to: { deviceId: 'b', portType: 'input', portIndex: 0 },
            },
        });
    });

    it('終點斜走：describeConnectFailure 的句子進 plain', () => {
        const ran = runTryout({
            api: 'canConnect',
            x: 1,
            y: 0,
            endX: 0,
            endY: 1,
            media: 'belt',
            prefer: '',
            fixture: 'splitters-adjacent',
        });
        const body = ran.value as { plain: string; failure: string; result: { ok: boolean } };
        expect(body.result).toEqual({ ok: false, reason: 'malformed' });
        expect(body.failure).toContain('不良構');
        expect(body.plain).toBe(body.failure);
    });
});
