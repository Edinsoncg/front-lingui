<template>
  <v-container fluid>
    <!-- 🟪 RESUMEN -->
    <v-row>
      <v-col cols="12" md="4" v-for="(value, key) in data.resumen" :key="key">
        <v-card class="pa-4 hover-card text-center" color="indigo-lighten-5">
          <v-card-title class="text-uppercase">{{ labelsResumen[key] }}</v-card-title>
          <v-card-text class="text-h5">{{ value }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 📊 GRÁFICOS -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title
            class="text-uppercase font-weight-bold text-center text-wrap"
            style="word-break: break-word; white-space: normal;"
          >
            Total de asistencias registradas por mes</v-card-title>
          <v-card-text>
            <VChartComponent
              v-if="Object.keys(data.graficos.attendance_by_month).length"
              :option="attendanceChart"
              autoresize
              style="height: 300px"
            />
            <div v-else class="text-grey">No hay datos de asistencia aún.</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Estudiantes por Nivel</v-card-title>
          <v-card-text>
            <VChartComponent
              v-if="Object.keys(data.graficos.students_by_level).length"
              :option="levelChartOptions"
              autoresize
              style="height: 300px"
            />
            <div v-else class="text-grey">No hay datos de niveles aún.</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 📋 CLASES DE HOY -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title
          class="text-uppercase font-weight-bold text-center text-wrap"
            style="word-break: break-word; white-space: normal;"
          >
            Clases Programadas Hoy
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col
                v-for="clase in data.clases_hoy"
                :key="clase.time + clase.classroom + clase.level"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                xl="2"
              >
                <v-card class="pa-3" rounded="xl" elevation="1">
                  <div class="d-flex align-center mb-1">
                    <v-icon icon="mdi-school" class="me-2" />
                    <span>{{ clase.classroom }} ({{ clase.level }})</span>
                  </div>
                  <div class="text-grey text-caption d-flex align-center mb-1">
                    <v-icon icon="mdi-account-tie" size="18" class="me-1" />
                    {{ clase.teacher }}
                  </div>
                  <div class="text-grey text-caption d-flex align-center">
                    <v-icon icon="mdi-clock-outline" size="18" class="me-1" />
                    {{ clase.time }}
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
import { BarChart, LineChart, PieChart} from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import DashboardReceptionistService from '@/services/DashboardReceptionistService'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  PieChart
])

const VChartComponent = VChart
const data = ref({
  resumen: {
    total_students: 0,
    total_teachers: 0,
    today_classes: 0
  },
  graficos: {
    attendance_by_month: {},
    students_by_level: {}
  },
  clases_hoy: []
})

const labelsResumen = {
  total_students: 'Total Estudiantes',
  total_teachers: 'Total Profesores',
  today_classes: 'Clases Hoy'
}

const attendanceChart = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: Object.keys(data.value.graficos.attendance_by_month) },
  yAxis: { type: 'value' },
  series: [{
    name: 'Asistencias',
    type: 'bar',
    data: Object.values(data.value.graficos.attendance_by_month)
  }]
}))

const levelChartOptions = computed(() => {
  const entries = Object.entries(data.value.graficos.students_by_level)
  return {
    title: { text: 'Estudiantes por Nivel', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 10,
      left: 'center'
    },
    series: [
      {
        name: 'Estudiantes',
        type: 'pie',
        radius: '50%',
        data: entries.map(([name, value]) => ({ name, value })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})


onMounted(async () => {
  try {
    const response = await DashboardReceptionistService.getDashboard()
    data.value = response
  } catch (error) {
    console.error('Error al cargar dashboard recepcionista:', error)
  }
})
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease;
}
.hover-card:hover {
  transform: scale(1.03);
}
</style>
