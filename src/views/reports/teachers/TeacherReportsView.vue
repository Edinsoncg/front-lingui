<template>
  <v-container class="py-6">
    <!-- 🔍 Buscador -->
    <v-text-field
      v-model="searchQuery"
      label="Buscar por nombre del profesor"
      prepend-inner-icon="mdi-magnify"
      hide-details
      clearable
      class="mb-4"
      density="compact"
      style="max-width: 300px;"
    />

    <!-- 📊 Tabla de profesores -->
    <TeacherTable
      :teachers="teachers"
      :total="total"
      :loading="loading"
      :page="page"
      :items-per-page="itemsPerPage"
      @updateOptions="loadTeachers"
      @update:page="page = $event"
      @update:itemsPerPage="itemsPerPage = $event"
      @view="goToDetail"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ReportTeacherService from '@/services/ReportTeacherService'
import TeacherTable from '@/components/reports/teachers/TeacherTable.vue'

const router = useRouter()

const searchQuery = ref('')
const teachers = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const itemsPerPage = ref(10)

async function loadTeachers(options?: any) {
  loading.value = true
  const currentPage = options?.page || page.value
  const perPage = options?.itemsPerPage || itemsPerPage.value

  try {
    const response = await ReportTeacherService.getAll({
      page: currentPage,
      limit: perPage,
      search: searchQuery.value,
    })

    teachers.value = response.data
    total.value = response.total
    page.value = currentPage
    itemsPerPage.value = perPage
  } catch (error) {
    console.error('Error al cargar profesores:', error)
  } finally {
    loading.value = false
  }
}

function goToDetail(id: number) {
  router.push(`/report/teacher/${id}`)
}

onMounted(loadTeachers)

watch(searchQuery, () => {
  page.value = 1
  loadTeachers()
})
</script>
