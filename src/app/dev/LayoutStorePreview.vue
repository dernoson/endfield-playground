<script setup lang="ts">
/**
 * V12-D1 — `/dev/layout-store-preview` 佈局 store 互動演示
 *
 * 資料：toolbarMachines 真實機器列＋layoutStore 讀寫。  \
 * 操作：預設點放置／點格放置／移動／刪除／兩機自動拉 belt。  \
 * **不** import editorStore；不改 ToolbarPanel／GridCanvas。
 */
import { computed, ref } from 'vue';
import type { MachineCategory } from '@/types/machine';
import type { PlacementResult, PlacedDevice } from '@/types/layout';
import { getMachineById } from '@/data/machines';
import {
    getMockLayoutScenario,
    MOCK_LAYOUT_SCENARIOS,
    toLayoutSnapshot,
    type MockLayoutScenarioId,
} from '@/data/mockLayout';
import {
    DEFAULT_TOOLBAR_MACHINE_TAG,
    listToolbarMachines,
    TOOLBAR_MACHINE_TAGS,
    type ToolbarMachineRow,
} from '@/editor/toolbar/toolbarMachines';
import { useLayoutStore } from '@/store/layoutStore';
import { getDeviceOccupiedCells } from '@/utils/layout/deviceOccupancy';
import { deviceSizeFromMachine, toDeviceFootprint } from '@/utils/layout/toFootprint';
import {
    buildBlockedXy,
    findRoutableBeltWaypoints,
    listPortAnchors,
} from '@/app/dev/layoutStorePreviewUtils';

const CELL = 28;
const GRID_W = 14;
const GRID_H = 10;

/** 預設落點（按鈕「放到預設點」） */
const DEFAULT_PLACE: { x: number; y: number; z: number } = { x: 2, y: 2, z: 0 };

const layoutStore = useLayoutStore();

const machineTag = ref<MachineCategory>(DEFAULT_TOOLBAR_MACHINE_TAG);
const selectedMachineId = ref<string>(
    listToolbarMachines(DEFAULT_TOOLBAR_MACHINE_TAG)[0]?.id ?? 'crusher',
);
const placeCursor = ref<{ x: number; y: number; z: number }>({ ...DEFAULT_PLACE });
const selectedDeviceId = ref<string | null>(null);
const beltTargetId = ref<string | null>(null);
const lastResult = ref<PlacementResult | null>(null);
const statusMsg = ref('選機器 → 放到預設點或點空格；點兩台設備後可拉 belt');

let uidSeq = 0;
function nextUid(prefix: string): string {
    uidSeq += 1;
    return `${prefix}-${Date.now().toString(36)}-${uidSeq}`;
}

const machineRows = computed(() => listToolbarMachines(machineTag.value));

const selectedRow = computed(
    () => machineRows.value.find((r) => r.id === selectedMachineId.value) ?? null,
);

/** 設備佔格（xy） */
const deviceCells = computed(() => {
    const result: Array<{
        key: string;
        deviceId: string;
        label: string;
        x: number;
        y: number;
    }> = [];

    for (const device of layoutStore.devices) {
        const machine = getMachineById(device.machineType);
        if (!machine) continue;
        const size = deviceSizeFromMachine(machine);
        const cells = getDeviceOccupiedCells(toDeviceFootprint(device, size));
        const seen = new Set<string>();
        for (const cell of cells) {
            const xy = `${cell.x},${cell.y}`;
            if (seen.has(xy)) continue;
            seen.add(xy);
            result.push({
                key: `${device.id}-${xy}`,
                deviceId: device.id,
                label: device.label ?? machine.name,
                x: cell.x,
                y: cell.y,
            });
        }
    }
    return result;
});

const cellOwner = computed(() => {
    const map = new Map<string, string>();
    for (const cell of deviceCells.value) {
        map.set(`${cell.x},${cell.y}`, cell.deviceId);
    }
    return map;
});

