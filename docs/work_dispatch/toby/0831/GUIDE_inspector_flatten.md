# 教學｜toby｜Inspector 攤平（W0831-T1）

| meta | value |
|------|-------|
| 對應工單 | [W0831-T1](./W0831-T1_inspector_flatten.md) |
| 要改的檔 | `src/editor/inspector/InspectorPanel.vue` |
| 用法 | 先讀工單 §0 白話；這裡是名詞、型別、可貼片段、指令 |

---

## 1. 「攤平」是什麼（白話）

上週你已經做到：點設備 → 面板出現名稱、佔格、耗電。

現在的問題是：template 直接用 `selectedMachine.name`。`selectedMachine` 是整包機器資料。之後若要把「顯示」拆給別人（L3 只吃字），那一塊會開始挖 `machine.modes[0].xxx`，越挖越深。

**本週要做的：** 先在同一個檔裡，算出一包**只有字串／數字的物件**，template **只綁這包**。查資料（store、`getMachine`）還是可以留在這個檔，因為它是容器。

做完之後，顯示那一塊**不再出現** `selectedMachine.xxx`。

---

## 2. 這包物件長這樣（先做這四個就夠）

```ts
type DeviceInfoView = {
    name: string;
    machineId: string;
    sizeText: string;   // 例如 "3×3"
    powerText: string | null;
};
```

對照現況：

| 畫面現在綁的 | 改綁成 |
|--------------|--------|
| `selectedMachine.name` | `deviceInfo.name` |
| `selectedMachine.width`×`height` | `deviceInfo.sizeText` |
| `selectedMachine.power` | `deviceInfo.powerText` |

沒選到機器時 `deviceInfo` 給 `undefined`，空狀態維持「未選取設備」。

**不要**把整個 `FactoryNode` 或 `Machine` 傳進顯示。

---

## 3. 可貼的計算（接在你上週 `selectedMachine` 後面）

```ts
/** 攤平後只給畫面用的字串；查不到機器時為 undefined */
const deviceInfo = computed<DeviceInfoView | undefined>(() => {
    const machine = selectedMachine.value;
    if (!machine) return undefined;
    return {
        name: machine.name,
        machineId: machine.id,
        sizeText: `${machine.width}×${machine.height}`,
        powerText: machine.power == null ? null : String(machine.power),
    };
});
```

template 把 `v-if="selectedMachine"` 改成 `v-if="deviceInfo"`，三個欄位改綁 `deviceInfo.*`。

工廠寬高、snap 那些**不要動**。

---

## 4. 加分：配方一行字

若 3–5h 還有剩。**注意 `RecipeDef` 沒有 `name` 欄位**，它只有 `id`、`inputs`、`outputs`、`machine`、`timeSeconds`；`RecipeItem` 是 `{ itemId, quantity }`。所以要自己組字：

```ts
import { getRecipesForMachine } from '@/data/products';

/** 第一筆配方的產出摘要；查無配方時為空字串 */
const recipeText = computed(() => {
    const machine = selectedMachine.value;
    if (!machine) return '';
    const first = getRecipesForMachine(machine.name)[0];
    const output = first?.outputs[0];
    if (!first || !output) return '';
    return `${output.itemId} ×${output.quantity}／${first.timeSeconds}s`;
});
```

畫面多一行「配方」顯示 `recipeText` 即可。**不要顯示產速／效率**（那是 11 月的事）。加不到就跳過，不算未完成。

---

## 5. 本機指令（問卷裡這兩項是「沒接觸」，照貼）

在專案根目錄：

```powershell
pnpm type-check
pnpm lint-check
pnpm format-check
pnpm test
```

四個都過再交。哪一個紅字看不懂，把**整段**貼給 dernoson。

`pnpm dev` 你已會跑：點一台設備，名稱／佔格／耗電還在；點空白仍是「未選取設備」。

---

## 6. 三個容易卡住的點

| 狀況 | 怎麼辦 |
|------|--------|
| 想拆成新檔 `DeviceInfoCard.vue` | 可以，但新檔只能放 `src/editor/inspector/`，且**只能吃上面那包 props**，不能 import store／`src/data/*`。拆不開就留在原檔 |
| `getRecipesForMachine` 要中文名 | 吃 `machine.name`（例如「粉碎機」），**不是** `machine.id`（`'crusher'`） |
| 覺得這條路線不對 | **先 Discord 一句**，不要自己改 store 簽章或重寫面板 |

---

## 7. 交件

```powershell
git checkout -b dev/toby-t1
git add src/editor/inspector/InspectorPanel.vue
git commit -m "refactor(inspector): 設備資訊改綁攤平字串"
git push -u origin dev/toby-t1
```

PR 寫三句：改了哪個檔、畫面跟上次有沒有一樣、有沒有加配方。截圖更好。
