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
      <v-row class="mb-4" align="center" justify="space-between">
        <v-col cols="auto">
          <BackButtonComponent to="/report/teacher" />
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            class="text-nowrap px-4 mr-2"
            prepend-icon="mdi-download"
            @click="exportToPDF"
          >
            Exportar a PDF
          </v-btn>
        </v-col>
      </v-row>

      <TeacherInfoCard v-if="teacher" :teacher="teacher" class="mb-6" />
      <TeacherClassTable v-if="classes.length" :classes="classes" />
      <v-alert
        v-else
        type="info"
        text="No se encontraron clases dictadas por este profesor."
        class="mt-6"
      />
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import BackButtonComponent from '@/components/buttons/BackButtonComponent.vue'
import TeacherInfoCard from '@/components/reports/teachers/TeacherInfoCard.vue'
import TeacherClassTable from '@/components/reports/teachers/TeacherClassTable.vue'
import ReportTeacherService from '@/services/ReportTeacherService'

const route = useRoute()
const id = Number(route.params.id)

const loading = ref(true)

const teacher = ref<null | {
  id: number
  nombre: string
  correo: string
  telefono: string
  idioma: string
  jornada: string
}>(null)

const classes = ref<
  Array<{
    id: number
    fecha: string
    nivel: string
    unidad: string
    modalidad: string
    salon: string
    duracion: number
  }>
>([])

onMounted(fetchDetail)

async function fetchDetail() {
  try {
    const response = await ReportTeacherService.getById(id)
    teacher.value = response.profesor
    classes.value = response.clases
  } catch (error) {
    console.error('Error al obtener detalle del profesor:', error)
  } finally {
    loading.value = false
  }
}

function exportToPDF() {
  if (!teacher.value) return

  const doc = new jsPDF()
  const margin = 15
  let y = margin

  doc.setFontSize(18)
  doc.text('Reporte del Profesor', doc.internal.pageSize.getWidth() / 2, y, { align: 'center' })

  y += 15
  doc.setFontSize(12)

  const info = [
    ['Nombre', teacher.value.nombre],
    ['Correo', teacher.value.correo],
    ['Teléfono', teacher.value.telefono],
    ['Idioma', teacher.value.idioma],
    ['Jornada', teacher.value.jornada],
  ]

  autoTable(doc, {
    startY: y,
    head: [['Campo', 'Valor']],
    body: info,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: margin, right: margin },
    headStyles: { fillColor: [63, 81, 181] },
  })

  const claseData = classes.value.map((clase) => [
    clase.fecha,
    clase.nivel,
    clase.unidad,
    clase.modalidad,
    clase.salon,
    `${clase.duracion}h`,
  ])

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Fecha', 'Nivel', 'Unidad', 'Modalidad', 'Salón', 'Duración']],
    body: claseData,
    theme: 'grid',
    styles: { fontSize: 10 },
    margin: { left: margin, right: margin },
    headStyles: { fillColor: [100, 100, 255] },
  })

  doc.save(`reporte_profesor_${teacher.value.id}.pdf`)
}
</script>
