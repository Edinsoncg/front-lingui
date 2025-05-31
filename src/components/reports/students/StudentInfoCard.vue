<template>
  <v-card class="pa-4 mb-4" elevation="2">
    <v-row dense>
      <v-col cols="12" md="6">
        <strong>Código:</strong>
        <div>{{ student.codigo }}</div>
      </v-col>

      <v-col cols="12" md="6">
        <strong>Nombre completo:</strong>
        <div>{{ student.nombre }} {{ student.apellido }}</div>
      </v-col>

      <v-col cols="12" md="6">
        <strong>Idioma:</strong>
        <div>{{ student.idioma }}</div>
      </v-col>

      <v-col cols="12" md="6">
        <strong>Estado:</strong>
        <div>
          <v-chip
            :color="student.estado === 'Activo' ? 'green' : 'red'"
            variant="elevated"
            size="small"
          >
            {{ student.estado }}
          </v-chip>
        </div>

      </v-col>

      <v-col cols="12" md="4">
        <strong>Tipo de contrato:</strong>
        <div>{{ student.tipo_contrato }}</div>
      </v-col>

      <v-col cols="6" md="4">
        <strong>Fecha inicio:</strong>
        <div>{{ student.fecha_inicio }}</div>
      </v-col>

      <v-col cols="6" md="4">
        <strong>Fecha fin:</strong>
        <div>{{ student.fecha_fin }}</div>
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
