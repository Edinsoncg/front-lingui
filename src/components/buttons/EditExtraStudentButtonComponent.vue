<template>
  <v-btn
    icon
    size="small"
    color="info"
    @click="$emit('open', userId)"
    :title="'Editar datos académicos'"
  >
    <v-icon>mdi-school</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{ userId: number }>()
</script>
