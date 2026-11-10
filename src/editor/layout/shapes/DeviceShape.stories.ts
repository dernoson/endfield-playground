// src/editor/layout/shapes/DeviceShape.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import DeviceShape from './DeviceShape.vue';
import ToolbarPanel from '@/editor/toolbar/ToolbarPanel.vue';
import { usePlacementIntent } from '@/editor/toolbar/usePlacementIntent';
import { getMachineById, machineList } from '@/data/machines';

/**
 * DeviceShape 輸出的是 SVG 的 `<g>`，必須放進 `<svg>` 才看得到，且元件使用白色線條，需要深色底。
 * 此 decorator 負責提供深色底與 svg 容器（單一設備用）。
 */
const svgStage = () => ({
    template:
        '<div class="inline-block bg-zinc-900 p-6">' +
        '<svg width="480" height="320" class="block overflow-visible">' +
        '<g transform="translate(8 8)"><story /></g>' +
        '</svg></div>',
});

/** 並排檢視用的單一項目 */
interface GridItem {
    /** 項目下方的說明文字 */
    caption: string;
    /** 傳給 DeviceShape 的 props（不含 gridSize／dragging／selected／unpowered） */
    props: Record<string, unknown>;
    /** 設備佔幾格，用來算 svg 容器大小 */
    cellsW: number;
    cellsH: number;
    /** 是否為拖曳中狀態 */
    dragging: boolean;
    /** 是否為被選取狀態 */
    selected: boolean;
    /** 是否為未接電狀態（顯示電池圖示） */
    unpowered: boolean;
}

/**
 * 依機器 id（與可選的 mode）建立並排項目；寬高取自機器資料。
 * @param id 機器 id
 * @param dragging 是否為拖曳中狀態
 * @param modeId 機器模式 id；省略則取第一個 mode
 * @param unpowered 是否為未接電狀態
 * @param selected 是否為被選取狀態
 */
function machineItem(
    id: string,
    dragging: boolean,
    modeId?: string,
    unpowered = false,
    selected = false,
): GridItem {
    const machine = getMachineById(id);
    return {
        caption: modeId ? `${id} / ${modeId}` : id,
        props: { machineType: id, machineMode: modeId },
        cellsW: machine?.width ?? 1,
        cellsH: machine?.height ?? 1,
        dragging,
        selected,
        unpowered,
    };
}

/**
 * 產生「多個 DeviceShape 並排」的 render 函式；gridSize 跟著 controls 變動。
 * @param buildItems 依目前 args 產生要顯示的項目
 */
function gridRender(buildItems: (args: Record<string, unknown>) => GridItem[]) {
    return (args: Record<string, unknown>) => ({
        components: { DeviceShape },
        setup() {
            const items = computed(() => buildItems(args));
            const gs = computed(() => (args.gridSize as number | undefined) ?? 28);
            return { items, gs };
        },
        template: `
            <div class="flex flex-wrap gap-7 bg-zinc-900 p-6">
                <figure
                    v-for="item in items"
                    :key="item.caption"
                    class="m-0 text-xs text-zinc-400"
                >
                    <svg
                        :width="item.cellsW * gs + 4"
                        :height="item.cellsH * gs + 4"
                        class="block overflow-visible"
                    >
                        <g transform="translate(2 2)">
                            <DeviceShape
                                v-bind="item.props"
                                :grid-size="gs"
                                :dragging="item.dragging"
                                :selected="item.selected"
                                :unpowered="item.unpowered"
                            />
                        </g>
                    </svg>
                    <figcaption class="mt-2">{{ item.caption }}</figcaption>
                </figure>
            </div>
        `,
    });
}

