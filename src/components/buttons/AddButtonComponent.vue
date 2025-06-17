<template>
  <v-btn color="primary" @click="emit('open')">
    Agregar {{ label }}
  </v-btn>
</template>

<script setup lang="ts">
const props = defineProps<{
  resource: string
  label?: string
}>()

const emit = defineEmits<{
  (e: 'open'): void
}>()
</script>

<style scoped>
  button {
    margin: 1.3rem auto;
  }
</style>
