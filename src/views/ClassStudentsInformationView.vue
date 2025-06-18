<template>
  <div class="pa-4">
    <AddButtonComponent
      resource="student"
      label="Estudiante"
      style="width: auto;"
      @open="openCreateForm"
    />

    <v-slide-y-transition>
      <div v-if="showForm" class="mb-4" style="max-width: fit-content;">
        <v-text-field
          label="Código del Estudiante"
          v-model="studentCode"
          outlined
        />

        <v-btn
          color="primary"
          style="width: auto; margin-right: 1rem;"
          @click="addStudentToClass"
          :loading="adding"
        >
          Añadir Estudiante
        </v-btn>

        <v-btn
          color="primary"
          style="width: auto;"
          @click="cancelForm"
          :disabled="adding"
        >
          Cancelar
        </v-btn>
      </div>
    </v-slide-y-transition>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loadingTable"
      item-value="id"
      @update:options="loadItems"
    >
      <template #tfoot>
        <tr>
          <td>
            <v-text-field
              v-model="searchName"
              class="ma-2"
              density="compact"
              placeholder="Buscar por código"
              hide-details
              color="purple"
            />
          </td>
        </tr>
      </template>

      <template #item.student_code="{ item }">
        {{ item.student_contract.student.studentCode }}
      </template>

      <template #item.name="{ item }">
        {{ item.student_contract.student.user.firstName }} {{ item.student_contract.student.user.firstLastName }}
      </template>

      <template #item.phone_number="{ item }">
        {{ item.student_contract.student.user.phoneNumber }}
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-icon @click="viewStudent(item)" color="primary">mdi-eye</v-icon>
          <DeleteButtonComponent
            :item="{ id: item.student_contract.student.id }"
            resource="estudiante"
            @confirm-delete="removeStudent"
          />
        </div>
      </template>
    </v-data-table-server>

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
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import StudentClassService from '@/services/StudentAttendanceService'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'
import AddButtonComponent from '@/components/buttons/AddButtonComponent.vue'

const route = useRoute()
const classId = Number(route.params.id)

const showForm = ref(false)
const studentCode = ref('')
const loadingTable = ref(false)
const adding = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')
const searchName = ref('')
const itemsPerPage = ref(5)
const headers = ref([
  { title: 'Código', key: 'student_code' },
  { title: 'Nombre', key: 'name' },
  { title: 'Teléfono', key: 'phone_number' },
  { title: 'Acciones', key: 'actions', sortable: false }
])
const serverItems = ref([])
const totalItems = ref(0)
const lastOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })

onMounted(() => {
  loadItems(lastOptions.value)
})

function openCreateForm() {
  showForm.value = true
  studentCode.value = ''
}

function cancelForm() {
  showForm.value = false
  studentCode.value = ''
}

async function addStudentToClass() {
  adding.value = true
  try {
    const code = studentCode.value.trim()

    if (!code) {
      snackbarMessage.value = 'Student code is required.'
      snackbarColor.value = 'warning'
      snackbar.value = true
      adding.value = false
      return
    }

    if (code.length < 4 || !/^\d+$/.test(code)) {
      snackbarMessage.value = 'Student code must be at least 4 digits.'
      snackbarColor.value = 'warning'
      snackbar.value = true
      adding.value = false
      return
    }

    const response = await StudentClassService.addStudentToClass(classId, studentCode.value.trim())

    if (response?.message?.includes('capacidad máxima')) {
      snackbarMessage.value = response.message
      snackbarColor.value = 'error'
      snackbar.value = true
      return
    }

    snackbarMessage.value = 'Estudiante agregado correctamente'
    snackbarColor.value = 'success'
    snackbar.value = true

    loadItems(lastOptions.value)
    cancelForm()
  } catch (error: any) {

    if (error?.response?.data?.errors?.length > 0) {
      snackbarMessage.value = error.response.data.errors[0].message
    } else if (error?.response?.data?.message) {
      snackbarMessage.value = error.response.data.message
    } else {
      snackbarMessage.value = 'Error desconocido'
    }

    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    adding.value = false
  }
}

async function loadItems(options: any) {
  loadingTable.value = true
  lastOptions.value = options
  try {
    const { items, total } = await StudentClassService.getPaginated(classId, {
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      search: { student_code: searchName.value }
    })
    serverItems.value = items
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar estudiantes', error)
  } finally {
    loadingTable.value = false
  }
}

function viewStudent(item: any) {
  console.log('Ver información del estudiante:', item)
}

async function removeStudent(item: any) {
  try {
    await StudentClassService.removeStudentFromClass(classId, item.id)
    snackbarMessage.value = 'Estudiante eliminado correctamente'
    snackbarColor.value = 'error'
    snackbar.value = true
    loadItems(lastOptions.value)
  } catch (error) {
    console.error('Error al eliminar estudiante:', error)
    snackbarMessage.value = 'Error al eliminar estudiante'
    snackbarColor.value = 'warning'
    snackbar.value = true
  }
}

watch(searchName, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})
</script>