/**
 * DeviceShape 依機器資料（`machines.ts`）繪製設備：外框、輸入／輸出埠箭頭，以及依機器類型不同的內容。
 * - 一般機器（3×3 以上）：頭像圓框（直徑 55，沒有圖片時保留空圓框）＋名稱，整組在設備內置中
 * - 1×1：不放名稱與頭像；分流器／匯流器用三條直線，橋用四邊重疊箭頭，管道類外框為圓形
 * - 1×3／3×1：不放名稱與頭像；箭頭側兩端倒角
 * - 供電樁類（2×2）：淡黃色圓形外框，正中央放圖示；熱能池（2×2）：只有頭像圓框，沒有名稱
 *
 * 狀態：
 * - 預設（放下後）：灰色；供電樁為淡黃色
 * - `selected`：被單擊選取，邊線、箭頭、底色（20%）為藍色 #1CAEFD；供電樁的圖示線條也變藍
 * - `dragging`：拖曳中，設備維持原色，底框與邊線、箭頭 Opacity 70%，頭像圓框 Opacity 50%，放下後恢復
 * - `unpowered`：有名稱的機器會在名稱下方顯示電池圖示
 *
 * 目前只有種植機登記了頭像圖片。
 */
const meta = {
    title: 'L3/Editor/DeviceShape',
    component: DeviceShape,
    args: {
        machineType: 'planter',
        gridSize: 28,
        dragging: false,
        selected: false,
        unpowered: false,
    },
    argTypes: {
        machineType: {
            control: 'select',
            options: machineList.map((m) => m.id),
            description: '機器 id（也接受中文名稱）',
        },
        machineMode: { control: 'text', description: '機器模式 id；留空取第一個 mode' },
        gridSize: { control: { type: 'range', min: 12, max: 72, step: 2 } },
        dragging: {
            control: 'boolean',
            description: '拖曳中：底框與邊線、箭頭 Opacity 70%，頭像圓框 Opacity 50%',
        },
        selected: {
            control: 'boolean',
            description: '被單擊選取：邊線、箭頭、底色改為藍色 #1CAEFD',
        },
        unpowered: { control: 'boolean', description: '沒有接電時顯示電池圖示' },
    },
} satisfies Meta<typeof DeviceShape>;

export default meta;

/** DeviceShape Story 型別 */
type Story = StoryObj<typeof meta>;

/** 放下後：白色半透明外框＋箭頭＋頭像與名稱 */
export const Placed: Story = {
    name: '放下：種植機',
    args: { machineType: 'planter', dragging: false },
    decorators: [svgStage],
};

/** 被選取：邊線、箭頭、底色（20%）都是藍色 #1CAEFD */
export const Selected: Story = {
    name: '選取：種植機',
    args: { machineType: 'planter', selected: true },
    decorators: [svgStage],
};

/** 拖曳中：設備維持灰色，底框與邊線、箭頭 Opacity 70%，頭像圓框 Opacity 50% */
export const Dragging: Story = {
    name: '拖曳中：種植機',
    args: { machineType: 'planter', dragging: true },
    decorators: [svgStage],
};

/** 放下與拖曳並排對照；種植機有頭像圖片，灌裝機尚無圖片，保留空圓框 */
export const PlacedVsDragging: Story = {
    name: '對照：放下 vs 拖曳',
    render: gridRender(() => [
        { ...machineItem('planter', false), caption: 'planter · 放下' },
        { ...machineItem('planter', true), caption: 'planter · 拖曳中' },
        { ...machineItem('filling_machine', false), caption: 'filling_machine · 放下' },
        { ...machineItem('filling_machine', true), caption: 'filling_machine · 拖曳中' },
    ]),
};

/**
 * 三種狀態對照：放下、選取、拖曳中。
 * 涵蓋有頭像的設備、供電樁（圓形、圖示會變藍）、1×1 分流器（直線與箭頭會變藍）。
 */
export const StatesComparison: Story = {
    name: '對照：放下 vs 選取 vs 拖曳',
    args: { gridSize: 40 },
    render: gridRender(() =>
        ['planter', 'power_pole', 'splitter'].flatMap((id) => [
            { ...machineItem(id, false), caption: `${id} · 放下` },
            { ...machineItem(id, false, undefined, false, true), caption: `${id} · 選取` },
            { ...machineItem(id, true), caption: `${id} · 拖曳中` },
        ]),
    ),
};

/** 3×3：上方輸入箭頭朝下、下方輸出箭頭朝下；頭像與名稱整組置中 */
export const Crusher3x3: Story = {
    name: '尺寸：粉碎機 3×3',
    args: { machineType: 'crusher' },
    decorators: [svgStage],
};

