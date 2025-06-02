<template>
  <v-card class="pa-4" elevation="2">
    <v-row>
      <v-col cols="12" md="6">
        <strong>Nombre:</strong><br />{{ teacher.nombre }}
      </v-col>
      <v-col cols="12" md="6">
        <strong>Correo:</strong><br />{{ teacher.correo }}
      </v-col>
      <v-col cols="12" md="6">
        <strong>Teléfono:</strong><br />{{ teacher.telefono }}
      </v-col>
      <v-col cols="12" md="6">
        <strong>Idioma:</strong><br />{{ teacher.idioma }}
      </v-col>
      <v-col cols="12" md="6">
        <strong>Jornada:</strong><br />{{ teacher.jornada }}
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  teacher: {
    id: number
    nombre: string
    correo: string
    telefono: string
    idioma: string
    jornada: string
  }
}>()
</script>
