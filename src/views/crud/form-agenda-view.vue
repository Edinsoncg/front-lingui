<template>
  <v-card class="pa-6" elevation="1" color="#f4eafd" rounded="lg">
    <v-row>
      <!-- Columna 1 -->
      <v-col cols="12" sm="4">
        <v-select v-model="form.house" :items="houses" label="House" />
        <v-select v-model="form.language" :items="languages" label="Language" />
        <v-select v-model="form.level" :items="levels" label="Level" />
        <v-text-field v-model="form.startDate" label="Start date time" type="datetime-local" />
      </v-col>

      <!-- Columna 2 -->
      <v-col cols="12" sm="4">
        <v-select v-model="form.classroom" :items="classrooms" label="Classroom" />
        <v-select v-model="form.teacher" :items="teachers" label="Teacher" />
        <v-select v-model="form.unit" :items="units" label="Unit" />
        <v-text-field v-model="form.endDate" label="end_date_time" type="datetime-local" />
      </v-col>

      <!-- Columna 3 -->
      <v-col cols="12" sm="4">
        <v-select v-model="form.modality" :items="modalities" label="Modality" />
        <v-select v-model="form.classType" :items="classTypes" label="Class type" />
        <v-select v-model="form.component" :items="components" label="Component" />
        <v-select v-model="form.duration" :items="[1, 2, 3]" label="Duration hour" />
      </v-col>
    </v-row>

    <!-- Botón -->
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn color="primary" class="px-6" @click="submitForm">
          <v-icon left>mdi-login</v-icon>
          Crear
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  house: null,
  classroom: null,
  modality: null,
  language: null,
  classType: null,
  level: null,
  unit: null,
  component: null,
  teacher: null,
  startDate: '',
  endDate: '',
  duration: null,
})

// Opciones simuladas, luego reemplazamos con servicios
const houses = ['Casa 1', 'Casa 2']
const classrooms = ['TOKYO', 'PARIS']
const modalities = ['Virtual', 'Presencial']
const languages = ['Inglés', 'Francés']
const classTypes = ['Clase', 'Asesoría']
const levels = ['Básico', 'Intermedio']
const units = ['Unidad 1', 'Unidad 2']
const components = ['Gramática', 'Conversación']
const teachers = ['Juan Pérez', 'Ana Ruiz']

function submitForm() {
  console.log('Formulario enviado:', form.value)
  // Lógica de guardado con servicio
}
</script>
