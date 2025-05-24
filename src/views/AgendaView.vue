<!-- src/views/AgendaView.vue -->

<template>
  <v-table class="elevation-1">
    <thead>
      <tr class="border-b">
        <th class="text-left border-r">CLASSROOM</th>
        <th
          v-for="hour in hours"
          :key="hour"
          class="text-left border-r"
        >
          {{ hour }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="room in classrooms"
        :key="room.id"
        class="border-b"
      >
        <td class="border-r">{{ room.name }}</td>
        <td
          v-for="hour in hours"
          :key="hour"
          class="text-center border-r cursor-pointer"
          @click="openDialog(room.id, room.name, hour)"
        >
        <v-chip
            v-if="isBooked(room.id, hour)"
            color="red"
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
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ClassroomService from '@/services/ClassroomService'
import AgendaActionDialog from '@/components/AgendaActionDialog.vue'

const hours = ref([
  '6:00', '7:00', '8:00', '9:00', '10:00',
  '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
])

const classrooms = ref<{ id: number; name: string }[]>([])

const bookings = ref([
  { roomId: 1, hour: '8:00' },
  { roomId: 2, hour: '10:00' },
  { roomId: 4, hour: '13:00' },
  { roomId: 5, hour: '17:00' },
])

function isBooked(roomId: number, hour: string) {
  return bookings.value.some(b => b.roomId === roomId && b.hour === hour)
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
  console.log('Acción desde modal:', action)
  // Aquí puedes abrir formularios, disparar servicios, o actualizar bookings
}

onMounted(async () => {
  try {
    const response = await ClassroomService.getAll()
    classrooms.value = response // ✅ Es un array plano
  } catch (error) {
    console.error('Error al obtener salones:', error)
  }
})
</script>

<style scoped>
th, td {
  border: 1px solid #000;
}
</style>