/** 已接上 belt 的錨點格（路徑端點） */
const linkedAnchorKeys = computed(() => {
    const keys = new Set<string>();
    for (const pipe of layoutStore.pipelines) {
        if (pipe.waypoints.length === 0) continue;
        const a = pipe.waypoints[0];
        const b = pipe.waypoints[pipe.waypoints.length - 1];
        keys.add(`${a.x},${a.y}`);
        keys.add(`${b.x},${b.y}`);
    }
    return keys;
});

/**
 * belt 埠外側錨點標記
 *
 * - 綠圓＝輸出；橙方＝輸入
 * - 已連線端點加大＋白描邊高亮
 * - 選為 belt 起點／終點的設備埠再加粗外圈
 */
const portMarkers = computed(() => {
    const markers: Array<{
        key: string;
        x: number;
        y: number;
        kind: 'input' | 'output';
        deviceId: string;
        linked: boolean;
        emphasis: boolean;
    }> = [];

    for (const device of layoutStore.devices) {
        const emphasizeOut = device.id === selectedDeviceId.value;
        const emphasizeIn = device.id === beltTargetId.value;

        for (const a of listPortAnchors(device, 'output')) {
            const xy = `${a.x},${a.y}`;
            markers.push({
                key: `out-${device.id}-${xy}`,
                x: a.x,
                y: a.y,
                kind: 'output',
                deviceId: device.id,
                linked: linkedAnchorKeys.value.has(xy),
                emphasis: emphasizeOut,
            });
        }
        for (const a of listPortAnchors(device, 'input')) {
            const xy = `${a.x},${a.y}`;
            markers.push({
                key: `in-${device.id}-${xy}`,
                x: a.x,
                y: a.y,
                kind: 'input',
                deviceId: device.id,
                linked: linkedAnchorKeys.value.has(xy),
                emphasis: emphasizeIn,
            });
        }
    }
    return markers;
});

function connectionStatus(conn: { from: unknown; to: unknown }): 'ok' | 'broken' {
    return conn.from && conn.to ? 'ok' : 'broken';
}

function pipelinePath(waypoints: readonly { readonly x: number; readonly y: number }[]): string {
    return waypoints
        .map((p, i) => {
            const cx = (p.x + 0.5) * CELL;
            const cy = (p.y + 0.5) * CELL;
            return `${i === 0 ? 'M' : 'L'}${cx} ${cy}`;
        })
        .join(' ');
}

function portRefLabel(
    ref: { deviceId: string; portType: string; portIndex: number } | null,
): string {
    if (!ref) return 'null';
    return `${ref.deviceId}.${ref.portType}[${ref.portIndex}]`;
}

function applyResult(result: PlacementResult, okMsg: string): void {
    lastResult.value = result;
    if (result.ok) {
        statusMsg.value = okMsg;
    } else {
        statusMsg.value = `失敗：${result.reason}`;
    }
}

function buildDevice(row: ToolbarMachineRow, x: number, y: number): PlacedDevice {
    return {
        id: nextUid(row.id),
        machineType: row.id,
        position: { x, y, z: 0 },
        rotation: 0,
        label: row.name,
    };
}

function selectMachine(row: ToolbarMachineRow): void {
    selectedMachineId.value = row.id;
    statusMsg.value = `已選機器：${row.name}（${row.sizeText}）`;
}

function placeAt(x: number, y: number): void {
    const row = selectedRow.value;
    if (!row) {
        statusMsg.value = '請先選一台真實機器';
        return;
    }
    const device = buildDevice(row, x, y);
    const result = layoutStore.addDevice(device);
    applyResult(result, `已放置 ${row.name} @ (${x},${y})`);
    if (result.ok) {
        selectedDeviceId.value = device.id;
        placeCursor.value = { x, y, z: 0 };
    }
}

/** 預設操作：放到預設／目前游標點 */
function placeAtCursor(): void {
    placeAt(placeCursor.value.x, placeCursor.value.y);
}

function resetCursor(): void {
    placeCursor.value = { ...DEFAULT_PLACE };
    statusMsg.value = `預設點重設為 (${DEFAULT_PLACE.x},${DEFAULT_PLACE.y})`;
}

