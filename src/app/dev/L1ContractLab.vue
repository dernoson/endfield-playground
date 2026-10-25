<script setup lang="ts">
/**
 * V14–V17 L1 契約實驗室
 *
 * 給串接／呼叫端：定義表＋可點案例（呼叫真實 API，輸出 JSON）。
 * 不取代各版專頁；深鏈見 {@link CONTRACT_BLOCKS}.deeperDemo。
 */
import { computed, ref } from 'vue';
import { createPinia, getActivePinia, setActivePinia } from 'pinia';
import type { Connection, PlacedDevice, Pipeline } from '@/types/layout';
import { getMachineMode } from '@/types/machine';
import { getMachineById, getMachine, resolveMachineDef } from '@/data/machines';
import { getRecipesForMachine } from '@/data/products';
import {
    DRAFT_ID,
    canPlaceDevice,
    canMoveDevice,
    type DeviceDraft,
} from '@/utils/layout/placementCheck';
import { canConnect, describeConnectFailure } from '@/utils/layout/connectRules';
import { devicesOutsideBase } from '@/utils/layout/devicesOutsideBase';
import { hitTestPortAt } from '@/utils/layout/portHitTest';
import { toTopology } from '@/utils/layout/toTopology';
import { resolveDisplayGrid, rotatePort } from '@/utils/portUtils';
import { resolvePortAnchorCell } from '@/utils/layout/portAnchors';
import {
    buildGraph,
    validateChains,
    topologicalSort,
    propagateFlows,
} from '@/composables/useFlowEngine';
import { useLayoutStore } from '@/store/layoutStore';
import { useHistoryStore } from '@/store/historyStore';
import {
    historyContextFromPath,
    shouldClearHistoryOnNavigate,
} from '@/utils/history/historyContext';
import { CONTRACT_BLOCKS, type ContractVersion } from '@/app/dev/l1ContractLab/contractCatalog';

/** 目前分頁：總覽或某契約版本 */
const active = ref<ContractVersion | 'overview'>('overview');

/** 契約塊列表（來自 catalog） */
const blocks = CONTRACT_BLOCKS;

/** 目前選中的契約塊；總覽時為 null */
const activeBlock = computed(() => blocks.find((b) => b.version === active.value) ?? null);

/** 結果面板標題 */
const outputTitle = ref('尚未執行');

/** 結果面板 JSON 字串 */
const outputJson = ref('點下方「執行」按鈕，結果會顯示在這裡。');

/**
 * 把案例結果寫進輸出面板
 *
 * @param title 標題
 * @param value 任意可 JSON 化物件
 */
function showResult(title: string, value: unknown) {
    outputTitle.value = title;
    outputJson.value = JSON.stringify(value, null, 2);
}

/**
 * 在獨立 Pinia 實例上執行寫入示範，避免污染 SPA 共用 layoutStore／history
 *
 * @param run 在臨時 Pinia 為 active 時執行的函式
 */
function withLabPinia<T>(run: () => T): T {
    const previous = getActivePinia();
    const labPinia = createPinia();
    setActivePinia(labPinia);
    try {
        return run();
    } finally {
        if (previous) {
            setActivePinia(previous);
        }
    }
}

/**
 * 測試用 splitter 設備（真實機型 id）
 *
 * @param id 設備 uid
 * @param x 佔格左上角 x
 * @param y 佔格左上角 y
 */
function splitterAt(id: string, x: number, y: number): PlacedDevice {
    return {
        id,
        machineType: 'splitter',
        position: { x, y, z: 0 },
        rotation: 0,
        label: id,
    };
}

/**
 * 取設備第一個入／出埠的外側錨點格（給 canConnect waypoints）
 *
 * @param device 已放置設備
 * @param portType 輸入或輸出
 */
function portAnchor(
    device: PlacedDevice,
    portType: 'input' | 'output',
): { x: number; y: number; z: number } {
    const def = getMachineById(device.machineType)!;
    const mode = getMachineMode(def, device.machineMode);
    const ports = portType === 'input' ? mode.input_ports : mode.output_ports;
    const port = ports[0]!;
    const rotated = rotatePort(port.side, port.offset, def.width, def.height, device.rotation);
    const display = resolveDisplayGrid(def.width, def.height, device.rotation);
    const cell = resolvePortAnchorCell(
        device.position.x,
        device.position.y,
        display.widthCells,
        display.heightCells,
        rotated.side,
        rotated.offset,
    );
    return { x: cell.x, y: cell.y, z: 0 };
}

