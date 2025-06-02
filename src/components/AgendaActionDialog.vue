<!-- src/components/agenda/AgendaActionDialog.vue -->

<template>
  <v-dialog v-model="isOpen" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        Acciones para la celda
      </v-card-title>

      <v-card-subtitle>
        Aula: <strong>{{ roomName }}</strong> <br>
        Hora: <strong>{{ hour }}</strong> <br>
        Fecha: <strong>{{ date }}</strong>
      </v-card-subtitle>

      <v-card-actions class="d-flex flex-column align-start pa-4">
        <v-btn color="green" variant="flat" block @click="emitAction('create')">
          Crear clase
        </v-btn>
        <v-btn color="blue" variant="flat" block @click="emitAction('view')">
          Ver clase
        </v-btn>
        <v-btn color="red" variant="flat" block @click="emitAction('delete')">
          Eliminar clase
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
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'action', value: { type: 'create' | 'view' | 'delete'; roomId: number; hour: string; date: date }): void
}>()

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, val => isOpen.value = val)
watch(isOpen, val => emit('update:modelValue', val))

function emitAction(type: 'create' | 'view' | 'delete') {
  emit('action', {
    type,
    roomId: props.roomId,
    hour: props.hour,
    date: props.date,
  })
  isOpen.value = false
}
</script>
