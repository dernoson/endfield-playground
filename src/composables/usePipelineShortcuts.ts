// src/composables/usePipelineShortcuts.ts
// CR-02: 管線模式快捷鍵

import { watch } from 'vue';
import { useMagicKeys, useEventListener, whenever } from '@vueuse/core';
import { usePipelineStore } from '@/store/pipelineStore';

/**
 * 管線模式快捷鍵設置
 */
export function usePipelineShortcuts() {
    const pipelineStore = usePipelineStore();
    const keys = useMagicKeys();

    // P 鍵：切換管線模式
    const { p, P } = keys;
    watch([p, P], ([pPressed, PPressed]) => {
        if (pPressed || PPressed) {
            pipelineStore.togglePipelineMode();
        }
    });

    // Escape：取消當前管線繪製或退出編輯狀態
    whenever(keys.Escape, () => {
        if (pipelineStore.hasActiveConnection) {
            pipelineStore.cancelDraft();
        } else if (pipelineStore.isEditing) {
            // 嘗試退出編輯狀態
            const success = pipelineStore.finishEditConnection();
            if (!success) {
                // 如果有斜線無法退出，給予提示
                console.warn('無法退出編輯狀態：路徑包含斜線');
            }
        }
    });

    // Enter：退出管線編輯狀態（需無斜線）
    whenever(keys.Enter, () => {
        if (pipelineStore.isEditing) {
            const success = pipelineStore.finishEditConnection();
            if (!success) {
                console.warn('無法退出編輯狀態：路徑包含斜線');
            }
        }
    });

    // Delete：刪除選取的管線
    // 注意：這應該與 selectionStore 整合
    // 這裡先提供基礎實現
    whenever(keys.Delete, () => {
        // TODO: 整合 selectionStore，判斷選取的是否為管線
        // 如果是管線，則刪除
        // pipelineStore.deleteConnection(selectedConnectionUid);
    });

    // 監聽畫布點擊事件（用於新增彎折點）
    // 注意：這個應該在 FactoryCanvas 組件中處理
    // 這裡僅作為示例

    return {
        // 可以返回一些狀態或方法供外部使用
        isPipelineMode: pipelineStore.isPipelineMode,
    };
}
