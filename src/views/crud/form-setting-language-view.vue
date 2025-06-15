<template>
  <v-card flat class="pa-4" color="#f4eafd">
    <v-form @submit.prevent="handleSubmit" ref="formRef">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.name"
            label="Nombre"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            color="purple"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.abbreviation"
            label="Abreviación"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            color="purple"
          />
        </v-col>
      </v-row>

      <v-row justify="end" class="mt-2">
        <v-btn color="grey-darken-1" variant="text" @click="$emit('cancel')">
          Cancelar
        </v-btn>
        <v-btn color="purple" class="ml-2" type="submit">
          Guardar
        </v-btn>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import LanguageService from '@/services/LanguageService'

const emit = defineEmits(['saved', 'cancel'])
const props = defineProps<{
  mode: 'create' | 'update'
  initialData?: { id?: number; name?: string; abbreviation?: string }
}>()

const form = ref({
  name: '',
  abbreviation: ''
})

const rules = {
  required: (v: string) => !!v || 'Este campo es obligatorio',
}

const formRef = ref()

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value.name = newData.name || ''
      form.value.abbreviation = newData.abbreviation || ''
    } else {
      form.value.name = ''
      form.value.abbreviation = ''
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate()
  if (!isValid) return

  try {
    if (props.mode === 'create') {
      await LanguageService.create(form.value)
    } else if (props.mode === 'update' && props.initialData?.id) {
      await LanguageService.update(props.initialData.id, form.value)
    }

    emit('saved')
  } catch (error) {
    console.error('Error al guardar el idioma:', error)
  }
}
</script>
