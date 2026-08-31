<script setup lang="ts">
import Frame from './frame.vue';

const props = defineProps<{
  id: string;
  name: string;
  sizeText: string;
  tag?: string;
  iconUrl?: string;
  power?: string;
  selectedRecipe?: string;
  formulas?: any[];
}>();

const emit = defineEmits<{
  (event: 'pick', machineId: string): void;
}>();

function onClick(): void {
  emit('pick', props.id);
}
</script>

<template>
  <div class="machine-card" @click="onClick">
    <Frame
      :name="name"
      :size-text="sizeText"
      :power="power"
      :selected-recipe="selectedRecipe"
      :icon-url="iconUrl"
      :formulas="formulas"
    />
  </div>
</template>

<style scoped>
.machine-card {
  display: inline-block;
  cursor: pointer;
  user-select: none;
}
</style>