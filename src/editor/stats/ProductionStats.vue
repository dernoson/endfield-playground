<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/store/editorStore'

const editorStore = useEditorStore()
const { machineCount, nodeCount, edgeCount } = storeToRefs(editorStore)
</script>

<template>
  <div class="panel h-full px-4 py-3 flex items-center gap-4">
    <div class="stat-item">
      <span class="stat-label">總機器數量</span>
      <strong class="stat-value">{{ machineCount }}</strong>
    </div>
    <div class="stat-item">
      <span class="stat-label">總功耗（placeholder）</span>
      <strong class="stat-value">-- kW</strong>
    </div>
    <div class="stat-item">
      <span class="stat-label">節點數量</span>
      <strong class="stat-value">{{ nodeCount }}</strong>
    </div>
    <div class="stat-item">
      <span class="stat-label">連線數量</span>
      <strong class="stat-value">{{ edgeCount }}</strong>
    </div>
  </div>
</template>
