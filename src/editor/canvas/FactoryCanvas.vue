<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow } from '@vue-flow/core'
import { useEditorStore } from '@/store/editorStore'
import { useSelectionStore } from '@/store/selectionStore'

const editorStore = useEditorStore()
const selectionStore = useSelectionStore()
const { nodes, edges, snapToGrid, activeTool } = storeToRefs(editorStore)

function handleSelectionChange(selection: { nodes?: Array<{ id: string }> }) {
  selectionStore.setSelection((selection.nodes ?? []).map((node) => node.id))
}
</script>

<template>
  <div class="panel h-full overflow-hidden">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :fit-view-on-init="true"
      :nodes-draggable="true"
      :zoom-on-scroll="true"
      :pan-on-drag="activeTool === 'pan'"
      :selection-on-drag="activeTool === 'box-select'"
      :snap-to-grid="snapToGrid"
      class="factory-flow"
      @selection-change="handleSelectionChange"
    >
      <Background :size="1.2" pattern-color="#3f3f46" />
      <Controls />
      <MiniMap />
    </VueFlow>
  </div>
</template>
