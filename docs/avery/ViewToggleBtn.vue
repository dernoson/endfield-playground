<script setup>
import { ref, computed } from 'vue';

const icons = ['view_3d', 'view_2d', 'view_top'];
const currentIndex = ref(0);
const currentIcon = computed(() => icons[currentIndex.value]);

const toggleView = () => {
    currentIndex.value = (currentIndex.value + 1) % icons.length;
};
</script>

<template>
    <button
        class="fixed right-6 bottom-6 z-999 h-14 w-14 cursor-pointer rounded-full border-none"
        @click="toggleView"
    >
        <span>{{ currentIcon }}</span>
    </button>
</template>
