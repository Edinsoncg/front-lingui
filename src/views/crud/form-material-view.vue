//src/views/crud_material/form-material-view.vue

<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          label="Nombre"
          v-model="form.name"
          :rules="[rules.required, rules.minName, rules.maxName]"
          :error-messages="errors.name"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="form.level_id"
          :items="levels"
          item-title="name"
          item-value="id"
          label="Nivel"
          :rules="[rules.required]"
          :error-messages="errors.level_id"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Link"
          v-model="form.link"
          :rules="[rules.required, rules.url]"
          :error-messages="errors.link"
          placeholder="https://example.com"
        />
      </v-col>
      <v-col cols="12" md="12">
        <v-textarea
          label="Descripción"
          v-model="form.description"
          :rules="[rules.required, rules.minDesc]"
          :error-messages="errors.description"
        />
      </v-col>
    </v-row>
    <div>
      <v-btn
        color="primary"
        style="margin-right:10px ;"
        :disabled="!formIsValid || loading"
        @click="checkFormBeforeConfirm"
        :loading="loading">
          Guardar
      </v-btn>

      <v-btn @click="$emit('cancel')">Cancelar</v-btn>
    </div>
    <!-- Modal de confirmación -->
    <ConfirmDialog
      v-model="confirmDialog"
      :title="modalTitle"
      :message="modalMessage"
      @confirm="submit"
      @cancel="confirmDialog = false"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import LevelService from '@/services/LevelService'
import SupportMaterialService from '@/services/SupportMaterialService'
import ConfirmDialog from '@/components/ModalComponent.vue'

// Interfaces y Tipos
interface SupportMaterialForm {
  id?: number
  name: string
  level_id: number | undefined
  link: string
  description: string
}
interface Level {
  id: number
  name: string
}

// props y emits
const props = defineProps<{
  mode: 'create' | 'update',
  initialData?: Partial<SupportMaterialForm>
}>()
const emit = defineEmits(['saved', 'cancel'])

// Variables Computadas
const modalTitle = computed(() =>
  props.mode === 'create' ? 'Crear Material' : 'Actualizar Material'
)
const modalMessage = computed(() =>
  props.mode === 'create'
    ? '¿Está seguro de que desea crear el material?'
    : '¿Está seguro de que desea actualizar el material?'
)

// Refs y Estado Reactivo
const form = ref<SupportMaterialForm>({
  name: '',
  level_id: undefined,
  link: '',
  description: ''
})
const levels = ref<Level[]>([])
const loading = ref(false)
const confirmDialog = ref(false)
const formRef = ref()
const formIsValid = ref(false)

const errors = ref<Record<string, string[]>>({
  name: [],
  level_id: [],
  link: [],
  description: [],
})

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  minName: (v: string) => v.length >= 3 || 'Mínimo 3 caracteres',
  maxName: (v: string) => v.length <= 100 || 'Máximo 100 caracteres',
  minDesc: (v: string) => v.length >= 5 || 'Mínimo 5 caracteres',
  url: (v: string) => {
    const pattern = /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i
    return pattern.test(v) || 'Debe ser una URL válida'
  }
}

// Watcher
watch(() => props.initialData, (data) => {
  if (props.mode === 'update' && data) {
    form.value = {
      id: data.id ?? undefined,
      name: data.name ?? '',
      level_id: data.level_id ?? undefined,
      link: data.link ?? '',
      description: data.description ?? ''
    }
  }
}, { immediate: true })

// Ciclo de Vida
onMounted(async () => {
  try {
    levels.value = await LevelService.getAll()
    console.log('NIVELES CARGADOS', levels.value)
  } catch (error) {
    console.error('Error while loading levels:', error)
  }
})

// Validación antes de mostrar modal
function checkFormBeforeConfirm() {
  formRef.value?.validate().then((isValid: boolean) => {
    if (isValid) {
      confirmDialog.value = true
    }
  })
}

// Métodos
async function submit() {
  confirmDialog.value = false
  loading.value = true

  try {
    if (props.mode === 'create') {
      await SupportMaterialService.create({
        ...form.value,
        level_id: form.value.level_id as number
      })
    } else if (props.mode === 'update' && form.value.id) {
      await SupportMaterialService.update(form.value.id, {
        name: form.value.name,
        level_id: form.value.level_id,
        link: form.value.link,
        description: form.value.description
      })
    }

    emit('saved')

    form.value = {
      name: '',
      level_id: undefined,
      link: '',
      description: ''
    }
  } catch (e) {
    console.error('Error al guardar el material:', e)
  } finally {
    loading.value = false
  }
}
</script>
