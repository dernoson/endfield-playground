export interface SingleProductDetail {
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

export interface SingleTip {
    id: string;
    type: 'error' | 'warning';
    text: string;
}

export interface TestStatsPanelProps {
    power?: PowerData;
    products?: SingleProductDetail[];
    exchangeRate?: number;
    tips?: SingleTip[];
    isCollapsed?: boolean;
}
