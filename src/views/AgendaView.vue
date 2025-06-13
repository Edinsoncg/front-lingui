<template>
  <div>
    <!-- Filtro de fecha -->
    <v-row class="mb-4">
      <v-col cols="auto">
        <v-text-field
          v-model="selectedDate"
          type="date"
          label="Seleccionar fecha"
          density="compact"
          @change="() => { fetchBookings(); applyFilters(); }"
        />
      </v-col>
    </v-row>

    <v-row class="mb-4" dense>
      <!-- Filtro por tipo de clase -->
      <v-col cols="12" sm="3">
        <v-select
          v-model="filters.classType"
          :items="classTypes"
          item-title="type"
          item-value="id"
          label="Tipo de clase"
          clearable
          density="compact"
          @update:modelValue="applyFilters"
        />
      </v-col>

      <!-- Filtro por idioma -->
      <v-col cols="12" sm="3">
        <v-select
          v-model="filters.language"
          :items="languages"
          item-title="name"
          item-value="id"
          label="Idioma"
          clearable
          density="compact"
          @update:modelValue="applyFilters"
        />
      </v-col>

      <!-- Filtro por nivel -->
      <v-col cols="12" sm="3">
        <v-select
          v-model="filters.level"
          :items="levels"
          item-title="name"
          item-value="id"
          label="Nivel"
          clearable
          density="compact"
          @update:modelValue="handleLevelChange"
        />
      </v-col>

      <!-- Filtro por unidad (dependiente de nivel) -->
      <v-col cols="12" sm="3">
        <v-select
          v-model="filters.unit"
          :items="filteredUnits"
          item-title="name"
          item-value="id"
          label="Unidad"
          clearable
          density="compact"
          :disabled="!filters.level"
          @update:modelValue="applyFilters"
        />
      </v-col>
    </v-row>

    <!-- Tabla de la agenda -->
    <v-table class="elevation-1">
      <thead>
        <tr class="border-b">
          <th class="text-left border-r">CLASSROOM</th>
          <th v-for="hour in hours" :key="hour" class="text-center border-r">
            {{ hour }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in classrooms" :key="room.id" class="border-b">
          <td class="border-r">{{ room.name }}</td>
          <td
            v-for="cell in renderAgendaRow(room.id)"
            :key="cell.key"
            :colspan="cell.colspan"
            class="text-center border-r cursor-pointer"
            @click="openDialog(room.id, room.name, cell.hour)"
          >
            <template v-if="cell.chip">
              <v-chip
                :color="cell.color"
                text="Booking"
                size="small"
                variant="elevated"
              />
            </template>
          </td>
        </tr>
      </tbody>
    </v-table>

    <AgendaActionDialog
      v-model="dialogOpen"
      :room-id="selectedRoomId"
      :room-name="selectedRoomName"
      :hour="selectedHour"
      :date="selectedDate"
      :class-type="dialogProps.classType"
      :language="dialogProps.language"
      :level="dialogProps.level"
      :unit="dialogProps.unit"
      :end-hour="dialogProps.endHour"
      :has-class="dialogProps.hasClass"
      :session-id="dialogProps.sessionId"
      @action="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClassroomService from '@/services/ClassroomService'
import AgendaService from '@/services/AgendaService'
import AgendaActionDialog from '@/components/AgendaActionDialog.vue'
import ClasstypesService from '@/services/ClasstypeService'
import UnitService from '@/services/UnitService'
import LevelService from '@/services/LevelService'
import LanguageService from '@/services/LanguageService'

const hours = ref([
  '6:00', '7:00', '8:00', '9:00', '10:00',
  '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00',
])

const router = useRouter()

function getLocalDateString(): string {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 10)
}

const selectedDate = ref(getLocalDateString())

const classrooms = ref<{ id: number; name: string }[]>([])

const filters = ref({
  classType: null,
  level: null,
  unit: null,
  language: null
})

const levels = ref<{ id: number; name: string }[]>([])
const units = ref<{ id: number; name: string; levelId: number }[]>([])
const classTypes = ref<{ id: number; type: string }[]>([])
const languages = ref<{ id: number; name: string }[]>([])
const filteredUnits = ref<{ id: number; name: string; levelId: number }[]>([])

const originalBookings = ref<any[]>([])
const bookings = ref<any[]>([])

const dialogOpen = ref(false)
const selectedRoomId = ref(0)
const selectedRoomName = ref('')
const selectedHour = ref('')
const dialogProps = ref({
  classType: '',
  language: '',
  level: '',
  unit: '',
  endHour: '',
  hasClass: false,
  sessionId: null
})

