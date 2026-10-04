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
                d="M12 8.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z"
                stroke="currentColor"
                stroke-width="1.6"
            />
            <path
                d="m19.4 13.5 1.1.85-1.5 2.6-1.3-.5a7.9 7.9 0 0 1-1.5.87L16 18.7h-3l-.3-1.38a7.9 7.9 0 0 1-1.5-.87l-1.3.5-1.5-2.6 1.1-.85a7.2 7.2 0 0 1 0-1.74l-1.1-.85 1.5-2.6 1.3.5a7.9 7.9 0 0 1 1.5-.87L13 6.56h3l.3 1.38a7.9 7.9 0 0 1 1.5.87l1.3-.5 1.5 2.6-1.1.85a7.2 7.2 0 0 1-.1 1.74Z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.6"
                transform="translate(-2 -0.6)"
            />
        </svg>
        <span>Settings</span>
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
