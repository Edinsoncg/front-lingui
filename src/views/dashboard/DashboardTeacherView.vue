<template>
  <v-container fluid class="py-4" style="max-width: 1600px; margin: 0 auto;">

    <!--RESUMEN-->
    <v-row class="mb-4" align="stretch">
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="deep-purple-lighten-5" elevation="2">
          <v-card-title class="text-uppercase font-weight-bold">Clases Hoy</v-card-title>
          <v-card-text class="text-h4">{{ data.resumen.today_classes }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="indigo-lighten-5" elevation="2">
          <v-card-title class="text-uppercase font-weight-bold">
            Total Clases de {{ data.resumen.current_month }}
          </v-card-title>
          <v-card-text class="text-h4">{{ data.resumen.total_classes_month }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="teal-lighten-5" elevation="2">
          <v-card-title class="text-uppercase font-weight-bold">Estudiantes esta semana</v-card-title>
          <v-card-text class="text-h4">{{ data.resumen.total_students_this_week }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!--GRÁFICO DE ASISTENCIA-->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="mb-2">Asistencia de Estudiantes por Día (ultimos 7 días)</v-card-title>
          <v-chart :option="attendanceChartOptions" autoresize style="height: 300px" />
        </v-card>
      </v-col>
    </v-row>

    <!--CLASES HOY-->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Clases Programadas Hoy</v-card-title>
          <v-card-text>
            <v-row dense class="g-3">
              <v-col
                v-for="clase in data.clases_hoy"
                :key="clase.id ?? `${clase.time ?? ''}-${clase.classroom ?? ''}`"
                cols="12" sm="6" md="4" lg="3" xl="2"
              >
                <v-card class="pa-3" rounded="xl" elevation="1">
                  <div class="d-flex align-center mb-2">
                    <v-icon icon="mdi-school" class="me-2" />
                    <span>{{ clase.classroom }} ({{ clase.level }})</span>
                  </div>
                  <div class="d-flex align-center text-grey text-caption">
                    <v-icon icon="mdi-clock-outline" size="18" class="me-1" />
                    <span style="color: black;">{{ clase.hour }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <div v-if="!data.clases_hoy.length" class="text-grey d-flex align-center mt-2">
              <v-icon icon="mdi-calendar-remove" class="me-2" />
              No hay clases programadas hoy.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import DashboardTeacherService from '@/services/DashboardTeacherService'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const VChartComponent = VChart

interface ClaseHoy {
  id?: number
  time?: string
  classroom?: string
  level?: string
  hour?: string
}

const data = ref<{
  resumen: {
    today_classes: number
    total_classes_month: number
    total_students_this_week: number
    current_month: string
  },
  graficos: {
    asistencia_por_dia: Record<string, number>
  },
  clases_hoy: ClaseHoy[]
}>({
  resumen: {
    today_classes: 0,
    total_classes_month: 0,
    total_students_this_week: 0,
    current_month: ''
  },
  graficos: {
    asistencia_por_dia: {}
  },
  clases_hoy: []
})

const attendanceChartOptions = computed(() => {
  const entries = Object.entries(data.value.graficos.asistencia_por_dia)
  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: entries.map(([day]) => day)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Asistencias',
        type: 'bar',
        data: entries.map(([, value]) => value),
        itemStyle: {
          color: '#673ab7'
        }
      }
    ]
  }
})

onMounted(async () => {
  try {
    const response = await DashboardTeacherService.getDashboard()
    data.value = response
  } catch (error) {
    console.error('Error al cargar dashboard del profesor:', error)
  }
})
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
  font-size: 1.2rem;
  white-space: normal;
  word-break: break-word;
}
.v-card {
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}
.v-card:hover {
  transform: scale(1.02);
}
</style>
