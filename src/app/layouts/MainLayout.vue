<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '@/editor/navbar/Navbar.vue';
import ToolbarPanel from '@/editor/toolbar/ToolbarPanel.vue';
import FactoryCanvas from '@/editor/canvas/FactoryCanvas.vue';
import InspectorPanel from '@/editor/inspector/InspectorPanel.vue';

const inspectorCollapsed = ref(false);
</script>

<template>
    <div class="editor-layout" :class="{ 'inspector-collapsed': inspectorCollapsed }">
        <header class="area-navbar">
            <Navbar />
        </header>
        <main class="area-canvas">
            <FactoryCanvas />
        </main>
        <section class="area-toolbar">
            <ToolbarPanel />
        </section>
        <aside class="area-inspector">
            <InspectorPanel
                :collapsed="inspectorCollapsed"
                @toggle-collapse="inspectorCollapsed = !inspectorCollapsed"
            />
        </aside>
    </div>
</template>
