//src/views/crud_material/create-material-view.vue

<template>
  <div>
    <form>
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

    <v-btn color="primary" @click="confirmDialog = true" :loading="loading">
      Guardar
    </v-btn>

    <v-btn @click="$emit('cancel')">Cancelar</v-btn>

    <!-- Modal de confirmación -->
    <ConfirmDialog
      v-model="confirmDialog"
      title="¿Confirmar guardado?"
      message="¿Deseas guardar este material?"
      @confirm="submit"
      @cancel="confirmDialog = false"
    />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LevelService from '@/services/LevelService'
import SupportMaterialService from '@/services/SupportMaterialService'
import ConfirmDialog from '@/components/ModalComponent.vue'

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
const confirmDialog = ref(false)

onMounted(async () => {
  try {
    levels.value = await LevelService.getAll()
    console.log('NIVELES CARGADOS', levels.value)
  } catch (error) {
    console.error('Error while loading levels:', error)
  }
})

async function submit() {
  confirmDialog.value = false

  if (!form.value.name?.trim()) {
    alert('El nombre es obligatorio')
    return
  }

  if (form.value.level_id === undefined) {
    alert('El nivel es obligatorio')
    return
  }

  loading.value = true
  try {
    await SupportMaterialService.create({ ...form.value, level_id: form.value.level_id as number })
    emit('saved')

    form.value = {
      name: '',
      level_id: undefined,
      link: '',
      description: ''
    }
  } catch (e) {
    console.error('Error al crear el material:', e)
  } finally {
    loading.value = false
  }
}
</script>