/** V14：空地放置預檢 */
function runV14PlaceOk() {
    const result = canPlaceDevice(
        { machineType: 'splitter', position: { x: 5, y: 0, z: 0 }, rotation: 0 },
        { devices: [splitterAt('a', 0, 0)], pipelines: [] },
    );
    showResult('canPlaceDevice（空地 → ok）', { ...result, DRAFT_ID });
}

/** V14：重疊放置預檢（仍回 overlap；寫入層不擋） */
function runV14PlaceOverlap() {
    const draft: DeviceDraft = {
        machineType: 'splitter',
        position: { x: 0, y: 0, z: 0 },
        rotation: 0,
    };
    const result = canPlaceDevice(draft, {
        devices: [splitterAt('a', 0, 0)],
        pipelines: [],
    });
    showResult('canPlaceDevice（重疊 → overlap；conflicts 含 DRAFT_ID）', result);
}

/** V14：原位移動必 ok */
function runV14MoveSame() {
    const d = splitterAt('a', 2, 3);
    const result = canMoveDevice('a', { x: 2, y: 3, z: 0 }, { devices: [d], pipelines: [] });
    showResult('canMoveDevice（原位 → 必 ok）', result);
}

/** V14：合法 belt 連線 */
function runV14ConnectOk() {
    const src = splitterAt('src', 0, 0);
    const dst = splitterAt('dst', 4, 0);
    const start = portAnchor(src, 'output');
    const end = portAnchor(dst, 'input');
    const result = canConnect(
        { media: 'belt', waypoints: [start, { x: 2, y: start.y, z: 0 }, end] },
        { devices: [src, dst], pipelines: [] },
        getMachineById,
    );
    showResult('canConnect（合法 belt）', {
        result,
        describe: describeConnectFailure(result),
    });
}

/** V15 案例群 */

/** V15：有基地時的出界 id */
function runV15Outside() {
    const devices: PlacedDevice[] = [splitterAt('in', 0, 0), splitterAt('far', 300, 0)];
    const ids = devicesOutsideBase(devices, 'wuling');
    showResult('devicesOutsideBase（wuling 256×256）', {
        region: 'wuling',
        outsideIds: ids,
        note: '出界仍可 addDevice；此列表只供視覺 Error',
    });
}

/** V15：未選基地 → 出界一律空 */
function runV15OutsideNullRegion() {
    const ids = devicesOutsideBase([splitterAt('x', 999, 999)], null);
    showResult('devicesOutsideBase（region=null）', {
        outsideIds: ids,
        note: '未選基地 → 一律 []',
    });
}

/** V15：埠熱區命中 */
function runV15HitTest() {
    const device: PlacedDevice = {
        id: 'c',
        machineType: 'crusher',
        position: { x: 0, y: 0, z: 0 },
        rotation: 0,
    };
    const def = getMachineById('crusher')!;
    const mode = getMachineMode(def);
    // 點在第一個 input 埠附近（熱區）
    const hit = hitTestPortAt({ x: 0.5, y: 0.1 }, [device], getMachineById, {
        prefer: 'input',
    });
    showResult('hitTestPortAt（crusher 附近）', {
        point: { x: 0.5, y: 0.1 },
        prefer: 'input',
        hit,
        inputPorts: mode.input_ports.length,
        note: '連續格座標；圓心＝埠邊心，不是外側錨點格',
    });
}

/** V16 案例群 */

/**
 * V16：純資料證明 toTopology 帶出 primaryOutput（不寫任何 store）
 */
function runV16TopologyMapping() {
    const devices: PlacedDevice[] = [
        {
            id: 'src',
            machineType: 'material_source',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            machineMode: 'solid_belt',
            primaryOutput: '源礦',
            sourceRatePerMin: 30,
        },
    ];
    const { nodes } = toTopology(devices, [], []);
    showResult('toTopology 映射 primaryOutput（純資料，不寫 store）', {
        input: {
            primaryOutput: devices[0]!.primaryOutput,
            sourceRatePerMin: devices[0]!.sourceRatePerMin,
            machineType: devices[0]!.machineType,
        },
        nodeData: nodes[0]?.data,
        note: '正式寫入請呼叫 layoutStore.setDevicePrimaryOutput(uid, itemId, rate?)',
    });
}

/**
 * V16：在**獨立 Pinia** 上示範 setDevicePrimaryOutput（不污染正式頁 layoutStore）
 */
