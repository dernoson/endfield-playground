<script setup lang="ts">
/**
 * V10-E1／I1 — `/dev` 擺放＋埠旋轉演示（L1 除錯頁；不接 store）
 */
import { computed, ref } from 'vue';
import { getAllMachines } from '@/data/machines';
import type { Machine } from '@/types/machine';
import type { FactoryNode, FactoryEdge } from '@/types/graph';
import type { GridRotation } from '@/utils/portUtils';
import { rotatePort } from '@/utils/portUtils';
import { getMachineMode } from '@/types/machine';
import DevTopologySvg from '@/app/dev/DevTopologySvg.vue';
import { resolveDisplayGrid } from '@/app/dev/topologyPortUtils';

const machines = getAllMachines();
const selectedId = ref(
    machines.find((m) => m.id === 'filling_machine')?.id ?? machines[0]?.id ?? '',
);
const rotation = ref<GridRotation>(0);
const placeCursor = ref({ x: 2, y: 2 });
const placed = ref(true);

const selected = computed(() => machines.find((m) => m.id === selectedId.value) ?? null);

const display = computed(() => {
    const m = selected.value;
    if (!m) return { widthCells: 0, heightCells: 0 };
    return resolveDisplayGrid(m.width, m.height, rotation.value);
});

const rotatedPorts = computed(() => {
    const m = selected.value;
    if (!m) return [];
    const mode = getMachineMode(m);
    const list: Array<{
        key: string;
        kind: 'in' | 'out';
        from: string;
        to: string;
    }> = [];
    mode.input_ports.forEach((p, i) => {
        const r = rotatePort(p.side, p.offset, m.width, m.height, rotation.value);
        list.push({
            key: `in-${i}`,
            kind: 'in',
            from: `${p.side}@${p.offset}`,
            to: `${r.side}@${r.offset}`,
        });
    });
    mode.output_ports.forEach((p, i) => {
        const r = rotatePort(p.side, p.offset, m.width, m.height, rotation.value);
        list.push({
            key: `out-${i}`,
            kind: 'out',
            from: `${p.side}@${p.offset}`,
            to: `${r.side}@${r.offset}`,
        });
    });
    return list;
});

const nodes = computed<FactoryNode[]>(() => {
    const m = selected.value;
    if (!m || !placed.value) return [];
    return [
        {
            id: 'demo-1',
            position: { ...placeCursor.value },
            data: {
                label: m.name,
                machineType: m.name,
                rotation: rotation.value,
            },
        } as FactoryNode,
    ];
});

const edges: FactoryEdge[] = [];

function pick(m: Machine) {
    selectedId.value = m.id;
    placed.value = true;
}

function cycleRotation() {
    rotation.value = ((rotation.value + 1) % 4) as GridRotation;
}

function onSelectNode(_id: string) {
    /* no-op：單機演示 */
}

function nudge(dx: number, dy: number) {
    placeCursor.value = {
        x: Math.max(0, placeCursor.value.x + dx),
        y: Math.max(0, placeCursor.value.y + dy),
    };
}
</script>

<template>
    <div class="space-y-6">
        <header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                擺放／埠旋轉演示（V10）
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                L1 除錯頁：唯讀 <code>getMachine</code>＋<code>rotatePort</code>（pad-to-square）＋
                <code>DevTopologySvg</code>。不接 Pinia。
            </p>
        </header>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <aside
                class="max-h-[32rem] space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
            >
                <h3 class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    選機（{{ machines.length }}）
                </h3>
                <button
                    v-for="m in machines"
                    :key="m.id"
                    type="button"
                    class="block w-full rounded px-2 py-1.5 text-left text-sm"
                    :class="
                        m.id === selectedId
                            ? 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    "
                    @click="pick(m)"
                >
                    {{ m.name }}
                    <span class="text-xs text-gray-500"> {{ m.width }}×{{ m.height }} </span>
                </button>
            </aside>

            <section class="space-y-3 lg:col-span-2">
                <div class="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                        @click="cycleRotation"
                    >
                        旋轉 90°（目前 {{ rotation }}）
                    </button>
                    <button
                        type="button"
                        class="rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600"
                        @click="placed = !placed"
                    >
                        {{ placed ? '隱藏設備' : '放上設備' }}
                    </button>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                        顯示格
                        <strong>{{ display.widthCells }}×{{ display.heightCells }}</strong>
                        （原 {{ selected?.width }}×{{ selected?.height }}）
                    </span>
                    <div class="flex gap-1">
                        <button
                            type="button"
                            class="rounded border px-2 text-sm"
                            @click="nudge(0, -1)"
                        >
                            ↑
                        </button>
                        <button
                            type="button"
                            class="rounded border px-2 text-sm"
                            @click="nudge(-1, 0)"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            class="rounded border px-2 text-sm"
                            @click="nudge(1, 0)"
                        >
                            →
                        </button>
                        <button
                            type="button"
                            class="rounded border px-2 text-sm"
                            @click="nudge(0, 1)"
                        >
                            ↓
                        </button>
                    </div>
                </div>

                <div
                    class="overflow-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
                >
                    <DevTopologySvg
                        :nodes="nodes"
                        :edges="edges"
                        :cell-size="28"
                        @select-node="onSelectNode"
                    />
                </div>

                <div
                    v-if="selected"
                    class="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                    <table class="min-w-full text-left text-sm">
                        <thead class="bg-gray-50 text-xs text-gray-500 dark:bg-gray-900">
                            <tr>
                                <th class="px-3 py-2">埠</th>
                                <th class="px-3 py-2">原 side@offset</th>
                                <th class="px-3 py-2">旋轉後</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="row in rotatedPorts"
                                :key="row.key"
                                class="border-t border-gray-100 dark:border-gray-700"
                            >
                                <td class="px-3 py-1.5 font-mono text-xs">
                                    {{ row.kind }} {{ row.key }}
                                </td>
                                <td class="px-3 py-1.5 font-mono text-xs">{{ row.from }}</td>
                                <td
                                    class="px-3 py-1.5 font-mono text-xs text-blue-700 dark:text-blue-300"
                                >
                                    {{ row.to }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
</template>
