//src/views/crud_material/create-material-view.vue

<template>
  <div>
    <v-text-field label="Nombre" v-model="form.name" />
    <v-select
      v-model="form.level_id"
      :items="levels"
      item-title="name"
      item-value="id"
      label="Nivel"
    />
    <v-text-field label="Link" v-model="form.link" />
    <v-textarea label="Descripción" v-model="form.description" />
    <v-btn color="primary" @click="submit" :loading="loading">Guardar</v-btn>
    <v-btn @click="$emit('cancel')">Cancelar</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LevelService from '@/services/LevelService'
import SupportMaterialService from '@/services/SupportMaterialService'

// ✅ Interfaz para tipar el formulario
interface SupportMaterialForm {
  name: string
  level_id: number | undefined
  link: string
  description: string
}

interface Level {
  id: number
  name: string
}

const emit = defineEmits(['saved', 'cancel'])

const form = ref<SupportMaterialForm>({
  name: '',
  level_id: undefined,
  link: '',
  description: ''
})

const levels = ref<Level[]>([])
const loading = ref(false)

onMounted(async () => {
  try {
    levels.value = await LevelService.getAll()
    console.log('NIVELES CARGADOS', levels.value)
  } catch (error) {
    console.error('Error while loading levels:', error)
  }
})

async function submit() {
  if (!form.value.name?.trim()) {
    alert('The name is required')
    return
  }

  if (form.value.level_id === undefined) {
    alert('The level is required')
    return
  }

  loading.value = true
  try {
    await SupportMaterialService.create({
      name: form.value.name,
      level_id: form.value.level_id,
      link: form.value.link,
      description: form.value.description
    })
    emit('saved')

    form.value = {
      name: '',
      level_id: undefined,
      link: '',
      description: ''
    }

  } catch (e) {
    console.error('An error has ocurred while creating material:', e)
  } finally {
    loading.value = false
  }
}
</script>
