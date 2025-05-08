<template>
  <v-icon small color="grey" @click="emit('open', { mode: 'view', resource, id })">
    mdi-eye
  </v-icon>
</template>

<script setup lang="ts">
const props = defineProps<{ resource: string; id: number }>()
const emit = defineEmits<{
  (e: 'open', payload: { mode: 'view'; resource: string; id: number }): void
}>()
</script>