/** 6×4 非正方形：外框不應被拉扁，上下各 6 個箭頭，頭像與名稱置中 */
export const FillingMachine6x4: Story = {
    name: '尺寸：灌裝機 6×4',
    args: { machineType: 'filling_machine' },
    decorators: [svgStage],
};

/** 種植機液體模式：左側（offset 2）多一個管線輸入，箭頭朝右 */
export const PlanterLiquidMode: Story = {
    name: '模式：種植機液體模式',
    args: { machineType: 'planter', machineMode: 'liquid_mode' },
    decorators: [svgStage],
};

/** 精煉爐液體模式：左側輸入朝右、右側輸出朝右（驗證輸出埠朝外） */
export const RefineryLiquidMode: Story = {
    name: '模式：精煉爐液體模式',
    args: { machineType: 'refinery', machineMode: 'liquid_mode' },
    decorators: [svgStage],
};

/**
 * 1×1 機器：不放名稱與頭像。
 * 准入口＝左入右出箭頭；分流器＝左側輸入箭頭＋三條輸出直線；匯流器＝三條輸入直線＋右側輸出箭頭；
 * 橋＝四邊各兩個重疊箭頭；管道類外框為圓形。可用 controls 切換 dragging／selected。
 */
export const TinyMachines1x1: Story = {
    name: '1×1 機器（箭頭與線條）',
    args: { gridSize: 56 },
    render: gridRender((args) =>
        [
            'item_access_port',
            'splitter',
            'logistics_bridge',
            'merger',
            'pipe_access_port',
            'pipe_splitter',
            'pipe_bridge',
            'pipe_merger',
        ].map((id) =>
            machineItem(id, Boolean(args.dragging), undefined, false, Boolean(args.selected)),
        ),
    ),
};

/**
 * 1×3／3×1 長條機器：不放名稱與頭像，箭頭所在側的兩端各倒一個半格的 45 度角。
 * 目前資料中 1×3 的埠都在右側、3×1 的埠都在上側。可用 controls 切換 dragging／selected。
 */
export const BarMachines: Story = {
    name: '長條機器（倒角）',
    args: { gridSize: 56 },
    render: gridRender((args) =>
        ['warehouse_input', 'warehouse_output', 'material_source', 'item_source', 'item_sink'].map(
            (id) =>
                machineItem(id, Boolean(args.dragging), undefined, false, Boolean(args.selected)),
        ),
    ),
};

/** 基礎材料輸出點的流體模式：埠 media 為 pipe（目前外觀與固態模式相同，仍為倒角矩形） */
export const MaterialSourceFluidMode: Story = {
    name: '長條機器：基礎材料輸出點（流體模式）',
    args: { machineType: 'material_source', machineMode: 'fluid_pipe', gridSize: 56 },
    decorators: [svgStage],
};

/**
 * 2×2：供電樁類為淡黃色圓形外框，正中央放圖示；熱能池只有頭像圓框與 2 個輸入箭頭，兩者都沒有名稱。
 * 可用 controls 切換 selected（供電樁底色與圖示變藍）、dragging。
 */
export const Machines2x2: Story = {
    name: '2×2 機器（供電樁／熱能池）',
    args: { gridSize: 56 },
    render: gridRender((args) =>
        ['power_pole', 'xi_rang_power_pole', 'thermal_pool'].map((id) =>
            machineItem(id, Boolean(args.dragging), undefined, false, Boolean(args.selected)),
        ),
    ),
};

/** 未接電：有名稱的機器在名稱文字下方 1 單位處出現電池圖示，水平置中；可用 controls 切換 unpowered */
export const Unpowered: Story = {
    name: '未接電：電池圖示',
    args: { machineType: 'crusher', unpowered: true, gridSize: 56 },
    decorators: [svgStage],
};

