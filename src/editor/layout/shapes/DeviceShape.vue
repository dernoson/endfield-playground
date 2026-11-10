<!-- src/editor/layout/shapes/DeviceShape.vue -->
<script setup lang="ts">
import { computed, useId } from 'vue';
import { resolveMachineDef } from '@/data/machines';
import type { Machine } from '@/types/machine';
import Electric from './Electric.vue';
import {
    CELL_DESIGN,
    DRAG_BODY_OPACITY,
    ELECTRIC_POLE_IDS,
    OUTLINE_FILL_OPACITY,
    SELECTED_COLOR,
} from './deviceShapeConstants';

type PortDef = Machine['modes'][number]['input_ports'][number];
type PortSide = PortDef['side'];

// ─── 圖片來源 ─────────────────────────────────────────────────────────
/**
 * 圖片一律用 import.meta.glob 讀取：檔案不存在時得到空物件，而不是讓編譯失敗。
 * 圖片只在這裡「讀取」，圓形裁切由下方 clipPath 處理，所以放原圖即可。
 * svg 加上 `?url` 是為了不論專案有沒有裝 svg 轉元件的外掛，都拿到網址字串。
 * （供電樁的電力圖示由 Electric.vue 自己讀取。）
 */
const planterFiles = import.meta.glob<string>('@/assets/icon/planter-pattern.png', {
    eager: true,
    import: 'default',
});
const batteryFiles = import.meta.glob<string>('@/assets/icon/icon battery.svg', {
    eager: true,
    query: '?url',
    import: 'default',
});

/**
 * 取出 glob 結果的第一個網址。
 * @param files import.meta.glob 的結果；檔案不存在時為空物件
 */
function firstUrl(files: Record<string, string>): string | undefined {
    return Object.values(files)[0];
}

/**
 * 頭像圖片：機器 id → 圖片網址。沒登記或檔案不存在時，仍會保留空的圓框。
 *
 * 之後新增圖片：先加一組 glob，再到這裡加一行對應，例如
 *   const crusherFiles = import.meta.glob<string>('@/assets/icon/（你決定的檔名）', {
 *       eager: true,
 *       import: 'default',
 *   });
 *   crusher: firstUrl(crusherFiles),
 */
const MACHINE_ICON_URLS: Readonly<Record<string, string | undefined>> = {
    planter: firstUrl(planterFiles),
};

/** 有頭像圓框、但不顯示機器名稱的機器 */
const NO_NAME_IDS: ReadonlySet<string> = new Set(['thermal_pool']);

/** 沒有接電時顯示的電池圖示網址；檔案不存在時為 undefined */
const BATTERY_URL = firstUrl(batteryFiles);

// ─── 設計稿常數（單位：設計單位 = Figma 長度單位；一格 = CELL_DESIGN） ──
/** 箭頭路徑（朝右的 chevron）的包圍盒中心，旋轉時以此為軸心 */
const CHEVRON_CX = 3.546;
const CHEVRON_CY = 5.847;
const CHEVRON_PATH =
    'M4.60201 5.84476L0.00194907 1.2447L1.246 3.8147e-06L7.09141 5.84476L1.2447 11.6934L0 10.4481L4.60201 5.84476Z';
/** 箭頭最靠近設備邊緣的那一點，到設備邊緣的距離（Figma：3） */
const ARROW_EDGE_GAP = 3;
/**
 * 箭頭中心距離設備邊緣的內縮量。
 * 箭頭沿「朝內」方向的寬度為 CHEVRON_CX × 2，所以中心 = 間距 + 半寬。
 */
const MARKER_INSET = ARROW_EDGE_GAP + CHEVRON_CX;

/** 四個邊；橋的標記依序畫在每一邊 */
const ALL_SIDES: readonly PortSide[] = ['top', 'right', 'bottom', 'left'];

