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
      <v-container class="py-6">
        <v-row class="mb-4" align="center" justify="space-between">
          <v-col cols="auto">
            <BackButtonComponent to="/report-student" />
          </v-col>

          <v-col cols="auto">
            <v-btn
              color="primary"
              class="text-nowrap px-4 mr-2"
              prepend-icon="mdi-download"
              @click="exportToPDF"
              style="width: auto;"
            >
              Exportar a PDF
            </v-btn>
          </v-col>
        </v-row>

        <StudentInfoCard v-if="student" :student="student" class="mb-6" />
        <StudentClassTable v-if="classes.length" :classes="classes" />
        <v-alert
          v-else
          type="info"
          text="No se encontraron clases registradas para este estudiante."
          class="mt-6"
        />
      </v-container>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import StudentInfoCard from '@/components/reports/students/StudentInfoCard.vue'
import StudentClassTable from '@/components/reports/students/StudentClassTable.vue'
import ReportStudentService from '@/services/ReportStudentService'
import BackButtonComponent from '@/components/buttons/BackButtonComponent.vue'

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

function exportToPDF() {
  if (!student.value) return

  const doc = new jsPDF()
  const margin = 15
  let y = margin

  // 🧾 Título centrado
  doc.setFontSize(18)
  doc.setTextColor(40)
  doc.text('Reporte del estudiante', doc.internal.pageSize.getWidth() / 2, y, { align: 'center' })

  y += 15
  doc.setFontSize(12)
  doc.setTextColor(0)

  // 📋 Info del estudiante (2 columnas)
  const info = [
    [`Código`, student.value.codigo],
    [`Nombre`, `${student.value.nombre} ${student.value.apellido}`],
    [`Idioma`, student.value.idioma],
    [`Estado`, student.value.estado],
    [`Contrato`, student.value.tipo_contrato],
    [`Fecha inicio`, student.value.fecha_inicio],
    [`Fecha fin`, student.value.fecha_fin],
  ]

  autoTable(doc, {
    startY: y,
    head: [['Campo', 'Valor']],
    body: info,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [100, 100, 255] },
    margin: { left: margin, right: margin },
  })

  // 📅 Tabla de clases
  const clasesData = classes.value.map((clase) => [
    clase.fecha,
    clase.nivel,
    clase.unidad,
    clase.modalidad,
    `${clase.duracion}h`,
    clase.asistio ? 'Sí' : 'No',
  ])

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Fecha', 'Nivel', 'Unidad', 'Modalidad', 'Duración', '¿Asistió?']],
    body: clasesData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [63, 81, 181] },
    margin: { left: margin, right: margin },
  })

  // 💾 Guardar
  doc.save(`reporte_estudiante_${student.value.codigo}.pdf`)
}
</script>
