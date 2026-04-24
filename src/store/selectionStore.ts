import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useSelectionStore = defineStore('selection', () => {
    const selectedNodeIds = ref<string[]>([]);

    const hasSelection = computed(() => selectedNodeIds.value.length > 0);
    const isMultiSelect = computed(() => selectedNodeIds.value.length > 1);

    function setSelection(ids: string[]) {
        selectedNodeIds.value = ids;
    }

    function clearSelection() {
        selectedNodeIds.value = [];
    }

    return {
        selectedNodeIds,
        hasSelection,
        isMultiSelect,
        setSelection,
        clearSelection,
    };
});
