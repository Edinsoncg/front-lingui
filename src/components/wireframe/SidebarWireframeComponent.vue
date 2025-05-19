<!-- src/components/navigation/SidebarComponent.vue -->
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
  import { ref } from 'vue'

  const isDrawerOpen = ref(false)

  const onMouseEnter = () => {
    isDrawerOpen.value = true
  }
  const onMouseLeave = () => {
    isDrawerOpen.value = false
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard-outline',
      to: '/dashboard',
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
          to: '/seguimiento/academico',
        },
        {
          title: 'Contrato',
          icon: 'mdi-file-document-outline',
          to: '/seguimiento/contrato',
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
          to: '/reportes/estudiantes',
        },
        {
          title: 'Salones',
          icon: 'mdi-door-open',
          to: '/reportes/salones',
        },
        {
          title: 'Profesores',
          icon: 'mdi-account-tie',
          to: '/reportes/profesores',
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
          to: '/configuracion/usuarios',
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
  ]

</script>

