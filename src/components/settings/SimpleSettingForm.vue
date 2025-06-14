<template>
  <v-form @submit.prevent="onSubmit">
    <v-row>
      <v-col cols="12" v-for="field in fields" :key="field.key">
        <v-text-field
          v-model="form[field.key]"
          :label="field.label"
          :type="field.type || 'text'"
          :required="field.required !== false"
        />
      </v-col>
    </v-row>

    <v-btn type="submit" color="primary">Guardar</v-btn>
    <v-btn @click="$emit('cancel')" text>Cancelar</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, watch, toRefs } from 'vue'

const props = defineProps<{
  mode: 'create' | 'update'
  initialData?: Record<string, any>
  fields: { key: string; label: string; type?: string; required?: boolean }[]
  onSave: (data: Record<string, any>) => Promise<void>
}>()

const emit = defineEmits(['saved', 'cancel'])

const form = reactive<Record<string, any>>({})

// Rellenar el formulario si hay datos iniciales
watch(
  () => props.initialData,
  (newVal) => {
    props.fields.forEach(({ key }) => {
      form[key] = newVal?.[key] ?? ''
    })
  },
  { immediate: true }
)

const onSubmit = async () => {
  try {
    await props.onSave({ ...form })
    emit('saved')
  } catch (error) {
    alert('Ocurrió un error al guardar. Revisa los datos e inténtalo de nuevo.')
    console.error(error)
  }
}

</script>
