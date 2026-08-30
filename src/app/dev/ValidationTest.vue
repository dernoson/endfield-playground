<template>
    <div class="validation-test">
        <div class="mb-6">
            <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">驗證系統測試</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                測試 validationStore 的 detector 註冊與 E001 設備重疊偵測
            </p>
        </div>

        <!-- 使用說明 -->
        <div
            class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950"
        >
            <h3 class="mb-3 text-sm font-semibold text-blue-900 dark:text-blue-200">📖 使用說明</h3>
            <div class="space-y-2 text-xs text-blue-800 dark:text-blue-300">
                <p class="font-semibold">驗證系統架構（CR-03）：</p>
                <ul class="ml-4 space-y-1">
                    <li>
                        • 本頁於 setup 時以 <code>registerDetector()</code> 掛上
                        <code>E001_deviceOverlap</code>，因此下方警示會實際反映設備重疊
                    </li>
                    <li>
                        • 透過 <code>useValidation()</code> 監聽
                        <code>editorStore.nodes / edges</code>，一有變動立即重跑所有已註冊 detector
                    </li>
                    <li>
                        • 下方「目前警示」直接讀取
                        <code>validationStore.alerts</code>，即正式環境右側面板未來要消費的資料
                    </li>
                </ul>

                <p class="mt-3 font-semibold">測試流程：</p>
                <ol class="ml-4 list-decimal space-y-1">
                    <li>點擊「清空所有設備」建立基線，警示應為 0 筆</li>
                    <li>點擊「新增設備 A」，警示仍為 0 筆</li>
                    <li>點擊「新增與 A 重疊的設備 B」，警示出現 1 筆 E001</li>
                    <li>點擊「新增不重疊的設備 C」，警示筆數維持 1 筆</li>
                    <li>點擊「清空所有設備」，警示應歸零</li>
                </ol>
            </div>
        </div>

        <!-- 目前警示 -->
        <div
            class="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
            <div class="mb-3 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                    目前警示（{{ validationStore.alerts.length }}）
                </h3>
                <div class="flex space-x-3 text-xs">
                    <span class="text-red-600 dark:text-red-400">
                        Error:
                        <span class="font-mono font-semibold">{{
                            validationStore.errorCount
                        }}</span>
                    </span>
                    <span class="text-yellow-600 dark:text-yellow-400">
                        Warning:
                        <span class="font-mono font-semibold">{{
                            validationStore.warningCount
                        }}</span>
                    </span>
                </div>
            </div>
            <div class="max-h-64 space-y-2 overflow-y-auto">
                <div
                    v-for="alert in validationStore.alerts"
                    :key="alert.uid"
                    class="rounded p-3 text-xs"
                    :class="
                        alert.level === 'error'
                            ? 'bg-red-50 dark:bg-red-950'
                            : 'bg-yellow-50 dark:bg-yellow-950'
                    "
                >
                    <span class="font-mono font-semibold">{{ alert.code }}</span>
                    <span class="ml-2 text-gray-700 dark:text-gray-300">{{ alert.message }}</span>
                </div>
            </div>
            <p v-if="validationStore.alerts.length === 0" class="text-xs text-gray-400">(無警示)</p>
        </div>

        <div class="grid grid-cols-2 gap-6">
            <!-- 左側：測試操作 -->
            <div
                class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
                <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">測試操作</h3>
                <div class="space-y-2">
                    <button
                        @click="testPlaceDeviceA"
                        class="w-full rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                    >
                        ➕ 新增設備 A（精煉爐 @10,10）
                    </button>
                    <button
                        @click="testPlaceOverlappingDeviceB"
                        class="w-full rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                    >
                        ➕ 新增與 A 重疊的設備 B（精煉爐 @11,11）
                    </button>
                    <button
                        @click="testPlaceNonOverlappingDeviceC"
                        class="w-full rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                    >
                        ➕ 新增不重疊的設備 C（精煉爐 @50,50）
                    </button>
                    <button
                        @click="testClearDevices"
                        :disabled="editorStore.nodes.length === 0"
                        class="w-full rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                        🗑️ 清空所有設備
                    </button>
                </div>
            </div>

            <!-- 右側：設備清單 -->
            <div
                class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
                <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Editor Nodes（{{ editorStore.nodes.length }}）
                </h3>
                <div class="max-h-64 space-y-1 overflow-y-auto">
                    <div
                        v-for="node in editorStore.nodes"
                        :key="node.id"
                        class="rounded bg-gray-50 p-2 text-xs dark:bg-gray-900"
                    >
                        <span class="font-mono text-gray-500">{{ node.id.slice(0, 8) }}</span>
                        <span class="ml-2 text-gray-700 dark:text-gray-300">{{
                            node.data?.machineType || 'Unknown'
                        }}</span>
                        <span class="ml-2 text-gray-500">
                            @({{ node.position.x }}, {{ node.position.y }}) px
                        </span>
                    </div>
                </div>
                <p v-if="editorStore.nodes.length === 0" class="text-xs text-gray-400">(無節點)</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/store/editorStore';
import { useValidationStore } from '@/store/validationStore';
import { useValidation } from '@/composables/useValidation';
import { E001_deviceOverlap } from '@/lib/validation/detectors/E001_deviceOverlap';

/** 藍圖 store：本頁所有測試設備皆透過此 store 擺放 / 清除 */
const editorStore = useEditorStore();
/** 驗證 store：本頁展示其 alerts / errorCount / warningCount */
const validationStore = useValidationStore();

/** 註冊必須早於 useValidation()：後者的 watch 是 immediate，setup 當下就會跑一次 */
validationStore.registerDetector(E001_deviceOverlap);

/** 啟動 editorStore → validationStore 的自動重跑監聽 */
useValidation();

/**
 * 在像素座標 (200,200)（gridSize 20 下即格子 (10,10)）擺放一台精煉爐，作為重疊測試的基準設備 A。
 * @example
 * testPlaceDeviceA()
 */
function testPlaceDeviceA() {
    editorStore.placeDevice({
        id: crypto.randomUUID(),
        type: 'default',
        position: { x: 200, y: 200 },
        data: { label: '測試設備 A', machineType: '精煉爐', recipeIndex: 0, rotation: 0 },
    });
}

/**
 * 在像素座標 (220,220)（即格子 (11,11)）擺放一台精煉爐，與設備 A 佔用格子重疊，用於觸發 E001。
 * @example
 * testPlaceOverlappingDeviceB()
 */
function testPlaceOverlappingDeviceB() {
    editorStore.placeDevice({
        id: crypto.randomUUID(),
        type: 'default',
        position: { x: 220, y: 220 },
        data: { label: '測試設備 B', machineType: '精煉爐', recipeIndex: 0, rotation: 0 },
    });
}

/**
 * 在像素座標 (1000,1000)（即格子 (50,50)）擺放一台精煉爐，與既有設備不重疊，用於驗證 E001 不誤報。
 * @example
 * testPlaceNonOverlappingDeviceC()
 */
function testPlaceNonOverlappingDeviceC() {
    editorStore.placeDevice({
        id: crypto.randomUUID(),
        type: 'default',
        position: { x: 1000, y: 1000 },
        data: { label: '測試設備 C', machineType: '精煉爐', recipeIndex: 0, rotation: 0 },
    });
}

/**
 * 刪除畫布上所有設備，用於驗證清空後 alerts 一併歸零。
 * @example
 * testClearDevices()
 */
function testClearDevices() {
    const allUids = editorStore.nodes.map((n) => n.id);
    editorStore.removeDevices(allUids);
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
