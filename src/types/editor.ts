export type ToolMode = 'select' | 'pan' | 'connect' | 'box-select';
export type EquipmentType =
    | 'smelter'
    | 'crusher'
    | 'assembler'
    | 'conveyor-node'
    | 'power-node';

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
