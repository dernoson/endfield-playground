<!-- src/editor/layout/shapes/DeviceShape.vue -->
<script setup lang="ts">
import { computed, useId } from 'vue';
import { resolveMachineDef } from '@/data/machines';
import type { Machine } from '@/types/machine';

type PortDef = Machine['modes'][number]['input_ports'][number];
type PortSide = PortDef['side'];

// ─── 圖片來源 ─────────────────────────────────────────────────────────
/**
 * 圖片一律用 import.meta.glob 讀取：檔案不存在時得到空物件，而不是讓編譯失敗。
 * 圖片只在這裡「讀取」，圓形裁切由下方 clipPath 處理，所以放原圖即可。
 * svg 加上 `?url` 是為了不論專案有沒有裝 svg 轉元件的外掛，都拿到網址字串。
 */
const planterFiles = import.meta.glob<string>('@/assets/icon/planter-pattern.png', {
    eager: true,
    import: 'default',
});
const electricFiles = import.meta.glob<string>('@/assets/icon/icon electric.svg', {
    eager: true,
    query: '?url',
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

/** 2×2 供電樁類：外框為圓形，不畫頭像圓框與名稱，改在機器正中央顯示圖示 */
const CENTER_ICON_URLS: Readonly<Record<string, string | undefined>> = {
    power_pole: firstUrl(electricFiles),
    xi_rang_power_pole: firstUrl(electricFiles),
};

/** 有頭像圓框、但不顯示機器名稱的機器 */
const NO_NAME_IDS: ReadonlySet<string> = new Set(['thermal_pool']);

/** 沒有接電時顯示的電池圖示網址；檔案不存在時為 undefined */
const BATTERY_URL = firstUrl(batteryFiles);

// ─── 設計稿常數（單位：設計單位；一格 = CELL_DESIGN） ──────────────────
/** 設計稿中一格的邊長；原 225×225 設計稿 = 5×5 格，每格 45 */
const CELL_DESIGN = 45;
/** 箭頭中心距離設備邊緣的內縮量（取自原設計稿左右標記的位置平均） */
const MARKER_INSET = 6.45;
/** 箭頭路徑（朝右的 chevron）的包圍盒中心，旋轉時以此為軸心 */
const CHEVRON_CX = 3.546;
const CHEVRON_CY = 5.847;
const CHEVRON_PATH =
    'M4.60201 5.84476L0.00194907 1.2447L1.246 3.8147e-06L7.09141 5.84476L1.2447 11.6934L0 10.4481L4.60201 5.84476Z';

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

// ─── 頭像（圓形徽章）與名稱標籤 ───────────────────────────────────────
/** 頭像圓框半徑（直徑 55 設計單位） */
const ICON_RADIUS = 27.5;
/** 圓心到下方名稱標籤頂端的距離（原：132.47 − 102.5） */
const ICON_LABEL_DY = 29.97;
/** 名稱標籤框高度（Figma：Height 18px） */
const ICON_LABEL_HEIGHT = 18;

// ─── 其他圖示 ─────────────────────────────────────────────────────────
/** 供電樁正中央圖示的顯示寬高（設計單位，Figma：36 × 33.77） */
const CENTER_ICON_WIDTH = 36;
const CENTER_ICON_HEIGHT = 33.77;
/** 電池圖示的顯示寬高（設計單位，Figma：23.82 × 11.16） */
const BATTERY_WIDTH = 23.82;
const BATTERY_HEIGHT = 11.16;
/** 電池圖示頂端與名稱標籤底端的距離（設計單位） */
const BATTERY_GAP = 1;

/** 供電樁外框：底色 #EEFD1C、不透明度 20%，描邊同色 */
const POLE_FILL = '#EEFD1C';
const POLE_FILL_OPACITY = 0.2;
const POLE_STROKE = 'rgba(238, 253, 28, 1)';

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
        /** 拖曳中以淺藍色標示 */
        dragging?: boolean;
        /** 設備目前沒有接電（收到「未接電」訊號）時為 true，會顯示電池圖示 */
        unpowered?: boolean;
    }>(),
    { gridSize: 28, dragging: false, unpowered: false },
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
 * - slim：1×1／1×3／3×1，不放名稱也不放頭像
 * - centerIcon：供電樁類，圓形外框、正中央放圖示，不放名稱也不放頭像
 * - badge：頭像圓框（無圖片時保留空圓框）＋名稱標籤（NO_NAME_IDS 例外）
 */
type DeviceLayout = 'text' | 'slim' | 'centerIcon' | 'badge';

const layout = computed<DeviceLayout>(() => {
    const id = machine.value?.id;
    if (!id) return 'text';
    if (isSlim.value) return 'slim';
    if (id in CENTER_ICON_URLS) return 'centerIcon';
    return 'badge';
});

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

/** 供電樁類正中央圖示網址 */
const centerIconUrl = computed(() => {
    const id = machine.value?.id;
    return id ? CENTER_ICON_URLS[id] : undefined;
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

/** 名稱標籤框頂端與底端 */
const labelTop = computed(() => iconCy.value + ICON_LABEL_DY);
const labelBottom = computed(() => labelTop.value + ICON_LABEL_HEIGHT);

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
/** 電池圖示左上角 Y：名稱標籤底端下方 1 單位 */
const batteryY = computed(() => labelBottom.value + BATTERY_GAP);

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

/** 供電樁類：外框改為圓形、顏色改為淡黃色 */
const isPole = computed(() => layout.value === 'centerIcon');

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
 * 外框路徑：一般為矩形；管道類 1×1 與供電樁為內接圓；長條機器在箭頭側倒角。
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
    if (isPipe.value || isPole.value) {
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
    <g data-testid="device-shape" :data-dragging="props.dragging">
        <path
            :d="outline"
            :fill="isPole ? POLE_FILL : 'white'"
            :fill-opacity="isPole ? POLE_FILL_OPACITY : 0.2"
            :stroke="isPole ? POLE_STROKE : 'white'"
        />
        <path v-if="spokePath" :d="spokePath" fill="none" stroke="white" />
        <g :transform="shapeTransform">
            <path
                v-for="marker in markers"
                :key="marker.key"
                :transform="marker.transform"
                :d="CHEVRON_PATH"
                fill="white"
            />
        </g>
        <path
            v-if="props.dragging"
            :d="outline"
            fill="rgba(28, 174, 253, 0.3)"
            stroke="rgba(28, 174, 253, 1)"
        />
        <g :transform="shapeTransform">
            <!-- 頭像圓框：即使沒有圖片也保留直徑 55 的圓框 -->
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
                <g :filter="`url(#${iconShadowId})`">
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
                        stroke-width="3"
                    />
                </g>
            </template>
            <!-- 供電樁類：機器正中央的圖示（圓形外框由 outline 負責） -->
            <image
                v-else-if="layout === 'centerIcon' && centerIconUrl"
                :href="centerIconUrl"
                :x="designWidth / 2 - CENTER_ICON_WIDTH / 2"
                :y="designHeight / 2 - CENTER_ICON_HEIGHT / 2"
                :width="CENTER_ICON_WIDTH"
                :height="CENTER_ICON_HEIGHT"
            />
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
                    fontSize: '16px',
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
    </g>
</template>
