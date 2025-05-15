<!-- src/components/buttons/DeleteButtonComponent.vue -->
<template>
  <v-btn icon size="small" color="error" @click="emit('delete')">
    <v-icon size="small">mdi-delete</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'delete'): void
}>()
</script>
