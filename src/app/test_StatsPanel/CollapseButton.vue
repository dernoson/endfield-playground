<script setup lang="ts">
interface Props {
    collapsed?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
    (e: 'toggle'): void;
}>();
</script>

<template>
    <div
        class="collapse-button"
        :class="{ 'is-collapsed': collapsed }"
        :title="collapsed ? '展開面板' : '折疊面板'"
        @click="emit('toggle')"
    >
        <div class="triangle" />
    </div>
</template>

<style scoped>
.collapse-button {
    position: absolute;
    top: 582px;
    right: 100%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    padding: 6px 0;
}

.collapse-button.is-collapsed {
    transform: translateY(-50%) scaleX(-1);
}

.triangle {
    width: 12px;
    height: 24px;
    background-color: #eefd1c;
    clip-path: polygon(100% 50%, 0% 0%, 0% 100%);
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
    transition: transform 0.2s ease;
}

.collapse-button:hover .triangle {
    opacity: 0.9;
}
</style>
