<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field v-model="form.name" label="Nombre del salón" required />
    <v-text-field v-model="form.capacity" label="Capacidad" type="number" required />
    <v-select
      v-model="form.house_id"
      :items="houses"
      label="Casa"
      item-value="id"
      item-text="name"
      required
    />
    <v-btn type="submit" color="primary">Guardar</v-btn>
    <v-btn @click="cancel" text>Cancelar</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ClassroomService from '@/services/ClassroomService'

const form = ref({
  name: '',
  capacity: '',
  house_id: null,
})

const houses = ref([])

const props = defineProps({
  mode: String,
  initialData: Object,
})

const emit = defineEmits(['saved', 'cancel'])

onMounted(() => {
  if (props.mode === 'update' && props.initialData) {
    form.value = { ...props.initialData }
  }
  // Cargar las casas disponibles
  loadHouses()
})

const loadHouses = async () => {
  const response = await fetch('http://localhost:3333/settings/houses')
  const data = await response.json()
  houses.value = data
}

const onSubmit = async () => {
  if (props.mode === 'create') {
    await ClassroomService.create(form.value)
  } else {
    await ClassroomService.update(props.initialData.id, form.value)
  }
  emit('saved')
}

const cancel = () => {
  emit('cancel')
}
</script>
