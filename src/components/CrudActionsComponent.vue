<template>
  <div class="d-flex align-center">
    <v-icon small color="indigo" @click="$emit('open', { mode: 'edit', resource, id })">
      mdi-pencil
    </v-icon>
    <v-icon small color="grey" @click="$emit('open', { mode: 'view', resource, id })">
      mdi-eye
    </v-icon>
    <v-icon small color="red" @click="$emit('delete', id)">
      mdi-delete
    </v-icon>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  resource: string
  id: number
}>()

defineEmits<{
  (e: 'open', payload: { mode: 'edit' | 'view'; resource: string; id: number }): void
  (e: 'delete', id: number): void
}>()
</script>
