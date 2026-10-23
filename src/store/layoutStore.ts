/**
 * 佈局領域 store（V12／W0907-A0；V16 補 setDevicePrimaryOutput）
 *
 * 平行於 `editorStore` 落地：持有 `devices`／`pipelines`，`connections` 為 getter  \
 *（每次呼叫 {@link resolveConnections}）。放置合法性回傳 {@link PlacementResult}，不 throw。
 *
 * 變更類 action 經 {@link useHistoryStore} 推入 Command，供 L2 undo／redo。
 *
 * 佔格檢查與落子前預檢共用 {@link collectLayoutIssues}／{@link assessInvolving}
 *（`src/utils/layout/placementCheck.ts`，V14／W0921-A0）。
 *
 * @example
 * const layout = useLayoutStore()
 * layout.loadSnapshot(toLayoutSnapshot(getMockLayoutScenario('connected')))
 * console.log(layout.connections)
 */

import { computed, readonly, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Position } from '@/types/euclideanSpace';
import type { Rotation } from '@/types/editor';
import type {
    LayoutIssues,
    LayoutSnapshot,
    PlacementResult,
    PlacedDevice,
    Pipeline,
} from '@/types/layout';
import { HistoryRecordType } from '@/types/history';
import { getMachineById } from '@/data/machines';
import { resolveConnections } from '@/utils/layout/resolveConnections';
import {
    assessInvolving,
    collectLayoutIssues,
    pipelineWaypointsValid,
    positionFinite,
} from '@/utils/layout/placementCheck';
import { canConnect } from '@/utils/layout/connectRules';
import { useHistoryStore } from '@/store/historyStore';

/**
 * 深拷貝快照，避免外部持有同一參考後改寫 store 內部
 */
function cloneSnapshot(snapshot: LayoutSnapshot): LayoutSnapshot {
    return {
        devices: snapshot.devices.map((d) => ({
            ...d,
            position: { ...d.position },
        })),
        pipelines: snapshot.pipelines.map((p) => ({
            ...p,
            waypoints: p.waypoints.map((w) => ({ ...w })),
        })),
    };
}

/**
 * 深拷貝單一設備
 */
function cloneDevice(device: PlacedDevice): PlacedDevice {
    return { ...device, position: { ...device.position } };
}

/**
 * 深拷貝單一管線
 */
function clonePipeline(pipeline: Pipeline): Pipeline {
    return {
        ...pipeline,
        waypoints: pipeline.waypoints.map((w) => ({ ...w })),
    };
}