/** 輸入埠「朝內」的箭頭角度（chevron 原始朝右 = 0°）；輸出埠 = 此角度 + 180° */
const INWARD_ANGLE: Record<PortSide, number> = {
    top: 90,
    bottom: -90,
    left: 0,
    right: 180,
};

/** 1×1 的橋類機器：四邊各畫一組對稱重疊箭頭，不依埠資料 */
const BRIDGE_IDS: ReadonlySet<string> = new Set(['logistics_bridge', 'pipe_bridge']);

// ─── 拖曳時的頭像透明度 ───────────────────────────────────────────────
/** 拖曳中：頭像圓框的 Opacity */
const DRAG_AVATAR_OPACITY = 0.5;

// ─── 頭像（圓形徽章）與名稱標籤 ───────────────────────────────────────
/** 頭像圓框半徑（直徑 55 設計單位） */
const ICON_RADIUS = 27.5;
/** 頭像圓框描邊寬度（以圓周為中心，向外凸出一半） */
const ICON_STROKE_WIDTH = 3;
/** 頭像描邊外緣到名稱標籤框頂端的間距（Figma：3） */
const ICON_NAME_GAP = 3;
/** 圓心到下方名稱標籤頂端的距離 = 半徑 + 描邊外凸 + 間距 */
const ICON_LABEL_DY = ICON_RADIUS + ICON_STROKE_WIDTH / 2 + ICON_NAME_GAP;
/** 名稱標籤框高度（Figma：Height 18px） */
const ICON_LABEL_HEIGHT = 18;
/** 名稱文字大小；line-height 為 100%，所以一行文字的高度等於字級 */
const ICON_LABEL_FONT_SIZE = 16;

// ─── 電池圖示 ─────────────────────────────────────────────────────────
/** 電池圖示的顯示寬高（設計單位，Figma：23.82 × 11.16） */
const BATTERY_WIDTH = 23.82;
const BATTERY_HEIGHT = 11.16;
/** 電池圖示頂端與名稱文字（一行文字的底端）的距離（Figma：1） */
const BATTERY_GAP = 1;

const iconClipId = useId();
/** 圓形徽章的 drop shadow filter id，對應設計稿 X0 Y4 Blur4 #000 25% */
const iconShadowId = useId();

const props = withDefaults(
    defineProps<{
        /** 機器 id 或中文名稱（用來查 machines.ts）；未傳時退回用 label 查 */
        machineType?: string;
        /** 機器模式 id（決定埠位）；預設取該機器第一個 mode */
        machineMode?: string;
        /** 設備寬度（格）；未傳則取機器資料 */
        width?: number;
        /** 設備高度（格）；未傳則取機器資料 */
        height?: number;
        /** 一格的像素大小；預設與佈局畫布一致 */
        gridSize?: number;
        /** 顯示名稱；查得到機器時以機器名稱為準 */
        label?: string;
        /** 拖曳中：底框與邊線、箭頭 Opacity 70%，頭像圓框 Opacity 50%，放下後恢復 */
        dragging?: boolean;
        /** 被滑鼠單擊選取：邊線、箭頭、底色改為藍色 #1CAEFD */
        selected?: boolean;
        /** 設備目前沒有接電（收到「未接電」訊號）時為 true，會顯示電池圖示 */
        unpowered?: boolean;
    }>(),
    { gridSize: 28, dragging: false, selected: false, unpowered: false },
);

/** 查到的機器定義；查不到時為 undefined（只畫外框與文字） */
const machine = computed<Machine | undefined>(() => {
    const key = props.machineType ?? props.label;
    return key ? resolveMachineDef(key) : undefined;
});

/** 目前模式；指定的 mode 不存在時退回第一個 */
const mode = computed(
    () => machine.value?.modes.find((m) => m.id === props.machineMode) ?? machine.value?.modes[0],
);

const cellsW = computed(() => props.width ?? machine.value?.width ?? 1);
const cellsH = computed(() => props.height ?? machine.value?.height ?? 1);
const displayName = computed(() => machine.value?.name ?? props.label);

