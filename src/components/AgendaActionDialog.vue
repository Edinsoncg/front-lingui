<!-- src/components/agenda/AgendaActionDialog.vue -->

<template>
  <v-dialog v-model="isOpen" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        Acciones para la celda
      </v-card-title>

      <v-card-subtitle>
        <v-row class="mb-2">
          <v-col cols="6">
            Aula: <strong>{{ roomName }}</strong> <br>
            Hora: <strong>{{ hour }} - {{ props.endHour || '...' }}</strong> <br>
            Fecha: <strong>{{ date }}</strong> <br>
            Tipo de clase: <strong>{{ props.classType || 'N/A' }}</strong> <br>
          </v-col>
          <v-col cols="6">
            Idioma: <strong>{{ props.language || 'N/A' }}</strong> <br>
            Nivel: <strong>{{ props.level || 'N/A' }}</strong> <br>
            Unidad: <strong>{{ props.unit || 'N/A' }}</strong>
          </v-col>
        </v-row>
      </v-card-subtitle>

      <v-card-actions class="d-flex flex-column align-start pa-4">
        <v-btn color="green" variant="flat" block @click="emitAction(hasClass ? 'enroll' : 'create')">
          {{ hasClass ? 'Programar estudiante' : 'Crear clase' }}
        </v-btn>

        <v-btn color="blue" variant="flat" block @click="emitAction('view')">
          Ver clase
        </v-btn>
      </v-card-actions>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="isOpen = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
  roomName: string
  roomId: number
  hour: string
  date: string
  classType?: string
  language?: string
  level?: string
  unit?: string
  endHour?: string
  hasClass?: boolean
  sessionId?: number // <-- NUEVO
}>()


const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'action', value: {
    type: 'create' | 'view' | 'delete' | 'enroll'
    roomId: number
    hour: string
    date: string
    endHour?: string
    classType?: string
    language?: string
    level?: string
    unit?: string
  }): void
}>()

function emitAction(type: 'create' | 'view' | 'delete' | 'enroll') {
  emit('action', {
    type,
    roomId: props.roomId,
    hour: props.hour,
    date: props.date,
    endHour: props.endHour,
    classType: props.classType,
    language: props.language,
    level: props.level,
    unit: props.unit,
    sessionId: props.sessionId // <-- AÑADIDO
  })
  isOpen.value = false
}
const isOpen = ref(props.modelValue)

watch(() => props.modelValue, val => isOpen.value = val)
watch(isOpen, val => emit('update:modelValue', val))
</script>
