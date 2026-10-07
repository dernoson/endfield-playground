<script setup lang="ts">
defineProps<{
    active?: boolean;
    hovered?: boolean;
}>();
</script>

<template>
    <button
        type="button"
        class="tool-button"
        :class="{
            'tool-button--active': active,
            'tool-button--preview-hovered': hovered === true,
            'tool-button--preview-not-hovered': hovered === false,
        }"
        :aria-pressed="active ?? false"
        aria-label="Settings"
    >
        <svg aria-hidden="true" viewBox="0 0 24 25" fill="none">
            <path
                d="M22.2471 14.8987C20.9419 12.6269 21.7268 9.71553 24 8.39268L21.5554 4.1375C20.8569 4.54897 20.0448 4.78491 19.1782 4.78491C16.5657 4.78491 14.4479 2.64268 14.4479 0H9.55849C9.56495 0.815674 9.36233 1.64263 8.92785 2.39873C7.62266 4.67061 4.72113 5.44321 2.4446 4.12622L0 8.3814C0.703809 8.78354 1.31311 9.37232 1.74643 10.1265C3.04953 12.3947 2.26905 15.3003 0.00432444 16.6261L2.44897 20.8813C3.14501 20.4736 3.95318 20.2403 4.81525 20.2403C7.41951 20.2403 9.53186 22.369 9.54537 25H14.4347C14.4326 24.1925 14.6357 23.3748 15.0655 22.6265C16.3686 20.3583 19.263 19.5847 21.5379 20.8928L23.9826 16.6377C23.2834 16.2357 22.6781 15.649 22.2471 14.8987ZM12 17.5619C9.21807 17.5619 6.96287 15.2957 6.96287 12.5C6.96287 9.70439 9.21802 7.43814 12 7.43814C14.7819 7.43814 17.037 9.70439 17.037 12.5C17.0369 15.2957 14.7819 17.5619 12 17.5619Z"
                fill="white"
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
    color: #ffffff;
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
    color: rgb(224 242 254);
    background: rgb(12 74 110 / 0.45);
    border-color: rgb(56 189 248);
}

.tool-button:hover:not(.tool-button--preview-not-hovered),
.tool-button--preview-hovered {
    color: #ffffff;
    background: rgba(78, 78, 78, 0.6);
    border-color: transparent;
}

.tool-button--preview-not-hovered:hover {
    color: #ffffff;
    background: rgba(78, 78, 78, 1);
    border-color: transparent;
}

svg {
    width: 24px;
    height: 25px;
    flex: 0 0 auto;
}
</style>
