<script setup lang="ts">
import { ref } from 'vue';
import { useEditorStore } from '@/store/editorStore';

defineProps<{ inspectorOpen: boolean }>();
defineEmits<{ (event: 'toggle-inspector'): void }>();

const editorStore = useEditorStore();
const fileName = ref('factory-layout-001.json');
</script>

<template>
    <div class="panel flex h-full items-center justify-between px-4 py-2">
        <UFieldGroup size="sm">
            <UButton variant="soft" color="neutral" label="新建專案" />
            <UButton variant="soft" color="neutral" label="匯入設計檔" />
            <UButton variant="soft" color="neutral" label="匯出設計檔" />
            <UButton variant="soft" color="error" label="重設畫布" @click="editorStore.resetCanvas" />
        </UFieldGroup>
        <div class="flex items-center gap-3">
            <UBadge color="neutral" variant="outline" size="md" :label="`目前檔名：${fileName}`" />
            <UButton
                size="sm"
                variant="outline"
                color="neutral"
                :label="inspectorOpen ? '收起右側面板' : '打開右側面板'"
                @click="$emit('toggle-inspector')"
            />
        </div>
    </div>
</template>
