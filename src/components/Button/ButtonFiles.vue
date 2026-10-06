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
        <svg aria-hidden="true" viewBox="0 0 25 25" fill="none">
            <path
                d="M21.875 0H0V25H25V3.125L21.875 0ZM12.5 3.125H15.625V8.5H12.5V3.125ZM21.875 21.875H3.125V3.125H6.5V10.9375H18.75V3.125H20.5805L21.875 4.41938V21.875Z"
                fill="#FFFFFF"
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
    color: #FFFFFF;
    background: rgba(78, 78, 78, 1);
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
    color: #FFFFFF;
    background: rgba(78, 78, 78, 0.6);
}

svg {
    width: 25px;
    height: 25px;
    flex: 0 0 auto;
}
</style>
