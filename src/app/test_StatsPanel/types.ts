export interface CapacityEstimateRow {
    itemId: string;
    name: string;
    produced: number;
    consumed: number;
    net: number;
    unit?: string;
    isExpanded?: boolean;
}

export type TipType = 'error' | 'warning';

export interface TipItem {
    id: string;
    type: TipType;
    message: string;
}

export interface StatsPanelProps {
    title?: string;
    totalDemandKw?: number;
    totalSupplyKw?: number;
    capacityRows?: CapacityEstimateRow[];
    ticketPerHour?: number;
    tips?: TipItem[];
    collapsed?: boolean;
}
