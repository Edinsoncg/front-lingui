<template>
  <v-row class="mb-4" align="stretch">
    <!-- Generamos una tarjeta para cada propiedad de 'classInfo' -->
    <v-col v-for="(value, label) in classInfo" :key="label" cols="12" sm="4">
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          :class="{ 'on-hover': isHovering }"
          :elevation="isHovering ? 12 : 2"
          v-bind="props"
          class="pa-4 text-center"
          :color="getCardColor(label)"
        >
          <v-card-title class="text-uppercase font-weight-bold text-black">{{ label }}</v-card-title>
          <v-card-text class="text-h8 text-black">{{ value }}</v-card-text>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AgendaService from '@/services/AgendaService'

const route = useRoute()
const classId = ref(Number(route.params.id))
const classInfo = ref<Record<string, string>>({})

// Colores predefinidos para las tarjetas
const cardColors = {
  House: 'deep-purple-lighten-4',
  Classroom: 'blue-lighten-3',
  Modality: 'green-lighten-3',
  Language: 'teal-lighten-3',
  Level: 'orange-lighten-3',
  Unit: 'cyan-lighten-3',
  'Class Type': 'red-lighten-3',
  'Start date time': 'indigo-lighten-3',
  'End date time': 'pink-lighten-3',
}

const fetchClassInfo = async () => {
  const data = await AgendaService.getById(classId.value)

  // Acceder a la primera clase (ya que la respuesta es un array)
  const classData = data[0]

  classInfo.value = {
    House: classData.classroom?.house?.name ?? 'Sin información',
    Classroom: classData.classroom?.name ?? 'Sin información',
    Modality: classData.modality?.kind ?? 'Sin información',
    Language: classData.teacher?.language?.name ?? 'Sin información',
    Level: classData.unit?.level?.name ?? 'Sin información',
    Unit: classData.unit?.name ?? 'Sin información',
    'Class Type': classData.classType?.type ?? 'Sin información',
    'Start date time': classData.startAt ? new Date(classData.startAt).toLocaleString() : 'Sin información',
    'End date time': classData.endAt ? new Date(classData.endAt).toLocaleString() : 'Sin información',
  }
}

onMounted(fetchClassInfo)

watch(() => route.params.id, (newId) => {
  classId.value = Number(newId)
  fetchClassInfo()
})

// Función para obtener el color de la tarjeta según el nombre de la propiedad
const getCardColor = (label: string) => {
  return cardColors[label] || 'grey'; // Si no existe el color para una propiedad, usar 'grey'
}
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}

.v-card {
  transition: opacity .4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.8;
}

.on-hover {
  opacity: 1;
}

/* Asegura que todo el texto en las tarjetas sea de color negro */
.text-black {
  color: black !important;
}
</style>