export const useLayoutStore = defineStore('layout', () => {
    /** 已放置設備（藍圖目標儲存形之一） */
    const devices = ref<PlacedDevice[]>([]);

    /** 管線（不含 Connection） */
    const pipelines = ref<Pipeline[]>([]);

    /**
     * 衍生連線；每次由 devices／pipelines 重算，**不是**可寫 state
     */
    const connections = computed(() => resolveConnections(devices.value, pipelines.value));

    /**
     * 目前佈局的全部問題（供 L2 對真正重疊／無效 id 畫紅框）
     *
     * invalid 與 overlap 並存時**兩者都回**；見 {@link LayoutIssues}。
     */
    const layoutIssues = computed(() => collectLayoutIssues(devices.value, pipelines.value));

    /**
     * 覆寫目前佈局（深拷貝）；回傳該快照的**全部**問題（`invalidIds` 與 `conflicts` 並列）。  \
     * 仍會載入快照（讓 L2 能對真正出錯的 id 畫紅框）；進歷史以便 undo。
     *
     * @param snapshot 純資料快照；connections 不在內
     */
    function loadSnapshot(snapshot: LayoutSnapshot): LayoutIssues {
        const historyStore = useHistoryStore();
        const before = cloneSnapshot({
            devices: devices.value,
            pipelines: pipelines.value,
        });
        const after = cloneSnapshot(snapshot);
        const result = collectLayoutIssues(after.devices, after.pipelines);

        historyStore.execute({
            id: crypto.randomUUID(),
            type: HistoryRecordType.Macro,
            label: '載入佈局快照',
            execute() {
                devices.value = after.devices;
                pipelines.value = after.pipelines;
            },
            undo() {
                devices.value = before.devices;
                pipelines.value = before.pipelines;
            },
        });

        return result;
    }

    /**
     * 匯出目前 devices／pipelines（深拷貝；不含 connections）
     */
    function toSnapshot(): LayoutSnapshot {
        return cloneSnapshot({
            devices: devices.value,
            pipelines: pipelines.value,
        });
    }

    /**
     * 新增設備；僅當「本設備」引入 overlap／invalid 時失敗並帶 conflicts
     *
     * @param device 待放置設備
     */
    function addDevice(device: PlacedDevice): PlacementResult {
        if (!device.id || devices.value.some((d) => d.id === device.id)) {
            return { ok: false, reason: 'invalid', invalidIds: device.id ? [device.id] : [] };
        }
        if (!positionFinite(device.position)) {
            return { ok: false, reason: 'invalid', invalidIds: [device.id] };
        }
        if (!getMachineById(device.machineType)) {
            return { ok: false, reason: 'invalid', invalidIds: [device.id] };
        }

        const added = cloneDevice(device);
        const before = devices.value.map(cloneDevice);
        const after = [...before, added];
        const result = assessInvolving(after, pipelines.value, new Set([added.id]));
        if (!result.ok) {
            return result;
        }

        const historyStore = useHistoryStore();
        historyStore.execute({
            id: crypto.randomUUID(),
            type: HistoryRecordType.MachinePlacement,
            label: `佈局放置 ${added.label ?? added.id}`,
            execute() {
                devices.value = after.map(cloneDevice);
            },
            undo() {
                devices.value = before.map(cloneDevice);
            },
        });
        return { ok: true };
    }

    /**
     * 刪除設備；管線保留（可變成斷線）。找不到或 id 不唯一時回 invalid。
     *
     * @param id 設備 uid
     */
    function removeDevice(id: string): PlacementResult {
        /** 同 id 有多台時刪除會一次砍兩台，語意不明，擋掉 */
        if (devices.value.filter((d) => d.id === id).length !== 1) {
            return { ok: false, reason: 'invalid', invalidIds: [id] };
        }

        const before = devices.value.map(cloneDevice);
        const after = before.filter((d) => d.id !== id);
        const historyStore = useHistoryStore();
        historyStore.execute({
            id: crypto.randomUUID(),
            type: HistoryRecordType.MachineDeletion,
            label: `佈局刪除設備 ${id}`,
            execute() {
                devices.value = after.map(cloneDevice);
            },
            undo() {
                devices.value = before.map(cloneDevice);
            },
        });
        return { ok: true };
    }

    /**
     * 移動設備；僅當「本設備」引入 overlap 時失敗
     *
     * @param id 設備 uid
     * @param position 新佔格左上角
     */
    function moveDevice(id: string, position: Position): PlacementResult {
        if (!positionFinite(position)) {
            return { ok: false, reason: 'invalid', invalidIds: [id] };
        }

        /** 快照可能塞進同 id 的兩台；此時動哪一台都是猜，直接擋掉 */
        if (devices.value.filter((d) => d.id === id).length !== 1) {
            return { ok: false, reason: 'invalid', invalidIds: [id] };
        }

        const index = devices.value.findIndex((d) => d.id === id);
        if (index < 0) {
            return { ok: false, reason: 'invalid', invalidIds: [id] };
        }

        const before = devices.value.map(cloneDevice);
        const after = before.map((d, i) => (i === index ? { ...d, position: { ...position } } : d));
        const result = assessInvolving(after, pipelines.value, new Set([id]));
        if (!result.ok) {
            return result;
        }

        const historyStore = useHistoryStore();
        historyStore.execute({
            id: crypto.randomUUID(),
            type: HistoryRecordType.MachineMovement,
            label: `佈局移動 ${id}`,
            execute() {
                devices.value = after.map(cloneDevice);
            },
            undo() {
                devices.value = before.map(cloneDevice);
            },
        });
        return { ok: true };
    }

    /**
     * 旋轉單一已放置設備，保持原點與既有管線位置不變。
     * 合法變更呼叫一次自動產生一筆 Command 推入 historyStore；同角度為 no-op。
     * 無效角度、未知／重複 id 或旋轉後重疊時拒絕，不修改資料或歷史。
     * @param id 設備實例識別
     * @param rotation 目標旋轉次數，0 至 3 分別表示 0、90、180、270 度
     * @returns 沿用既有佈局放置結果，供 L2 顯示非彈窗失敗提示
     * @example
     * const result = layout.rotateDevice('device-id', 1);
     */
    function rotateDevice(id: string, rotation: Rotation): PlacementResult {
        if (
            ![0, 1, 2, 3].includes(rotation) ||
            devices.value.filter((device) => device.id === id).length !== 1
        ) {
            return { ok: false, reason: 'invalid', invalidIds: [id] };
        }
        /** 必須找到唯一實例，不能因快捷鍵晚到而旋轉另一台設備。 */
        const target = devices.value.find((device) => device.id === id);
        if (!target) return { ok: false, reason: 'invalid', invalidIds: [id] };
        if (target.rotation === rotation) return { ok: true };
        /** 前後快照各自深拷貝，確保 undo／redo 不持有外部可寫參考。 */
        const before = devices.value.map(cloneDevice);
        /** 僅更新旋轉次數，不交換機型靜態尺寸，也不移動管線來假裝保持連接。 */
        const after = before.map((device) => (device.id === id ? { ...device, rotation } : device));
        /** 與放置／移動共用 L1 佔格檢查，只拒絕本次旋轉涉及的衝突。 */
        const result = assessInvolving(after, pipelines.value, new Set([id]));
        if (!result.ok) return result;
        /** 歷史由 L1 action 建立，L2 不需自行組 Command。 */
        const historyStore = useHistoryStore();
        historyStore.execute({
            id: crypto.randomUUID(),
            type: HistoryRecordType.MachineRotation,
            label: `佈局旋轉 ${id}`,
            /** 套用已驗證的旋轉快照，衍生埠與連線會自行重算。 */
            execute() {
                devices.value = after.map(cloneDevice);
            },
            /** 還原角度與其他設備快照，管線仍保留原來座標。 */
            undo() {
                devices.value = before.map(cloneDevice);
            },
        });
        return { ok: true };
    }

    /**
     * 新增管線；waypoints 須 ≥2 點、座標有限且逐段軸對齊；  \
     * 連線語意依 {@link canConnect}（方向／媒質／單埠單線／自連）；  \
     * 僅當「本管線」引入 overlap 時失敗
     *
     * @param pipeline 待加入管線
     */
    function addPipeline(pipeline: Pipeline): PlacementResult {
        if (!pipeline.id || pipelines.value.some((p) => p.id === pipeline.id)) {
            return {
                ok: false,
                reason: 'invalid',
                invalidIds: pipeline.id ? [pipeline.id] : [],
            };
        }
        if (!pipelineWaypointsValid(pipeline)) {
            return { ok: false, reason: 'invalid', invalidIds: [pipeline.id] };
        }

        const connectCheck = canConnect(
            { media: pipeline.media, waypoints: pipeline.waypoints },
            { devices: devices.value, pipelines: pipelines.value },
        );
        if (!connectCheck.ok) {
            return { ok: false, reason: 'invalid', invalidIds: [pipeline.id] };
        }

        const added = clonePipeline(pipeline);
        const before = pipelines.value.map(clonePipeline);
        const after = [...before, added];
        const result = assessInvolving(devices.value, after, new Set([added.id]));
        if (!result.ok) {
            return result;
        }

        const historyStore = useHistoryStore();
        historyStore.execute({
            id: crypto.randomUUID(),
            type: HistoryRecordType.MachineConnection,
            label: `佈局新增管線 ${added.id}`,
            execute() {
                pipelines.value = after.map(clonePipeline);
            },
            undo() {
                pipelines.value = before.map(clonePipeline);
            },
        });
        return { ok: true };
    }

    /**
     * 刪除管線。找不到或 id 不唯一時回 invalid。
     *
     * @param id 管線 uid
     */
    function removePipeline(id: string): PlacementResult {
        /** 同 id 有多條時刪除會一次砍兩條，語意不明，擋掉 */
        if (pipelines.value.filter((p) => p.id === id).length !== 1) {
            return { ok: false, reason: 'invalid', invalidIds: [id] };
        }

        const before = pipelines.value.map(clonePipeline);
        const after = before.filter((p) => p.id !== id);
        const historyStore = useHistoryStore();
        historyStore.execute({
            id: crypto.randomUUID(),
            type: HistoryRecordType.MachineDisconnection,
            label: `佈局刪除管線 ${id}`,
            execute() {
                pipelines.value = after.map(clonePipeline);
            },
            undo() {
                pipelines.value = before.map(clonePipeline);
            },
        });
        return { ok: true };
    }

    /**
     * 設定源設備的主要產出物與速率（V16／W1011-A0／C5）。
     *
     * 寫入 {@link PlacedDevice.primaryOutput}／{@link PlacedDevice.sourceRatePerMin}；進歷史。  \
     * 未知或同 id 多台時靜默 no-op，且**不**進歷史。
     *
     * @param uid 設備 uid
     * @param itemId 基礎材料 id；傳 `null` 表示清除設定
     * @param ratePerMin 每分鐘產出；省略時預設 30
     */
    function setDevicePrimaryOutput(uid: string, itemId: string | null, ratePerMin?: number): void {
        /** 找不到或同 id 多台時語意不明，靜默離開且不進歷史 */
        if (devices.value.filter((d) => d.id === uid).length !== 1) {
            return;
        }

        const index = devices.value.findIndex((d) => d.id === uid);
        if (index < 0) {
            return;
        }

        const before = devices.value.map(cloneDevice);
        const after = before.map((d, i) => {
            if (i !== index) {
                return d;
            }
            if (itemId === null) {
                const cleared: PlacedDevice = { ...d, position: { ...d.position } };
                delete cleared.primaryOutput;
                delete cleared.sourceRatePerMin;
                return cleared;
            }
            return {
                ...d,
                position: { ...d.position },
                primaryOutput: itemId,
                sourceRatePerMin: ratePerMin ?? 30,
            };
        });

        const historyStore = useHistoryStore();
        historyStore.execute({
            id: crypto.randomUUID(),
            type: HistoryRecordType.MachineRecipeChange,
            label: itemId === null ? `清除源產出 ${uid}` : `設定源產出 ${uid} → ${itemId}`,
            execute() {
                devices.value = after.map(cloneDevice);
            },
            undo() {
                devices.value = before.map(cloneDevice);
            },
        });
    }

    return {
        /** 已放置設備（唯讀面） */
        devices: readonly(devices),
        /** 管線（唯讀面） */
        pipelines: readonly(pipelines),
        /** 衍生連線（getter；唯讀面） */
        connections: readonly(connections),
        /**
         * 目前佈局的全部問題（供 L2 對真正重疊／無效 id 畫紅框；唯讀面）
         *
         * invalid 與 overlap 並存時**兩者都回**；見 {@link LayoutIssues}。
         */
        layoutIssues: readonly(layoutIssues),
        /**
         * 覆寫目前佈局（深拷貝）；回傳該快照的**全部**問題（`invalidIds` 與 `conflicts` 並列）。  \
         * 仍會載入快照（讓 L2 能對真正出錯的 id 畫紅框）；進歷史以便 undo。
         *
         * @param snapshot 純資料快照；connections 不在內
         */
        loadSnapshot,
        /**
         * 匯出目前 devices／pipelines（深拷貝；不含 connections）
         */
        toSnapshot,
        /**
         * 新增設備；僅當「本設備」引入 overlap／invalid 時失敗並帶 conflicts
         *
         * @param device 待放置設備
         */
        addDevice,
        /**
         * 刪除設備；管線保留（可變成斷線）。找不到或 id 不唯一時回 invalid。
         *
         * @param id 設備 uid
         */
        removeDevice,
        /**
         * 移動設備；僅當「本設備」引入 overlap 時失敗
         *
         * @param id 設備 uid
         * @param position 新佔格左上角
         */
        moveDevice,
        /**
         * 旋轉單一已放置設備，保持原點與既有管線位置不變。
         * 合法變更呼叫一次自動產生一筆 Command 推入 historyStore；同角度為 no-op。
         * 無效角度、未知／重複 id 或旋轉後重疊時拒絕，不修改資料或歷史。
         * @param id 設備實例識別
         * @param rotation 目標旋轉次數，0 至 3 分別表示 0、90、180、270 度
         * @returns 沿用既有佈局放置結果，供 L2 顯示非彈窗失敗提示
         * @example
         * const result = layout.rotateDevice('device-id', 1);
         */
        rotateDevice,
        /**
         * 新增管線；waypoints 須 ≥2 點、座標有限且逐段軸對齊；  \
         * 僅當「本管線」引入 overlap 時失敗
         *
         * @param pipeline 待加入管線
         */
        addPipeline,
        /**
         * 刪除管線。找不到或 id 不唯一時回 invalid。
         *
         * @param id 管線 uid
         */
        removePipeline,
        /**
         * 設定源設備的主要產出物與速率（V16／W1011-A0／C5）。
         *
         * 寫入 {@link PlacedDevice.primaryOutput}／{@link PlacedDevice.sourceRatePerMin}；進歷史。  \
         * 未知或同 id 多台時靜默 no-op，且**不**進歷史。
         *
         * @param uid 設備 uid
         * @param itemId 基礎材料 id；傳 `null` 表示清除設定
         * @param ratePerMin 每分鐘產出；省略時預設 30
         */
        setDevicePrimaryOutput,
    };
});
