<template>
  <div class="pa-4">
    <!-- Botón reutilizable para crear -->
    <CreateButtonComponent
      resource="usuario"
      label="Usuario"
      @open="openCreateForm"
    />

    <v-slide-y-transition>
      <div v-if="showForm" ref="formContainer" class="mb-4">
        <UserForm
          :mode="formMode"
          :initialData="editData"
          @saved="onSaved"
          @cancel="showForm = false"
        />
      </div>
    </v-slide-y-transition>

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

      <template #item.role="{ item }">
        {{ item.role }}
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-1">
          <UpdateButtonComponent
            resource="usuario"
            label="Usuario"
            @edit="editItem(item)" />

          <DeleteButtonComponent
            :item="item"
            resource="usuario"
            @confirm-delete="deleteUser" />
        </div>
      </template>

    </v-data-table-server>
  </div>

  <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    :color="snackbarColor"
    location="top right"
  >
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import UserService from '@/services/SettingUserService'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'
import UserForm from '@/views/crud/form-user-view.vue'

// interfaces
interface UserForm {
  id?: number
  first_name: string
  middle_name?: string
  first_last_name: string
  second_last_name: string
  email: string
  role_id: number
  document_type_id: number
  document_number: string
  phone_number: string
  workday_id?: number | null
  password?: string
}

// Estado del FORMULARIO
const showForm = ref(false)
const editData = ref<Partial<UserForm> | undefined>(undefined)
const formMode = ref<'create' | 'update'>('create')
const formContainer = ref<HTMLElement | null>(null)

// Snackbar
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Estado de la TABLA
const itemsPerPage = ref(5)
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'first_name' },
  { title: 'Apellido', key: 'first_last_name' },
  { title: 'Correo', key: 'email' },
  { title: 'Rol', key: 'role' },
  { title: 'Acciones', key: 'actions', sortable: false }
])

const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(false)
const searchName = ref('')
const lastOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })

// Funciones del formulario
function openCreateForm() {
  formMode.value = 'create'
  editData.value = undefined
  showForm.value = true
}

async function editItem(item: any) {
  try {
    const userData = await UserService.getById(item.id)

    formMode.value = 'update'
    editData.value = {
      id: userData.id,
      first_name: userData.firstName,
      middle_name: userData.middleName,
      first_last_name: userData.firstLastName,
      second_last_name: userData.secondLastName,
      document_type_id: userData.documentTypeId,
      document_number: userData.documentNumber,
      email: userData.email,
      phone_number: userData.phoneNumber,
      workday_id: userData.workdayId,
      role_id: userData.role_id,
    }

    showForm.value = true
    await nextTick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('Error al cargar datos del usuario para edición', error)
    showSnackbar('No se pudo cargar el usuario para editar', 'error')
  }
}



function onSaved() {
  showSnackbar(
    formMode.value === 'create'
      ? 'Usuario creado correctamente'
      : 'Usuario actualizado correctamente',
    formMode.value === 'create' ? 'success' : 'info'
  )

  showForm.value = false
  loadItems(lastOptions.value)
}

// Función de borrado
async function deleteUser(item: { id: number }) {
  try {
    await UserService.delete(item.id)
    await loadItems(lastOptions.value)
    showSnackbar('Usuario eliminado correctamente', 'error')
  } catch (error) {
    console.error('Error al eliminar usuario', error)
    showSnackbar('Error al eliminar el usuario', 'warning')
  }
}

// Cargar items desde el servicio
async function loadItems(options: any) {
  loading.value = true
  lastOptions.value = options
  try {
    const { items, total } = await UserService.getPaginated({
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      sortBy: options.sortBy ?? [],
      search: { search: searchName.value }
    })
    serverItems.value = items.map((item: any) => ({
      id: item.user.id,
      first_name: item.user.firstName,
      first_last_name: item.user.firstLastName,
      email: item.user.email,
      role: item.role?.name ?? null,
      role_id: item.roleId,
    }))
    totalItems.value = total
  } catch (error) {
    console.error('Error al obtener los usuarios', error)
  } finally {
    loading.value = false
  }
}

// Watcher
watch(searchName, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})

// Snackbar
function showSnackbar(message: string, color: string = 'success') {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}
</script>
