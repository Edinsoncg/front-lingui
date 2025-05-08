<template>
  <v-icon small color="indigo" @click="emit('open', { mode: 'edit', resource, id })">
    mdi-pencil
  </v-icon>
</template>

<script setup lang="ts">
const props = defineProps<{ resource: string; id: number }>()
const emit = defineEmits<{
  (e: 'open', payload: { mode: 'edit'; resource: string; id: number }): void
}>()
</script>
