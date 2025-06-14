<!-- src/views/settings/SettingRoleView.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import RoleService from '@/services/RoleService'
import SimpleSettingForm from '@/components/settings/SimpleSettingForm.vue'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'

const itemsPerPage = ref(10)
const roles = ref([])
const totalItems = ref(0)
const loading = ref(false)
const searchName = ref('')
const showForm = ref(false)
const formMode = ref('create')
const editData = ref(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const loadItems = async (options = { page: 1, itemsPerPage: itemsPerPage.value }) => {
  loading.value = true
  try {
    const { items, total } = await RoleService.getPaginated({
      ...options,
      search: { name: searchName.value },
    })
    roles.value = items
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar roles', error)
  } finally {
    loading.value = false
  }
}

const openCreateForm = () => {
  formMode.value = 'create'
  editData.value = null
  showForm.value = true
}

const editItem = (item) => {
  formMode.value = 'update'
  editData.value = { ...item }
  showForm.value = true
}

const handleSave = async (data) => {
  if (formMode.value === 'create') {
    await RoleService.create(data)
  } else {
    await RoleService.update(editData.value.id, data)
  }
}

const deleteItem = async (item) => {
  try {
    await RoleService.delete(item.id)
    showSnackbar('Rol eliminado', 'success')
    loadItems()
  } catch (error) {
    showSnackbar('Error al eliminar', 'error')
  }
}

const onSaved = () => {
  showSnackbar(
    formMode.value === 'create' ? 'Rol creado' : 'Rol actualizado',
    formMode.value === 'create' ? 'success' : 'info'
  )
  showForm.value = false
  loadItems()
}

const showSnackbar = (message, color) => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

watch(searchName, () => loadItems())
</script>

<template>
  <v-container>
    <CreateButtonComponent resource="role" label="Rol" @open="openCreateForm" />

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="roles"
      :items-length="totalItems"
      :loading="loading"
      item-value="id"
      @update:options="loadItems"
    >
      <template v-slot:item.actions="{ item }">
        <UpdateButtonComponent resource="role" label="Rol" @edit="editItem(item)" />
        <DeleteButtonComponent :item="item" resource="role" @confirm-delete="deleteItem" />
      </template>

      <template v-slot:tfoot>
        <tr>
          <td colspan="2">
            <v-text-field
              v-model="searchName"
              class="ma-2"
              density="compact"
              placeholder="Buscar por nombre"
              hide-details
              color="purple"
            />
          </td>
        </tr>
      </template>
    </v-data-table-server>

    <v-slide-y-transition>
      <div v-if="showForm" class="mb-4">
        <SimpleSettingForm
          :mode="formMode"
          :initialData="editData"
          :fields="[{ key: 'name', label: 'Nombre' }]"
          :onSave="handleSave"
          @saved="onSaved"
          @cancel="showForm = false"
        />
      </div>
    </v-slide-y-transition>

    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor" location="top right">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>
