<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-text-field
      label="Nombre"
      v-model="form.name"
      :rules="[rules.required, rules.min, rules.max]"
      :error-messages="errors.name"
    />
    <v-text-field
      label="Abreviación"
      v-model="form.abbreviation"
      :rules="[rules.required, rules.maxAbbr]"
      :error-messages="errors.abbreviation"
    />

    <div class="mt-2">
      <v-btn
        color="primary"
        :disabled="!formIsValid || loading"
        @click="checkFormBeforeConfirm"
        :loading="loading"
        class="me-2"
      >Guardar</v-btn>

      <v-btn @click="$emit('cancel')">Cancelar</v-btn>
    </div>

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
import { ref, watch, computed } from 'vue'
import ConfirmDialog from '@/components/ModalComponent.vue'
import DocumentTypeService from '@/services/DocumentTypeService'

const props = defineProps<{
  mode: 'create' | 'update',
  initialData?: { id?: number; name: string; abbreviation: string }
}>()

const emit = defineEmits(['saved', 'cancel'])

const form = ref({
  name: '',
  abbreviation: '',
})
const formRef = ref()
const formIsValid = ref(false)
const loading = ref(false)
const confirmDialog = ref(false)

const modalTitle = computed(() =>
  props.mode === 'create' ? 'Crear Tipo de Documento' : 'Actualizar Tipo de Documento'
)
const modalMessage = computed(() =>
  props.mode === 'create'
    ? '¿Deseas crear este tipo de documento?'
    : '¿Deseas actualizar este tipo de documento?'
)

const errors = ref<Record<string, string[]>>({
  name: [],
  abbreviation: [],
})

watch(
  () => props.initialData,
  (data) => {
    if (props.mode === 'update' && data) {
      form.value.name = data.name ?? ''
      form.value.abbreviation = data.abbreviation ?? ''
    }
  },
  { immediate: true }
)

const rules = {
  required: (v: any) => !!v || 'Campo obligatorio',
  min: (v: string) => v.length >= 3 || 'Mínimo 3 caracteres',
  max: (v: string) => v.length <= 50 || 'Máximo 50 caracteres',
  maxAbbr: (v: string) => v.length <= 10 || 'Máximo 10 caracteres',
}

function checkFormBeforeConfirm() {
  formRef.value?.validate().then((isValid: boolean) => {
    if (isValid) confirmDialog.value = true
  })
}

async function submit() {
  loading.value = true
  confirmDialog.value = false
  try {
    if (props.mode === 'create') {
      await DocumentTypeService.create(form.value)
    } else if (props.initialData?.id) {
      await DocumentTypeService.update(props.initialData.id, form.value)
    }
    emit('saved')
    form.value = { name: '', abbreviation: '' }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
