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
        <svg aria-hidden="true" viewBox="0 0 31 25" fill="none">
            <path
                d="M17.4375 3.84615L13.5625 0H0V25H31V3.84615H17.4375ZM15.5 10.5769L22.2812 17.3077H17.4375V25H13.5625V17.3077H8.71875L15.5 10.5769Z"
                fill="#FFFFFF"
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
    flex: none;
    order: 2;
    place-items: center;
    padding: 0;
    color: #FFFFFF;
    background: rgba(78, 78, 78 , 1);
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
    color: #FFFFFF;
    background: rgba(78 ,78 ,78 , 0.6);
    border-color: transparent;
}

svg {
    width: 31px;
    height: 25px;
    flex: 0 0 auto;
}
</style>
