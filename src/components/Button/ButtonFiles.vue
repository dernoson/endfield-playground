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
        aria-label="Files"
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
    </button>
</template>

<style scoped>
.tool-button {
    position: absolute;
    top: 20px;
    left: 20px;
    display: grid;
    box-sizing: border-box;
    width: 58px;
    height: 55px;
    place-items: center;
    padding: 0;
    color: #2b2b2b;
    background: #EEFD1C;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
}

.tool-button:focus-visible {
    outline: 2px solid rgb(56 189 248);
    outline-offset: 2px;
}

.tool-button--active {
    background: rgb(12 74 110 / 0.45);
    border-color: rgb(56 189 248);
}

.tool-button:hover {
    color: #EEFD1C;
    background: #2B2B2B;
}

svg {
    width: 25px;
    height: 25px;
    flex: 0 0 auto;
}
</style>
