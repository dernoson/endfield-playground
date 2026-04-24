<script setup lang="ts">
import MainLayout from './layouts/MainLayout.vue';
import { useShortcuts } from '@/composables/useShortcuts';

useShortcuts();
</script>

<template>
    <UApp>
        <MainLayout />
    </UApp>
</template>
