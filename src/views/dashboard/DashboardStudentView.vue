<template>
  <v-container fluid class="py-4" style="max-width: 1600px; margin: 0 auto;">

    <!-- 🟪 RESUMEN PRINCIPAL -->
    <v-row class="mb-4" align="stretch">
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="light-blue-lighten-5" elevation="2">
          <v-card-title class="text-uppercase font-weight-bold">Nivel Actual</v-card-title>
          <v-card-text class="text-h5">{{ data.resumen.nivel_actual }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="green-lighten-5" elevation="2">
          <v-card-title
            class="text-uppercase font-weight-bold text-center text-wrap"
            style="word-break: break-word; white-space: normal;"
          >
            Clases programadas en {{ currentMonth }}
          </v-card-title>
          <v-card-text class="text-h5">{{ data.resumen.clases_mes }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="purple-lighten-5" elevation="2">
          <v-card-title class="text-uppercase font-weight-bold">Clases Hoy</v-card-title>
          <v-card-text class="text-h5">{{ data.resumen.clases_hoy }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 📊 GRÁFICO DE ASISTENCIA -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title
            class="mb-2 font-weight-bold text-center text-wrap"
            style="word-break: break-word; white-space: normal;"
          >
            Asistencia por Día (7 días)
          </v-card-title>
          <v-chart :option="attendanceChartOptions" autoresize style="height: 300px" />
        </v-card>
      </v-col>
    </v-row>

    <!-- 📋 CLASES PROGRAMADAS HOY -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Clases Programadas Hoy</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col
                v-for="clase in data.clases_hoy"
                :key="clase.id"
                cols="12" sm="6" md="4" lg="3" xl="2"
              >
                <v-card class="pa-3" rounded="xl" elevation="1">
                  <div class="d-flex align-center mb-1">
                    <v-icon icon="mdi-school" class="me-2" />
                    <span>{{ clase.classroom }} ({{ clase.level }})</span>
                  </div>
                  <div class="text-grey text-caption d-flex align-center">
                    <v-icon icon="mdi-clock-outline" size="18" class="me-1" />
                    {{ clase.hour }}
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
import DashboardStudentService from '@/services/DashboardeStudentService'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const data = ref({
  resumen: {
    nivel_actual: '',
    clases_hoy: 0,
    clases_mes: 0
  },
  graficos: {
    asistencia_por_dia: {}
  },
  clases_hoy: []
})

const currentMonth = computed(() => {
  return new Date().toLocaleDateString('es-CO', { month: 'long' }).toUpperCase()
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
          color: '#3f51b5'
        }
      }
    ]
  }
})

onMounted(async () => {
  try {
    const response = await DashboardStudentService.getDashboard()
    data.value = response
  } catch (error) {
    console.error('Error al cargar dashboard del estudiante:', error)
  }
})
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
  font-size: 1.2rem;
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
