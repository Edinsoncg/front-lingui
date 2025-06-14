<template>
  <v-container fluid>
    <!-- 🟪 RESUMEN -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-4 transition-all hover-scale" color="deep-purple-lighten-5" elevation="2">
          <v-card-title>Total Estudiantes</v-card-title>
          <v-card-text class="text-h5">{{ data.resumen.total_students }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 transition-all hover-scale" color="indigo-lighten-5" elevation="2">
          <v-card-title>Total Profesores</v-card-title>
          <v-card-text class="text-h5">{{ data.resumen.total_teachers }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 transition-all hover-scale" color="cyan-lighten-5" elevation="2">
          <v-card-title>Total Contratos</v-card-title>
          <v-card-text class="text-h5">{{ data.resumen.total_contracts }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4 transition-all hover-scale" color="teal-lighten-5" elevation="2">
          <v-card-title>Clases Hoy</v-card-title>
          <v-card-text class="text-h5">{{ data.resumen.today_classes }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 📊 GRÁFICOS -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Asistencias por Mes</v-card-title>
          <v-card-text>
            <v-chart :option="attendanceChartOptions" autoresize style="height: 300px" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Estudiantes por Nivel</v-card-title>
          <v-card-text>
            <v-chart :option="levelChartOptions" autoresize style="height: 300px" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 🔔 NOTIFICACIONES -->
    <v-row align="stretch">
      <!-- 🧑‍🎓 Nuevos Estudiantes -->
      <v-col cols="12" md="6">
        <v-card class="pa-4 d-flex flex-column h-100">
          <v-card-title>Nuevos Estudiantes</v-card-title>
          <v-card-text class="flex-grow-1">
            <v-row>
              <v-col
                cols="12"
                sm="6"
                v-for="student in data.notificaciones.newStudents"
                :key="student.id"
                class="d-flex align-center"
              >
                <v-avatar class="me-3" size="40">
                  <v-img :src="student.user.profilePicture || defaultAvatar" cover />
                </v-avatar>
                <div>
                  <strong>{{ student.user.firstName }} {{ student.user.firstLastName }}</strong><br />
                  <small class="text-caption text-grey-darken-1">Código del estudiante: {{ student.studentCode }}</small>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 📅 Contratos por Vencer -->
      <v-col cols="12" md="6">
        <v-card class="pa-4 d-flex flex-column h-100">
          <v-card-title>Contratos por Vencer</v-card-title>
          <v-card-text class="flex-grow-1">
            <v-list>
              <v-list-item
                v-for="contract in data.notificaciones.expiring_contracts"
                :key="contract.id"
              >
                <v-icon icon="mdi-alert" class="me-2" />
                <div>
                  <strong>{{ contract.student.user.firstName }} {{ contract.student.user.firstLastName }}</strong><br />
                  <small>Fin: {{ formatDate(contract.endDate) }}</small>
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Clases Programadas Hoy -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title
            class="text-uppercase font-weight-bold text-center text-wrap"
            style="word-break: break-word; white-space: normal;"
            >
              Clases Programadas Hoy</v-card-title>
          <v-card-text>
            <v-row dense class="g-3">
              <v-col
                v-for="clase in data.resumen.clases_hoy"
                :key="clase.id"
                cols="12" sm="6" md="4" lg="3" xl="2"
              >
                <v-card class="pa-3" rounded="xl" elevation="1">
                  <div class="d-flex align-center mb-2">
                    <v-icon icon="mdi-school" class="me-2" />
                    <span>{{ clase.classroom }}</span>
                  </div>
                  <div class="d-flex align-center text-grey text-caption">
                    <v-icon icon="mdi-clock-outline" size="18" class="me-1" />
                    <span style="color: black;">{{ clase.time }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <div v-if="!data.resumen.clases_hoy.length" class="text-grey d-flex align-center mt-2">
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
import DashboardAdminService from '@/services/DashboardAdminService'
import type { DashboardResponse } from '@/services/DashboardAdminService'

import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'

use([CanvasRenderer, BarChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const data = ref<DashboardResponse>({
  resumen: {
    total_students: 0,
    total_teachers: 0,
    total_contracts: 0,
    today_classes: 0,
    clases_hoy: []
  },
  graficos: {
    attendance_by_month: {},
    students_by_level: {}
  },
  notificaciones: {
    newStudents: [],
    expiring_contracts: []
  }
})

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'

const formatDate = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

const attendanceChartOptions = computed(() => {
  const entries = Object.entries(data.value.graficos.attendance_by_month)
  return {
    tooltip: {},
    xAxis: {
      type: 'category',
      data: entries.map(([month]) => month)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Asistencias',
        type: 'bar',
        data: entries.map(([, value]) => value),
        itemStyle: { color: '#5e35b1' }
      }
    ]
  }
})

const levelChartOptions = computed(() => {
  const entries = Object.entries(data.value.graficos.students_by_level)
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 10, left: 'center' },
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
    const response = await DashboardAdminService.getDashboard()
    data.value = response
  } catch (error) {
    console.error('Error al cargar dashboard:', error)
  }
})
</script>

<style>
.hover-scale:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
</style>
