<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field v-model="form.name" label="Nombre del salón" required />
    <v-text-field v-model="form.capacity" label="Capacidad" type="number" required />

    <!-- Cargamos las casas con el servicio HouseService -->
    <v-select
      v-model="form.house_id"
      :items="houses"
      label="Casa"
      item-title="name"
      item-value="id"
      required
    />

    <v-btn type="submit" color="primary">Guardar</v-btn>
    <v-btn @click="cancel" text>Cancelar</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HouseService from '@/services/HouseService' // Usamos HouseService solo para cargar las casas
import ClassroomService from '@/services/ClassroomService' // Usamos ClassroomService para el CRUD de salones

const form = ref({
  name: '',
  capacity: '',
  house_id: null,
})

const houses = ref([]) // Para almacenar las casas

const props = defineProps({
  mode: String, // Modo: 'create' o 'update'
  initialData: Object, // Datos iniciales para editar
})

const emit = defineEmits(['saved', 'cancel'])

onMounted(() => {
  // Si estamos en modo actualización, cargamos los datos existentes
  if (props.mode === 'update' && props.initialData) {
    form.value = { ...props.initialData }
  }

  // Cargamos las casas disponibles
  loadHouses()
})

const loadHouses = async () => {
  try {
    const { items } = await HouseService.getPaginated({ page: 1, itemsPerPage: 100 })
    houses.value = items // Asignamos las casas al select
  } catch (error) {
    console.error('Error al cargar las casas', error)
  }
}

// Función que se ejecuta al enviar el formulario
const onSubmit = async () => {
  if (props.mode === 'create') {
    // Usamos ClassroomService para crear el salón
    await ClassroomService.create(form.value)
  } else {
    // Usamos ClassroomService para actualizar el salón
    await ClassroomService.update(props.initialData.id, form.value)
  }
  emit('saved') // Emitimos el evento 'saved' al componente padre
}

const cancel = () => {
  emit('cancel') // Emitimos el evento 'cancel' al componente padre
}
</script>
