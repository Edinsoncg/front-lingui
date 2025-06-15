<template>
  <v-card flat class="pa-4" color="#f4eafd">
    <v-form ref="formRef" v-model="formIsValid">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.name"
            label="Nombre"
            :rules="[rules.required, rules.minLength]"
            :error-messages="errors.name"
            variant="outlined"
            density="comfortable"
            color="purple"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.abbreviation"
            label="Abreviación"
            :rules="[rules.required, rules.maxLength]"
            :error-messages="errors.abbreviation"
            variant="outlined"
            density="comfortable"
            color="purple"
          />
        </v-col>
      </v-row>

      <v-row justify="end" class="mt-2">
        <v-btn color="grey-darken-1" variant="text" @click="$emit('cancel')">Cancelar</v-btn>
        <v-btn color="purple" class="ml-2" :disabled="!formIsValid || loading" :loading="loading" @click="checkFormBeforeConfirm">Guardar</v-btn>
      </v-row>

      <!-- Modal de confirmación -->
      <ConfirmDialog
        v-model="confirmDialog"
        :title="modalTitle"
        :message="modalMessage"
        @confirm="submit"
        @cancel="confirmDialog = false"
      />
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import LanguageService from '@/services/LanguageService'
import ConfirmDialog from '@/components/ModalComponent.vue'

const props = defineProps<{
  mode: 'create' | 'update'
  initialData?: { id?: number; name?: string; abbreviation?: string }
}>()
const emit = defineEmits(['saved', 'cancel'])

const form = ref({
  id: undefined,
  name: '',
  abbreviation: ''
})
const formRef = ref()
const formIsValid = ref(false)
const confirmDialog = ref(false)
const loading = ref(false)

const errors = ref<Record<string, string[]>>({
  name: [],
  abbreviation: []
})

const rules = {
  required: (v: string) => !!v || 'Este campo es obligatorio',
  minLength: (v: string) => v.length >= 2 || 'Mínimo 2 caracteres',
  maxLength: (v: string) => v.length <= 10 || 'Máximo 10 caracteres'
}

const modalTitle = computed(() =>
  props.mode === 'create' ? 'Crear Idioma' : 'Actualizar Idioma'
)
const modalMessage = computed(() =>
  props.mode === 'create'
    ? '¿Desea crear este idioma?'
    : '¿Desea actualizar este idioma?'
)

watch(
  () => props.initialData,
  (newData) => {
    form.value = {
      id: newData?.id ?? undefined,
      name: newData?.name ?? '',
      abbreviation: newData?.abbreviation ?? ''
    }
  },
  { immediate: true }
)

function checkFormBeforeConfirm() {
  formRef.value?.validate().then((valid: boolean) => {
    if (valid) confirmDialog.value = true
  })
}

async function submit() {
  confirmDialog.value = false
  loading.value = true
  try {
    if (props.mode === 'create') {
      await LanguageService.create(form.value)
    } else if (props.mode === 'update' && form.value.id) {
      await LanguageService.update(form.value.id, {
        name: form.value.name,
        abbreviation: form.value.abbreviation
      })
    }
    emit('saved')
  } catch (error) {
    console.error('Error guardando idioma:', error)
  } finally {
    loading.value = false
  }
}
</script>
