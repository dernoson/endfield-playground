import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ShortcutAction } from '@/types/editor';

export const useShortcutStore = defineStore('shortcut', () => {
    const registeredActions = ref<Record<string, ShortcutAction>>({});
    const undoStack = ref<string[]>([]);
    const redoStack = ref<string[]>([]);

    function registerAction(action: ShortcutAction) {
        registeredActions.value[action.id] = action;
    }

    function triggerAction(id: string) {
        registeredActions.value[id]?.run();
    }

    function pushUndoSnapshot(snapshot: string) {
        undoStack.value.push(snapshot);
        redoStack.value = [];
    }

    function undo() {
        const snapshot = undoStack.value.pop();
        if (!snapshot) return;
        redoStack.value.push(snapshot);
    }

    function redo() {
        const snapshot = redoStack.value.pop();
        if (!snapshot) return;
        undoStack.value.push(snapshot);
    }

    return {
        registeredActions,
        undoStack,
        redoStack,
        registerAction,
        triggerAction,
        pushUndoSnapshot,
        undo,
        redo,
    };
});
