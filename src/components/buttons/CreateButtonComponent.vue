//src/components/buttons/CreateButtonComponent.vue

<template>
  <v-btn color="primary" @click="emit('open')">
    Crear {{ label }}
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

