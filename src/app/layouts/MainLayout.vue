<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '@/editor/navbar/Navbar.vue';
import ToolbarPanel from '@/editor/toolbar/ToolbarPanel.vue';
import FactoryCanvas from '@/editor/canvas/FactoryCanvas.vue';
import InspectorPanel from '@/editor/inspector/InspectorPanel.vue';

const inspectorOpen = ref(true);
</script>

<template>
    <div class="editor-layout">
        <header class="area-navbar">
            <Navbar
                :inspector-open="inspectorOpen"
                @toggle-inspector="inspectorOpen = !inspectorOpen"
            />
        </header>
        <main class="area-canvas">
            <FactoryCanvas />
        </main>
        <section class="area-toolbar">
            <ToolbarPanel />
        </section>
    </div>

    <USlideover
        v-model:open="inspectorOpen"
        side="right"
        title="Inspector"
        description="地圖與模擬參數"
        :close="false"
    >
        <template #body>
            <InspectorPanel @close="inspectorOpen = false" />
        </template>
    </USlideover>
</template>
