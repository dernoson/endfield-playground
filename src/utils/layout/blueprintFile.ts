/**
 * 藍圖 JSON 匯出／匯入純函式（D4 §4・W1109-Z1）
 *
 * - `serializeBlueprint`：`LayoutSnapshot` → `BlueprintFile`（加 version 外殼）
 * - `parseBlueprint`：`unknown`（JSON.parse 結果） → 驗證通過回 LayoutSnapshot，否則回錯誤
 *
 * Zod 只負責形狀驗證（第一道）；語意檢查（機型、重疊、id 重複）
 * 仍歸 `layoutStore.loadSnapshot` 回傳的 `LayoutIssues`（第二道）。
 *
 * @see {@link file://docs/roadmap/detail/D4_blueprint_json_io.md} §4.6
 */

import type { LayoutSnapshot } from '@/types/layout';
import { blueprintSchema, type BlueprintFile } from '@/types/blueprint';

// ─── 匯出 ─────────────────────────────────────────────────────────────────────

/**
 * 把 `LayoutSnapshot` 包上 `version: 2` 外殼，產生可序列化的藍圖物件。
 *
 * 不做深拷貝——呼叫方應使用 `layoutStore.toSnapshot()`（已深拷貝）取得 snapshot。
 *
 * @param snapshot 佈局快照（`toSnapshot()` 的回傳值）
 * @param planId 所屬計畫 UUID；省略時 JSON 中不出現此欄位
 * @returns 可直接 `JSON.stringify` 的藍圖物件
 */
export function serializeBlueprint(snapshot: LayoutSnapshot, planId?: string): BlueprintFile {
    return {
        version: 2,
        ...(planId !== undefined ? { planId } : {}),
        devices: snapshot.devices,
        pipelines: snapshot.pipelines,
    };
}

// ─── 匯入 ─────────────────────────────────────────────────────────────────────

/** parseBlueprint 成功時的回傳 */
export interface ParseBlueprintOk {
    ok: true;
    snapshot: LayoutSnapshot;
    planId?: string;
}

/** parseBlueprint 失敗時的回傳 */
export interface ParseBlueprintError {
    ok: false;
    error: string;
}

export type ParseBlueprintResult = ParseBlueprintOk | ParseBlueprintError;

/**
 * 解析並驗證外部 JSON 資料為藍圖。
 *
 * 第一道驗證（形狀）：版本號、必要欄位、值域。
 * 通過後剝掉 `version`，回傳 `LayoutSnapshot`（供第二道語意驗證 `loadSnapshot`）。
 *
 * 版本 1 會得到專用提示文字（D4 §4.3）。
 *
 * @param data `JSON.parse()` 的結果（型別為 `unknown`）
 */
export function parseBlueprint(data: unknown): ParseBlueprintResult {
    // ── 先攔 version 1（專用提示；D4 §4.3） ──────────────────────────────────
    if (
        typeof data === 'object' &&
        data !== null &&
        'version' in data &&
        (data as Record<string, unknown>).version === 1
    ) {
        return {
            ok: false,
            error: '此檔為舊版藍圖格式（version 1），本版不支援匯入。',
        };
    }

    // ── Zod 形狀驗證 ─────────────────────────────────────────────────────────
    const result = blueprintSchema.safeParse(data);

    if (!result.success) {
        // 把 Zod 的第一個 issue 轉為可讀訊息
        const firstIssue = result.error.issues[0];
        const path = firstIssue.path.length > 0 ? ` (${firstIssue.path.join('.')})` : '';
        return {
            ok: false,
            error: `藍圖格式不合法${path}：${firstIssue.message}`,
        };
    }

    // ── 剝掉 version，產出 LayoutSnapshot ────────────────────────────────────
    const { version: _, planId, devices, pipelines } = result.data;

    const snapshot: LayoutSnapshot = { devices, pipelines };

    return {
        ok: true,
        snapshot,
        ...(planId !== undefined ? { planId } : {}),
    };
}
