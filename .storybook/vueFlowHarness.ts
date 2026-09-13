import { h, markRaw, type Component } from 'vue';
import { VueFlow } from '@vue-flow/core';

/**
 * `VueFlow` 的 props 與 emits 型別在 `h()` 下無法對上（`onError` 等事件的
 * 簽章推導不相容），而 story 只需要傳幾個明確的 props。以 `Component` 收窄
 * 檢查範圍，換取 harness 本身的可讀性；元件實際的 props 正確性由畫布負責。
 */
const Canvas = VueFlow as Component;

/**
 * Vue Flow 節點與邊的 story 掛載工具
 *
 * `FlowChart/` 底下的節點與邊元件不是靠 props 直接掛載的：它們的 props 由
 * Vue Flow 在渲染時算出（節點的 `selected`、邊的 `sourceX` / `targetY` 等），
 * 單獨掛載會缺少畫布注入而失敗。因此 story 一律把元件註冊成 `nodeTypes` /
 * `edgeTypes`，讓真正的 `<VueFlow>` 去渲染它。
 *
 * 畫布關掉拖曳與縮放：story 要看的是元件外觀，不是畫布互動。
 */

/** 畫布外框尺寸；固定值讓各 story 的截圖可互相比較 */
const CANVAS_STYLE = 'width: 460px; height: 240px';

/**
 * 把單一節點元件包進最小畫布。
 *
 * @param component 要渲染的節點元件
 * @param id 畫布實例 id，同頁多個 story 需各自獨立
 * @returns Storybook 的 render 函式
 * @example
 * render: nodeHarness(DeviceNode, 'device-node')
 */
export function nodeHarness(component: Component, id: string) {
    const nodeTypes = { story: markRaw(component) };

    return (args: { data: Record<string, unknown>; selected?: boolean }) => ({
        setup() {
            return () =>
                h('div', { style: CANVAS_STYLE }, [
                    h(Canvas, {
                        id,
                        nodeTypes,
                        nodes: [
                            {
                                id: 'story-node',
                                type: 'story',
                                position: { x: 0, y: 0 },
                                data: args.data,
                                selected: args.selected ?? false,
                            },
                        ],
                        fitViewOnInit: true,
                        nodesDraggable: false,
                        zoomOnScroll: false,
                        panOnDrag: false,
                    }),
                ]);
        },
    });
}

/**
 * 把單一邊元件包進最小畫布。
 *
 * 邊需要兩端節點才算得出路徑，因此本工具額外放兩個預設節點；
 * 它們只是端點，外觀不是本 story 要看的東西。
 *
 * @param component 要渲染的邊元件
 * @param id 畫布實例 id，同頁多個 story 需各自獨立
 * @returns Storybook 的 render 函式
 * @example
 * render: edgeHarness(FlowEdge, 'flow-edge')
 */
export function edgeHarness(component: Component, id: string) {
    const edgeTypes = { story: markRaw(component) };

    return (args: { data: Record<string, unknown> }) => ({
        setup() {
            return () =>
                h('div', { style: CANVAS_STYLE }, [
                    h(Canvas, {
                        id,
                        edgeTypes,
                        nodes: [
                            { id: 'a', position: { x: 0, y: 60 }, data: { label: '來源' } },
                            { id: 'b', position: { x: 240, y: 60 }, data: { label: '目標' } },
                        ],
                        edges: [
                            {
                                id: 'story-edge',
                                source: 'a',
                                target: 'b',
                                type: 'story',
                                data: args.data,
                            },
                        ],
                        fitViewOnInit: true,
                        nodesDraggable: false,
                        zoomOnScroll: false,
                        panOnDrag: false,
                    }),
                ]);
        },
    });
}