const pixelWidth = computed(() => cellsW.value * props.gridSize);
const pixelHeight = computed(() => cellsH.value * props.gridSize);
/** 設計稿尺寸（單位：設計單位） */
const designWidth = computed(() => cellsW.value * CELL_DESIGN);
const designHeight = computed(() => cellsH.value * CELL_DESIGN);

/** 設計單位 → 像素；X/Y 同一個倍率，圖示才不會被拉扁 */
const shapeTransform = computed(() => `scale(${props.gridSize / CELL_DESIGN})`);

// ─── 機器類型與內容配置 ───────────────────────────────────────────────
/** 查得到資料、且有一邊只有 1 格的機器（1×1、1×3、3×1）：不顯示名稱文字與圓形徽章 */
const isSlim = computed(() => !!machine.value && Math.min(cellsW.value, cellsH.value) === 1);

/** 1×1 機器：用外框形狀（矩形或圓）與箭頭／線條表示 */
const isTiny = computed(() => isSlim.value && cellsW.value === cellsH.value);

/** 1×3／3×1 長條機器：箭頭所在那一側的兩個端點轉角倒角 */
const isBar = computed(() => isSlim.value && !isTiny.value);

/**
 * 機器內容的配置方式：
 * - text：查不到機器，只顯示傳入的 label 文字
 * - electric：供電樁類，整個交給 Electric.vue 繪製
 * - slim：1×1／1×3／3×1，不放名稱也不放頭像
 * - badge：頭像圓框（無圖片時保留空圓框）＋名稱標籤（NO_NAME_IDS 例外）
 */
type DeviceLayout = 'text' | 'electric' | 'slim' | 'badge';

const layout = computed<DeviceLayout>(() => {
    const id = machine.value?.id;
    if (!id) return 'text';
    if (ELECTRIC_POLE_IDS.has(id)) return 'electric';
    if (isSlim.value) return 'slim';
    return 'badge';
});

/** 是否交給 Electric.vue 繪製 */
const isElectric = computed(() => layout.value === 'electric');

/** 是否顯示名稱標籤（頭像下方） */
const showName = computed(
    () =>
        layout.value === 'badge' &&
        !NO_NAME_IDS.has(machine.value?.id ?? '') &&
        !!displayName.value,
);

/** 頭像圖片網址；沒登記或檔案不存在時為 undefined（仍會畫空圓框） */
const iconUrl = computed(() => {
    const id = machine.value?.id;
    return id ? MACHINE_ICON_URLS[id] : undefined;
});

// ─── 頭像群組的置中計算（設計單位） ───────────────────────────────────
/** 頭像（＋名稱）群組的總高度：有名稱時為「圓框＋名稱」，否則只有圓框 */
const groupHeight = computed(() =>
    showName.value ? ICON_LABEL_DY + ICON_RADIUS + ICON_LABEL_HEIGHT : ICON_RADIUS * 2,
);

/** 圓心 X：設備水平置中 */
const iconCx = computed(() => designWidth.value / 2);
/** 圓心 Y：整個群組在設備內垂直置中 */
const iconCy = computed(() => designHeight.value / 2 - groupHeight.value / 2 + ICON_RADIUS);

/** 名稱標籤框頂端 */
const labelTop = computed(() => iconCy.value + ICON_LABEL_DY);

/** 標籤框：寬度為機器內寬（避開兩側箭頭），文字置中，長名稱不會偏移 */
const labelBoxWidth = computed(() => designWidth.value - 2 * (MARKER_INSET + 8));

// ─── 電池圖示（沒有接電時才顯示） ─────────────────────────────────────
/**
 * 只在「頭像＋名稱」配置的機器上顯示，且圖片檔存在。
 * 熱能池（無名稱）與供電樁類不顯示電池。
 */
const showBattery = computed(() => props.unpowered && showName.value && !!BATTERY_URL);

