<template>
  <v-container class="py-6">
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="40"
      class="d-block mx-auto my-12"
    />

    <template v-else>
      <StudentInfoCard v-if="student" :student="student" class="mb-6" />
      <StudentClassTable v-if="classes.length" :classes="classes" />
      <v-alert
        v-else
        type="info"
        text="No se encontraron clases registradas para este estudiante."
        class="mt-6"
      />
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import StudentInfoCard from '@/components/reports/students/StudentInfoCard.vue'
import StudentClassTable from '@/components/reports/students/StudentClassTable.vue'
import ReportStudentService from '@/services/ReportStudentService'

const route = useRoute()
const codigo = route.params.code as string

const loading = ref(true)
const student = ref<null | {
  codigo: string
  nombre: string
  apellido: string
  estado: string
  idioma: string
  tipo_contrato: string
  fecha_inicio: string
  fecha_fin: string
}>(null)

const classes = ref<
  Array<{
    id: number
    fecha: string
    nivel: string
    unidad: string
    modalidad: string
    duracion: number
    asistio: boolean
  }>
>([])

onMounted(() => {
  fetchDetail()
})

async function fetchDetail() {
  try {
    const response = await ReportStudentService.getByCode(codigo)
    student.value = response.estudiante
    classes.value = response.clases
  } catch (error) {
    console.error('Error al obtener el detalle del estudiante:', error)
  } finally {
    loading.value = false
  }
}
</script>
