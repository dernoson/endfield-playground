/**
 * V11-F1 — 佈局 L1 `/dev` 預覽用 fixture（不進 editorStore）
 *
 * 兩態：已連接／斷線。設備用真實 `splitter`（1×1），路徑端點對齊埠錨點規則。
 */

import type { LayoutSnapshot, Pipeline, PlacedDevice } from '@/types/layout';

/** fixture 識別 */
export type MockLayoutScenarioId = 'connected' | 'broken';

/** 單一預覽場景 */
export interface MockLayoutScenario {
    id: MockLayoutScenarioId;
    /** 顯示名稱 */
    label: string;
    /** 說明 */
    description: string;
    devices: PlacedDevice[];
    pipelines: Pipeline[];
}

/**
 * 已連接：src 右出錨 (1,0) → dst 左入錨 (3,0)
 *
 * splitter@ (0,0) 右出＝(1,0)；splitter@(4,0) 左入＝(3,0)
 */
const connectedDevices: PlacedDevice[] = [
    {
        id: 'src',
        machineType: 'splitter',
        position: { x: 0, y: 0, z: 0 },
        rotation: 0,
        label: '分流器 A',
    },
    {
        id: 'dst',
        machineType: 'splitter',
        position: { x: 4, y: 0, z: 0 },
        rotation: 0,
        label: '分流器 B',
    },
];

const connectedPipeline: Pipeline = {
    id: 'pipe-ok',
    media: 'belt',
    waypoints: [
        { x: 1, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 0, z: 0 },
    ],
};

/**
 * 斷線：端點故意錯位；設備仍在，管線保留
 */
const brokenPipeline: Pipeline = {
    id: 'pipe-broken',
    media: 'belt',
    waypoints: [
        { x: 8, y: 5, z: 0 },
        { x: 9, y: 5, z: 0 },
        { x: 10, y: 5, z: 0 },
    ],
};

/** 預覽場景表 */
export const MOCK_LAYOUT_SCENARIOS: readonly MockLayoutScenario[] = [
    {
        id: 'connected',
        label: '已連接',
        description: '兩台分流器＋端點對齊埠錨點的 belt',
        devices: connectedDevices,
        pipelines: [connectedPipeline],
    },
    {
        id: 'broken',
        label: '斷線',
        description: '同設備，管線端點錯位 → from／to 皆 null',
        devices: connectedDevices,
        pipelines: [brokenPipeline],
    },
] as const;

/**
 * 依 id 取場景；找不到時回退已連接
 */
export function getMockLayoutScenario(id: MockLayoutScenarioId): MockLayoutScenario {
    return MOCK_LAYOUT_SCENARIOS.find((s) => s.id === id) ?? MOCK_LAYOUT_SCENARIOS[0];
}

/**
 * 場景 → LayoutSnapshot
 */
export function toLayoutSnapshot(scenario: MockLayoutScenario): LayoutSnapshot {
    return {
        devices: scenario.devices,
        pipelines: scenario.pipelines,
    };
}