function runV16StoreAction() {
    const payload = withLabPinia(() => {
        const layout = useLayoutStore();
        const history = useHistoryStore();
        const id = `lab-src-${Date.now()}`;
        const placed = layout.addDevice({
            id,
            machineType: 'material_source',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            machineMode: 'solid_belt',
        });
        if (!placed.ok) {
            return {
                error: 'addDevice failed（僅 invalid 會失敗；重疊應 ok）',
                placed,
            };
        }
        const depthBefore = history.undoDepth;
        layout.setDevicePrimaryOutput(id, '源礦');
        const device = layout.devices.find((d) => d.id === id);
        return {
            isolation: 'createPinia 臨時實例；結束後已還原 SPA active Pinia',
            device: {
                id,
                primaryOutput: device?.primaryOutput,
                sourceRatePerMin: device?.sourceRatePerMin,
            },
            undoDepthBefore: depthBefore,
            undoDepthAfter: history.undoDepth,
        };
    });
    showResult('setDevicePrimaryOutput（獨立 Pinia，不寫正式頁）', payload);
}

/**
 * V16／V18：獨立 Pinia 示範 rotateDevice（原點不動、進歷史）
 */
function runV16RotateDevice() {
    const payload = withLabPinia(() => {
        const layout = useLayoutStore();
        const history = useHistoryStore();
        layout.addDevice({
            id: 'rot',
            machineType: 'filling_machine',
            position: { x: 3, y: 3, z: 0 },
            rotation: 0,
        });
        history.clear();
        const beforePos = { ...layout.devices[0]!.position };
        const result = layout.rotateDevice('rot', 1);
        return {
            isolation: '獨立 Pinia',
            result,
            positionUnchanged: layout.devices[0]!.position,
            expectedPosition: beforePos,
            rotation: layout.devices[0]!.rotation,
            undoDepth: history.undoDepth,
            note: '重疊不擋寫入；E001 看 layoutIssues',
        };
    });
    showResult('rotateDevice（獨立 Pinia）', payload);
}

/** V17：resolveMachineDef 與配方鍵 */
function runV17Resolve() {
    const byId = resolveMachineDef('crusher');
    const byName = resolveMachineDef('粉碎機');
    const recipesByWrongKey = getRecipesForMachine('crusher', 'default');
    const recipesByName = byId ? getRecipesForMachine(byId.name, 'default') : [];
    showResult('resolveMachineDef＋配方鍵', {
        byId: byId && { id: byId.id, name: byId.name },
        byName: byName && { id: byName.id, name: byName.name },
        sameRef: byId === byName,
        recipesIfPassEnglishId: recipesByWrongKey.length,
        recipesViaDefName: recipesByName.length,
        note: '英文 id 當配方鍵通常＝0 條；必須用 def.name',
    });
}

/** V17：純函式引擎 30/min 產線（不寫 store） */
function runV17EngineSlice() {
    const devices: PlacedDevice[] = [
        {
            id: 'src',
            machineType: 'material_source',
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            machineMode: 'solid_belt',
            primaryOutput: '源礦',
            sourceRatePerMin: 30,
        },
        {
            id: 'crusher',
            machineType: 'crusher',
            position: { x: 4, y: 0, z: 0 },
            rotation: 0,
            machineMode: 'default',
        },
        {
            id: 'sink',
            machineType: 'item_sink',
            position: { x: 10, y: 0, z: 0 },
            rotation: 0,
        },
    ];
    const pipelines: Pipeline[] = [
        {
            id: 'p1',
            media: 'belt',
            waypoints: [
                { x: 1, y: 1, z: 0 },
                { x: 3, y: 1, z: 0 },
            ],
        },
        {
            id: 'p2',
            media: 'belt',
            waypoints: [
                { x: 7, y: 1, z: 0 },
                { x: 9, y: 1, z: 0 },
            ],
        },
    ];
    const connections: Connection[] = [
        {
            id: 'p1',
            pipelineId: 'p1',
            from: { deviceId: 'src', portType: 'output', portIndex: 0 },
            to: { deviceId: 'crusher', portType: 'input', portIndex: 0 },
        },
        {
            id: 'p2',
            pipelineId: 'p2',
            from: { deviceId: 'crusher', portType: 'output', portIndex: 0 },
            to: { deviceId: 'sink', portType: 'input', portIndex: 0 },
        },
    ];
    const { nodes, edges } = toTopology(devices, pipelines, connections);
    const graph = buildGraph(nodes, edges);
    validateChains(graph);
    const flows = propagateFlows(topologicalSort(graph), graph);
    showResult('toTopology → 引擎（源礦 30 產線）', {
        machineTypes: nodes.map((n) => n.data?.machineType),
        sourceOut: graph.nodes.get('src')?.outputRates.get('源礦'),
        crusherIn: graph.nodes.get('crusher')?.inputRates.get('源礦'),
        crusherOut: graph.nodes.get('crusher')?.outputRates.get('源石粉末'),
        sinkIn: graph.nodes.get('sink')?.inputRates.get('源石粉末'),
        edgeP1: flows.get('p1'),
        edgeP2: flows.get('p2'),
    });
}

