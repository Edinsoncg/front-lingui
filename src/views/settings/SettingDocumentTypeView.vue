<template>
  <div class="pa-4">
    <CreateButtonComponent
      resource="documento"
      label="Tipo de Documento"
      @open="openCreateForm"
    />

    <v-slide-y-transition>
      <div v-if="showForm" class="mb-4">
        <DocumentTypeForm
          :mode="formMode"
          :initialData="editData"
          @saved="onSaved"
          @cancel="showForm = false"
        />
      </div>
    </v-slide-y-transition>

  <div class="tabla-wrapper">
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      item-value="id"
      @update:options="loadItems"
    >
      <template #item.actions="{ item }">
        <div class="d-flex ga-1 btn-style">
          <UpdateButtonComponent
            resource="documento"
            label="Tipo de Documento"
            @edit="editItem(item)"
          />
          <DeleteButtonComponent
            :item="item"
            resource="documento"
            @confirm-delete="deleteItem"
          />
        </div>
      </template>

      <template #tfoot>
        <tr>
          <td colspan="1">
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
  </div>
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
import DocumentTypeService from '@/services/DocumentTypeService'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'
import DocumentTypeForm from '@/views/crud/form-setting-documenttype-view.vue'

const itemsPerPage = ref(10)
const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(false)
const searchName = ref('')
const showForm = ref(false)
const formMode = ref<'create' | 'update'>('create')
const editData = ref(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')
const lastOptions = ref({ page: 1, itemsPerPage: 10, sortBy: [] })

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Abreviación', key: 'abbreviation' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
]

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

const deleteItem = async (item) => {
  try {
    await DocumentTypeService.delete(item.id)
    showSnackbar('Tipo eliminado correctamente', 'success')
    loadItems(lastOptions.value)
  } catch (error) {
    showSnackbar('Error al eliminar tipo', 'error')
  }
}

const onSaved = () => {
  showSnackbar(
    formMode.value === 'create' ? 'Tipo creado' : 'Tipo actualizado',
    formMode.value === 'create' ? 'success' : 'info'
  )
  showForm.value = false
  loadItems(lastOptions.value)
}

const showSnackbar = (message: string, color: string) => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

const loadItems = async (options = { page: 1, itemsPerPage: itemsPerPage.value }) => {
  loading.value = true
  lastOptions.value = options
  try {
    const all = await DocumentTypeService.getAll()
    const filtered = all.filter(item =>
      item.name.toLowerCase().includes(searchName.value.toLowerCase())
    )
    serverItems.value = filtered.slice(
      (options.page - 1) * options.itemsPerPage,
      options.page * options.itemsPerPage
    )
    totalItems.value = filtered.length
  } catch (error) {
    console.error('Error al cargar tipos', error)
  } finally {
    loading.value = false
  }
}

watch(searchName, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})
</script>
<style scoped>
.tabla-wrapper {
  max-width: 800px; /* Ancho maximo de la tabla */
  margin: auto;
}

.btn-style {
  align-items: center; /* centra verticalmente los botones */
  margin-top: -2px;    /* corrige alineación vertical con el encabezado */
  justify-content: center;
}

/* Apunta a los v-btn internos de los componentes */
.btn-style :deep(.v-btn) {
  margin: 3px;
  padding: px;
}

:deep(.v-btn) {
  padding: 0 16px !important;
  min-width: max-content;
  overflow: visible;
  white-space: nowrap;
}

</style>