async function loadFilters() {
  try {
    classTypes.value = await ClasstypesService.getAll()
    levels.value = await LevelService.getAll()
    units.value = await UnitService.getAll()
    languages.value = await LanguageService.getAll()
    filteredUnits.value = []
  } catch (err) {
    console.error('Error cargando filtros:', err)
  }
}

function handleLevelChange(levelId: number | null) {
  filters.value.unit = null
  filteredUnits.value = units.value.filter(unit => unit.levelId === levelId)
  applyFilters()
}

function applyFilters() {
  const { classType, level, unit, language } = filters.value
  bookings.value = originalBookings.value.filter(booking => {
    return (!classType || booking.classTypeId === classType) &&
      (!level || booking.levelId === level) &&
      (!unit || booking.unitId === unit) &&
      (!language || booking.teacher.language.id === language)
  })
}

function getHourString(date: Date) {
  return date.toTimeString().substring(0, 5)
}

function openDialog(roomId: number, roomName: string, hour: string) {
  const session = getSessionAt(roomId, hour)

  selectedRoomId.value = roomId
  selectedRoomName.value = roomName
  selectedHour.value = hour

  dialogProps.value = {
    classType: session?.classType?.type || '',
    language: session?.teacher?.language?.name || '',
    level: session?.unit?.level?.name || '',
    unit: session?.unit?.name || '',
    endHour: session ? getHourString(new Date(session.endAt)) : '',
    hasClass: !!session,
    sessionId: session?.id || null
  }

  dialogOpen.value = true
}

async function fetchBookings() {
  try {
    const data = await AgendaService.getAll(selectedDate.value)
    originalBookings.value = data.map((booking: any) => ({
      ...booking,
      levelId: booking.unit.level.id,
      unitId: booking.unit.id,
      classTypeId: booking.classTypeId,
      startAt: booking.startAt,
      endAt: booking.endAt,
    }))
    applyFilters()
  } catch (error) {
    console.error('Error al obtener sesiones:', error)
  }
}

function getHourDate(hour: string): Date {
  return new Date(`${selectedDate.value}T${hour.padStart(5, '0')}:00`)
}

function getSessionAt(roomId: number, hour: string) {
  const targetTime = getHourDate(hour)
  return bookings.value.find(session => {
    const start = new Date(session.startAt)
    const end = new Date(session.endAt)
    return (
      session.classroom.id === roomId &&
      targetTime >= start &&
      targetTime < end
    )
  })
}

function getBookingColor(roomId: number, hour: string): string {
  const session = getSessionAt(roomId, hour)
  if (!session) return 'grey'
  const totalInscritos = session.attendances.length
  const capacidadMaxima = session.classroom.capacity

  if (totalInscritos >= capacidadMaxima) return 'red'

  return 'green'
}

function renderAgendaRow(roomId: number) {
  const cells = []
  let hourIndex = 0

  while (hourIndex < hours.value.length) {
    const hour = hours.value[hourIndex]
    const session = getSessionAt(roomId, hour)

    if (session && getHourDate(hour).getTime() === new Date(session.startAt).getTime()) {
      cells.push({
        key: `${roomId}-${hour}`,
        colspan: session.duration,
        chip: true,
        color: getBookingColor(roomId, hour),
        hour,
      })
      hourIndex += session.duration
    } else {
      cells.push({
        key: `${roomId}-${hour}`,
        colspan: 1,
        chip: false,
        hour,
      })
      hourIndex += 1
    }
  }

  return cells
}

function handleAction(payload: {
  type: 'create' | 'view' | 'delete' | 'enroll'
  roomId: number
  hour: string
  date: string
  endHour?: string
  classType?: string
  language?: string
  level?: string
  unit?: string
  sessionId?: number
}) {
  if (payload.type === 'create') {
    router.push({
      path: '/agenda/class-form',
      query: {
        roomId: payload.roomId.toString(),
        date: payload.date,
        hour: payload.hour,
        endHour: payload.endHour,
        classType: payload.classType,
        language: payload.language,
        level: payload.level,
        unit: payload.unit
      }
    })
  }

  if (payload.type === 'view' && payload.sessionId) {
    router.push({ name: 'ClassInfoView', params: { id: payload.sessionId } })
  }

  if (payload.type === 'enroll' && payload.sessionId) {
    router.push({ name: 'ClassStudentsView', params: { id: payload.sessionId } })
  }
}


onMounted(async () => {
  classrooms.value = await ClassroomService.getAll()
  await loadFilters()
  await fetchBookings()
})
</script>

<style scoped>
th, td {
  border: 1px solid #747474;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
