<template>
  <v-container class="py-6">
    <!-- 🔍 Buscadores -->
    <v-text-field
      v-model="searchQuery"
      label="Buscar por código o nombre"
      prepend-inner-icon="mdi-magnify"
      hide-details
      clearable
      density="compact"
      class="mb-4"
      style="width: 25%;"
    />


    <!-- 📊 Tabla de estudiantes -->
    <StudentTable
      :students="students"
      :total="total"
      :loading="loading"
      :page="page"
      :items-per-page="itemsPerPage"
      @updateOptions="loadStudents"
      @update:page="page = $event"
      @update:itemsPerPage="itemsPerPage = $event"
      @view="goToDetail"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch} from 'vue'
import { useRouter } from 'vue-router'
import StudentTable from '@/components/reports/students/StudentTable.vue'
import ReportStudentService from '@/services/ReportStudentService'

const router = useRouter()

// 📌 Estado local
const searchQuery = ref('')
const students = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const itemsPerPage = ref(10)

// 🔍 Buscar estudiantes
async function loadStudents(options?: any) {
  loading.value = true
  const currentPage = options?.page || page.value
  const perPage = options?.itemsPerPage || itemsPerPage.value

  try {
    const response = await ReportStudentService.getAll({
      page: currentPage,
      limit: perPage,
      code: searchQuery.value,
      name: searchQuery.value,
    })

    students.value = response.data
    total.value = response.total
    page.value = currentPage
    itemsPerPage.value = perPage
  } catch (error) {
    console.error('Error al cargar estudiantes:', error)
  } finally {
    loading.value = false
  }
}


// 🔗 Ir a vista detalle
function goToDetail(codigo: string) {
  router.push(`/reportes/estudiantes/${codigo}`)
}

// 🚀 Cargar inicial
onMounted(() => {
  loadStudents()
})

watch(searchQuery, () => {
  page.value = 1
  loadStudents()
})
</script>
