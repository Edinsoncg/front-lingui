<!-- src/views/crud/form-setting-house-view.vue -->
<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-text-field
      label="Nombre"
      v-model="form.name"
      :rules="[rules.required, rules.minLength, rules.maxLength]"
      :error-messages="errors.name"
    />

    <div>
      <v-btn
        color="primary"
        class="mr-2"
        :disabled="!formIsValid || loading"
        @click="checkFormBeforeConfirm"
        :loading="loading"
      >
        Guardar
      </v-btn>
      <v-btn @click="$emit('cancel')">Cancelar</v-btn>
    </div>

    <!-- Confirmación -->
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
import { ref, computed, watch } from 'vue'
import HouseService from '@/services/HouseService'
import ConfirmDialog from '@/components/ModalComponent.vue'

const props = defineProps<{
  mode: 'create' | 'update'
  initialData?: { id?: number; name?: string }
}>()
const emit = defineEmits(['saved', 'cancel'])

const form = ref<{ id?: number; name: string }>({
  name: ''
})

const formRef = ref()
const formIsValid = ref(false)
const loading = ref(false)
const confirmDialog = ref(false)

const errors = ref<{ name: string[] }>({ name: [] })

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  minLength: (v: string) => v.length >= 1 || 'Mínimo 1 carácter',
  maxLength: (v: string) => v.length <= 3 || 'Máximo 3 caracteres',
}

const modalTitle = computed(() =>
  props.mode === 'create' ? 'Crear Casa' : 'Actualizar Casa'
)
const modalMessage = computed(() =>
  props.mode === 'create'
    ? '¿Está seguro de que desea crear esta casa?'
    : '¿Está seguro de que desea actualizar esta casa?'
)

// Rellenar el formulario si es edición
watch(
  () => props.initialData,
  (data) => {
    if (props.mode === 'update' && data) {
      form.value = {
        id: data.id,
        name: data.name || ''
      }
    }
  },
  { immediate: true }
)

function checkFormBeforeConfirm() {
  formRef.value?.validate().then((isValid: boolean) => {
    if (isValid) {
      confirmDialog.value = true
    }
  })
}

async function submit() {
  confirmDialog.value = false
  loading.value = true
  try {
    if (props.mode === 'create') {
      await HouseService.create({ name: form.value.name })
    } else if (props.mode === 'update' && form.value.id) {
      await HouseService.update(form.value.id, { name: form.value.name })
    }
    emit('saved')
    form.value = { name: '' }
  } catch (error: any) {
    console.error('Error al guardar la casa:', error)
    if (error.response?.errors) {
      errors.value.name = error.response.errors.name || []
    }
  } finally {
    loading.value = false
  }
}
</script>
