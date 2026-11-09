/**
 * 按住左鍵拖曳捲動容器（取代可見捲軸）
 *
 * 容器內容超出時，按住左鍵拖曳以 1:1 跟隨位移捲動；滾輪捲動不受影響。
 * 子元素若已自行處理拖曳（mousedown 呼叫了 `preventDefault`，如 MachineCard 配方列的橫向拖曳），
 * 本 composable 不接手，避免同一次拖曳同時捲動兩層。
 */

import type { Ref } from 'vue';
import { useEventListener } from '@vueuse/core';

/** 位移超過此像素數才算拖曳，以下仍視為點擊 */
const DRAG_THRESHOLD = 3;

/**
 * 為容器加上按住左鍵拖曳捲動。
 * @param target 要捲動的容器；為 `null` 時不作用（例如 `v-if` 尚未渲染）
 */
export function useDragScroll(target: Ref<HTMLElement | null>): void {
    /** 本次拖曳的起點與起始捲動位置；`null` 表示目前沒有按住 */
    let drag: { x: number; y: number; left: number; top: number; moved: boolean } | null = null;
    /** 剛結束的按壓是否拖曳過；mouseup 先於 click 觸發，需另外記住給 click 判斷 */
    let suppressClick = false;

    useEventListener(target, 'mousedown', (event: MouseEvent) => {
        const el = target.value;
        suppressClick = false;
        if (event.button !== 0 || event.defaultPrevented || !el) return;
        drag = {
            x: event.clientX,
            y: event.clientY,
            left: el.scrollLeft,
            top: el.scrollTop,
            moved: false,
        };
    });

    useEventListener(window, 'mousemove', (event: MouseEvent) => {
        const el = target.value;
        if (!drag || !el) return;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        drag.moved = true;
        /** 拖曳期間不要選取文字 */
        event.preventDefault();
        el.scrollLeft = drag.left - dx;
        el.scrollTop = drag.top - dy;
    });

    useEventListener(window, 'mouseup', () => {
        suppressClick = drag?.moved ?? false;
        drag = null;
    });

    /** 真的拖曳過就吞掉放開後的 click，避免誤觸卡片內的點擊事件 */
    useEventListener(
        target,
        'click',
        (event: MouseEvent) => {
            if (!suppressClick) return;
            suppressClick = false;
            event.stopPropagation();
        },
        { capture: true },
    );
}
