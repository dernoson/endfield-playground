export interface FormulaItem {
    name: string;
    image?: string;
    amount: number;
}

export interface Formula {
    duration: number;
    input: FormulaItem[];
    output: FormulaItem[];
}

export interface MachineCardProps {
    id: string;
    name: string;
    sizeText: string;
    iconUrl?: string;
    power?: string;
    selectedRecipe?: string;
    formulas?: Formula[];
}