/** V17：history 情境與跨頁是否 clear（純規則，不寫 store） */
function runV17HistoryContext() {
    showResult('history 情境邊界', {
        contexts: {
            '/': historyContextFromPath('/'),
            '/dev/flow-engine': historyContextFromPath('/dev/flow-engine'),
            '/dev/paper-fig-main-field': historyContextFromPath('/dev/paper-fig-main-field'),
        },
        shouldClear: {
            '／→／dev': shouldClearHistoryOnNavigate('/', '/dev/history-replay'),
            '／dev/a→／dev/b': shouldClearHistoryOnNavigate('/dev/a', '/dev/b'),
            '／dev→／': shouldClearHistoryOnNavigate('/dev/x', '/'),
        },
        note: 'router.afterEach 已掛；同區不清。獨立 HTML preview 另 Pinia。',
        getMachineStillExists: typeof getMachine === 'function',
    });
}

/**
 * 可點案例列
 */
interface PlayCase {
    /** 穩定 id（列表 key） */
    id: string;
    /** 按鈕文案 */
    label: string;
    /** 執行函式 */
    run: () => void;
}

/** 各版本可點案例 */
const playByVersion: Record<ContractVersion, PlayCase[]> = {
    V14: [
        { id: 'p-ok', label: 'canPlaceDevice 空地', run: runV14PlaceOk },
        { id: 'p-ov', label: 'canPlaceDevice 重疊', run: runV14PlaceOverlap },
        { id: 'p-mv', label: 'canMoveDevice 原位', run: runV14MoveSame },
        { id: 'p-cn', label: 'canConnect 試跑', run: runV14ConnectOk },
    ],
    V15: [
        { id: 'o1', label: 'devicesOutsideBase（有基地）', run: runV15Outside },
        { id: 'o2', label: 'devicesOutsideBase（null）', run: runV15OutsideNullRegion },
        { id: 'h1', label: 'hitTestPortAt', run: runV15HitTest },
    ],
    V16: [
        { id: 's1', label: 'toTopology 映射（不寫 store）', run: runV16TopologyMapping },
        { id: 's2', label: 'setDevicePrimaryOutput（獨立 Pinia）', run: runV16StoreAction },
        { id: 's3', label: 'rotateDevice（獨立 Pinia）', run: runV16RotateDevice },
    ],
    V17: [
        { id: 'r1', label: 'resolveMachineDef＋配方鍵', run: runV17Resolve },
        { id: 'e1', label: '引擎 30/min 產線', run: runV17EngineSlice },
        { id: 'h1', label: 'history 情境規則', run: runV17HistoryContext },
    ],
};
</script>