/** 未接電的規則對照：只有「頭像＋名稱」的機器顯示電池，熱能池與供電樁都不顯示 */
export const UnpoweredRules: Story = {
    name: '未接電：各類機器對照',
    args: { gridSize: 40 },
    render: gridRender(() => [
        { ...machineItem('crusher', false, undefined, true), caption: 'crusher · 顯示電池' },
        { ...machineItem('planter', false, undefined, true), caption: 'planter · 顯示電池' },
        {
            ...machineItem('thermal_pool', false, undefined, true),
            caption: 'thermal_pool · 不顯示',
        },
        { ...machineItem('power_pole', false, undefined, true), caption: 'power_pole · 不顯示' },
        { ...machineItem('splitter', false, undefined, true), caption: 'splitter · 不顯示' },
    ]),
};

/** 舊式呼叫：只傳 label 與寬高，label 為機器中文名稱，仍應查得到資料 */
export const LegacyLabelOnly: Story = {
    name: '相容：只傳 label',
    args: { machineType: undefined, label: '種植機', width: 5, height: 5 },
    decorators: [svgStage],
};

/** 查不到機器：只畫外框與傳入的 label 文字，不應報錯 */
export const UnknownMachine: Story = {
    name: '容錯：查不到機器',
    args: { machineType: 'not_exist', label: '未知機器', width: 4, height: 3 },
    decorators: [svgStage],
};

/** 全部機器（預設 mode）；導入新機器或新圖片時用來目視檢查，可用 controls 切換拖曳中／選取／未接電 */
export const GalleryAllMachines: Story = {
    name: '總覽：所有機器',
    render: gridRender((args) =>
        machineList.map((m) =>
            machineItem(
                m.id,
                Boolean(args.dragging),
                undefined,
                Boolean(args.unpowered),
                Boolean(args.selected),
            ),
        ),
    ),
};

/** 全部機器的所有 mode；用來檢查各 mode 的埠位與箭頭方向 */
export const GalleryAllModes: Story = {
    name: '總覽：所有機器的所有模式',
    render: gridRender((args) =>
        machineList.flatMap((m) =>
            m.modes.map((mode) =>
                machineItem(
                    m.id,
                    Boolean(args.dragging),
                    mode.id,
                    Boolean(args.unpowered),
                    Boolean(args.selected),
                ),
            ),
        ),
    ),
};

// ─── 整合：搭配下方工具列（模擬 L2 接線） ────────────────────────────────

/** 已放下的設備（Story 內暫存，不進任何 store） */
interface PlacedItem {
    key: number;
    machineId: string;
    /** 左上角所在格（欄、列） */
    col: number;
    row: number;
}

/** 放下後是否繼續保持拿起（true＝連續放置；false＝放一次就解除） */
const CONTINUOUS_PLACEMENT = false;

/**
 * 模擬 L2 接線：與下方真正的 ToolbarPanel 連動。
 * 點卡片 → 半透明預覽（吸附格線）跟著滑鼠 → 點畫布放下 → 變回一般樣式。
 * 沒有拿起機器時，單擊已放下的設備可選取（藍色），點空白處取消選取。
 * 這只是 Story 內的簡化模擬，沒有碰撞檢查、平移、縮放，也不寫入 editorStore。
 */
