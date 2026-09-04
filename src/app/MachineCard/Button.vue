<script setup lang="ts">
import buttonSvg from './Button.svg';
</script>

<template>
    <div class="button">
        <img :src="buttonSvg" alt="button" />
    </div>
</template>

<style scoped>
.button {
    position: absolute;
    top: 45%;
    right: -10px;
    cursor: pointer;
}
</style>
