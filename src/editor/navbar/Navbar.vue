<script setup lang="ts">
import { ref } from 'vue';
import { useEditorStore } from '@/store/editorStore';

const editorStore = useEditorStore();
const fileName = ref('factory-layout-001.json');
</script>

<template>
    <div class="panel flex h-full items-center justify-between px-4 py-2">
        <div class="flex items-center gap-2">
            <button class="btn">新建專案</button>
            <button class="btn">匯入設計檔</button>
            <button class="btn">匯出設計檔</button>
            <button class="btn btn-warning" @click="editorStore.resetCanvas">重設畫布</button>
        </div>
        <div class="text-sm text-zinc-300">
            目前檔名：<span class="font-semibold text-zinc-100">{{ fileName }}</span>
        </div>
    </div>
</template>