export const WithToolbar: Story = {
    name: '整合：搭配下方工具列（模擬 L2 接線）',
    parameters: { layout: 'fullscreen' },
    render: (args: Record<string, unknown>) => ({
        components: { DeviceShape, ToolbarPanel },
        setup() {
            const { armedMachineId, disarm } = usePlacementIntent();
            disarm();

            const gs = computed(() => (args.gridSize as number | undefined) ?? 28);
            const selectedView = ref('layout');
            const placed = ref<PlacedItem[]>([]);
            const hover = ref<{ col: number; row: number } | null>(null);
            /** 目前被選取的已放置設備；沒有選取時為 null */
            const selectedKey = ref<number | null>(null);
            let nextKey = 0;

            /** 目前拿起的機器定義；沒拿起時為 undefined */
            const armed = computed(() =>
                armedMachineId.value ? getMachineById(armedMachineId.value) : undefined,
            );

            /** 畫布格線背景，格距跟著 gridSize */
            const gridStyle = computed(() => ({
                backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),' +
                    'linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: `${gs.value}px ${gs.value}px`,
            }));

            /** 狀態說明文字 */
            const hint = computed(() =>
                armed.value
                    ? `已拿起：${armed.value.name}（${armed.value.width}×${armed.value.height}）｜點畫布放下，Esc 取消`
                    : '點下方卡片拿起機器；單擊已放下的設備可選取',
            );

            /**
             * 滑鼠移動：算出以游標為中心、吸附格線的左上角格座標。
             * @param event 畫布 svg 上的滑鼠事件
             */
            function handleMove(event: MouseEvent) {
                const machine = armed.value;
                if (!machine) {
                    hover.value = null;
                    return;
                }
                const rect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
                hover.value = {
                    col: Math.max(
                        0,
                        Math.round((event.clientX - rect.left) / gs.value - machine.width / 2),
                    ),
                    row: Math.max(
                        0,
                        Math.round((event.clientY - rect.top) / gs.value - machine.height / 2),
                    ),
                };
            }

            /** 點畫布：有拿起機器且有預覽位置才放下；沒拿起機器時，點空白處取消選取 */
            function handleClick() {
                const machine = armed.value;
                if (!machine) {
                    selectedKey.value = null;
                    return;
                }
                if (!hover.value) return;
                placed.value.push({
                    key: nextKey++,
                    machineId: machine.id,
                    col: hover.value.col,
                    row: hover.value.row,
                });
                if (!CONTINUOUS_PLACEMENT) {
                    disarm();
                    hover.value = null;
                }
            }

            /**
             * 點已放下的設備：沒拿起機器時選取它；拿起機器時讓事件往上傳，照常放置。
             * @param event 點擊事件
             * @param key 被點的設備 key
             */
            function handleItemClick(event: MouseEvent, key: number) {
                if (armed.value) return;
                event.stopPropagation();
                selectedKey.value = key;
            }

            /**
             * 計算設備在畫布上的位移。
             * @param col 左上角所在欄
             * @param row 左上角所在列
             */
            function offset(col: number, row: number) {
                return `translate(${col * gs.value} ${row * gs.value})`;
            }

            /**
             * Esc 取消拿起，並取消選取。
             * @param event 全域鍵盤事件
             */
            function handleKeyDown(event: KeyboardEvent) {
                if (event.key === 'Escape') {
                    disarm();
                    hover.value = null;
                    selectedKey.value = null;
                }
            }

            onMounted(() => window.addEventListener('keydown', handleKeyDown));
            onUnmounted(() => {
                window.removeEventListener('keydown', handleKeyDown);
                // 共用的落子意圖是模組層級狀態，離開 Story 時清掉避免影響其他 Story
                disarm();
            });

            return {
                gs,
                selectedView,
                placed,
                hover,
                selectedKey,
                armed,
                gridStyle,
                hint,
                handleMove,
                handleClick,
                handleItemClick,
                offset,
            };
        },
        template: `
            <div class="relative h-[640px] w-[1280px] overflow-hidden bg-zinc-900" :style="gridStyle">
                <svg
                    class="absolute inset-0 block h-full w-full"
                    :class="armed ? 'cursor-crosshair' : 'cursor-default'"
                    @mousemove="handleMove"
                    @mouseleave="hover = null"
                    @click="handleClick"
                >
                    <g
                        v-for="item in placed"
                        :key="item.key"
                        :transform="offset(item.col, item.row)"
                        @click="handleItemClick($event, item.key)"
                    >
                        <DeviceShape
                            :machine-type="item.machineId"
                            :grid-size="gs"
                            :selected="item.key === selectedKey"
                        />
                    </g>
                    <g
                        v-if="armed && hover"
                        :transform="offset(hover.col, hover.row)"
                        pointer-events="none"
                    >
                        <DeviceShape :machine-type="armed.id" :grid-size="gs" dragging />
                    </g>
                </svg>

                <div class="absolute top-3 left-3 flex items-center gap-3 text-xs text-zinc-300">
                    <button
                        type="button"
                        class="cursor-pointer rounded bg-zinc-700 px-2 py-1 text-white"
                        @click="placed = []; selectedKey = null"
                    >
                        清除已放置（{{ placed.length }}）
                    </button>
                    <span>{{ hint }}</span>
                </div>

                <ToolbarPanel :selected-view="selectedView" @view-click="selectedView = $event" />
            </div>
        `,
    }),
};
