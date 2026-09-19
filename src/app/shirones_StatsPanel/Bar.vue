<script setup lang="ts">
defineProps<{
    isDragging?: boolean;
}>();

const emit = defineEmits<{
    (e: 'start-drag', event: PointerEvent): void;
}>();
</script>

<template>
    <div
        class="bar-handle"
        :class="{ 'is-dragging': isDragging }"
        @pointerdown="emit('start-drag', $event)"
    >
        <div class="bar-line" />
    </div>
</template>

<style scoped>
.bar-handle {
    position: absolute;
    top: var(--split-percent, 70%);
    left: 0;
    width: 100%;
    height: 12px;
    transform: translateY(-50%);
    cursor: row-resize;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
}

.bar-line {
    width: 100%;
    height: 1px;
    background-color: #dadada;
    pointer-events: none;
    transition:
        background-color 0.15s ease,
        height 0.15s ease;
}

.bar-handle:hover .bar-line,
.bar-handle.is-dragging .bar-line {
    background-color: #ffffff;
    height: 2px;
}
</style>
