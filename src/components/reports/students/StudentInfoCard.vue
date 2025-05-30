<template>
  <v-card class="pa-6 mb-4" elevation="2">
    <v-row>
      <v-col cols="12" md="6">
        <p class="font-weight-bold mb-1">Código:</p>
        <p>{{ student.codigo }}</p>
      </v-col>

      <v-col cols="12" md="6">
        <p class="font-weight-bold mb-1">Nombre completo:</p>
        <p>{{ student.nombre }} {{ student.apellido }}</p>
      </v-col>

      <v-col cols="12" md="6">
        <p class="font-weight-bold mb-1">Idioma:</p>
        <p>{{ student.idioma }}</p>
      </v-col>

      <v-col cols="12" md="6">
        <p class="font-weight-bold mb-1">Estado:</p>
        <v-chip :color="student.estado === 'Activo' ? 'green' : 'red'" dark>
          {{ student.estado }}
        </v-chip>
      </v-col>

      <v-col cols="12" md="4">
        <p class="font-weight-bold mb-1">Tipo de contrato:</p>
        <p>{{ student.tipo_contrato }}</p>
      </v-col>

      <v-col cols="6" md="4">
        <p class="font-weight-bold mb-1">Fecha inicio:</p>
        <p>{{ student.fecha_inicio }}</p>
      </v-col>

      <v-col cols="6" md="4">
        <p class="font-weight-bold mb-1">Fecha fin:</p>
        <p>{{ student.fecha_fin }}</p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  student: {
    codigo: string
    nombre: string
    apellido: string
    estado: string
    idioma: string
    tipo_contrato: string
    fecha_inicio: string
    fecha_fin: string
  }
}>()
</script>
