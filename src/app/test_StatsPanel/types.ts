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

export interface TestStatsPanelProps {
    power?: PowerData;
    products?: ProductDetail[];
    exchangeRate?: number;
    tips?: TipItem[];
    isCollapsed?: boolean;
}