/** 電池圖示左上角 X：設備水平置中 */
const batteryX = computed(() => designWidth.value / 2 - BATTERY_WIDTH / 2);
/** 電池圖示左上角 Y：名稱文字（一行）底端下方 BATTERY_GAP */
const batteryY = computed(() => labelTop.value + ICON_LABEL_FONT_SIZE + BATTERY_GAP);

// ─── 特殊外觀 ─────────────────────────────────────────────────────────
/** 1×1 的橋（物流橋、管道橋） */
const isBridge = computed(() => isTiny.value && BRIDGE_IDS.has(machine.value?.id ?? ''));

/** 1×1 的管道類機器（埠的 media 為 pipe）：外框改為圓形 */
const isPipe = computed(() => {
    const currentMode = mode.value;
    if (!isTiny.value || !currentMode) return false;
    return [...currentMode.input_ports, ...currentMode.output_ports].some(
        (port) => port.media === 'pipe',
    );
});

// ─── 顏色（依選取狀態切換） ───────────────────────────────────────────
/** 底框底色與外框描邊：選取時藍色，其餘白色 */
const outlineColor = computed(() => (props.selected ? SELECTED_COLOR : 'white'));

/** 箭頭與分流器直線的顏色：選取時與邊線同為藍色，其餘白色 */
const lineColor = computed(() => (props.selected ? SELECTED_COLOR : 'white'));

/**
 * 長條機器的倒角側：取第一個埠所在的邊（箭頭所在側）。
 * 該側兩端的單位格，各從「端邊中點」連到「箭頭側邊中點」，與兩邊夾 45 度。
 */
const chamferSide = computed<PortSide | null>(() => {
    const currentMode = mode.value;
    if (!isBar.value || !currentMode) return null;
    const firstPort = currentMode.input_ports[0] ?? currentMode.output_ports[0];
    return firstPort ? firstPort.side : null;
});

/**
 * 1×1 分流器／匯流器：埠數大於 1 的那一側（分流器是輸出、匯流器是輸入）。
 * 該側改用「中心連到各埠所在邊」的直線表示，只有單一埠的那一側才畫箭頭。
 */
const multiPortGroup = computed<'input' | 'output' | null>(() => {
    const currentMode = mode.value;
    if (!isTiny.value || isBridge.value || !currentMode) return null;
    if (currentMode.input_ports.length > 1) return 'input';
    if (currentMode.output_ports.length > 1) return 'output';
    return null;
});

/**
 * 外框路徑：一般為矩形；管道類 1×1 為內接圓；長條機器在箭頭側倒角。
 * 路徑偏移 0.5px 讓線條落在像素中間。
 */
