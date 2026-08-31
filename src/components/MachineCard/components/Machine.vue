<script setup lang="ts">
import testImage from './image.png';

defineProps<{
    src?: string;
}>();
</script>

<template>
    <div class="machine">
        <img :src="src || testImage" alt="machine" class="machine-image" />
    </div>
</template>

<style scoped>
/* image */
.machine {
    position: absolute;
    right: 10px;
    top: 30px;
}

.machine-image {
    display: block;
}
</style>
