<template>
  <v-icon small color="red" @click="emit('delete', id)">
    mdi-delete
  </v-icon>
</template>

<script setup lang="ts">
const props = defineProps<{ id: number }>()
const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()
</script>
