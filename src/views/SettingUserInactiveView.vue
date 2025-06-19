<template>
  <div class="pa-4">
    <!-- Tabla paginada con búsqueda -->
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      item-value="id"
      @update:options="loadItems"
    >
      <template v-slot:tfoot>
        <tr>
          <td></td>
          <td>
            <v-text-field
              v-model="searchName"
              class="ma-2"
              density="compact"
              placeholder="Buscar por nombre o correo"
              hide-details
              color="purple"
            />
          </td>
        </tr>
      </template>

      <template #item.roles="{ item }">
        <v-chip
          v-for="role in item.roles"
          :key="role"
          :color="roleColors[role] || 'grey-lighten-2'"
          class="ma-1"
          size="small"
          label
        >
          {{ role }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-1">
          <RestoreButtonComponent
            :item="item"
            resource="usuario"
            @confirm-restore="restoreUser"
          />

          <DeleteButtonComponent
            :item="item"
            resource="usuario"
            @confirm-delete="forceDeleteUser"
          />
        </div>
      </template>

    <template #no-data>
      <div class="text-center pa-6 text-grey">
      No hay usuarios inactivos
      </div>
    </template>
    </v-data-table-server>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :color="snackbarColor"
      location="top right"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SettingUserInactiveService from '@/services/SettingUserInactiveService'
import RestoreButtonComponent from '@/components/buttons/RestoreButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'

// Estado tabla
const itemsPerPage = ref(5)
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'first_name' },
  { title: 'Apellido', key: 'first_last_name' },
  { title: 'Correo', key: 'email' },
  { title: 'Roles', key: 'roles' },
  { title: 'Acciones', key: 'actions', sortable: false }
])

interface UserItem {
  id: number
  first_name: string
  first_last_name: string
  email: string
  roles: string[]
}

const serverItems = ref<UserItem[]>([])
const totalItems = ref(0)
const loading = ref(false)
const searchName = ref('')
const lastOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })

const roleColors: Record<string, string> = {
  Estudiante: 'green-lighten-2',
  Profesor: 'blue-lighten-2',
  Administrativo: 'deep-purple-lighten-2',
  Recepcionista: 'orange-lighten-2',
}

// Snackbar
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

function showSnackbar(message: string, color = 'success') {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

// Restaurar usuario
async function restoreUser(item: { id: number }) {
  try {
    await SettingUserInactiveService.restore(item.id)
    showSnackbar('Usuario restaurado correctamente', 'success')
    loadItems(lastOptions.value)
  } catch (error) {
    console.error(error)
    showSnackbar('Error al restaurar usuario', 'error')
  }
}

// Eliminar usuario definitivamente
async function forceDeleteUser(item: { id: number }) {
  try {
    await SettingUserInactiveService.forceDelete(item.id)
    showSnackbar('Usuario eliminado permanentemente', 'info')
    loadItems(lastOptions.value)
  } catch (error) {
    console.error(error)
    showSnackbar('Error al eliminar usuario', 'error')
  }
}

// Cargar datos
async function loadItems(options: any) {
  loading.value = true
  lastOptions.value = options
  try {
    const { items, total } = await SettingUserInactiveService.getPaginated({
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      sortBy: options.sortBy ?? [],
      search: { search: searchName.value }
    })

    serverItems.value = items.map((item: any) => ({
      id: item.id,
      first_name: item.firstName,
      first_last_name: item.firstLastName,
      email: item.email,
      roles: item.roles?.map((r: any) => r.name) ?? [],
    }))
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar usuarios inactivos', error)
  } finally {
    loading.value = false
  }
}

watch(searchName, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})
</script>
