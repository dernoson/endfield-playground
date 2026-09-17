export interface PowerStats {
    demandKw: number;
    supplyKw: number;
}

export interface ProductionItem {
    id: string;
    name: string;
    producePerMin: number;
    consumePerMin: number;
    expanded?: boolean;
}

export interface AlertTip {
    id: string;
    level: 'error' | 'warning';
    message: string;
}

export interface ShironeStatsPanelProps {
    power?: PowerStats;
    productions?: ProductionItem[];
    ticketPerHour?: number;
    tips?: AlertTip[];
}
