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
        <v-list-group v-if="item.children && item.children.length">
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
import { ref, computed, onMounted} from 'vue'
import { authSetStore } from '@/stores/AuthStore'
import { usePermissions } from '@/stores/UsePermissions'

const auth = authSetStore()
const isDrawerOpen = ref(false)
const { getMenu, fetchMenu } = usePermissions()

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

onMounted(fetchMenu)
const menuItems = computed(() => getMenu())
</script>
