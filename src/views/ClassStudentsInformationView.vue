<template>
  <div class="pa-4">
    <CreateButtonComponent
      resource="student"
      label="Estudiante"
      @open="openCreateForm"
    />

    <v-slide-y-transition>
      <div v-if="showForm" class="mb-4">
        <v-text-field
          label="Código del Estudiante"
          v-model="studentCode"
          @blur="fetchStudentInfo"
          outlined
        />

        <div v-if="studentInfo" class="mb-2">
          <div><strong>Nombre:</strong> {{ studentInfo.user.firstName }} {{ studentInfo.user.firstLastName }}</div>
          <div><strong>Teléfono:</strong> {{ studentInfo.user.phoneNumber }}</div>
        </div>

        <v-btn
          color="primary"
          @click="addStudentToClass"
          :loading="adding"
        >
          Añadir Estudiante
        </v-btn>

        <v-btn @click="cancelForm" :disabled="adding">Cancelar</v-btn>
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
          <td></td>
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
          <v-icon @click="viewStudent(item)">mdi-eye</v-icon>
          <v-icon @click="removeStudent(item)">mdi-delete</v-icon>
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
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'

const route = useRoute()
const classId = Number(route.params.id) // 👈 Obtenemos el ID dinámico de la clase

const showForm = ref(false)
const studentCode = ref('')
const studentInfo = ref<any | null>(null)
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
  studentInfo.value = null
}

function cancelForm() {
  showForm.value = false
  studentCode.value = ''
  studentInfo.value = null
}

async function fetchStudentInfo() {
  if (studentCode.value.length < 3) {
    studentInfo.value = null
    return
  }
  try {
    const response = await StudentClassService.getAll(classId, 1, 1, studentCode.value)
    studentInfo.value = response.data.length > 0 ? response.data[0] : null
  } catch (error) {
    console.error('Error al buscar estudiante:', error)
  }
}

async function addStudentToClass() {
  adding.value = true
  try {
    if (!studentInfo.value || studentInfo.value.studentCode !== studentCode.value) {
      await fetchStudentInfo()
    }

    if (!studentInfo.value) {
      snackbarMessage.value = 'Estudiante no encontrado'
      snackbarColor.value = 'warning'
      snackbar.value = true
      return
    }

    // ✅ Validar si el estudiante YA está inscrito antes de enviar petición
    const isAlreadyEnrolled = serverItems.value.some(item => item.student_contract.student.id === studentInfo.value.student.id)
    if (isAlreadyEnrolled) {
      snackbarMessage.value = 'El estudiante ya se encuentra inscrito en esta clase'
      snackbarColor.value = 'warning'
      snackbar.value = true
      return
    }

    await StudentClassService.addStudentToClass(classId, studentCode.value)
    snackbarMessage.value = 'Estudiante agregado correctamente'
    snackbarColor.value = 'success'
    snackbar.value = true
    loadItems(lastOptions.value)
    cancelForm()
  } catch (error: any) {
    console.error('Error al agregar estudiante:', error)

    const responseMessage = error?.response?.data?.message || ''

    if (responseMessage.includes('ya inscrito')) {
      snackbarMessage.value = 'El estudiante ya se encuentra inscrito en esta clase'
      snackbarColor.value = 'warning'
    } else if (responseMessage.includes('capacidad máxima') || responseMessage.includes('límite de capacidad')) {
      snackbarMessage.value = responseMessage
      snackbarColor.value = 'warning'
    } else {
      snackbarMessage.value = 'Error al agregar estudiante'
      snackbarColor.value = 'error'
    }

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

watch(studentCode, () => {
  studentInfo.value = null
})

watch(searchName, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})
</script>
