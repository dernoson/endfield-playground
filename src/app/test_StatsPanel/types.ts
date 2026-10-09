export interface ProductDetail {
    id: string;
    name: string;
    produce: number;
    consume: number;
    profit: number;
    isExpanded?: boolean;
}

export interface PowerData {
    used: number;
    total: number;
    percent?: number;
}

export interface TipItem {
    id: string;
    type: 'error' | 'warning';
    text: string;
}

export interface ItemSummaryRow {
    itemId: string;
    name: string;
    iconUrl: string;
    produced: number; // 每分鐘產量
    consumed: number; // 每分鐘消耗量
    net: number; // 淨產出 (produced - consumed)
    efficiency: number; // (0 ~ 1)
}

export interface TestStatsPanelProps {
    power?: PowerData;
    products?: ProductDetail[];
    rows?: ItemSummaryRow[];
    exchangeRate?: number;
    tips?: TipItem[];
    isCollapsed?: boolean;
}
