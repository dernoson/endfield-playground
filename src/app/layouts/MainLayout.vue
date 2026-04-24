<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '@/editor/navbar/Navbar.vue';
import ProjectSidebar from '@/editor/sidebar/ProjectSidebar.vue';
import ToolbarPanel from '@/editor/toolbar/ToolbarPanel.vue';
import FactoryCanvas from '@/editor/canvas/FactoryCanvas.vue';
import InspectorPanel from '@/editor/inspector/InspectorPanel.vue';

const sidebarOpen = ref(false);
const inspectorOpen = ref(false);
</script>

<template>
    <div class="editor-layout">
        <header class="area-navbar">
            <Navbar
                :inspector-open="inspectorOpen"
                :sidebar-open="sidebarOpen"
                @toggle-inspector="inspectorOpen = !inspectorOpen"
                @toggle-sidebar="sidebarOpen = !sidebarOpen"
            />
        </header>

        <div class="area-workspace">
            <ProjectSidebar v-model:open="sidebarOpen" />

            <div class="workspace-main">
                <main class="area-canvas">
                    <FactoryCanvas />
                </main>
                <section class="area-toolbar">
                    <ToolbarPanel />
                </section>
            </div>
        </div>
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
