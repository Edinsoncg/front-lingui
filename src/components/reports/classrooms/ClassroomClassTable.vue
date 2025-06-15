<template>
  <v-card elevation="2" class="pa-4 mt-6">
    <v-data-table
      :headers="headers"
      :items="classes"
      class="elevation-1"
      density="compact"
    >
      <template #item.fecha="{ item }">
        {{ formatDate(item.fecha) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  classes: Array<{
    id: number
    fecha: string
    nivel: string
    unidad: string
    modalidad: string
    idioma: string
    profesor: string
    duracion: number
  }>
}>()

const headers = [
  { title: 'Fecha', key: 'fecha' },
  { title: 'Nivel', key: 'nivel' },
  { title: 'Unidad', key: 'unidad' },
  { title: 'Modalidad', key: 'modalidad' },
  { title: 'Idioma', key: 'idioma' },
  { title: 'Profesor', key: 'profesor' },
  { title: 'Duración (h)', key: 'duracion' },
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>
