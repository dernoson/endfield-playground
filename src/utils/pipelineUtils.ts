// src/utils/pipelineUtils.ts
// CR-02: 管線連接工具函數

import type { Connection, Segment, PathValidation } from '@/types/pipeline';

/**
 * 將滑鼠座標換算為格子座標
 */
export function screenToGrid(
    screenX: number,
    screenY: number,
    offset: { x: number; y: number },
    gridSize: number,
): { x: number; y: number } {
    const gridX = Math.floor((screenX - offset.x) / gridSize);
    const gridY = Math.floor((screenY - offset.y) / gridSize);
    return { x: gridX, y: gridY };
}

/**
 * 將格子座標換算為畫布座標
 */
export function gridToScreen(
    gridX: number,
    gridY: number,
    offset: { x: number; y: number },
    gridSize: number,
): { x: number; y: number } {
    return {
        x: gridX * gridSize + offset.x,
        y: gridY * gridSize + offset.y,
    };
}

/**
 * 將 waypoints 轉換為線段列表
 */
export function waypointsToSegments(
    waypoints: { x: number; y: number }[],
): Segment[] {
    if (waypoints.length < 2) {
        return [];
    }

    const segments: Segment[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
        segments.push({
            start: waypoints[i],
            end: waypoints[i + 1],
        });
    }

    return segments;
}

/**
 * 獲取管線的所有線段（包含起終點）
 */
export function getConnectionSegments(
    connection: Connection,
    startPos: { x: number; y: number },
    endPos: { x: number; y: number },
): Segment[] {
    const allPoints = [startPos, ...connection.waypoints, endPos];
    return waypointsToSegments(allPoints);
}

/**
 * 驗證所有線段是否為純水平或垂直（90 度轉角）
 */
export function validateAllSegments(
    points: { x: number; y: number }[],
): PathValidation {
    const invalidIndices: number[] = [];

    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;

        // 斜線：dx 與 dy 同時非零
        if (dx !== 0 && dy !== 0) {
            invalidIndices.push(i);
        }
    }

    return {
        valid: invalidIndices.length === 0,
        invalidIndices,
    };
}

/**
 * 檢查點是否在線段上
 */
export function isPointOnSegment(
    point: { x: number; y: number },
    segment: Segment,
    tolerance = 0.5,
): boolean {
    const { start, end } = segment;

    // 計算點到線段的距離
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
        // 線段退化為點
        const distSquared =
            (point.x - start.x) * (point.x - start.x) +
            (point.y - start.y) * (point.y - start.y);
        return distSquared <= tolerance * tolerance;
    }

    // 計算投影參數 t
    const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;

    // 點的投影不在線段範圍內
    if (t < 0 || t > 1) {
        return false;
    }

    // 計算投影點
    const projX = start.x + t * dx;
    const projY = start.y + t * dy;

    // 計算點到投影點的距離
    const distance = Math.sqrt(
        (point.x - projX) * (point.x - projX) + (point.y - projY) * (point.y - projY),
    );

    return distance <= tolerance;
}

/**
 * 檢測兩條線段是否相交
 */
export function doSegmentsIntersect(seg1: Segment, seg2: Segment): boolean {
    const { start: p1, end: p2 } = seg1;
    const { start: p3, end: p4 } = seg2;

    const denominator =
        (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

    // 平行或重合
    if (denominator === 0) {
        return false;
    }

    const ua =
        ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) /
        denominator;
    const ub =
        ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) /
        denominator;

    // 相交點在兩條線段範圍內
    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

/**
 * 獲取兩條線段的交點
 */
export function getSegmentIntersection(
    seg1: Segment,
    seg2: Segment,
): { x: number; y: number } | null {
    const { start: p1, end: p2 } = seg1;
    const { start: p3, end: p4 } = seg2;

    const denominator =
        (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

    if (denominator === 0) {
        return null;
    }

    const ua =
        ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) /
        denominator;
    const ub =
        ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) /
        denominator;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return {
            x: p1.x + ua * (p2.x - p1.x),
            y: p1.y + ua * (p2.y - p1.y),
        };
    }

    return null;
}

/**
 * 計算兩點之間的距離
 */
export function distance(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 檢查點是否在圓形範圍內
 */
export function isPointInCircle(
    point: { x: number; y: number },
    center: { x: number; y: number },
    radius: number,
): boolean {
    return distance(point, center) <= radius;
}

/**
 * 計算線段的中點
 */
export function getSegmentMidpoint(segment: Segment): { x: number; y: number } {
    return {
        x: (segment.start.x + segment.end.x) / 2,
        y: (segment.start.y + segment.end.y) / 2,
    };
}

/**
 * 判斷線段是否為水平線
 */
export function isHorizontal(segment: Segment): boolean {
    return segment.start.y === segment.end.y;
}

/**
 * 判斷線段是否為垂直線
 */
export function isVertical(segment: Segment): boolean {
    return segment.start.x === segment.end.x;
}

/**
 * 簡化路徑（移除共線的中間點）
 */
export function simplifyPath(
    points: { x: number; y: number }[],
): { x: number; y: number }[] {
    if (points.length <= 2) {
        return [...points];
    }

    const simplified: { x: number; y: number }[] = [points[0]];

    for (let i = 1; i < points.length - 1; i++) {
        const prev = simplified[simplified.length - 1];
        const curr = points[i];
        const next = points[i + 1];

        // 檢查是否共線
        const dx1 = curr.x - prev.x;
        const dy1 = curr.y - prev.y;
        const dx2 = next.x - curr.x;
        const dy2 = next.y - curr.y;

        // 如果不共線，保留這個點
        if (dx1 * dy2 !== dy1 * dx2) {
            simplified.push(curr);
        }
    }

    simplified.push(points[points.length - 1]);
    return simplified;
}

/**
 * 生成管線的 SVG 路徑字符串
 */
export function generatePathString(points: { x: number; y: number }[]): string {
    if (points.length < 2) {
        return '';
    }

    const pathCommands: string[] = [`M ${points[0].x} ${points[0].y}`];

    for (let i = 1; i < points.length; i++) {
        pathCommands.push(`L ${points[i].x} ${points[i].y}`);
    }

    return pathCommands.join(' ');
}