const outline = computed(() => {
    const w = pixelWidth.value;
    const h = pixelHeight.value;
    if (chamferSide.value) {
        /** 倒角腿長 = 半格，對應「單位格兩邊的中點」 */
        const c = props.gridSize / 2;
        const x0 = 0.5;
        const y0 = 0.5;
        const x1 = w - 0.5;
        const y1 = h - 0.5;
        switch (chamferSide.value) {
            case 'right':
                return `M${x0} ${y0}H${x1 - c}L${x1} ${y0 + c}V${y1 - c}L${x1 - c} ${y1}H${x0}Z`;
            case 'left':
                return `M${x0 + c} ${y0}H${x1}V${y1}H${x0 + c}L${x0} ${y1 - c}V${y0 + c}Z`;
            case 'top':
                return `M${x0} ${y0 + c}L${x0 + c} ${y0}H${x1 - c}L${x1} ${y0 + c}V${y1}H${x0}Z`;
            default:
                return `M${x0} ${y0}H${x1}V${y1 - c}L${x1 - c} ${y1}H${x0 + c}L${x0} ${y1 - c}Z`;
        }
    }
    if (isPipe.value) {
        const r = Math.min(w, h) / 2 - 0.5;
        const cx = w / 2;
        const cy = h / 2;
        return `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;
    }
    return `M0.5 0.5H${w - 0.5}V${h - 0.5}H0.5V0.5Z`;
});

/** 分流器／匯流器的三條直線（像素座標）：從中心連到各埠所在邊的中點 */
const spokePath = computed(() => {
    const currentMode = mode.value;
    const group = multiPortGroup.value;
    if (!currentMode || !group) return '';
    const ports = group === 'input' ? currentMode.input_ports : currentMode.output_ports;
    const w = pixelWidth.value;
    const h = pixelHeight.value;
    const cx = w / 2;
    const cy = h / 2;
    const edgeMid: Record<PortSide, [number, number]> = {
        top: [cx, 0.5],
        bottom: [cx, h - 0.5],
        left: [0.5, cy],
        right: [w - 0.5, cy],
    };
    return ports
        .map((port) => `M${cx} ${cy}L${edgeMid[port.side][0]} ${edgeMid[port.side][1]}`)
        .join('');
});

/**
 * 箭頭的 transform：放在指定邊、指定格的中央，以箭頭中心為軸旋轉。
 * @param side 箭頭所在的邊
 * @param offset 沿該邊的格序（0 起算）
 * @param angle 旋轉角度（原始朝右 = 0°）
 */
function chevronAt(side: PortSide, offset: number, angle: number): string {
    const along = (offset + 0.5) * CELL_DESIGN;
    let x: number;
    let y: number;
    switch (side) {
        case 'top':
            x = along;
            y = MARKER_INSET;
            break;
        case 'bottom':
            x = along;
            y = designHeight.value - MARKER_INSET;
            break;
        case 'left':
            x = MARKER_INSET;
            y = along;
            break;
        default:
            x = designWidth.value - MARKER_INSET;
            y = along;
    }
    return `translate(${x} ${y}) rotate(${angle}) translate(${-CHEVRON_CX} ${-CHEVRON_CY})`;
}

/** 依埠資料算出每個箭頭的 transform */
const markers = computed(() => {
    const currentMode = mode.value;
    if (!currentMode) return [];

    // 橋：四邊各畫兩個朝向相反、軸心相同的箭頭，完全重疊成 X 形
    if (isBridge.value) {
        return ALL_SIDES.flatMap((side) =>
            [0, 180].map((extra) => ({
                key: `bridge-${side}-${extra}`,
                transform: chevronAt(side, 0, INWARD_ANGLE[side] + extra),
            })),
        );
    }

    const build = (ports: readonly PortDef[], isOutput: boolean) =>
        ports.map((port, i) => ({
            key: `${isOutput ? 'out' : 'in'}-${port.side}-${port.offset}-${i}`,
            transform: chevronAt(
                port.side,
                port.offset,
                INWARD_ANGLE[port.side] + (isOutput ? 180 : 0),
            ),
        }));

    // 分流器／匯流器：多埠那一側改畫直線，不畫箭頭
    const inputs = multiPortGroup.value === 'input' ? [] : currentMode.input_ports;
    const outputs = multiPortGroup.value === 'output' ? [] : currentMode.output_ports;
    return [...build(inputs, false), ...build(outputs, true)];
});
</script>

<template>
    <g
        data-testid="device-shape"
        :data-dragging="props.dragging"
        :data-selected="props.selected"
    >
        <!-- 供電樁類：整個交給 Electric.vue（圓形外框、中央圖示） -->
        <Electric
            v-if="isElectric"
            :grid-size="props.gridSize"
            :selected="props.selected"
            :dragging="props.dragging"
        />
        <template v-else>
            <!-- 底框、邊線、箭頭：拖曳中整組套用 Opacity 70% -->
            <g :opacity="props.dragging ? DRAG_BODY_OPACITY : 1">
                <path
                    :d="outline"
                    :fill="outlineColor"
                    :fill-opacity="OUTLINE_FILL_OPACITY"
                    :stroke="outlineColor"
                />
                <path v-if="spokePath" :d="spokePath" fill="none" :stroke="lineColor" />
                <g :transform="shapeTransform">
                    <path
                        v-for="marker in markers"
                        :key="marker.key"
                        :transform="marker.transform"
                        :d="CHEVRON_PATH"
                        :fill="lineColor"
                    />
                </g>
            </g>
            <g :transform="shapeTransform">
                <!-- 頭像圓框：即使沒有圖片也保留直徑 55 的圓框；拖曳中 Opacity 50% -->
                <template v-if="layout === 'badge'">
                    <defs>
                        <clipPath :id="iconClipId">
                            <circle :cx="iconCx" :cy="iconCy" :r="ICON_RADIUS" />
                        </clipPath>
                        <!-- Figma 的 Blur 是模糊半徑，換算成 SVG stdDeviation 需除以 2 -->
                        <filter :id="iconShadowId" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow
                                dx="0"
                                dy="4"
                                stdDeviation="2"
                                flood-color="#000000"
                                flood-opacity="0.25"
                            />
                        </filter>
                    </defs>
                    <g
                        :filter="`url(#${iconShadowId})`"
                        :opacity="props.dragging ? DRAG_AVATAR_OPACITY : 1"
                    >
                        <foreignObject
                            :x="iconCx - ICON_RADIUS"
                            :y="iconCy - ICON_RADIUS"
                            :width="ICON_RADIUS * 2"
                            :height="ICON_RADIUS * 2"
                        >
                            <div
                                xmlns="http://www.w3.org/1999/xhtml"
                                style="
                                    width: 55px;
                                    height: 55px;
                                    border-radius: 50%;
                                    background: rgba(43, 43, 43, 1);
                                "
                            />
                        </foreignObject>
                        <image
                            v-if="iconUrl"
                            :href="iconUrl"
                            :x="iconCx - ICON_RADIUS"
                            :y="iconCy - ICON_RADIUS"
                            :width="ICON_RADIUS * 2"
                            :height="ICON_RADIUS * 2"
                            :clip-path="`url(#${iconClipId})`"
                        />
                        <circle
                            :cx="iconCx"
                            :cy="iconCy"
                            :r="ICON_RADIUS"
                            fill="none"
                            stroke="rgba(238, 253, 28, 1)"
                            :stroke-width="ICON_STROKE_WIDTH"
                        />
                    </g>
                </template>
                <!-- 查不到機器：只顯示傳入的 label -->
                <text
                    v-else-if="layout === 'text' && displayName"
                    :x="designWidth / 2"
                    :y="designHeight / 2"
                    fill="white"
                    font-size="14"
                    text-anchor="middle"
                    dominant-baseline="middle"
                >
                    {{ displayName }}
                </text>
                <!-- 沒有接電時的電池圖示 -->
                <image
                    v-if="showBattery"
                    :href="BATTERY_URL"
                    :x="batteryX"
                    :y="batteryY"
                    :width="BATTERY_WIDTH"
                    :height="BATTERY_HEIGHT"
                />
            </g>
            <foreignObject
                v-if="showName"
                :transform="shapeTransform"
                :x="iconCx - labelBoxWidth / 2"
                :y="labelTop"
                :width="labelBoxWidth"
                :height="ICON_LABEL_HEIGHT"
            >
                <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    :style="{
                        width: labelBoxWidth + 'px',
                        height: ICON_LABEL_HEIGHT + 'px',
                        color: 'rgba(207, 207, 207, 1)',
                        fontFamily: `'HarmonyOS Sans TC', sans-serif`,
                        fontSize: ICON_LABEL_FONT_SIZE + 'px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: '100%',
                        letterSpacing: '0',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                    }"
                >
                    {{ displayName }}
                </div>
            </foreignObject>
        </template>
    </g>
</template>