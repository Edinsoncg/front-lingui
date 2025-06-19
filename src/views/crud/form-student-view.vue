<template>
  <v-card class="pa-6 mb-6" elevation="2" color="#f4eafd" rounded="lg" v-if="userId">
    <v-form ref="formRef" @submit.prevent="save">
    <v-row>
      <!-- Código -->
      <v-col cols="12" sm="4">
        <v-text-field v-model="form.student_code" label="Código Estudiante" outlined dense :rules="[rules.required, rules.numeric, rules.minDigits]" :error-messages="formErrors.student_code"/>
      </v-col>

      <!-- Estado -->
      <v-col cols="12" sm="4">
        <v-select
          v-model="form.status_id"
          :items="statusOptions"
          item-title="name"
          item-value="id"
          label="Estado"
          outlined
          dense
          :rules="[rules.required]"
        />
      </v-col>

      <!-- Leguaje -->
      <v-col cols="12" sm="4">
        <v-select
          v-model="form.language_id"
          :items="languages"
          item-title="name"
          item-value="id"
          label="Idioma"
          outlined
          dense
          :rules="[rules.required]"
        />
      </v-col>

      <!-- Nivel -->
      <v-col cols="12" sm="6">
        <v-select
          v-model="form.level_id"
          :items="levels"
          item-title="name"
          item-value="id"
          label="Nivel"
          outlined
          dense
          @update:modelValue="handleLevelChange"
          :rules="[rules.required]"
        />
      </v-col>

      <!-- Unidad (filtrada por nivel) -->
      <v-col cols="12" sm="6">
        <v-select
          v-model="form.unit_id"
          :items="filteredUnits"
          item-title="name"
          item-value="id"
          label="Unidad"
          outlined
          dense
          :disabled="!form.level_id"
          :rules="[rules.required]"
        />
      </v-col>

      <!-- Contrato -->
      <v-col cols="12" sm="6">
        <v-select
          v-model="form.contract_id"
          :items="contractOptions"
          item-title="name"
          item-value="id"
          label="Tipo de contrato"
          outlined
          dense
          :rules="[rules.required]"
        />
      </v-col>

      <!-- Fecha inicio -->
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="form.start_date"
          label="Fecha de inicio"
          type="date"
          outlined
          dense
          :rules="[rules.required, rules.date]"
        />
      </v-col>
    </v-row>

    <v-row justify="end" class="mt-2">
      <v-btn color="grey" variant="tonal" class="mr-2" @click="$emit('cancel')">
        Cancelar
      </v-btn>
      <v-btn color="green" @click="showModal = true">
        Guardar
      </v-btn>
    </v-row>
    </v-form>

    <ModalComponent
      v-model="showModal"
      title="Confirmar guardado"
      message="¿Deseas guardar los datos extendidos?"
      @confirm="save"
    />

    <v-snackbar v-model="snackbar" :color="snackbarColor" location="top end" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import ModalComponent from '@/components/ModalComponent.vue'
import StudentExtendedService from '@/services/StudentExtendedService'
import StatusService from '@/services/StatusService'
import UnitService from '@/services/UnitService'
import ContractService from '@/services/ContractService'
import LevelService from '@/services/LevelService'
import LanguageService from '@/services/LanguageService'

const props = defineProps<{
  userId: number
}>()

const emit = defineEmits(['saved', 'cancel'])

const form = ref({
  student_code: '',
  status_id: null,
  unit_id: null,
  contract_id: null,
  start_date: '',
  level_id: null,
  language_id: null,
})

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  date: (v: any) => !!v && !isNaN(Date.parse(v)) || 'Fecha inválida',
  numeric: (v: any) =>
    /^\d+$/.test(v) || 'Solo se permiten números',

  minDigits: (v: any) =>
    String(v).length >= 4 || 'Debe tener al menos 4 cifras numéricas',
}

const statusOptions = ref([])
const unitOptions = ref([])
const contractOptions = ref([])
const languages = ref([])
const levels = ref([])
const units = ref([])
const filteredUnits = ref([])

const formErrors = ref<{ [key: string]: string }>({})
const snackbarColor = ref('success')
const showModal = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')

// --- Cargar datos iniciales ---
const loadOptions = async () => {
  statusOptions.value = await StatusService.getAll()
  unitOptions.value = await UnitService.getAll()
  contractOptions.value = await ContractService.getAll()
  levels.value = await LevelService.getAll()
  units.value = await UnitService.getAll()
  languages.value = await LanguageService.getAll()
}

const loadData = async () => {
  try {
    const data = await StudentExtendedService.getByUserId(props.userId)
    form.value = {
      student_code: data.student_code,
      status_id: data.status.id,
      unit_id: data.unit.id,
      contract_id: data.contract.id,
      start_date: data.start_date,
      level_id: data.level.id,
      language_id: data.language?.id ?? null,
    }

    // Llenar unidades disponibles tras cargar nivel
    handleLevelChange(data.level.id)
    form.value.unit_id = data.unit.id
  } catch (error) {
    // Si no hay datos previos, mantenemos campos vacíos (modo creación)
  }
}

// --- Guardar ---
const formRef = ref()

const save = async () => {
  formErrors.value = {} // limpiar errores previos
  const isValid = await formRef.value?.validate()
  if (!isValid) {
    snackbarText.value = 'Por favor completa los campos requeridos.'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }

  try {
    const payload = { ...form.value } as Partial<typeof form.value>
    delete payload.level_id

    await StudentExtendedService.saveByUserId(props.userId, payload)
    snackbarText.value = 'Datos guardados correctamente'
    snackbarColor.value = 'success'
    snackbar.value = true
    emit('saved')
  } catch (error: any) {
    console.error(error)

    // Error específico de duplicado
    if (error.message?.includes('Duplicate entry')) {
      formErrors.value.student_code = 'Este código ya está en uso'
    }

    snackbarText.value = 'Error al guardar datos'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

// Logica del filtro
function handleLevelChange(levelId: number | null) {
  form.value.unit_id = null
  filteredUnits.value = units.value.filter((u: any) => u.levelId === levelId)
}

// --- Inicializar al montar o cuando cambia el usuario ---
watch(() => props.userId, async () => {
  if (props.userId) {
    await loadOptions()
    await loadData()
  }
})

onMounted(async () => {
  if (props.userId) {
    await loadOptions()
    await loadData()
  }
})
</script>
