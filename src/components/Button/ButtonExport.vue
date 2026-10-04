<script setup lang="ts">
defineProps<{
    active?: boolean;
}>();
</script>

<template>
    <button
        type="button"
        class="tool-button"
        :class="{ 'tool-button--active': active }"
        :aria-pressed="active ?? false"
    >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path
                d="M12 4v11m0 0 4-4m-4 4-4-4M5 14v4.25A1.75 1.75 0 0 0 6.75 20h10.5A1.75 1.75 0 0 0 19 18.25V14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.6"
            />
        </svg>
        <span>Export</span>
    </button>
</template>

<style scoped>
.tool-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    color: rgb(212 212 216);
    background: rgb(39 39 42);
    border: 1px solid rgb(63 63 70);
    border-radius: 0.375rem;
    cursor: pointer;
}

.tool-button:hover {
    background: rgb(63 63 70);
}

.tool-button:focus-visible {
    outline: 2px solid rgb(56 189 248);
    outline-offset: 2px;
}

.tool-button--active {
    color: rgb(224 242 254);
    background: rgb(12 74 110 / 0.45);
    border-color: rgb(56 189 248);
}

svg {
    width: 1rem;
    height: 1rem;
    flex: 0 0 auto;
}
</style>
