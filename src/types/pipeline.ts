// src/types/pipeline.ts
// CR-02: 管線連接系統類型定義

/**
 * 管線類型：傳送帶或水管
 */
export type PipelineType = 'conveyor' | 'pipe';

/**
 * 接口類型定義
 */
export interface Port {
    id: string;
    type: PipelineType;
    direction: 'input' | 'output';
    position: { x: number; y: number }; // 相對於設備中心的偏移
}

/**
 * 接口的絕對位置（換算至畫布座標）
 */
export interface AbsolutePort extends Port {
    absolutePos: { x: number; y: number };
    deviceUid: string;
}

/**
 * 自動節點類型：分流器、匯流器、物流橋
 */
export type AutoNodeKind = 'splitter' | 'merger' | 'bridge';

/**
 * 自動節點模式
 * - auto: 自動生成模式（分流器一分為二，匯流器兩條合流）
 * - cut: 截斷模式（分流器截斷原管線，匯流器取代原起點）
 */
export type AutoNodeMode = 'auto' | 'cut';

/**
 * 自動生成的節點（分流器/匯流器/物流橋）
 */
export interface AutoNode {
    kind: AutoNodeKind;
    gridPos: { x: number; y: number };
    deviceUid: string; // 對應自動插入的 PlacedDevice uid
    mode: AutoNodeMode; // 僅 splitter/merger 可切換；bridge 固定為 'auto'
}

/**
 * 管線連接
 */
export interface Connection {
    uid: string;
    type: PipelineType;
    from: {
        deviceUid: string;
        portId: string;
    };
    to: {
        deviceUid: string;
        portId: string;
    };
    waypoints: { x: number; y: number }[]; // 彎折點格子座標（不含起終點）
    autoNodes: AutoNode[]; // 自動生成的分流器/匯流器/物流橋
}

/**
 * 繪製中的管線（尚未確認放置）
 */
export interface DraftConnection {
    type: PipelineType;
    fromDeviceUid: string;
    fromPortId: string;
    waypoints: { x: number; y: number }[];
    cursorPos: { x: number; y: number };
    hasInvalidSegment: boolean; // true 表示存在斜線，無法確認放置
}

/**
 * 管線線段（用於碰撞檢測、路徑規劃等）
 */
export interface Segment {
    start: { x: number; y: number };
    end: { x: number; y: number };
}

/**
 * 路徑驗證結果
 */
export interface PathValidation {
    valid: boolean;
    invalidIndices: number[]; // 違規線段的起點索引
}

/**
 * 管線交叉點資訊
 */
export interface CrossingInfo {
    pos: { x: number; y: number };
    connectionUid: string;
    segmentIndex: number;
}

/**
 * 管線中途點資訊（用於分流器/匯流器判斷）
 */
export interface MidpointTarget {
    connection: Connection;
    segmentIndex: number;
}
