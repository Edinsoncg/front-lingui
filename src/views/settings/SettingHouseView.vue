<template>
  <div class="pa-4">
    <CreateButtonComponent
      resource="house"
      label="Casa"
      @open="openCreateForm"
    />

    <v-slide-y-transition>
      <div v-if="showForm" ref="formContainer" class="mb-4">
        <HouseForm
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
            resource="house"
            label="Casa"
            @edit="editItem(item)" />
          <DeleteButtonComponent
            :item="item"
            resource="house"
            @confirm-delete="deleteItem" />
        </div>
      </template>

      <template #tfoot>
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
import { ref, watch, nextTick } from 'vue'
import HouseService from '@/services/HouseService'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'
import HouseForm from '@/views/crud/form-setting-house-view.vue'

interface HouseForm {
  id?: number
  name: string
}

const itemsPerPage = ref(10)
const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(false)
const searchName = ref('')
const showForm = ref(false)
const formMode = ref<'create' | 'update'>('create')
const editData = ref<Partial<HouseForm> | undefined>(undefined)
const formContainer = ref<HTMLElement | null>(null)

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' }
]

const lastOptions = ref({ page: 1, itemsPerPage: 10, sortBy: [] })

function openCreateForm() {
  formMode.value = 'create'
  editData.value = undefined
  showForm.value = true
}

async function editItem(item: any) {
  formMode.value = 'update'
  editData.value = { ...item }
  showForm.value = true
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onSaved() {
  showSnackbar(
    formMode.value === 'create'
      ? 'Casa creada correctamente'
      : 'Casa actualizada correctamente',
    formMode.value === 'create' ? 'success' : 'info'
  )
  showForm.value = false
  loadItems(lastOptions.value)
}

async function deleteItem(item: { id: number }) {
  try {
    await HouseService.delete(item.id)
    await loadItems(lastOptions.value)
    showSnackbar('Casa eliminada correctamente', 'error')
  } catch (error) {
    console.error('Error al eliminar casa:', error)
    showSnackbar('Error al eliminar la casa', 'warning')
  }
}

async function loadItems(options: any) {
  loading.value = true
  lastOptions.value = options
  try {
    const { items, total } = await HouseService.getPaginated({
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      sortBy: options.sortBy ?? [],
      search: { name: searchName.value }
    })
    serverItems.value = items
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar casas', error)
  } finally {
    loading.value = false
  }
}

watch(searchName, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})

function showSnackbar(message: string, color: string = 'success') {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}
</script>

<style scoped>
.tabla-wrapper {
  max-width: 900px; /* Ancho maximo de la tabla */
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
</style>
