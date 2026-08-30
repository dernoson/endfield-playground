import type { Position, Axis, AxisMove } from '@/types/euclideanSpace';
import type { PipelineFootprint, PipelinePath } from '@/types/footprint';

/** 管線路徑可行走的軸；z 由媒質固定，不參與位移 */
const WALKABLE_AXES: readonly Axis[] = ['x', 'y'] as const;

/**
 * 把絕對座標的路徑轉成「起點 ＋ 一串軸向位移」的相對表示。
 *
 * 只沿 x 與 y 產生位移：管線所在層由傳輸媒質固定，路徑本身不換層。  \
 * 相鄰兩點在同一軸上的差值為 0 時不產生位移。
 *
 * @param originalPoints 依序連接的絕對座標路徑
 * @returns 起點與位移串；空路徑時起點為 null
 * @example
 * absToRelPath([
 *     { x: 10, y: 20, z: 0 },
 *     { x: 30, y: 20, z: 0 },
 *     { x: 30, y: 50, z: 0 },
 * ]);
 * // { start: { x: 10, y: 20, z: 0 }, moves: [{ axis: 'x', delta: 20 }, { axis: 'y', delta: 30 }] }
 */
export function absToRelPath(originalPoints: Position[]): PipelinePath {
    if (originalPoints.length === 0) {
        return { start: null, moves: [] };
    }

    const start: Position = { ...originalPoints[0] };
    const moves: AxisMove[] = [];

    let prev = originalPoints[0];

    for (let i = 1; i < originalPoints.length; i++) {
        const curr = originalPoints[i];

        for (const axis of WALKABLE_AXES) {
            const delta = curr[axis] - prev[axis];
            if (delta !== 0) {
                moves.push({ axis, delta });
            }
        }

        prev = curr;
    }

    return { start, moves };
}

/**
 * 展開單一管線佔用的所有格點。
 *
 * 依序走過路徑上的每一段位移，逐格記錄經過的座標；再依佔用深度  \
 * 自該格的 z 起向上展開，得到 (z, d) 模型下的完整佔用層。  \
 * 路徑假設不自交；若自交，同一格會出現兩次而被重疊偵測視為自身衝突。
 *
 * @param pipeline 管線的佔格描述
 * @returns 該管線佔用的所有格點座標
 * @example
 * getPipelineOccupiedCells({
 *     id: 'p1',
 *     waypoints: [{ x: 2, y: 0, z: 0 }, { x: 4, y: 0, z: 0 }],
 *     depth: 1,
 * });
 * // [{ x: 2, y: 0, z: 0 }, { x: 3, y: 0, z: 0 }, { x: 4, y: 0, z: 0 }]
 */
export function getPipelineOccupiedCells(pipeline: PipelineFootprint): Position[] {
    const { start, moves } = absToRelPath(pipeline.waypoints);

    if (start === null) {
        return [];
    }

    /** 逐段走訪時的游標；每走一格就把當下座標記進 path */
    const cursor: Position = { ...start };
    const path: Position[] = [{ ...cursor }];

    for (const move of moves) {
        const direction = move.delta > 0 ? 1 : -1;
        for (let step = 0; step !== move.delta; step += direction) {
            cursor[move.axis] += direction;
            path.push({ ...cursor });
        }
    }

    const cells: Position[] = [];

    for (const point of path) {
        for (let dz = 0; dz < pipeline.depth; dz++) {
            cells.push({ x: point.x, y: point.y, z: point.z + dz });
        }
    }

    return cells;
}
