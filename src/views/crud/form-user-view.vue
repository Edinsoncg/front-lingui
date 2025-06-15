<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="4">
        <v-text-field label="Nombre" v-model="form.first_name" density="compact" />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field label="Segundo Nombre" v-model="form.middle_name" density="compact" />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field label="Apellido" v-model="form.first_last_name" density="compact" />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field label="Segundo Apellido" v-model="form.second_last_name" density="compact" />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="form.document_type_id"
          :items="documentTypes"
          item-title="name"
          item-value="id"
          label="Tipo de Documento"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field label="Número de Documento" v-model="form.document_number" density="compact" />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field label="Correo Electrónico" v-model="form.email" density="compact" />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field label="Teléfono" v-model="form.phone_number" density="compact" />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="form.workday_id"
          :items="workdays"
          item-title="journal"
          item-value="id"
          label="Jornada"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="form.role_id"
          :items="roles"
          item-title="name"
          item-value="id"
          label="Rol"
        />
      </v-col>

      <v-col cols="12" md="4" v-if="props.mode === 'create'">
        <v-text-field label="Contraseña" type="password" v-model="form.password" density="compact" />
      </v-col>
    </v-row>

    <v-btn color="primary" @click="confirmDialog = true" :loading="loading">
      Guardar
    </v-btn>

    <v-btn @click="$emit('cancel')">Cancelar</v-btn>

    <ConfirmDialog
      v-model="confirmDialog"
      :title="modalTitle"
      :message="modalMessage"
      @confirm="submit"
      @cancel="confirmDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import ConfirmDialog from '@/components/ModalComponent.vue'
import SettingUserService from '@/services/SettingUserService'
import WorkdayService from '@/services/WorkdayService'
import DocumentTypeService from '@/services/DocumentTypeService'
import RoleService from '@/services/RoleService'

// Interfaces
interface UserForm {
  id?: number
  first_name: string
  middle_name?: string
  first_last_name: string
  second_last_name: string
  document_type_id: number | undefined
  document_number: string
  email: string
  password?: string
  phone_number: string
  workday_id?: number | null
  role_id: number | undefined
}

interface SelectOption {
  id: number
  name: string
}

// Props y Emits
const props = defineProps<{
  mode: 'create' | 'update',
  initialData?: Partial<UserForm>
}>()
const emit = defineEmits(['saved', 'cancel'])

// Computados
const modalTitle = computed(() =>
  props.mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'
)
const modalMessage = computed(() =>
  props.mode === 'create'
    ? '¿Está seguro de que desea crear este usuario?'
    : '¿Está seguro de que desea actualizar este usuario?'
)

// Refs
const form = ref<UserForm>({
  first_name: '',
  middle_name: '',
  first_last_name: '',
  second_last_name: '',
  document_type_id: undefined,
  document_number: '',
  email: '',
  password: '',
  phone_number: '',
  workday_id: null,
  role_id: undefined,
})

const documentTypes = ref<SelectOption[]>([])
const workdays = ref<SelectOption[]>([])
const roles = ref<SelectOption[]>([])
const loading = ref(false)
const confirmDialog = ref(false)

// Watch
watch(() => props.initialData, (data) => {
  if (props.mode === 'update' && data) {
    form.value = {
      id: data.id ?? undefined,
      first_name: data.first_name ?? '',
      middle_name: data.middle_name ?? '',
      first_last_name: data.first_last_name ?? '',
      second_last_name: data.second_last_name ?? '',
      document_type_id: data.document_type_id ?? undefined,
      document_number: data.document_number ?? '',
      email: data.email ?? '',
      phone_number: data.phone_number ?? '',
      workday_id: data.workday_id ?? null,
      role_id: data.role_id ?? undefined,
    }
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  try {
    roles.value = await RoleService.getAll()
    workdays.value = await WorkdayService.getAll()
    documentTypes.value = await DocumentTypeService.getAll()
  } catch (error) {
    console.error('Error al cargar listas para el formulario:', error)
  }
})

// Enviar formulario
async function submit() {
  confirmDialog.value = false

  loading.value = true
  try {
    if (props.mode === 'create') {
      await SettingUserService.create(form.value)
    } else if (props.mode === 'update' && form.value.id) {
      await SettingUserService.update(form.value.id, form.value)
    }

    emit('saved')
  } catch (error) {
    console.error('Error al guardar usuario:', error)
  } finally {
    loading.value = false
  }
}
</script>
