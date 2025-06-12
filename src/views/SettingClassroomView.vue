<template>
  <v-container>
    <!-- Botón de Crear salón -->
    <CreateButtonComponent
      resource="classroom"
      label="Salón"
      @open="openCreateForm"
    />

    <!-- Tabla de salones -->
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="classrooms"
      :items-length="totalItems"
      :loading="loading"
      item-value="id"
      @update:options="loadItems"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <!-- Botón de Editar -->
          <UpdateButtonComponent
            resource="classroom"
            label="Salón"
            @edit="editClassroom(item)"
          />
          <!-- Botón de Eliminar -->
          <DeleteButtonComponent
            :item="item"
            resource="classroom"
            @confirm-delete="deleteClassroom"
          />
        </div>
      </template>

      <!-- Filtro de búsqueda -->
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
    </v-data-table-server>

    <!-- Formulario de creación/edición -->
    <v-slide-y-transition>
      <div v-if="showForm" class="mb-4">
        <ClassroomForm
          :mode="formMode"
          :initialData="editData"
          @saved="onSaved"
          @cancel="showForm = false"
        />
      </div>
    </v-slide-y-transition>

    <!-- Snackbar de mensajes de éxito -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :color="snackbarColor"
      location="top right"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import ClassroomService from '@/services/ClassroomService'  // Usamos el servicio tal como está
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'
import ClassroomForm from '@/components/ClassroomForm.vue'

const itemsPerPage = ref(10)
const classrooms = ref([])
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
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Capacidad', key: 'capacity' },
  { title: 'Casa', key: 'house.name' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

// Cargar los datos de los salones
const loadItems = async (options) => {
  loading.value = true
  const { page, itemsPerPage, sortBy } = options
  try {
    const { items, total } = await ClassroomService.getAll()
    classrooms.value = items
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar los salones', error)
  } finally {
    loading.value = false
  }
}

// Abrir formulario para crear un salón
const openCreateForm = () => {
  formMode.value = 'create'
  editData.value = null
  showForm.value = true
}

// Abrir formulario para editar un salón
const editClassroom = (item) => {
  formMode.value = 'update'
  editData.value = { ...item, house_id: item.house.id }
  showForm.value = true
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

// Guardar salón después de crear/editar
const onSaved = () => {
  showSnackbar(
    formMode.value === 'create' ? 'Salón creado correctamente' : 'Salón actualizado correctamente',
    formMode.value === 'create' ? 'success' : 'info'
  )
  showForm.value = false
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
}

// Eliminar un salón
const deleteClassroom = async (item) => {
  try {
    await ClassroomService.delete(item.id)
    showSnackbar('Salón eliminado correctamente', 'error')
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
  } catch (error) {
    console.error('Error al eliminar el salón:', error)
    showSnackbar('Error al eliminar el salón', 'warning')
  }
}

// Mostrar snackbar con mensajes
const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

// Buscar salones por nombre
watch(searchName, () => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
})
</script>
