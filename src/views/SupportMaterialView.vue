//src/views/SupportMaterialView.vue

<template>
  <div class="pa-4">
    <!-- Botón reutilizable para crear -->
    <CreateButtonComponent
      resource="material"
      label="Material"
      @open="openCreateForm"
    />

    <v-slide-y-transition>
      <div v-if="showForm"
          ref="formContainer"
          class="mb-4"
      >
        <MaterialForm
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
            placeholder="Buscar por nombre"
            hide-details
            color="purple"
          />
        </td>
      </tr>
    </template>

      <template #item.level="{ item }">
        {{ item.level?.name }}
      </template>

      <template #item.link="{ item }">
        <a :href="item.link" target="_blank">{{ item.link }}</a>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-1">
          <UpdateButtonComponent
            resource="material"
            label="Material"
            @edit="editItem(item)" />

          <DeleteButtonComponent
            :item="item"
            @deleted="onDeleted" />
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
import SupportMaterialService from '@/services/SupportMaterialService'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'
import MaterialForm from '@/views/crud_material/form-material-view.vue'

//interfaces
interface SupportMaterialForm {
  id?: number
  name: string
  level_id: number | undefined
  link: string
  description: string
}

//Estado del  FORMULARIO
const showForm = ref(false)
const editData = ref<Partial<SupportMaterialForm> | undefined>(undefined)
const formMode = ref<'create' | 'update'>('create')
const formContainer = ref<HTMLElement | null>(null)

//Snackbar
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

//Esta de la TABLA
const itemsPerPage = ref(5)
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Nivel', key: 'level.name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Link', key: 'link' },
  { title: 'Acciones', key: 'actions', sortable: false }
])

const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(false)
const searchName = ref('')
const lastOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })

//Funciones del formulario
function openCreateForm(){
  formMode.value = 'create'
  editData.value = undefined
  showForm.value = true
}

async function editItem(item: any) {
  formMode.value = 'update'
  editData.value = { ...item, level_id: item.level?.id } // asegúrate de extraer el `id`
  showForm.value = true
  await nextTick()

  window.scrollTo({ top: 0, behavior: 'smooth'
  })
}

function onSaved() {
  showSnackbar(
    formMode.value === 'create'
      ? 'Material creado correctamente'
      : 'Material actualizado correctamente',
    formMode.value === 'create' ? 'success' : 'info'
  )

  showForm.value = false
  loadItems(lastOptions.value)
}

//Funciones de la Tabla
async function onDeleted() {
  await loadItems(lastOptions.value)
  showSnackbar('Material eliminado correctamente', 'error')
}

  // Cargar items desde el servicio con filtros
async function loadItems(options: any) {
  loading.value = true
  lastOptions.value = options
  try {
    const { items, total } = await SupportMaterialService.getPaginated({
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      sortBy: options.sortBy ?? [],
      search: { name: searchName.value }
    })
    serverItems.value = items
    totalItems.value = total
  } catch (error) {
    console.error('An error has ocurred while loading the materials', error)
  } finally {
    loading.value = false
  }
}

// Watcher
watch(searchName, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})

// Funciones de Snackbar: Mensajes
function showSnackbar(message: string, color: string = 'success') {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

</script>
