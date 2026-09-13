/**
 * 佔格描述型別
 *
 * 幾何層只吃這些形狀，不查機器定義：尺寸與佔用層由轉換層先填好，  \
 * 佔格展開與重疊偵測因此都是純函式。佔用層的 (z, d) 語意見  \
 * `spec/03_validation.md` §2.2.1。
 */

import type { Position, AxisMove } from '@/types/euclideanSpace';
import type { Rotation } from '@/types/editor';

/** 設備的佔格描述 */
export interface DeviceFootprint {
    /** 設備 uid；重疊配對以此回報 */
    id: string;
    /** 佔格左上角所在格；z 為佔用層起點 */
    position: Position;
    /** 旋轉次數；1 與 3 時佔格的寬高對調 */
    rotation: Rotation;
    /** 佔格尺寸（格）；z 即佔用深度 d，佔用層為 position.z 起連續 size.z 層 */
    size: Position;
}

/** 管線的佔格描述 */
export interface PipelineFootprint {
    /** 管線 uid；重疊配對以此回報 */
    id: string;
    /** 完整路徑座標，依序連接起點埠、彎折點與終點埠 */
    waypoints: Position[];
    /** 佔用深度 d；自 waypoint 的 z 起算 */
    depth: number;
}

/**
 * 路徑的相對表示：一個起點加上一串軸向位移。
 *
 * 空路徑時 `start` 為 null，呼叫端不需型別斷言即可分辨  \
 * 「沒有路徑」與「單點路徑」。
 */
export interface PipelinePath {
    /** 路徑起點；空路徑為 null */
    start: Position | null;
    /** 自起點依序套用的軸向位移 */
    moves: AxisMove[];
}
