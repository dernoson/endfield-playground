# 技術註記｜shirone｜E001 的座標語意與最小測試骨架（W0823-S1 專用）

| meta | value |
|------|-------|
| 對應工單 | [W0823-S1](./W0823-S1_e001_device_overlap.md) |
| 為什麼有這份 | `ValidationContext` 的座標語意是 detector 最容易寫錯的地方；先講清楚就不會在「測試過了但畫面上抓不到重疊」之間耗掉整週 |
| 另含 | 可直接抄的測試 fixture、以及第一次開 PR 的步驟 |

---

## 1. 座標語意（本週最重要的一段）

`useValidation.buildContext()` 負責把畫布的像素座標換算成格子座標，`ValidationContext` 對外只保證格子座標：

```ts
function buildContext(): ValidationContext {
    /** 單格像素；換算基準取自畫布視圖狀態，detector 端因此不需要知道 gridSize */
    const gridSize = canvasStore.gridSize;

    return {
        devices: editorStore.nodes.map((node) => ({
            ...node,
            position: {
                x: Math.floor(node.position.x / gridSize),
                y: Math.floor(node.position.y / gridSize),
            },
        })),
        connections: editorStore.edges.map(toGridBendPoints), // data.bendPoints 同樣換算
        getDef: getMachine,
        baseRegion: canvasStore.baseRegion,
    };
}
```

`FactoryNode.position` 在 store 裡是 Vue Flow 的像素座標（吸附成 `gridSize`＝20 的倍數，見 `src/types/graph.ts` 註解）；進到 `ctx` 之後就是格子座標。畫面上相鄰一格的兩台設備，在 detector 眼裡座標就是差 1。

**怎麼寫：**

| 做 | 不要做 |
|----|--------|
| detector 直接把 `node.position.x` / `.y` 當格子索引用 | 不要在 detector 裡除以 `gridSize`——`ValidationContext` 沒有 gridSize，硬取就會 import store，違反純函式 |
| 佔格與路徑展開一律走 `@/utils/layout` 的既有模組 | 不要自己重寫佔格換算，那會產生第二份真相 |
| 測試 fixture 用**格子座標**（`position: { x: 0, y: 0 }`、`{ x: 1, y: 0 }`） | 不要為了「畫面上要抓得到」去改 `buildContext` 或 store |

---

## 2. 現況再確認

- 佔格與路徑展開的單一來源在 `src/utils/layout/`：`deviceOccupancy.ts`（設備佔格）、`pipelineGeometry.ts`（管線路徑）、`overlapDetection.ts`（格點表與配對）
- detector 由使用端顯式 `validationStore.registerDetector()` 掛上；目前唯一的使用端是 `src/app/dev/ValidationTest.vue`
- 官方型別在 `src/types/validation.ts`：`Detector = { code, level, run(ctx) }`，`Alert` 需要 `uid`／`level`／`code`／`message`／`relatedDeviceUids`／`relatedConnectionUids`
- 佔格描述型別在 `src/types/footprint.ts`：`DeviceFootprint`（`position` 的 z 為起始層、`size` 的 z 為佔用深度 d）、`PipelineFootprint`

---

## 3. 測試 fixture 骨架（抄了改）

```ts
import { describe, it, expect } from 'vitest';
import type { FactoryNode, FactoryEdge } from '@/types/graph';
import type { Machine } from '@/types/machine';
import type { ValidationContext } from '@/types/validation';
import { E001_deviceOverlap } from '@/lib/validation/detectors/E001_deviceOverlap';

/** 造一台最小可用的機器定義；只有幾何欄位是本測試在意的 */
function makeDef(name: string, width: number, height: number): Machine {
    return { name, width, height, modes: [] } as unknown as Machine;
}

/** 造一顆最小節點；position 用「格子座標」，與 ctx 的語意一致 */
function makeNode(id: string, machineType: string, x: number, y: number, rotation = 0): FactoryNode {
    return {
        id,
        position: { x, y },
        data: { label: machineType, machineType, rotation },
    } as FactoryNode;
}

/** 組出最小 ValidationContext：不啟動 Vue、不碰 store */
function makeCtx(
    devices: FactoryNode[],
    defs: Record<string, Machine>,
    connections: FactoryEdge[] = [],
): ValidationContext {
    return {
        devices,
        connections,
        getDef: (type: string) => defs[type],
        baseRegion: null,
    };
}

describe('E001_deviceOverlap', () => {
    const defs = { 粉碎機: makeDef('粉碎機', 3, 2), 塑型機: makeDef('塑型機', 2, 2) };

    it('兩台分開時不產生警示', () => {
        const ctx = makeCtx([makeNode('a', '粉碎機', 0, 0), makeNode('b', '塑型機', 10, 10)], defs);
        expect(E001_deviceOverlap.run(ctx)).toEqual([]);
    });

    it('兩台重疊時只產生一條 E001', () => {
        const ctx = makeCtx([makeNode('a', '粉碎機', 0, 0), makeNode('b', '塑型機', 1, 0)], defs);
        const alerts = E001_deviceOverlap.run(ctx);
        expect(alerts).toHaveLength(1);
        expect(alerts[0].code).toBe('E001');
        expect(alerts[0].relatedDeviceUids).toEqual(expect.arrayContaining(['a', 'b']));
    });
});
```

再補兩個案例就達到工單 DoD：**rotation 造成重疊／不重疊各一例**（3×2 轉 90° 變 2×3）、**`getDef` 回 undefined 時該對 skip 不炸**。

`as unknown as Machine` 是為了不用填滿整個 `Machine` 介面；只在測試裡這樣用，正式碼不要。

---

## 4. Alert 的兩個細節

- **同一對只報一條**：`detectOverlaps` 已把配對以字典序正規化後去重，直接照回傳的配對清單產 Alert 即可
- **訊息用機器名**：`ctx.getDef(...)?.name`，不要只丟 uid（右側面板 11 月要直接顯示這句）

---

## 5. 第一次開 PR 的步驟

```powershell
git checkout -b dev/shirone-e001
# 寫 detector 與測試
pnpm type-check
pnpm lint-check
pnpm format-check
pnpm test
git add src/lib/validation/detectors/E001_deviceOverlap.ts src/__tests__/lib/validation/detectors/E001_deviceOverlap.test.ts
git commit -m "feat(validation): E001 device overlap detector + tests"
git push -u origin dev/shirone-e001
```

到 GitHub 開 PR，描述四行：

1. 做了什麼
2. 怎麼測（`pnpm test`）
3. **未接右側 UI**
4. 在 `/dev/validation-test` 的實測結果

`format-check` 沒過就跑 `pnpm format` 再 commit。dernoson 幫你順格式是預期內的事，不是失敗。

---

## 6. 一票否決（review 直接退）

- 提交 `opus.ts`／`sonnet.ts` 之類 AI dump 檔進正式樹
- detector 內 `import` 了 `vue`／`pinia`／`.vue`
- 順手做 E002、右側列表、點擊導覽
