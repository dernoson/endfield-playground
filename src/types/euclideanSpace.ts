/**
 * 歐幾里得格子空間的座標型別
 *
 * 本專案的空間一律是三維格子空間：x、y 為畫布平面的格子索引，  \
 * z 為佔用層（0 為地面層、1 為空中層）。單位固定為「格」而非像素，  \
 * 像素到格子的換算由 `useValidation.buildContext()` 完成。
 */

/** 三維格子座標；三個軸皆以格為單位 */
export interface Position {
    /** 水平格子索引，向右為正 */
    x: number;
    /** 垂直格子索引，向下為正 */
    y: number;
    /** 佔用層索引，向上為正 */
    z: number;
}

/**
 * 管線路徑可行走的軸。
 *
 * 管線只在 xy 平面上走，所在層由傳輸媒質固定（傳送帶為 0、水管為 1），  \
 * 因此不存在沿 z 的位移。
 */
export type Axis = 'x' | 'y';

/** 沿單一軸的一段位移 */
export interface AxisMove {
    /** 位移所在的軸 */
    axis: Axis;
    /** 位移量；負值代表往該軸的負方向 */
    delta: number;
}
