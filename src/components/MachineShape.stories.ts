import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { machineList } from '@/data/machines';
import MachineShape from './MachineShape.vue';

/** 自真實機器資料取一台；找不到就退回清單第一台，避免 story 因資料調整而消失 */
function pickMachine(name: string) {
    return machineList.find((m) => m.name === name) ?? machineList[0];
}

/** 取第一台寬高不等的機器；用條件而非寫死名稱，資料調整時 story 仍指向真正的非方形機 */
function pickNonSquare() {
    return machineList.find((m) => m.width !== m.height) ?? machineList[0];
}

const meta = {
    title: 'L3/MachineShape',
    component: MachineShape,
    argTypes: {
        unitSize: { control: { type: 'range', min: 8, max: 64, step: 4 } },
    },
} satisfies Meta<typeof MachineShape>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 方形機器：3x3 的精煉爐，埠分布在上下兩緣 */
export const Square: Story = {
    name: '方形機器（3x3）',
    args: {
        machine: pickMachine('精煉爐'),
        unitSize: 32,
    },
};

/** 非方形機器：寬高不等時 side 與 offset 的對應最容易寫錯，單獨列一個 story */
export const NonSquare: Story = {
    name: '非方形機器',
    args: {
        machine: pickNonSquare(),
        unitSize: 32,
    },
};

/** 邊界：unitSize 極小，驗證埠線段在低解析度下不會蓋掉矩形 */
export const TinyUnitSize: Story = {
    name: '邊界：unitSize 極小',
    args: {
        machine: pickMachine('精煉爐'),
        unitSize: 8,
    },
};
