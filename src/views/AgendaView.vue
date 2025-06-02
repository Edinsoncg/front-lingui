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
          <th v-for="hour in hours" :key="hour" class="text-left border-r">
            {{ hour }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in classrooms" :key="room.id" class="border-b">
          <td class="border-r">{{ room.name }}</td>
          <td
            v-for="hour in hours"
            :key="hour"
            class="text-center border-r cursor-pointer"
            @click="openDialog(room.id, room.name, hour)"
          >
            <v-chip
              v-if="isBooked(room.id, hour)"
              :color="getBookingColor(room.id, hour)"
              text="Booking"
              size="small"
              variant="elevated"
            />
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
      @action="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ClassroomService from '@/services/ClassroomService'
import AgendaService from '@/services/AgendaService'
import AgendaActionDialog from '@/components/AgendaActionDialog.vue'
import ClasstypesService from '@/services/ClasstypeService'
import UnitService from '@/services/UnitService'
import LevelService from '@/services/LevelService'

const hours = ref([
  '6:00', '7:00', '8:00', '9:00', '10:00',
  '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
])

const selectedDate = ref(new Date().toISOString().substring(0, 10))
const classrooms = ref<{ id: number; name: string }[]>([])

function isBooked(roomId: number, hour: string) {
  const targetTime = new Date(`${selectedDate.value}T${hour.padStart(5, '0')}:00`)

  return bookings.value.some(booking => {
    const start = new Date(booking.startAt)
    const end = new Date(booking.endAt)
    return (
      booking.classroom.id === roomId &&
      targetTime >= start &&
      targetTime < end
    )
  })
}

const filters = ref({
  classType: null,
  level: null,
  unit: null,
})

const levels = ref<{ id: number; name: string }[]>([])
const units = ref<{ id: number; name: string; levelId: number }[]>([])
const classTypes = ref<{ id: number; type: string }[]>([])
const filteredUnits = ref<{ id: number; name: string; levelId: number }[]>([])

const originalBookings = ref<any[]>([])
const bookings = ref<any[]>([])

async function loadFilters() {
  try {
    classTypes.value = await ClasstypesService.getAll()
    levels.value = await LevelService.getAll()
    units.value = await UnitService.getAll()
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
  const { classType, level, unit } = filters.value
  bookings.value = originalBookings.value.filter(booking => {
    return (!classType || booking.classTypeId === classType) &&
      (!level || booking.levelId === level) &&
      (!unit || booking.unitId === unit)
  })
}

const dialogOpen = ref(false)
const selectedRoomId = ref(0)
const selectedRoomName = ref('')
const selectedHour = ref('')

function openDialog(roomId: number, roomName: string, hour: string) {
  selectedRoomId.value = roomId
  selectedRoomName.value = roomName
  selectedHour.value = hour
  dialogOpen.value = true
}

function handleAction(action: { type: 'create' | 'view' | 'delete'; roomId: number; hour: string }) {
  console.log('Acción:', action)
}

async function fetchBookings() {
  try {
    console.log('Fecha enviada:', selectedDate.value)
    const data = await AgendaService.getAll(selectedDate.value)
    originalBookings.value = data

    applyFilters()
  } catch (error) {
    console.error('Error al obtener sesiones:', error)
  }
}

function getBookingColor(roomId: number, hour: string): string {
  const targetTime = new Date(`${selectedDate.value}T${hour.padStart(5, '0')}:00`)

  const session = bookings.value.find(booking => {
    const start = new Date(booking.startAt)
    const end = new Date(booking.endAt)
    return (
      booking.classroom.id === roomId &&
      targetTime >= start &&
      targetTime < end
    )
  })

  if (!session) return 'grey'

  const totalInscritos = session.attendances.length
  const capacidadMaxima = session.classroom.capacity

  return totalInscritos >= capacidadMaxima ? 'red' : 'green'
}

onMounted(async () => {
  const response = await ClassroomService.getAll()
  classrooms.value = response
  await loadFilters()
  await fetchBookings()
})
</script>

<style scoped>
th, td {
  border: 1px solid #000;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