function nudgeCursor(dx: number, dy: number): void {
    placeCursor.value = {
        x: Math.max(0, Math.min(GRID_W - 1, placeCursor.value.x + dx)),
        y: Math.max(0, Math.min(GRID_H - 1, placeCursor.value.y + dy)),
        z: 0,
    };
}

function moveSelected(dx: number, dy: number): void {
    const id = selectedDeviceId.value;
    if (!id) {
        statusMsg.value = '請先點選一台已放置設備';
        return;
    }
    const device = layoutStore.devices.find((d) => d.id === id);
    if (!device) return;
    const next = {
        x: device.position.x + dx,
        y: device.position.y + dy,
        z: device.position.z,
    };
    const result = layoutStore.moveDevice(id, next);
    applyResult(result, `已移動 ${id} → (${next.x},${next.y})`);
}

function removeSelected(): void {
    const id = selectedDeviceId.value;
    if (!id) {
        statusMsg.value = '請先點選一台已放置設備';
        return;
    }
    layoutStore.removeDevice(id);
    if (beltTargetId.value === id) beltTargetId.value = null;
    selectedDeviceId.value = null;
    lastResult.value = { ok: true };
    statusMsg.value = `已刪除 ${id}（管線保留，可能斷線）`;
}

function clearAll(): void {
    layoutStore.loadSnapshot({ devices: [], pipelines: [] });
    selectedDeviceId.value = null;
    beltTargetId.value = null;
    lastResult.value = null;
    statusMsg.value = '已清空；可從工具列選機放置';
}

function loadFixture(id: MockLayoutScenarioId): void {
    layoutStore.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario(id)));
    selectedDeviceId.value = null;
    beltTargetId.value = null;
    lastResult.value = { ok: true };
    statusMsg.value = `已載入 fixture：${id}`;
}

function onDeviceClick(deviceId: string): void {
    if (!selectedDeviceId.value) {
        selectedDeviceId.value = deviceId;
        beltTargetId.value = null;
        statusMsg.value = `選取起點：${deviceId}（再點另一台設為 belt 終點）`;
        return;
    }
    if (selectedDeviceId.value === deviceId) {
        selectedDeviceId.value = null;
        beltTargetId.value = null;
        statusMsg.value = '已取消選取';
        return;
    }
    beltTargetId.value = deviceId;
    statusMsg.value = `起點 ${selectedDeviceId.value} → 終點 ${deviceId}；可按「自動拉 belt」`;
}

function onGridClick(evt: MouseEvent): void {
    const svg = evt.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const gx = Math.floor((evt.clientX - rect.left) / CELL);
    const gy = Math.floor((evt.clientY - rect.top) / CELL);
    if (gx < 0 || gy < 0 || gx >= GRID_W || gy >= GRID_H) return;

    const owner = cellOwner.value.get(`${gx},${gy}`);
    if (owner) {
        onDeviceClick(owner);
        return;
    }

    placeCursor.value = { x: gx, y: gy, z: 0 };
    placeAt(gx, gy);
}

function autoBelt(): void {
    const fromId = selectedDeviceId.value;
    const toId = beltTargetId.value;
    if (!fromId || !toId) {
        statusMsg.value = '請先點兩台不同設備（起點＋終點）';
        return;
    }
    const fromDev = layoutStore.devices.find((d) => d.id === fromId);
    const toDev = layoutStore.devices.find((d) => d.id === toId);
    if (!fromDev || !toDev) return;

    /** 封鎖＝所有設備佔格＋既有管線（路徑須繞開，否則 addPipeline 會 overlap） */
    const blocked = buildBlockedXy(layoutStore.devices, layoutStore.pipelines);
    const waypoints = findRoutableBeltWaypoints(fromDev, toDev, blocked);
    if (!waypoints) {
        lastResult.value = { ok: false, reason: 'invalid' };
        statusMsg.value = '失敗：invalid（找不到不穿過設備的 belt 路徑；試加大兩機間距或換方向）';
        return;
    }

    const result = layoutStore.addPipeline({
        id: nextUid('belt'),
        media: 'belt',
        waypoints,
    });
    applyResult(result, `已拉 belt：${fromId} → ${toId}（waypoints=${waypoints.length}）`);
}

