<template>
  <v-app-bar
    app
    flat
    class="bg-purple-lighten-4"
    density="default"
  >  <!-- el density da el tamaño de header (prominent > default> comfortable > compact)-->

    <h2 style="margin-left: 1rem;">ID: {{ classId }}</h2>

    <v-spacer />
        <v-btn
      @click="goToAgenda"
      prepend-icon="mdi-calendar-arrow-left"
      color="purple-lighten-2"
      variant="flat"
      rounded
      class="text-white font-weight-bold mr-3"
      >
      Volver
    </v-btn>
    <CancelButtonClassAgendaComponent
      :item-id="classId"
      @confirm-cancel="cancelClass"
      style="margin-right: 1rem;"
    />
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :color="snackbarColor"
      location="top right"
      class="text-white"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router' // Importar useRoute
import AgendaService from '@/services/AgendaService'
import CancelButtonClassAgendaComponent from '@/components/buttons/CancelButtonClassAgendaComponent.vue'

const router = useRouter()
const route = useRoute() // Obtener el objeto de la ruta

const classId = ref(Number(route.params.id)) // Usar route.params.id para obtener el ID de la clase


const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success') // puede ser 'success', 'error', 'info', etc.

function goToAgenda() {
  router.push({ name: 'agenda' })
}

async function cancelClass() {
  try {
    await AgendaService.delete(classId.value)
    snackbarText.value = 'Clase cancelada con éxito.'
    snackbarColor.value = 'success'
    snackbar.value = true

    setTimeout(() => {
      router.push({ name: 'agenda' })
    }, 1000)
  } catch (error) {
    snackbarText.value = 'Error al cancelar la clase.'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}
</script>

