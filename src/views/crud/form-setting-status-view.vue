<template>
  <v-card flat class="pa-4" color="#f4eafd">
    <v-form ref="formRef" v-model="formIsValid">
      <v-row>
        <!-- Nombre del estado -->
        <v-col cols="12" sm="12">
          <v-text-field
            label="Nombre del estado"
            v-model="form.name"
            :rules="[rules.required, rules.minName, rules.maxName]"
            :error-messages="errors.name"
            variant="outlined"
            density="comfortable"
            color="purple"
          />
        </v-col>
      </v-row>

      <v-row justify="end" class="mt-2">
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="$emit('cancel')"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="purple"
          class="ml-2"
          :disabled="!formIsValid || loading"
          :loading="loading"
          @click="checkFormBeforeConfirm"
        >
          Guardar
        </v-btn>
      </v-row>

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
import StatusService from '@/services/StatusService'
import ConfirmDialog from '@/components/ModalComponent.vue'

interface StatusForm {
  id?: number
  name: string
}

const props = defineProps<{
  mode: 'create' | 'update'
  initialData?: Partial<StatusForm>
}>()

const emit = defineEmits(['saved', 'cancel'])

const modalTitle = computed(() =>
  props.mode === 'create' ? 'Crear Estado' : 'Actualizar Estado'
)
const modalMessage = computed(() =>
  props.mode === 'create'
    ? '¿Está seguro de que desea crear este estado?'
    : '¿Está seguro de que desea actualizar este estado?'
)

const form = ref<StatusForm>({
  name: '',
})

const formRef = ref()
const formIsValid = ref(false)
const loading = ref(false)
const confirmDialog = ref(false)

const errors = ref<Record<string, string[]>>({
  name: [],
})

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  minName: (v: string) => v.length >= 3 || 'Mínimo 3 caracteres',
  maxName: (v: string) => v.length <= 50 || 'Máximo 50 caracteres',
}

watch(
  () => props.initialData,
  (data) => {
    if (props.mode === 'update' && data) {
      form.value = {
        id: data.id ?? undefined,
        name: data.name ?? '',
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
      await StatusService.create({ name: form.value.name })
    } else if (props.mode === 'update' && form.value.id) {
      await StatusService.update(form.value.id, { name: form.value.name })
    }

    emit('saved')
    form.value = { name: '' }
  } catch (e) {
    console.error('Error al guardar estado:', e)
  } finally {
    loading.value = false
  }
}
</script>
