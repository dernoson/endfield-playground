export type ToolMode = 'select' | 'pan' | 'connect' | 'box-select';

export interface MapSettings {
    mapWidth: number;
    mapHeight: number;
    snapToGrid: boolean;
}

export interface ShortcutAction {
    id: string;
    description: string;
    run: () => void;
}
