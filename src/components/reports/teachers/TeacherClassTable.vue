<template>
  <v-data-table
    :headers="headers"
    :items="classes"
    class="elevation-2"
    item-value="id"
    density="comfortable"
  >
    <template #item.duracion="{ item }">
      {{ item.duracion }} h
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
defineProps<{
  classes: Array<{
    id: number
    fecha: string
    nivel: string
    unidad: string
    modalidad: string
    salon: string
    duracion: number
  }>
}>()

const headers = [
  { title: 'Fecha', key: 'fecha' },
  { title: 'Nivel', key: 'nivel' },
  { title: 'Unidad', key: 'unidad' },
  { title: 'Modalidad', key: 'modalidad' },
  { title: 'Salón', key: 'salon' },
  { title: 'Duración', key: 'duracion' },
]
</script>
