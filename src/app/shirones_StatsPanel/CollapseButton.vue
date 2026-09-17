<script setup lang="ts">
/**
 * collapse button 元件
 * 對應 Figma: Production Overview > collapse button
 * 側邊黃色指示/收合三角形按鈕
 */
const emit = defineEmits<{
    (e: 'toggle'): void;
}>();
</script>

<template>
    <div class="collapse-button" @click="emit('toggle')">
        <div class="triangle" />
    </div>
</template>

<style scoped>
.collapse-button {
    position: absolute;
    left: -16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.triangle {
    width: 16px;
    height: 32px;
    background-color: #eefd1c;
    clip-path: polygon(100% 50%, 0% 0%, 0% 100%);
}
</style>
