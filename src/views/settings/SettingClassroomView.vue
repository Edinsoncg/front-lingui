<template>
  <div class="pa-4">
    <CreateButtonComponent
      resource="classroom"
      label="Salón"
      @open="openCreateForm"
    />

    <v-slide-y-transition>
      <div v-if="showForm" ref="formContainer" class="mb-4">
        <ClassroomForm
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
      <template #tfoot>
        <tr>
          <td></td>
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

      <template #item.house="{ item }">
        {{ item.house?.name }}
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-1 btn-style">
          <UpdateButtonComponent
            resource="classroom"
            label="Salón"
            @edit="editItem(item)" />

          <DeleteButtonComponent
            :item="item"
            resource="classroom"
            @confirm-delete="deleteClassroom" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import ClassroomService from '@/services/ClassroomService'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'
import ClassroomForm from '@/views/crud/form-setting-classroom-view.vue'

interface Classroom {
  id?: number
  name: string
  capacity: number
  house_id: number | null
}

const showForm = ref(false)
const editData = ref<Partial<Classroom> | undefined>(undefined)
const formMode = ref<'create' | 'update'>('create')
const formContainer = ref<HTMLElement | null>(null)

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const itemsPerPage = ref(5)
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Capacidad', key: 'capacity' },
  { title: 'Casa', key: 'house.name' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' }
])

const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(false)
const searchName = ref('')
const lastOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })

function openCreateForm() {
  formMode.value = 'create'
  editData.value = undefined
  showForm.value = true
}

async function editItem(item: any) {
  formMode.value = 'update'
  editData.value = {
    ...item,
    house_id: item.house?.id
  }
  showForm.value = true
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onSaved() {
  showSnackbar(
    formMode.value === 'create'
      ? 'Salón creado correctamente'
      : 'Salón actualizado correctamente',
    formMode.value === 'create' ? 'success' : 'info'
  )
  showForm.value = false
  loadItems(lastOptions.value)
}

async function deleteClassroom(item: { id: number }) {
  try {
    await ClassroomService.delete(item.id)
    await loadItems(lastOptions.value)
    showSnackbar('Salón eliminado correctamente', 'error')
  } catch (error) {
    console.error('Error al eliminar salón:', error)
    showSnackbar('Error al eliminar el salón', 'warning')
  }
}

async function loadItems(options: any) {
  loading.value = true
  lastOptions.value = options
  try {
    const { items, total } = await ClassroomService.getPaginated({
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      sortBy: options.sortBy ?? [],
      search: { name: searchName.value }
    })
    serverItems.value = items
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar los salones:', error)
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
  max-width: 1000px; /* Ancho maximo de la tabla */
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
}
</style>
