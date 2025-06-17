<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="3">
        <v-text-field label="Nombre" v-model="form.first_name" :rules="[rules.required, rules.minName, rules.maxName]"/>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field label="Segundo Nombre" v-model="form.middle_name"/>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field label="Apellido" v-model="form.first_last_name" :rules="[rules.required, rules.minName, rules.maxName]"/>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field label="Segundo Apellido" v-model="form.second_last_name" :rules="[rules.required, rules.minName, rules.maxName]"/>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="form.document_type_id"
          :items="documentTypes"
          item-title="name"
          item-value="id"
          label="Tipo de Documento"
          :rules="[rules.required]"
        />
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field label="Número de Documento" v-model="form.document_number" :rules="[rules.required, rules.minDocumentNumber, rules.maxDocumentNumber]"/>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field label="Correo Electrónico" v-model="form.email" :rules="[rules.required, rules.email]" />
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field label="Teléfono" v-model="form.phone_number" :rules="[rules.required, rules.minPhoneNumber, rules.maxPhoneNumber]" />
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="form.role_ids"
          :items="roles"
          item-title="name"
          item-value="id"
          label="Roles"
          multiple
          chips
          :rules="[rules.required]"
        />
      </v-col>

      <!-- Idiomas: solo aparece si incluye el rol profesor (id === 3) -->
      <v-col cols="12" md="3" v-if="includesTeacher">
        <v-select
          v-model="form.language_ids"
          :items="languages"
          item-title="name"
          item-value="id"
          label="Idiomas (solo para profesores)"
          multiple
          chips
        />
      </v-col>

      <!-- Jornada: se desactiva si solo tiene el rol estudiante -->
      <v-col cols="12" md="3">
        <v-select
          v-model="form.workday_id"
          :items="workdays"
          item-title="journal"
          item-value="id"
          label="Jornada"
          :disabled="isStudent"
        />
      </v-col>

      <v-col cols="12" md="3" v-if="props.mode === 'create'">
        <v-text-field label="Contraseña" type="password" v-model="form.password" :rules="[rules.required , rules.password]"/>
      </v-col>
    </v-row>

    <v-btn color="primary" @click="confirmDialog = true" :loading="loading" style="width: auto; margin-right: 1rem;">
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
import LanguageService from '@/services/LanguageService'

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
    role_ids: number[]
  language_ids: number[]
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
  role_ids: [],
  language_ids: [],
})

const documentTypes = ref<SelectOption[]>([])
const workdays = ref<SelectOption[]>([])
const roles = ref<SelectOption[]>([])
const languages = ref<SelectOption[]>([])
const loading = ref(false)
const confirmDialog = ref(false)

const rules = {
  required: (value: any) => !!value && value.length !== 0 || 'Este campo es obligatorio',
  minName: (value:any) => String(value).length >= 3  || 'Debe tener al menos 3 caracteres',
  maxName: (value:any) => String(value).length <= 33  || 'Debe tener menos de 32 caracteres',
  numeric: (v: any) =>
    /^\d+$/.test(v) || 'Solo se permiten números',
  minDocumentNumber: (v: any) =>
    String(v).length >= 8 || 'Debe tener al menos 8 cifras numéricas',
  maxDocumentNumber: (v: any) =>
    String(v).length <= 10 || 'Debe tener al menos 10 cifras numéricas',
  minPhoneNumber: (v: any) =>
    String(v).length >= 7 || 'Debe tener al menos 7 cifras numéricas',
  maxPhoneNumber: (v: any) =>
    String(v).length <= 15 || 'Debe tener al menos 15 cifras numéricas',
   // 📧 Validación de formato de correo
  email: (v: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co|es|org|edu|net|gob|gov|ut\.edu)$/i
    return pattern.test(v) || 'Correo no válido o dominio incorrecto'
  },
  password: (value:any) => String(value).length >= 6 || 'Debe tener al menos 6 caracteres'
}

// Computados
const modalTitle = computed(() =>
  props.mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'
)
const modalMessage = computed(() =>
  props.mode === 'create'
    ? '¿Está seguro de que desea crear este usuario?'
    : '¿Está seguro de que desea actualizar este usuario?'
)

// 👇 Computados para lógica de campos condicionales
const isStudent = computed(() => form.value.role_ids.includes(4))
const includesTeacher = computed(() => form.value.role_ids.includes(3))

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
      role_ids: data.role_ids ?? [],
      language_ids: data.language_ids ?? [],
    }
  }
}, { immediate: true })

watch(() => form.value.role_ids, () => {
  if (isStudent.value) {
    form.value.workday_id = null
  }

  if (!includesTeacher.value) {
    form.value.language_ids = []
  }
})

// Lifecycle
onMounted(async () => {
  try {
    roles.value = await RoleService.getAll()
    workdays.value = await WorkdayService.getAll()
    documentTypes.value = await DocumentTypeService.getAll()
    languages.value = await LanguageService.getAll()
  } catch (error) {
    console.error('Error al cargar listas para el formulario:', error)
  }
})

// Enviar formulario
async function submit() {
  confirmDialog.value = false

  loading.value = true


  try {
    const payload = { ...form.value }

    // Eliminar password si es actualización
    if (props.mode !== 'create') {
      delete payload.password
    }

    // Eliminar language_ids si no es profesor o está vacío
    if (!includesTeacher.value || !payload.language_ids?.length) {
      delete payload.language_ids
    }

    // Eliminar workday_id si es solo estudiante
    if (isStudent.value) {
      payload.workday_id = null
    }

    // Eliminar role_ids si está vacío
    if (!payload.role_ids?.length) {
      delete payload.role_ids
    }

    if (props.mode !== 'create') {
      delete payload.password
    }

    if (props.mode === 'create') {
      await SettingUserService.create(payload)
    } else if (props.mode === 'update' && form.value.id) {
      await SettingUserService.update(form.value.id, payload)
    }

    emit('saved')
  } catch (error) {
    console.error('Error al guardar usuario:', error)
  } finally {
    loading.value = false
  }
}
</script>