function deviceStroke(deviceId: string): string {
    if (deviceId === selectedDeviceId.value) return '#2563eb';
    if (deviceId === beltTargetId.value) return '#7c3aed';
    return '#0284c7';
}

function deviceFill(deviceId: string): string {
    if (deviceId === selectedDeviceId.value) return '#bfdbfe';
    if (deviceId === beltTargetId.value) return '#ddd6fe';
    return '#bae6fd';
}

const snapshotSummary = computed(() => {
    const snap = layoutStore.toSnapshot();
    return {
        devices: snap.devices.map((d) => ({
            id: d.id,
            machineType: d.machineType,
            position: d.position,
        })),
        pipelines: snap.pipelines.map((p) => ({
            id: p.id,
            media: p.media,
            waypoints: p.waypoints.length,
        })),
    };
});
</script>

<template>
    <div class="space-y-6">
        <header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                佈局 store 預覽（V12）
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                真實機器（<code>toolbarMachines</code>）→
                <code>layoutStore</code> 讀寫演示。含預設點放置、點格放置、移動／刪除、兩機自動拉
                belt。不接 editorStore／不改 ToolbarPanel。
            </p>
        </header>

        <div
            class="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-900 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-100"
        >
            資料路徑：<strong>layoutStore</strong> · devices={{ layoutStore.devices.length }} ·
            pipelines={{ layoutStore.pipelines.length }} · connections={{
                layoutStore.connections.length
            }}
            · 游標 ({{ placeCursor.x }},{{ placeCursor.y }})
        </div>

        <p
            class="rounded border px-3 py-2 text-sm"
            :class="
                lastResult && !lastResult.ok
                    ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100'
                    : 'border-gray-200 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
            "
        >
            {{ statusMsg }}
            <span v-if="lastResult" class="ml-2 font-mono text-xs"
                >last={{ lastResult.ok ? 'ok' : lastResult.reason }}</span
            >
        </p>

        <!-- 真實機器（toolbar 資料） -->
        <section
            class="space-y-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                真實機器（toolbarMachines）
            </h3>
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="tag in TOOLBAR_MACHINE_TAGS"
                    :key="tag"
                    type="button"
                    class="rounded-lg border px-3 py-1.5 text-sm"
                    :class="
                        machineTag === tag
                            ? 'border-blue-500 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-100'
                            : 'border-gray-200 dark:border-gray-600'
                    "
                    @click="machineTag = tag"
                >
                    {{ tag }}
                </button>
            </div>
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="row in machineRows"
                    :key="row.id"
                    type="button"
                    class="rounded-lg border px-3 py-2 text-left text-sm"
                    :class="
                        selectedMachineId === row.id
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
                            : 'border-gray-200 dark:border-gray-600'
                    "
                    @click="selectMachine(row)"
                >
                    <div class="font-medium">{{ row.name }}</div>
                    <div class="text-xs text-gray-500">{{ row.id }} · {{ row.sizeText }}</div>
                </button>
            </div>
        </section>

        <!-- 預設操作 -->
        <section
            class="space-y-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">預設操作</h3>
            <div class="flex flex-wrap gap-2">
                <button
                    type="button"
                    class="rounded-lg border border-blue-500 bg-blue-600 px-3 py-2 text-sm text-white"
                    @click="placeAtCursor"
                >
                    放到預設點 ({{ placeCursor.x }},{{ placeCursor.y }})
                </button>
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="resetCursor"
                >
                    重設預設點 ({{ DEFAULT_PLACE.x }},{{ DEFAULT_PLACE.y }})
                </button>
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="nudgeCursor(0, -1)"
                >
                    游標↑
                </button>
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="nudgeCursor(0, 1)"
                >
                    游標↓
                </button>
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="nudgeCursor(-1, 0)"
                >
                    游標←
                </button>
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="nudgeCursor(1, 0)"
                >
                    游標→
                </button>
            </div>
            <div class="flex flex-wrap gap-2">
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="moveSelected(0, -1)"
                >
                    選取↑
                </button>
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="moveSelected(0, 1)"
                >
                    選取↓
                </button>
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="moveSelected(-1, 0)"
                >
                    選取←
                </button>
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="moveSelected(1, 0)"
                >
                    選取→
                </button>
                <button
                    type="button"
                    class="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 dark:border-red-700"
                    @click="removeSelected"
                >
                    刪除選取
                </button>
                <button
                    type="button"
                    class="rounded-lg border border-violet-500 bg-violet-600 px-3 py-2 text-sm text-white"
                    @click="autoBelt"
                >
                    自動拉 belt（起點→終點）
                </button>
                <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm dark:border-gray-600"
                    @click="clearAll"
                >
                    清空
                </button>
            </div>
            <p class="text-xs text-gray-500">
                藍框＝起點選取；紫框＝belt 終點。點空格＝放置選中機器。
            </p>
        </section>

        <!-- fixture 備援 -->
        <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm text-gray-500">一鍵 fixture：</span>
            <button
                v-for="s in MOCK_LAYOUT_SCENARIOS"
                :key="s.id"
                type="button"
                class="rounded-lg border px-3 py-1.5 text-sm dark:border-gray-600"
                @click="loadFixture(s.id)"
            >
                {{ s.label }}
            </button>
        </div>

        <!-- 格點（可點） -->
        <div
            class="overflow-auto rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
        >
            <svg
                :width="GRID_W * CELL"
                :height="GRID_H * CELL"
                class="block max-w-full cursor-crosshair"
                role="img"
                aria-label="佈局 store 互動格點"
                @click="onGridClick"
            >
                <g stroke="#e5e7eb" stroke-width="1">
                    <line
                        v-for="x in GRID_W + 1"
                        :key="`vx-${x}`"
                        :x1="(x - 1) * CELL"
                        y1="0"
                        :x2="(x - 1) * CELL"
                        :y2="GRID_H * CELL"
                    />
                    <line
                        v-for="y in GRID_H + 1"
                        :key="`hy-${y}`"
                        x1="0"
                        :y1="(y - 1) * CELL"
                        :x2="GRID_W * CELL"
                        :y2="(y - 1) * CELL"
                    />
                </g>

                <!-- 游標預覽 -->
                <rect
                    :x="placeCursor.x * CELL + 2"
                    :y="placeCursor.y * CELL + 2"
                    :width="CELL - 4"
                    :height="CELL - 4"
                    fill="none"
                    stroke="#a78bfa"
                    stroke-width="2"
                    stroke-dasharray="4 3"
                />

                <g>
                    <rect
                        v-for="cell in deviceCells"
                        :key="cell.key"
                        :x="cell.x * CELL + 1"
                        :y="cell.y * CELL + 1"
                        :width="CELL - 2"
                        :height="CELL - 2"
                        rx="3"
                        :fill="deviceFill(cell.deviceId)"
                        :stroke="deviceStroke(cell.deviceId)"
                        stroke-width="2"
                    />
                    <text
                        v-for="device in layoutStore.devices"
                        :key="`lbl-${device.id}`"
                        :x="(device.position.x + 0.5) * CELL"
                        :y="(device.position.y + 0.55) * CELL"
                        text-anchor="middle"
                        class="pointer-events-none fill-sky-950 text-[9px] font-semibold dark:fill-sky-100"
                    >
                        {{ device.label ?? device.machineType }}
                    </text>
                </g>

                <g
                    v-for="(pipe, idx) in layoutStore.pipelines"
                    :key="pipe.id"
                    class="pointer-events-none"
                >
                    <path
                        :d="pipelinePath(pipe.waypoints)"
                        fill="none"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        :stroke="
                            connectionStatus(layoutStore.connections[idx]!) === 'ok'
                                ? '#16a34a'
                                : '#ea580c'
                        "
                    />
                    <circle
                        v-for="(wp, wi) in pipe.waypoints"
                        :key="`${pipe.id}-wp-${wi}`"
                        :cx="(wp.x + 0.5) * CELL"
                        :cy="(wp.y + 0.5) * CELL"
                        r="2.5"
                        :fill="
                            connectionStatus(layoutStore.connections[idx]!) === 'ok'
                                ? '#86efac'
                                : '#fdba74'
                        "
                    />
                </g>

                <!-- belt 埠錨點：綠＝輸出、橙＝輸入；已連線／選取高亮 -->
                <g class="pointer-events-none">
                    <template v-for="port in portMarkers" :key="port.key">
                        <!-- 選取強調外圈 -->
                        <circle
                            v-if="port.emphasis"
                            :cx="(port.x + 0.5) * CELL"
                            :cy="(port.y + 0.5) * CELL"
                            r="9"
                            fill="none"
                            :stroke="port.kind === 'output' ? '#2563eb' : '#7c3aed'"
                            stroke-width="2"
                            stroke-dasharray="3 2"
                        />
                        <!-- 輸出＝圓 -->
                        <circle
                            v-if="port.kind === 'output'"
                            :cx="(port.x + 0.5) * CELL"
                            :cy="(port.y + 0.5) * CELL"
                            :r="port.linked || port.emphasis ? 6 : 4.5"
                            :fill="port.linked ? '#15803d' : '#22c55e'"
                            :stroke="port.linked ? '#fff' : '#14532d'"
                            :stroke-width="port.linked ? 2 : 1"
                        />
                        <!-- 輸入＝方 -->
                        <rect
                            v-else
                            :x="(port.x + 0.5) * CELL - (port.linked || port.emphasis ? 5.5 : 4)"
                            :y="(port.y + 0.5) * CELL - (port.linked || port.emphasis ? 5.5 : 4)"
                            :width="port.linked || port.emphasis ? 11 : 8"
                            :height="port.linked || port.emphasis ? 11 : 8"
                            rx="1.5"
                            :fill="port.linked ? '#c2410c' : '#f97316'"
                            :stroke="port.linked ? '#fff' : '#7c2d12'"
                            :stroke-width="port.linked ? 2 : 1"
                        />
                    </template>
                </g>
            </svg>
            <p class="mt-2 text-xs text-gray-500">
                點空格放置；點設備選取（再點另一台當 belt 終點）。
                <span class="text-green-700 dark:text-green-400">綠圓＝輸出埠</span>；
                <span class="text-orange-700 dark:text-orange-400">橙方＝輸入埠</span>；白邊＝已接
                belt。紫虛線＝預設游標。
            </p>
        </div>

        <section
            class="space-y-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                layoutStore.connections（getter）
            </h3>
            <ul class="space-y-2 text-sm">
                <li
                    v-for="conn in layoutStore.connections"
                    :key="conn.id"
                    class="rounded border px-3 py-2 font-mono text-xs"
                    :class="
                        connectionStatus(conn) === 'ok'
                            ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950'
                            : 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950'
                    "
                >
                    <div class="font-sans text-sm font-semibold">
                        {{ conn.pipelineId }} —
                        {{ connectionStatus(conn) === 'ok' ? '已連接' : '斷線' }}
                    </div>
                    <div>from: {{ portRefLabel(conn.from) }}</div>
                    <div>to: {{ portRefLabel(conn.to) }}</div>
                </li>
                <li v-if="layoutStore.connections.length === 0" class="text-sm text-gray-500">
                    （無管線 → connections 為空）
                </li>
            </ul>
        </section>

        <section
            class="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">toSnapshot() 摘要</h3>
            <pre
                class="overflow-x-auto rounded bg-gray-100 p-2 text-xs text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                >{{ JSON.stringify(snapshotSummary, null, 2) }}</pre
            >
        </section>
    </div>
</template>
