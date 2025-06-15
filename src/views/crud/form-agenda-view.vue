<template>
  <v-card class="pa-6" elevation="1" color="#f4eafd" rounded="lg">
    <v-row>
      <!-- Columna 1 -->
      <v-col cols="12" sm="4">
        <v-text-field v-model="form.house" label="Casa" disabled />
        <v-select
          v-model="form.language"
          :items="languages"
          item-title="name"
          item-value="id"
          label="Idioma"
        />
        <v-select
          v-model="form.level"
          :items="levels"
          item-title="name"
          item-value="id"
          label="Nivel"
        />
        <v-text-field
          v-model="form.startDate"
          label="Fecha y hora de inicio"
          type="datetime-local"
          readonly
        />
      </v-col>

      <!-- Columna 2 -->
      <v-col cols="12" sm="4">
        <v-text-field :model-value="getClassroomName()" label="Salón" disabled />
        <v-select
          v-model="form.teacher"
          :items="filteredTeachers"
          item-title="name"
          item-value="id"
          label="Profesor"
        />
        <v-select
          v-model="form.unit"
          :items="filteredUnits"
          item-title="name"
          item-value="id"
          label="Unidad"
        />
        <v-text-field
          v-model="form.endDate"
          label="Fecha y hora de fin"
          type="datetime-local"
          readonly
        />
      </v-col>

      <!-- Columna 3 -->
      <v-col cols="12" sm="4">
        <v-select
          v-model="form.modality"
          :items="modalities"
          item-title="kind"
          item-value="id"
          label="Modalidad"
        />
        <v-select
          v-model="form.classType"
          :items="classTypes"
          item-title="type"
          item-value="id"
          label="Tipo de clase"
        />
        <v-select
          v-model="form.duration"
          :items="[1, 2, 3]"
          label="Duración (horas)"
        />
      </v-col>
    </v-row>

    <v-row justify="end">
      <v-col cols="auto">
        <v-btn color="primary" @click="confirmDialog = true" :loading="loading" :disabled="!formIsValid">
          Crear
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="cancelarFormulario">Cancelar</v-btn>
      </v-col>
    </v-row>

    <ConfirmDialog
      v-model="confirmDialog"
      title="Confirmar creación"
      message="¿Estás seguro de que deseas crear esta clase?"
      @confirm="submit"
      @cancel="confirmDialog = false"
    />
  </v-card>

  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    :timeout="3000"
    location="top right"
  >
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AgendaService from '@/services/AgendaService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import ClassroomService from '@/services/ClassroomService'
import TeacherService from '@/services/TeacherService'
import LanguageService from '@/services/LanguageService'
import LevelService from '@/services/LevelService'
import UnitService from '@/services/UnitService'
import ClasstypesService from '@/services/ClasstypeService'
import ModalityService from '@/services/ModalityService'

interface FormData {
  house: string | null
  classroom: number | null
  modality: number | null
  language: number | null
  classType: number | null
  level: number | null
  unit: number | null
  teacher: number | null
  startDate: string
  endDate: string
  duration: number | null
}

interface Classroom {
  id: number
  name: string
  houseId: number
  house: { id: number; name: string }
}

// Refs principales
const route = useRoute()
const router = useRouter()

const form = ref<FormData>({
  house: null,
  classroom: null,
  modality: null,
  language: null,
  classType: null,
  level: null,
  unit: null,
  teacher: null,
  startDate: '',
  endDate: '',
  duration: null
})

const allTeachers = ref<any[]>([])
const allUnits = ref<any[]>([])
const bookings = ref<any[]>([])
const filteredTeachers = ref<any[]>([])
const filteredUnits = ref<any[]>([])
const classrooms = ref<Classroom[]>([])
const modalities = ref<any[]>([])
const languages = ref<any[]>([])
const levels = ref<any[]>([])
const classTypes = ref<any[]>([])

// Confirmación y estado
const confirmDialog = ref(false)
const loading = ref(false)

// Snackbar
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Validación de campos obligatorios
const formIsValid = computed(() => {
  return !!(
    form.value.classroom &&
    form.value.modality &&
    form.value.unit &&
    form.value.teacher &&
    form.value.classType &&
    form.value.startDate &&
    form.value.duration
  )
})

// Métodos utilitarios
function padHour(hour: string): string {
  return hour.length === 4 ? '0' + hour : hour
}

function getClassroomName(): string {
  return classrooms.value.find(c => c.id === form.value.classroom)?.name || ''
}

