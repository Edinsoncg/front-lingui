<template>
  <form @submit.prevent="submit">
    <input v-model="form.name" placeholder="Nombre" />
    <input v-model.number="form.level" type="number" placeholder="Nivel" />
    <input v-model="form.link" placeholder="Link" />
    <textarea v-model="form.description" placeholder="Descripción"></textarea>
    <button type="submit">Guardar</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SupportMaterialService from '@/services/SupportMaterialService'

const emit = defineEmits(['saved', 'close'])

const form = ref({
  name: '',
  level: '',
  description: '',
  link: ''
})

const submit = async () => {
  await SupportMaterialService.create(form.value)
  emit('saved')
  emit('close')
}
</script>
