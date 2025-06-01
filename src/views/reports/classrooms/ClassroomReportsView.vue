<template>
  <v-container class="py-6">
    <!-- 🔍 Buscador -->
    <v-text-field
      v-model="searchQuery"
      label="Buscar por nombre del salón"
      prepend-inner-icon="mdi-magnify"
      hide-details
      clearable
      class="mb-4"
      density="compact"
      style="max-width: 300px;"
    />

    <!-- 📊 Tabla de salones -->
    <ClassroomTable
      :classrooms="classrooms"
      :total="total"
      :loading="loading"
      :page="page"
      :items-per-page="itemsPerPage"
      @updateOptions="loadClassrooms"
      @update:page="page = $event"
      @update:itemsPerPage="itemsPerPage = $event"
      @view="goToDetail"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import ClassroomTable from '@/components/reports/classrooms/ClassroomTable.vue'
import ReportClassroomService from '@/services/ReportClassroomService'

const router = useRouter()
const searchQuery = ref('')
const classrooms = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const itemsPerPage = ref(10)

async function loadClassrooms(options?: any) {
  loading.value = true
  const currentPage = options?.page || page.value
  const perPage = options?.itemsPerPage || itemsPerPage.value

  try {
    const response = await ReportClassroomService.getAll({
      page: currentPage,
      limit: perPage,
      search: searchQuery.value,
    })

    classrooms.value = response.data
    total.value = response.total
    page.value = currentPage
    itemsPerPage.value = perPage
  } catch (error) {
    console.error('Error al cargar salones:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadClassrooms)

watch(searchQuery, () => {
  page.value = 1
  loadClassrooms()
})

function goToDetail(id: number) {
  router.push(`/report/classroom/${id}`)
}
</script>
