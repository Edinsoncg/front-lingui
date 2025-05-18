<!-- src/components/buttons/UpdateButtonComponent.vue -->
<template>
  <v-btn icon size="small" color="primary" @click="emit('edit')">
    <v-icon size="small">mdi-pencil</v-icon>
  </v-btn>
</template>

<script setup lang="ts">

const props = defineProps<{
  resource: string
  label?: string
}>()

const emit = defineEmits<{
  (e: 'edit'): void
}>()
</script>
