// src/composables/useShortcuts.ts
import { computed, watch } from 'vue';
import { useEventListener, useMagicKeys } from '@vueuse/core';
import { useEditorStore } from '@/store/editorStore';
import { useSelectionStore } from '@/store/selectionStore';
import { useShortcutStore } from '@/store/shortcutStore';
import { usePipelineStore } from '@/store/pipelineStore';

export function useShortcuts() {
    const editorStore = useEditorStore();
    const selectionStore = useSelectionStore();
    const shortcutStore = useShortcutStore();
    const pipelineStore = usePipelineStore();
    const keys = useMagicKeys();

    const isCopy = computed(() => keys['Ctrl+C'].value || keys['Meta+C'].value);
    const isPaste = computed(() => keys['Ctrl+V'].value || keys['Meta+V'].value);
    const isUndo = computed(() => keys['Ctrl+Z'].value || keys['Meta+Z'].value);
    const isRedo = computed(() => keys['Ctrl+Y'].value || keys['Meta+Y'].value);

    // ── 既有快捷鍵 ──────────────────────────────────────────
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

    // ── CR-02 管線快捷鍵 ────────────────────────────────────

    // P：切換管線模式（用 keydown 而非 useMagicKeys 的 watch，避免大小寫判斷問題）
    useEventListener(window, 'keydown', (event) => {
        // 忽略 input / textarea 內的按鍵
        const tag = (event.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;

        switch (event.code) {
            case 'KeyP':
                pipelineStore.togglePipelineMode();
                break;

            case 'Escape':
                if (pipelineStore.hasActiveConnection) {
                    pipelineStore.cancelDraft();
                } else if (pipelineStore.isEditing) {
                    pipelineStore.finishEditConnection();
                }
                break;

            case 'Enter':
                if (pipelineStore.isEditing) {
                    pipelineStore.finishEditConnection();
                }
                break;
        }
    });
}