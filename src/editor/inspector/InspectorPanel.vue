<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useEditorStore } from '@/store/editorStore';

const editorStore = useEditorStore();
const { mapWidth, mapHeight, snapToGrid } = storeToRefs(editorStore);

const mapWidthInput = computed({
    get: () => mapWidth.value,
    set: (value: number) => editorStore.setMapSize(Number(value), mapHeight.value),
});

const mapHeightInput = computed({
    get: () => mapHeight.value,
    set: (value: number) => editorStore.setMapSize(mapWidth.value, Number(value)),
});
</script>

<template>
    <div class="panel flex h-full flex-col gap-3 p-3">
        <h2 class="panel-title">Inspector</h2>
        <div class="space-y-3">
            <label class="field">
                <span>工廠寬度</span>
                <input
                    v-model.number="mapWidthInput"
                    type="number"
                    min="64"
                    step="16"
                    class="input"
                />
            </label>

            <label class="field">
                <span>工廠高度</span>
                <input
                    v-model.number="mapHeightInput"
                    type="number"
                    min="64"
                    step="16"
                    class="input"
                />
            </label>

            <label class="inline-flex items-center gap-2 text-sm text-zinc-200">
                <input
                    :checked="snapToGrid"
                    type="checkbox"
                    class="accent-violet-500"
                    @change="editorStore.setSnapToGrid(($event.target as HTMLInputElement).checked)"
                />
                Snap to grid
            </label>
        </div>

        <div class="mt-2 border-t border-zinc-700 pt-3">
            <h3 class="text-xs tracking-wide text-zinc-400 uppercase">未來預留</h3>
            <ul class="mt-2 space-y-1 text-sm text-zinc-300">
                <li>電力模式</li>
                <li>模擬速度</li>
                <li>生產目標</li>
            </ul>
        </div>
    </div>
</template>
