<template>
  <v-navigation-drawer
    app
    expand-on-hover
    rail
    color="deep-purple-lighten-4"
    permanent
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <v-list nav density="compact">
      <template v-for="item in menuItems" :key="item.title">
        <!-- Si tiene hijos (submenu) -->
        <v-list-group v-if="item.children">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.icon"
              :title="isDrawerOpen ? item.title : ''"
            />
          </template>

          <v-list-item
            v-show="isDrawerOpen"
            v-for="child in item.children"
            :key="child.title"
            :to="child.to"
            :title="child.title"
            :prepend-icon="child.icon"
            rounded="xl"
          />
        </v-list-group>

        <!-- Ítem sin hijos -->
        <v-list-item
          v-else
          :to="item.to"
          :title="item.title"
          :prepend-icon="item.icon"
          rounded="xl"
        />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { authSetStore } from '@/stores/AuthStore'

const auth = authSetStore()
const isDrawerOpen = ref(false)

const onMouseEnter = () => {
  isDrawerOpen.value = true
}
const onMouseLeave = () => {
  isDrawerOpen.value = false
}

const dashboardRoute = computed(() => {
  const role = auth.user?.roles?.[0]?.toUpperCase() || ''
  switch (role) {
    case 'ADMINISTRATIVO':
      return '/dashboard/admin'
    case 'RECEPCIONISTA':
      return '/dashboard/receptionist'
    case 'PROFESOR':
      return '/dashboard/teacher'
    case 'ESTUDIANTE':
      return '/dashboard/student'
    default:
      return '/dashboard/student'
  }
})

const menuItems = computed(() => [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    to: dashboardRoute.value,
  },
  {
    title: 'Agenda',
    icon: 'mdi-calendar-month-outline',
    to: '/agenda',
  },
  {
    title: 'Mi Perfil',
    icon: 'mdi-account-circle-outline',
    to: '/profile',
  },
  {
    title: 'Mi Seguimiento',
    icon: 'mdi-chart-line',
    children: [
      {
        title: 'Académico',
        icon: 'mdi-school-outline',
        to: '/progress/academic',
      },
      {
        title: 'Contrato',
        icon: 'mdi-file-document-outline',
        to: '/progress/contract',
      },
    ],
  },
  {
    title: 'Material de Soporte',
    icon: 'mdi-bookshelf',
    to: '/support-material',
  },
  {
    title: 'Reportes',
    icon: 'mdi-file-chart',
    children: [
      {
        title: 'Estudiantes',
        icon: 'mdi-account-multiple-outline',
        to: '/report-student',
      },
      {
        title: 'Salones',
        icon: 'mdi-door-open',
        to: '/report/classroom',
      },
      {
        title: 'Profesores',
        icon: 'mdi-account-tie',
        to: '/report/teacher',
      },
    ],
  },
  {
    title: 'Soporte',
    icon: 'mdi-lifebuoy',
    to: '/soporte',
  },
  {
    title: 'Configuración',
    icon: 'mdi-cog-outline',
    children: [
      {
        title: 'Usuarios',
        icon: 'mdi-account-cog-outline',
        to: '/setting/user',
      },
      {
        title: 'Usuarios Inactivos',
        icon: 'mdi-account-off-outline',
        to: '/setting/inactive-user',
      },
      {
        title: 'Permisos',
        icon: 'mdi-shield-key-outline',
        to: '/configuracion/permisos',
      },
      {
        title: 'Lenguaje y Notificaciones',
        icon: 'mdi-earth',
        to: '/configuracion/lenguaje-notificaciones',
      },
    ],
  },
])
</script>
