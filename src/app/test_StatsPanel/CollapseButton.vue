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
    <button
        type="button"
        class="collapse-button"
        :class="{ 'is-collapsed': collapsed }"
        :title="collapsed ? '展開面板' : '折疊面板'"
        @click="emit('toggle')"
    >
        <svg
            width="20"
            height="39"
            viewBox="0 0 20 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="button-svg"
        >
            <path d="M0 0L0.00439661 39L19.7875 19.5065L0 0Z" fill="#EEFD1C" />
        </svg>
    </button>
</template>

<style scoped>
.collapse-button {
    position: absolute;
    width: 24px;
    height: 39px;
    left: -36px;
    top: 559px;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    transform: matrix(-1, 0, 0, 1, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    transition: opacity 0.2s ease;
}

.collapse-button:hover {
    opacity: 0.85;
}

.collapse-button.is-collapsed {
    transform: matrix(1, 0, 0, 1, 0, 0);
}

.button-svg {
    display: block;
    width: 20px;
    height: 39px;
}
</style>