<template>
    <div class="space-y-6 text-gray-900 dark:text-gray-100">
        <header class="space-y-2">
            <h1 class="text-2xl font-bold">L1 契約實驗室（V14–V17）</h1>
            <p class="max-w-3xl text-sm text-gray-600 dark:text-gray-400">
                本頁彙整 aaaaa 近幾版<strong>底層純函式／store 契約</strong
                >：給串接畫布、驗證、引擎的人對照「該呼叫誰、鍵是 id 還是中文名、回傳長怎樣」。
                每個案例都跑<strong>真實 API</strong>，結果在下方 JSON。不發解鎖句；正式
                UI／右側產耗不在此頁範圍。
            </p>
            <p class="text-xs text-amber-800 dark:text-amber-200">
                DEV ONLY ·
                <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">/dev/l1-contract-lab</code>
            </p>
        </header>

        <!-- 版本切換 -->
        <nav class="flex flex-wrap gap-2">
            <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-sm font-medium"
                :class="
                    active === 'overview'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200'
                "
                @click="active = 'overview'"
            >
                總覽
            </button>
            <button
                v-for="b in blocks"
                :key="b.version"
                type="button"
                class="rounded-lg px-3 py-1.5 text-sm font-medium"
                :class="
                    active === b.version
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200'
                "
                @click="active = b.version"
            >
                {{ b.version }}
            </button>
        </nav>

        <!-- 總覽 -->
        <section v-if="active === 'overview'" class="space-y-4">
            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table class="min-w-full text-left text-sm">
                    <thead
                        class="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase dark:bg-gray-800"
                    >
                        <tr>
                            <th class="px-3 py-2">版</th>
                            <th class="px-3 py-2">主題</th>
                            <th class="px-3 py-2">PR</th>
                            <th class="px-3 py-2">一句話</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="b in blocks"
                            :key="b.version"
                            class="cursor-pointer border-t border-gray-100 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:bg-blue-950/30"
                            @click="active = b.version"
                        >
                            <td class="px-3 py-2 font-semibold">{{ b.version }}</td>
                            <td class="px-3 py-2">{{ b.title }}</td>
                            <td class="px-3 py-2 font-mono text-xs">{{ b.prs }}</td>
                            <td class="px-3 py-2 text-gray-600 dark:text-gray-400">
                                {{ b.oneLiner }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                class="rounded-lg border border-dashed border-gray-300 p-4 text-sm dark:border-gray-600"
            >
                <h2 class="mb-2 font-semibold">呼叫端速查（誤用對照）</h2>
                <ul class="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
                    <li>
                        新模型 <code>machineType</code>＝<strong>英文 id</strong>；查定義用
                        <code>resolveMachineDef</code>
                    </li>
                    <li>
                        配方鍵仍是 <strong>中文 name</strong>：
                        <code>getRecipesForMachine(def.name, mode)</code>
                    </li>
                    <li>落子預覽＝真落子答案：只信 <code>canPlaceDevice</code> 回傳</li>
                    <li>
                        埠滑鼠熱區＝<code>hitTestPortAt</code>；規則錨點＝<code>canConnect</code>／findPortAt
                    </li>
                    <li>
                        源素材寫 <code>layoutStore.setDevicePrimaryOutput</code>；讀引擎經
                        <code>toTopology</code>
                    </li>
                </ul>
            </div>
        </section>

        <!-- 單版 -->
        <section v-else-if="activeBlock" class="space-y-4">
            <div>
                <h2 class="text-xl font-semibold">
                    {{ activeBlock.version }} · {{ activeBlock.title }}
                </h2>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{ activeBlock.oneLiner }}
                    <span class="ml-2 font-mono text-xs text-gray-500">{{ activeBlock.prs }}</span>
                </p>
                <a
                    v-if="activeBlock.deeperDemo"
                    :href="activeBlock.deeperDemo.href"
                    class="mt-2 inline-block text-sm text-blue-600 underline dark:text-blue-400"
                    target="_blank"
                    rel="noopener"
                >
                    → {{ activeBlock.deeperDemo.label }}
                </a>
            </div>

            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table class="min-w-full text-left text-sm">
                    <thead class="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-800">
                        <tr>
                            <th class="px-3 py-2">符號</th>
                            <th class="px-3 py-2">模組</th>
                            <th class="px-3 py-2">用途</th>
                            <th class="px-3 py-2">誰呼叫</th>
                            <th class="px-3 py-2">不要</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="api in activeBlock.apis"
                            :key="api.symbol"
                            class="border-t border-gray-100 align-top dark:border-gray-800"
                        >
                            <td
                                class="px-3 py-2 font-mono text-xs font-semibold text-blue-700 dark:text-blue-300"
                            >
                                {{ api.symbol }}
                            </td>
                            <td class="px-3 py-2 font-mono text-xs">{{ api.module }}</td>
                            <td class="px-3 py-2">{{ api.purpose }}</td>
                            <td class="px-3 py-2 text-gray-600 dark:text-gray-400">
                                {{ api.callers }}
                            </td>
                            <td class="px-3 py-2 text-red-700/90 dark:text-red-300/90">
                                {{ api.dont }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h3 class="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                    現場驗證（真實 API）
                </h3>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="c in playByVersion[activeBlock.version]"
                        :key="c.id"
                        type="button"
                        class="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                        @click="c.run()"
                    >
                        {{ c.label }}
                    </button>
                </div>
            </div>
        </section>

        <!-- 輸出 -->
        <section
            class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/60"
        >
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                輸出 · {{ outputTitle }}
            </h3>
            <pre
                class="mt-2 max-h-96 overflow-auto rounded bg-gray-900 p-3 text-xs text-green-300"
                >{{ outputJson }}</pre
            >
        </section>
    </div>
</template>
