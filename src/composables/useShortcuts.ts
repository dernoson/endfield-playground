import { computed, watch } from 'vue';
import { useEventListener, useMagicKeys } from '@vueuse/core';
import { useEditorStore } from '@/store/editorStore';
import { useSelectionStore } from '@/store/selectionStore';
import { useShortcutStore } from '@/store/shortcutStore';

export function useShortcuts() {
    const editorStore = useEditorStore();
    const selectionStore = useSelectionStore();
    const shortcutStore = useShortcutStore();
    const keys = useMagicKeys();

    const isCopy = computed(() => keys['Ctrl+C'].value || keys['Meta+C'].value);
    const isPaste = computed(() => keys['Ctrl+V'].value || keys['Meta+V'].value);
    const isUndo = computed(() => keys['Ctrl+Z'].value || keys['Meta+Z'].value);
    const isRedo = computed(() => keys['Ctrl+Y'].value || keys['Meta+Y'].value);

    watch(
        () => keys.Delete.value,
        (pressed) => {
            if (!pressed) return;
            selectionStore.clearSelection();
            shortcutStore.triggerAction('delete');
        },
    );

    watch(isCopy, (pressed) => pressed && shortcutStore.triggerAction('copy'));
    watch(isPaste, (pressed) => pressed && shortcutStore.triggerAction('paste'));
    watch(isUndo, (pressed) => pressed && shortcutStore.undo());
    watch(isRedo, (pressed) => pressed && shortcutStore.redo());

    useEventListener(window, 'keydown', (event) => {
        if (event.code === 'Space') {
            editorStore.setActiveTool('pan');
        }
    });

    useEventListener(window, 'keyup', (event) => {
        if (event.code === 'Space') {
            editorStore.setActiveTool('select');
        }
    });
}
