/**
 * 藍圖檔案 schema（Zod）與推導型別
 *
 * `BlueprintFile` 由 `z.infer` 導出，不另寫 interface——
 * 避免 `PlacedDevice` 加欄位時 schema 與型別默默漂移（D4 §4.7）。
 *
 * Zod 只負責第一道「形狀」驗證（版本號、必要欄位、值域）；
 * 語意檢查（未知機型、佔格重疊）仍歸 `loadSnapshot` 的 `LayoutIssues`。
 *
 * @see {@link file://docs/roadmap/detail/D4_blueprint_json_io.md} §4.1、§4.7
 */

import { z } from 'zod';

// ─── 子 schema ────────────────────────────────────────────────────────────────

/** 三維格子座標 */
const positionSchema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
});

/** 旋轉步數 0–3 */
const rotationSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);

/** 傳輸媒質 */
const portMediaSchema = z.union([z.literal('belt'), z.literal('pipe')]);

/**
 * 已放置設備（對齊 `src/types/layout.ts` PlacedDevice）
 *
 * 必要欄位：id、machineType、position、rotation。
 * 選擇性欄位以 `.optional()` 標記，與 PlacedDevice interface 一致。
 */
const placedDeviceSchema = z.object({
    id: z.string().min(1),
    machineType: z.string().min(1),
    position: positionSchema,
    rotation: rotationSchema,
    machineMode: z.string().optional(),
    label: z.string().optional(),
    recipeIndex: z.number().optional(),
    environment: z.string().optional(),
    primaryOutput: z.string().optional(),
    sourceRatePerMin: z.number().optional(),
});

/**
 * 管線（對齊 `src/types/layout.ts` Pipeline）
 *
 * waypoints 須 ≥2 點。
 */
const pipelineSchema = z.object({
    id: z.string().min(1),
    media: portMediaSchema,
    waypoints: z.array(positionSchema).min(2),
});

// ─── 頂層 schema ──────────────────────────────────────────────────────────────

/**
 * 最小藍圖檔格式（佈局模型版；version 固定 2）
 *
 * @see {@link file://docs/roadmap/detail/D4_blueprint_json_io.md} §4.1
 */
export const blueprintSchema = z.object({
    version: z.literal(2),
    planId: z.string().optional(),
    devices: z.array(placedDeviceSchema),
    pipelines: z.array(pipelineSchema),
});

// ─── 推導型別 ─────────────────────────────────────────────────────────────────

/** 藍圖檔案格式（由 Zod schema 推導；不手寫 interface） */
export type BlueprintFile = z.infer<typeof blueprintSchema>;
