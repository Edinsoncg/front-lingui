<template>
  <v-container>
    <!-- Botón de crear -->
    <CreateButtonComponent
      resource="house"
      label="Casa"
      @open="openCreateForm"
    />

    <!-- Formulario -->
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

    <!-- Tabla -->
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="houses"
      :items-length="totalItems"
      :loading="loading"
      item-value="id"
      @update:options="loadItems"
    >
      <!-- Botones de acción -->
      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <UpdateButtonComponent
            resource="house"
            label="Casa"
            @edit="editItem(item)"
          />
          <DeleteButtonComponent
            :item="item"
            resource="house"
            @confirm-delete="deleteItem"
          />
        </div>
      </template>

      <!-- Filtro -->
      <template v-slot:tfoot>
        <tr>
          <td>
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

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor" location="top right">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import HouseService from '@/services/HouseService'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'
import SimpleSettingForm from '@/components/settings/SimpleSettingForm.vue'

const itemsPerPage = ref(10)
const houses = ref([])
const totalItems = ref(0)
const loading = ref(false)
const searchName = ref('')
const showForm = ref(false)
const formMode = ref<'create' | 'update'>('create')
const editData = ref(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

// Cargar casas
const loadItems = async (options = { page: 1, itemsPerPage: itemsPerPage.value }) => {
  loading.value = true
  try {
    const { items, total } = await HouseService.getPaginated({
      ...options,
      search: { name: searchName.value },
    })
    houses.value = items
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar casas', error)
  } finally {
    loading.value = false
  }
}

// Abrir formulario
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
    await HouseService.create(data)
  } else {
    await HouseService.update(editData.value.id, data)
  }
}

const deleteItem = async (item) => {
  try {
    await HouseService.delete(item.id)
    showSnackbar('Casa eliminada correctamente', 'success')
    loadItems()
  } catch (error) {
    showSnackbar('Error al eliminar', 'error')
  }
}

const onSaved = () => {
  showSnackbar(
    formMode.value === 'create' ? 'Casa creada' : 'Casa actualizada',
    formMode.value === 'create' ? 'success' : 'info'
  )
  showForm.value = false
  loadItems()
}

const showSnackbar = (message: string, color: string) => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

watch(searchName, () => {
  loadItems()
})
</script>
