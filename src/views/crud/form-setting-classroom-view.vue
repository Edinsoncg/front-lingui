<template>
  <v-card flat class="pa-4" color="#f4eafd">
    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-row>
        <!-- Nombre del salón -->
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="form.name"
            label="Nombre del salón"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            color="purple"
          />
        </v-col>

        <!-- Capacidad -->
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="form.capacity"
            label="Capacidad"
            type="number"
            :rules="[rules.required, rules.number]"
            variant="outlined"
            density="comfortable"
            color="purple"
          />
        </v-col>

        <!-- Casa -->
        <v-col cols="12" sm="4">
          <v-select
            v-model="form.house_id"
            :items="houses"
            label="Casa"
            item-title="name"
            item-value="id"
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
import { ref, onMounted, watch } from 'vue'
import HouseService from '@/services/HouseService'
import ClassroomService from '@/services/ClassroomService'

const props = defineProps({
  mode: { type: String, required: true },
  initialData: Object
})

const emit = defineEmits(['saved', 'cancel'])

const form = ref({
  name: '',
  capacity: '',
  house_id: null,
})

const formRef = ref()
const houses = ref([])

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  number: (v: any) => (!isNaN(v) && Number(v) > 0) || 'Debe ser un número válido',
}

onMounted(() => {
  loadHouses()
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = { ...newData }
    } else {
      form.value = { name: '', capacity: '', house_id: null }
    }
  },
  { immediate: true }
)

async function loadHouses() {
  try {
    const { items } = await HouseService.getPaginated({ page: 1, itemsPerPage: 100 })
    houses.value = items
  } catch (error) {
    console.error('Error al cargar casas:', error)
  }
}

async function handleSubmit() {
  const isValid = await formRef.value?.validate()
  if (!isValid) return

  if (props.mode === 'create') {
    await ClassroomService.create(form.value)
  } else {
    await ClassroomService.update(props.initialData.id, form.value)
  }

  emit('saved')
}
</script>
