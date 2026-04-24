<script setup lang="ts">
import Navbar from '@/editor/navbar/Navbar.vue';
import ToolbarPanel from '@/editor/toolbar/ToolbarPanel.vue';
import FactoryCanvas from '@/editor/canvas/FactoryCanvas.vue';
import InspectorPanel from '@/editor/inspector/InspectorPanel.vue';
import ProductionStats from '@/editor/stats/ProductionStats.vue';
</script>

<template>
    <div class="editor-layout">
        <header class="area-navbar">
            <Navbar />
        </header>
        <aside class="area-toolbar">
            <ToolbarPanel />
        </aside>
        <main class="area-canvas">
            <FactoryCanvas />
        </main>
        <aside class="area-inspector">
            <InspectorPanel />
        </aside>
        <footer class="area-stats">
            <ProductionStats />
        </footer>
    </div>
</template>
