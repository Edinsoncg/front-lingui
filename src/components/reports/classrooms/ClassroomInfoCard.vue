<template>
  <v-card elevation="2" class="pa-6">
    <v-row>
      <v-col cols="12" md="4">
        <strong class="text-subtitle-1 font-weight-bold">Nombre:</strong><br />
        {{ classroom.nombre }}
      </v-col>

      <v-col cols="12" md="4">
        <strong class="text-subtitle-1 font-weight-bold">Capacidad:</strong><br />
        {{ classroom.capacidad }} estudiantes
      </v-col>

      <v-col cols="12" md="4">
        <strong class="text-subtitle-1 font-weight-bold">House:</strong><br />
        {{ classroom.house }}
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  classroom: {
    id: number
    nombre: string
    capacidad: number
    house: string
  }
}>()
</script>
