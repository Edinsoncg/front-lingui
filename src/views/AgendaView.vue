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
          class="text-center border-r"
        >
          <!-- Aquí podrías mostrar "Booking" si está ocupado -->
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ClassroomService from '@/services/ClassroomService'

const hours = ref([
  '6:00', '7:00', '8:00', '9:00', '10:00',
  '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
])

const classrooms = ref<{ id: number; name: string }[]>([])

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
