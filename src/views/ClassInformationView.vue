<template>
  <v-card flat class="pa-4" color="white">
    <v-row dense>
      <v-col
        v-for="(value, label) in classInfo"
        :key="label"
        cols="12"
        sm="4"
      >
        <h4 class="font-weight-bold mb-1">{{ label }}</h4>
        <p class="text-black text-body-2 no-underline">{{ value }}</p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AgendaService from '@/services/AgendaService'

const route = useRoute()
const classId = ref(Number(route.params.id))
const classInfo = ref<Record<string, string>>({})

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
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}
</style>
