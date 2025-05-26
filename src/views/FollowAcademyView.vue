<template>
  <v-container class="py-8">
    <!-- BUSCADOR -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="studentCode"
          label="SEARCH - CODE"
          prepend-inner-icon="mdi-magnify"
          @keyup.enter="fetchProgress"
          outlined
          hide-details
        />
      </v-col>
    </v-row>

    <!-- SEGUIMIENTO -->
    <v-row justify="center" v-if="student">
      <v-col cols="12" md="8">
        <v-card class="pa-6" elevation="4">
          <h2 class="text-h5 font-weight-bold mb-6">TU PROGRESO</h2>

          <v-row class="mb-4">
            <v-col cols="12" md="4">
              <v-text-field
                label="NIVEL"
                :model-value="current?.level || '......'"
                readonly
                outlined
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                label="UNIDAD"
                :model-value="current?.unit || '......'"
                readonly
                outlined
              />
            </v-col>
          </v-row>

          <div>
            <p class="text-subtitle-1 font-weight-medium mb-2">COMPONENTE:</p>
            <v-row class="ml-1">
              <v-checkbox
                v-for="(item, index) in current?.components || []"
                :key="index"
                :label="item.component"
                v-model="item.completed"
                hide-details
                density="compact"
              />
            </v-row>
          </div>

          <v-btn
            color="green"
            class="mt-6"
            variant="flat"
            @click="showModal = true"
            :loading="isSaving"
          >
            Guardar Progreso
          </v-btn>

          <ModalComponent
            v-model="showModal"
            title="Confirmar guardado"
            message="¿Estás seguro de que deseas guardar tu progreso?"
            @confirm="saveProgress"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top end">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AcademyProgressService from '@/services/AcademyProgressService'
import ModalComponent from '@/components/ModalComponent.vue'

const studentCode = ref('')
const student = ref(null)
const current = ref(null)
const progress = ref([])
const showModal = ref(false)
const isSaving = ref(false)

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

function showSnackbar(message: string, color: string = 'success') {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

const fetchProgress = async () => {
  if (!studentCode.value) return
  try {
    const data = await AcademyProgressService.getByStudentCode(studentCode.value)
    student.value = data.student
    current.value = data.current
    progress.value = data.progress
  } catch (error) {
    console.error(error)
    showSnackbar('Error al obtener progreso', 'error')
    student.value = null
    current.value = null
    progress.value = []
  }
}

const saveProgress = async () => {
  if (!current.value || !current.value.components?.length) return

  isSaving.value = true
  try {
    const changes = current.value.components.map((c) => ({
      unit_component_id: c.id,
      completed: c.completed,
    }))

    await AcademyProgressService.saveChanges({
      student_id: current.value.components[0].student_id,
      changes,
    })

    fetchProgress() // recargar
    showSnackbar('Progreso guardado correctamente', 'success')
  } catch (error) {
    console.error('Error al guardar progreso:', error)
    showSnackbar('Error al guardar progreso', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.v-text-field input {
  font-weight: bold;
}
</style>
