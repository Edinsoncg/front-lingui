<template>
  <v-container>
    <!-- Botón de Crear -->
    <CreateButtonComponent
      resource="language"
      label="Idioma"
      @open="openCreateForm"
    />

    <!-- Formulario -->
    <v-slide-y-transition>
      <div v-if="showForm" class="mb-4">
        <SimpleSettingForm
          :mode="formMode"
          :initialData="editData"
          :fields="[
            { key: 'name', label: 'Nombre' },
            { key: 'abbreviation', label: 'Abreviación' }
          ]"
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
      :items="languages"
      :items-length="totalItems"
      :loading="loading"
      item-value="id"
      @update:options="loadItems"
    >
      <!-- Acciones -->
      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <UpdateButtonComponent
            resource="language"
            label="Idioma"
            @edit="editItem(item)"
          />
          <DeleteButtonComponent
            :item="item"
            resource="language"
            @confirm-delete="deleteItem"
          />
        </div>
      </template>

      <!-- Filtro -->
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

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor" location="top right">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import LanguageService from '@/services/LanguageService'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'
import SimpleSettingForm from '@/components/settings/SimpleSettingForm.vue'

const itemsPerPage = ref(10)
const languages = ref([])
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
  { title: 'Abreviación', key: 'abbreviation' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const loadItems = async (options = { page: 1, itemsPerPage: itemsPerPage.value }) => {
  loading.value = true
  try {
    const { items, total } = await LanguageService.getPaginated({
      ...options,
      search: { name: searchName.value },
    })
    languages.value = items
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar idiomas', error)
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
    await LanguageService.create(data)
  } else {
    await LanguageService.update(editData.value.id, data)
  }
}

const deleteItem = async (item) => {
  try {
    await LanguageService.delete(item.id)
    showSnackbar('Idioma eliminado correctamente', 'success')
    loadItems()
  } catch (error) {
    showSnackbar('Error al eliminar idioma', 'error')
  }
}

const onSaved = () => {
  showSnackbar(
    formMode.value === 'create' ? 'Idioma creado' : 'Idioma actualizado',
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
