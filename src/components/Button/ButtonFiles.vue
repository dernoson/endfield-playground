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
                d="M3.75 6.75A1.75 1.75 0 0 1 5.5 5h5l2 2h6A1.75 1.75 0 0 1 20.25 8.75v9.5A1.75 1.75 0 0 1 18.5 20h-13a1.75 1.75 0 0 1-1.75-1.75z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.6"
            />
        </svg>
        <span>Files</span>
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
