<template>
  <v-app-bar
    app
    flat
    class="bg-purple-lighten-4"
    density="default"
  >  <!-- el density da el tamaño de header (prominent > default> comfortable > compact)-->

    <h2 style="margin-left: 1rem;">ID: {{ classId }}</h2>

    <v-spacer />
    <v-btn @click="goToAgenda" prepend-icon="mdi-calendar-arrow-left" color="purple-lighten-2" rounded>Agenda</v-btn>
    <v-btn @click="cancelClass" prepend-icon="mdi-calendar-remove" color="blue-darken-3" rounded>Cancelar</v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router' // Importar useRoute
import AgendaService from '@/services/AgendaService'

const router = useRouter()
const route = useRoute() // Obtener el objeto de la ruta

const classId = ref(Number(route.params.id)) // Usar route.params.id para obtener el ID de la clase

function goToAgenda() {
  router.push({ name: 'agenda' })
}

async function cancelClass() {
  await AgendaService.delete(classId.value)
  router.push({ name: 'agenda' })
}
</script>

