<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useEditorStore } from '@/store/editorStore';
import { useSelectionStore } from '@/store/selectionStore';
import { getMachine } from '@/data/machines';
import ProductionStats from '@/editor/stats/ProductionStats.vue';

/** 藍圖 store：本面板讀寫畫布尺寸與 snap-to-grid 設定 */
const editorStore = useEditorStore();
/** 解構 editorStore 的響應式參照，供 template 綁定輸入框使用 */
const { mapWidth, mapHeight, snapToGrid } = storeToRefs(editorStore);

/** 選取狀態 store：本面板唯讀目前選取的設備 uid */
const selectionStore = useSelectionStore();
/** 目前選取的設備 uid 清單，供單選設備資訊查詢使用 */
const { selectedNodeIds } = storeToRefs(selectionStore);

/** 工廠寬度輸入框的 model，寫入時同步呼叫 editorStore.setMapSize 更新地圖尺寸 */
const mapWidthInput = computed({
    get: () => mapWidth.value,
    set: (value: number) => editorStore.setMapSize(Number(value), mapHeight.value),
});

/** 工廠高度輸入框的 model，寫入時同步呼叫 editorStore.setMapSize 更新地圖尺寸 */
const mapHeightInput = computed({
    get: () => mapHeight.value,
    set: (value: number) => editorStore.setMapSize(mapWidth.value, Number(value)),
});

/** 目前選取的單一設備節點；未選取、多選或節點不存在時為 undefined */
const selectedDevice = computed(() => {
    if (selectedNodeIds.value.length !== 1) return undefined;
    return editorStore.nodes.find((node) => node.id === selectedNodeIds.value[0]);
});

/** 選取設備的機器定義；缺少 machineType 或查無資料時為 undefined */
const selectedMachine = computed(() => {
    const machineType = selectedDevice.value?.data?.machineType;
    return machineType ? getMachine(machineType) : undefined;
});
</script>

<template>
    <div class="panel flex h-full flex-col gap-3 p-3">
        <h2 class="panel-title">Inspector</h2>
        <div class="space-y-3">
            <UFormField label="工廠寬度">
                <UInputNumber v-model="mapWidthInput" :min="64" :step="16" />
            </UFormField>

            <UFormField label="工廠高度">
                <UInputNumber v-model="mapHeightInput" :min="64" :step="16" />
            </UFormField>

            <UCheckbox
                :model-value="snapToGrid"
                label="Snap to grid"
                @update:model-value="editorStore.setSnapToGrid(Boolean($event))"
            />
        </div>

        <div class="mt-2 border-t border-zinc-700 pt-3">
            <h3 class="text-xs tracking-wide text-zinc-400 uppercase">設備資訊</h3>

            <dl v-if="selectedMachine" class="mt-2 space-y-1 text-sm">
                <div class="flex justify-between">
                    <dt class="text-zinc-400">名稱</dt>
                    <dd class="text-zinc-100">{{ selectedMachine.name }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-zinc-400">佔格</dt>
                    <dd class="text-zinc-100">
                        {{ selectedMachine.width }}×{{ selectedMachine.height }}
                    </dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-zinc-400">耗電</dt>
                    <dd class="text-zinc-100">{{ selectedMachine.power }}</dd>
                </div>
            </dl>

            <p v-else class="mt-2 text-sm text-zinc-500">未選取設備</p>
        </div>

        <div class="mt-2 border-t border-zinc-700 pt-3">
            <h3 class="text-xs tracking-wide text-zinc-400 uppercase">未來預留</h3>
            <ul class="mt-2 space-y-1 text-sm text-zinc-300">
                <li>電力模式</li>
                <li>模擬速度</li>
                <li>生產目標</li>
            </ul>
        </div>

        <div class="mt-2 border-t border-zinc-700 pt-3">
            <h3 class="text-xs tracking-wide text-zinc-400 uppercase">產能資訊</h3>
            <div class="mt-2">
                <ProductionStats />
            </div>
        </div>
    </div>
</template>
