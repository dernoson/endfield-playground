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
        aria-label="Export"
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
    </button>
</template>

<style scoped>
.tool-button {
    display: inline-grid;
    box-sizing: border-box;
    width: 58px;
    height: 55px;
    place-items: center;
    padding: 0;
    color: #FFFFFF;
    background: #4E4E4E;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
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

.tool-button:hover {
    background: rgb(78 78 78 / 0.6);
}

svg {
    width: 31px;
    height: 25px;
    flex: 0 0 auto;
}
</style>
