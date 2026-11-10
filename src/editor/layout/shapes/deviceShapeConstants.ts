// src/editor/layout/shapes/deviceShapeConstants.ts
// DeviceShape.vue 與 Electric.vue 共用的常數；改這裡，兩邊會一起變。

/** 設計稿中一格的邊長（設計單位 = Figma 長度單位）；原 225×225 設計稿 = 5×5 格，每格 45 */
export const CELL_DESIGN = 45;

/** 底框底色不透明度（一般、選取、供電樁都是 20%） */
export const OUTLINE_FILL_OPACITY = 0.2;

/** 被單擊選取時：邊線、箭頭、底色（以及供電樁圖示線條）都用這個藍色（Figma：#1CAEFD） */
export const SELECTED_COLOR = '#1CAEFD';

/** 拖曳中：底框（底色、邊線、箭頭）整組的 Opacity */
export const DRAG_BODY_OPACITY = 0.7;

/** 交給 Electric.vue 繪製的供電樁機器 id（2×2、圓形外框） */
export const ELECTRIC_POLE_IDS: ReadonlySet<string> = new Set(['power_pole', 'xi_rang_power_pole']);