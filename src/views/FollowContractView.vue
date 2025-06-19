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

    <!-- PROGRESO -->
    <v-row justify="center" align="stretch" v-if="student">
      <!-- Avatar + Nombre -->
      <v-col cols="12" md="3" class="d-flex">
        <v-card class="pa-4 d-flex flex-column align-center justify-center w-100" elevation="4" color="#fff">
          <AvatarComponent :imagePath="student.profile_picture" size="180" color="blue-grey-lighten-5"/>
          <v-card
            class="mt-6 transition-all hover-scale"
            color="blue-grey-lighten-5"
            elevation="2"
            width="100%"
          >
            <v-card-title class="text-center justify-center">{{ student.full_name }}</v-card-title>
          </v-card>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="pa-6" elevation="4">
          <h2 class="text-h5 font-weight-bold mb-6">PROGRESO</h2>

          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <v-select
                v-model="form.new_contract_id"
                :items="contractOptions"
                item-title="name"
                item-value="id"
                label="Contrato"
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.new_status_id"
                :items="statusOptions"
                item-title="name"
                item-value="id"
                label="Estado"
                outlined
              />
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.new_start_date"
                label="Fecha de inicio"
                type="date"
                outlined
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                :model-value="student.contracts?.[0]?.endDate?.split('T')[0] || '......'"
                label="Fecha final estimada"
                readonly
                outlined
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-progress-linear
                :model-value="progress.date_percent || 0"
                color="cyan"
                height="40"
                class="mt-2"
                rounded
              >
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="12" md="3">
              <v-text-field
                :model-value="`${progress.weekly_hours_completed || 0}h / ${progress.weekly_sessions_completed || 0} sesiones`"
                label="Horas semanales"
                readonly
                outlined
                class="flex-grow-1"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-progress-linear
                :model-value="weeklyProgress"
                color="cyan"
                height="40"
                class="mt-2"
                rounded
              >
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                :model-value="`${progress.monthly_hours_completed || 0}h / ${progress.monthly_sessions_completed || 0} sesiones`"
                label="Horas mensuales"
                readonly
                outlined
                class="flex-grow-1"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-progress-linear
                :model-value="monthlyProgress"
                color="cyan"
                height="40"
                class="mt-2"
                rounded
              >
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </v-col>
          </v-row>

          <v-btn
            color="green"
            class="mt-4"
            variant="flat"
            style="width: auto"
            @click="showModal = true"
            :loading="isSaving"
          >
            Guardar cambios
          </v-btn>

          <ModalComponent
            v-model="showModal"
            title="Confirmar cambios"
            message="¿Deseas actualizar el contrato y estado del estudiante?"
            @confirm="saveChanges"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top end">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ContractProgressService from '@/services/ContractProgressService'
import StatusService from '@/services/StatusService'
import ContractService from '@/services/ContractService'
import ModalComponent from '@/components/ModalComponent.vue'
import AvatarComponent from '@/components/shared/AvatarComponent.vue'

const studentCode = ref('')

interface Student {
  id: number
  full_name: string
  profile_picture: string
  status?: { id: number; name: string }
  contracts?: Array<{
    contract?: { id: number; name: string }
    startDate?: string
    endDate?: string
  }>
}

const student = ref<Student | null>(null)
const attendances = ref([])

interface Progress {
  date_percent?: number
  weekly_percent?: number
  monthly_percent?: number
  weekly_hours_completed?: number
  weekly_sessions_completed?: number
  monthly_hours_completed?: number
  monthly_sessions_completed?: number
  // add other properties as needed
}

const progress = ref<Progress>({})
const statusOptions = ref([])
const contractOptions = ref([])

const form = ref({
  student_id: 0,
  new_status_id: null,
  new_contract_id: null,
  new_start_date: '',
})

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
  const code = studentCode.value.trim()

  if (!code) {
    showSnackbar('Student code is required.', 'warning')
    return
  }

  if (code.length < 4 || !/^\d+$/.test(code)) {
    showSnackbar('Student code must be at least 4 digits.', 'warning')
    return
  }

  try {
    const data = await ContractProgressService.list(studentCode.value)
    student.value = data.student
    attendances.value = data.attendances
    progress.value = data.progress

    form.value.student_id = data.student.id
    form.value.new_status_id = data.student.status?.id || null
    form.value.new_contract_id = data.student.contracts?.[0]?.contract?.id || null
    form.value.new_start_date = data.student.contracts?.[0]?.startDate?.split('T')[0] || ''
  } catch (error) {
    console.error(error)
    showSnackbar('Error al obtener progreso', 'error')
    student.value = null
    attendances.value = []
    progress.value = {}
  }
}

const saveChanges = async () => {
  if (!form.value.student_id) return
  isSaving.value = true
  try {
    await ContractProgressService.update(form.value)
    fetchProgress()
    showSnackbar('Datos actualizados correctamente')
  } catch (error) {
    console.error('Error al guardar:', error)
    showSnackbar('Error al actualizar', 'error')
  } finally {
    isSaving.value = false
    showModal.value = false
  }
}

onMounted(async () => {
  try {
    statusOptions.value = await StatusService.getAll()
    contractOptions.value = await ContractService.getAll()
  } catch (error) {
    showSnackbar('Error al cargar selects', 'error')
  }
})

const weeklyProgress = computed(() => progress.value.weekly_percent || 0)
const monthlyProgress = computed(() => progress.value.monthly_percent || 0)
</script>

<style scoped>
.text-h5 {
  color: #333;
}
</style>
