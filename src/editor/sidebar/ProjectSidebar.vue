<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const open = defineModel<boolean>('open', { required: true });
const canHoverExpand = ref(false);

let mediaQuery: MediaQueryList | null = null;

function updateHoverCapability() {
    if (!mediaQuery) {
        return;
    }

    canHoverExpand.value = mediaQuery.matches;
}

function handleMouseEnter() {
    if (!canHoverExpand.value) {
        return;
    }

    open.value = true;
}

function handleMouseLeave() {
    if (!canHoverExpand.value) {
        return;
    }

    open.value = false;
}

onMounted(() => {
    mediaQuery = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    updateHoverCapability();
    mediaQuery.addEventListener('change', updateHoverCapability);
});

onBeforeUnmount(() => {
    if (!mediaQuery) {
        return;
    }

    mediaQuery.removeEventListener('change', updateHoverCapability);
});

const projectMenuItems: NavigationMenuItem[] = [
    {
        label: '新建專案',
        icon: 'i-lucide-file-plus-2',
        onSelect: () => {
            // TODO: 之後接實際新建流程
        },
    },
    {
        label: '匯入設計檔',
        icon: 'i-lucide-folder-open',
        onSelect: () => {
            // TODO: 之後接實際匯入流程
        },
    },
    {
        label: '匯出設計檔',
        icon: 'i-lucide-download',
        onSelect: () => {
            // TODO: 之後接實際匯出流程
        },
    },
];
</script>

<template>
    <USidebar
        v-model:open="open"
        collapsible="icon"
        rail
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :ui="{
            gap: 'h-[calc(100%-var(--ui-header-height))] w-16!',
            container:
                'absolute top-(--ui-header-height) bottom-0 h-[calc(100%-var(--ui-header-height))] bg-black',
        }"
    >
        <template #default="{ state }">
            <UNavigationMenu
                :items="projectMenuItems"
                orientation="vertical"
                :collapsed="state === 'collapsed'"
                :ui="{
                    link: 'p-1.5 overflow-hidden',
                }"
            />
        </template>
    </USidebar>
</template>
