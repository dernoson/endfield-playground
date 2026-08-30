# 教學｜goodmorning｜MachineCard 完整樣板（W0831-G1）

| meta | value |
|------|-------|
| 對應工單 | [W0831-G1](./W0831-G1_machine_card.md) |
| 用法 | **整份複製**下面內容，改文字與樣式即可交件 |
| 唯一路徑 | `src/components/MachineCard/Index.vue` |
| Deadline | **2026-09-04（五）23:59** |
| 設計 | **凍結**：照這份樣板即可；paper 本週改稿也不必跟 |

---

## 1. 三步驟

1. 建立資料夾 `src/components/MachineCard/`
2. 建立檔案 `Index.vue`
3. 貼上 §2 → 存檔 → **先推分支**（就算還沒漂亮）→ 交件

不必先看懂整個專案，也不必接任何資料。

---

## 2. 整份貼這個

```vue
<script setup lang="ts">
/**
 * MachineCard/Index.vue
 *
 * 工具列用的機器卡片（只負責看起來怎樣）：
 *   - 只顯示別人用 props 傳進來的文字
 *   - 點卡片時 emit('pick', id)
 */

const props = defineProps<{
    /** 機器 id，點擊時原樣回傳 */
    id: string;
    /** 例如「粉碎機」 */
    name: string;
    /** 例如「3×3」 */
    sizeText: string;
    /** 例如「基礎生產」；沒有就不顯示 */
    tag?: string;
    /** 圖示網址；沒有就不顯示圖 */
    iconUrl?: string;
}>();

const emit = defineEmits<{
    (event: 'pick', machineId: string): void;
}>();

function onClick(): void {
    emit('pick', props.id);
}
</script>

<template>
    <button type="button" class="machine-card" @click="onClick">
        <img v-if="iconUrl" :src="iconUrl" class="machine-card__icon" alt="" />

        <span class="machine-card__body">
            <span class="machine-card__name">{{ name }}</span>
            <span class="machine-card__size">{{ sizeText }}</span>
        </span>

        <span v-if="tag" class="machine-card__tag">{{ tag }}</span>
    </button>
</template>

<style scoped>
.machine-card {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 10px;
    text-align: left;
    border: 1px solid #3f3f46;
    border-radius: 8px;
    background: #18181b;
    color: #fafafa;
    cursor: pointer;
}

.machine-card:hover {
    background: #27272a;
}

.machine-card__icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.machine-card__body {
    display: flex;
    flex-direction: column;
}

.machine-card__name {
    font-size: 13px;
    font-weight: 600;
}

.machine-card__size {
    font-size: 11px;
    color: #a1a1aa;
}

.machine-card__tag {
    margin-left: auto;
    padding: 2px 6px;
    font-size: 11px;
    border-radius: 4px;
    background: #3f3f46;
    color: #d4d4d8;
}
</style>
```

想改顏色、圓角可以，**不影響驗收**。

**不要等設計稿。** 本週驗收不看 `.fig`：文字排得出名稱與佔格就算過。上週被抽掉的那份稿不影響這一份。

---

## 3. 交件前逐條看

- [ ] 路徑是 `src/components/MachineCard/Index.vue`，一字不差
- [ ] 檔名沒有日期（`Index.vue0904` 不行）
- [ ] 全檔搜尋沒有 `store`、`pinia`、`@/data/machines`
- [ ] 有 `id`、`name`、`sizeText`；點擊 `emit('pick', id)`
- [ ] 沒動 `ToolbarPanel.vue`

---

## 4. 交件（三選一；禁止 GitHub 網頁 Add file）

**做到哪就先推**，不必等完美。

**A. 本機 git（推薦）**

```powershell
git checkout -b dev/goodmorning-g1
git add src/components/MachineCard/Index.vue
git commit -m "feat(ui): MachineCard 機器卡片"
git push -u origin dev/goodmorning-g1
```

**B.** 整份檔案貼 Discord，路徑寫清楚，請 dernoson 代推。

**C.** ZIP，內層路徑仍要一樣。

不會掛上畫面截圖沒關係——dernoson 代掛假 props 仍算你交付。

---

## 5. 驗收長相

有人用這兩組假資料掛上去後，看得到兩張卡：

```vue
<MachineCard id="crusher" name="粉碎機" size-text="3×3" tag="基礎生產" @pick="..." />
<MachineCard id="splitter" name="分流器" size-text="1×1" tag="物流設備" @pick="..." />
```

（真實資料：粉碎機 3×3、分流器 1×1。這兩組是驗收時會用的假 props。）

點一下，上層收到 `pick` 與對應 id。這樣就結案。

---

## 6. 逾時

9/4 23:59 前交不出來，Discord 說「本週不做」——**不計失敗**。最怕不回訊息。
