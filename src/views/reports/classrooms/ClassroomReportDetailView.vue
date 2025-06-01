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
            <BackButtonComponent to="/report/classroom" />
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

        <ClassroomInfoCard v-if="classroom" :classroom="classroom" class="mb-6" />
        <ClassroomClassTable v-if="classes.length" :classes="classes" />
        <v-alert
          v-else
          type="info"
          text="No se encontraron clases registradas para este salón."
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
import ClassroomInfoCard from '@/components/reports/classrooms/ClassroomInfoCard.vue'
import ClassroomClassTable from '@/components/reports/classrooms/ClassroomClassTable.vue'
import ReportClassroomService from '@/services/ReportClassroomService'
import BackButtonComponent from '@/components/buttons/BackButtonComponent.vue'

const route = useRoute()
const id = Number(route.params.id)

const loading = ref(true)
const classroom = ref<null | {
  id: number
  nombre: string
  capacidad: number
  house: string
}>(null)

const classes = ref<
  Array<{
    id: number
    fecha: string
    nivel: string
    unidad: string
    modalidad: string
    idioma: string
    profesor: string
    duracion: number
  }>
>([])

onMounted(() => {
  fetchDetail()
})

async function fetchDetail() {
  try {
    const response = await ReportClassroomService.getById(id)
    classroom.value = response.salon
    classes.value = response.clases
  } catch (error) {
    console.error('Error al obtener el detalle del salón:', error)
  } finally {
    loading.value = false
  }
}

function exportToPDF() {
  if (!classroom.value) return

  const doc = new jsPDF()
  const margin = 15
  let y = margin

  doc.setFontSize(18)
  doc.text('Reporte del salón', doc.internal.pageSize.getWidth() / 2, y, { align: 'center' })

  y += 15
  doc.setFontSize(12)

  const info = [
    ['Nombre', classroom.value.nombre],
    ['Capacidad', classroom.value.capacidad.toString()],
    ['House', classroom.value.house],
  ]

  autoTable(doc, {
    startY: y,
    head: [['Campo', 'Valor']],
    body: info,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [80, 80, 180] },
    margin: { left: margin, right: margin },
  })

  const body = classes.value.map((clase) => [
    clase.fecha,
    clase.nivel,
    clase.unidad,
    clase.modalidad,
    clase.idioma,
    clase.profesor,
    `${clase.duracion}h`,
  ])

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Fecha', 'Nivel', 'Unidad', 'Modalidad', 'Idioma', 'Profesor', 'Duración']],
    body,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [63, 81, 181] },
    margin: { left: margin, right: margin },
  })

  doc.save(`reporte_salon_${classroom.value.nombre}.pdf`)
}
</script>
