<template>
  <v-card class="pa-4 elevation-2">
    <h2 class="text-h6 font-weight-bold mb-4">Clases inscritas</h2>

    <v-data-table
      :headers="headers"
      :items="classes"
      class="elevation-1"
      item-value="id"
      density="compact"
      no-data-text="No hay clases registradas"
    >
      <template #item.asistio="{ item }">
        <v-chip :color="item.asistio ? 'green' : 'red'" dark>
          {{ item.asistio ? 'Sí' : 'No' }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  classes: Array<{
    id: number
    fecha: string
    nivel: string
    unidad: string
    modalidad: string
    duracion: number
    asistio: boolean
  }>
}>()

const headers = [
  { title: 'Fecha', key: 'fecha' },
  { title: 'Nivel', key: 'nivel' },
  { title: 'Unidad', key: 'unidad' },
  { title: 'Modalidad', key: 'modalidad' },
  { title: 'Duración (h)', key: 'duracion' },
  { title: '¿Asistió?', key: 'asistio' },
]
</script>