function showSnackbar(message: string, color = 'success') {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

// Verificar traslape
function verificarConflicto(): boolean {
  const start = new Date(form.value.startDate)
  const end = new Date(form.value.endDate)

  return bookings.value.some(session => {
    if (session.classroom.id !== form.value.classroom) return false
    const sessionStart = new Date(session.startAt)
    const sessionEnd = new Date(session.endAt)
    return (
      (start >= sessionStart && start < sessionEnd) ||
      (end > sessionStart && end <= sessionEnd) ||
      (start <= sessionStart && end >= sessionEnd)
    )
  })
}

// Obtener clases del día actual
async function fetchBookings() {
  try {
    const date = form.value.startDate.split('T')[0]
    bookings.value = await AgendaService.getAll(date)
  } catch (err) {
    console.error('Error al obtener clases existentes:', err)
  }
}

// Watchers para filtrar
watch(() => form.value.language, (languageId) => {
  filteredTeachers.value = languageId
    ? allTeachers.value.filter(t => t.languageId === languageId).map(t => ({
        id: t.id,
        name: `${t.user.firstName} ${t.user.firstLastName}`
      }))
    : []
  form.value.teacher = null
})

watch(() => form.value.level, (levelId) => {
  filteredUnits.value = levelId
    ? allUnits.value.filter(u => u.levelId === levelId).map(u => ({
        id: u.id,
        name: u.name
      }))
    : []
  form.value.unit = null
})

// Calcular endDate basado en duración
watch(() => form.value.duration, (duration) => {
  if (typeof duration !== 'number' || !form.value.startDate) return
  const [datePart, timePart] = form.value.startDate.split('T')
  const [hours, minutes] = timePart.split(':').map(Number)
  const start = new Date(`${datePart}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`)
  if (start.toString() === 'Invalid Date') return

  const end = new Date(start)
  end.setHours(end.getHours() + duration)

  const yyyy = end.getFullYear()
  const mm = String(end.getMonth() + 1).padStart(2, '0')
  const dd = String(end.getDate()).padStart(2, '0')
  const hh = String(end.getHours()).padStart(2, '0')
  const min = String(end.getMinutes()).padStart(2, '0')

  form.value.endDate = `${yyyy}-${mm}-${dd}T${hh}:${min}`
})

// On mounted: carga inicial
onMounted(async () => {
  const roomId = parseInt(route.query.roomId as string)
  const date = route.query.date as string
  const hour = padHour(route.query.hour as string)
  const endHour = padHour((route.query.endHour || '') as string)

  classrooms.value = await ClassroomService.getAll()
  allTeachers.value = await TeacherService.getAll()
  languages.value = await LanguageService.getAll()
  levels.value = await LevelService.getAll()
  allUnits.value = await UnitService.getAll()
  classTypes.value = await ClasstypesService.getAll()
  modalities.value = await ModalityService.getAll()

  const classroom = classrooms.value.find(c => c.id === roomId)
  if (classroom) {
    form.value.classroom = classroom.id
    form.value.house = classroom.house.name
  }

  if (date && hour) {
    form.value.startDate = `${date}T${hour}:00`
    await fetchBookings()
  }

  if (date && endHour) {
    form.value.endDate = `${date}T${endHour}:00`
    const start = new Date(form.value.startDate)
    const end = new Date(form.value.endDate)
    form.value.duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  }
})

// Formato de fecha
function formatDateTimeLocalToSQL(dateTimeLocal: string): string {
  const [datePart, timePart] = dateTimeLocal.split('T')
  return `${datePart} ${timePart}`
}

// Cancelar
function cancelarFormulario() {
  router.push('/agenda')
}

// Submit
async function submit() {
  confirmDialog.value = false

  if (!formIsValid.value) {
    showSnackbar('Debes completar todos los campos obligatorios', 'warning')
    return
  }

  if (verificarConflicto()) {
    showSnackbar('Este salón ya está ocupado en este horario', 'warning')
    return
  }

  // Validación extra: clases no pueden terminar después de las 21:00
  const end = new Date(form.value.endDate)
  if (end.getHours() > 21 || (end.getHours() === 21 && end.getMinutes() > 0)) {
    showSnackbar(
      `Solo puedes programar clases hasta las 21:00. Esta clase terminaría a las ${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`,
      'warning'
    )
    return
  }

  loading.value = true
  try {
    const payload = {
      classroom_id: form.value.classroom,
      modality_id: form.value.modality,
      unit_id: form.value.unit,
      teacher_user_language_id: form.value.teacher,
      class_type_id: form.value.classType,
      start_at: formatDateTimeLocalToSQL(form.value.startDate),
      duration: form.value.duration
    }

    await AgendaService.create(payload)
    showSnackbar('Clase creada exitosamente', 'success')

    // Espera 1.5 segundos para que se vea el mensaje antes de redirigir
    setTimeout(() => {
      router.push('/agenda')
    }, 1500)
  } catch (err) {
    console.error('Error al guardar la clase:', err)
    showSnackbar('Ocurrió un error al guardar la clase', 'error')
  } finally {
    loading.value = false
  }
}
</script>
