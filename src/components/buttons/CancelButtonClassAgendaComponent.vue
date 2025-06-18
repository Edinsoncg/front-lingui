<template>
  <div>
    <v-btn
      color="purple-lighten-2"
      rounded
      variant="flat"
      prepend-icon="mdi-calendar-remove"
      class="text-white font-weight-bold"
      @click="openDialog"
    >
      Cancelar
    </v-btn>

    <ConfirmDialog
      v-model="showDialog"
      :title="`¿Cancelar clase?`"
      :message="`¿Estás seguro de que deseas cancelar esta clase? Esta acción no se puede deshacer.`"
      @confirm="confirmDelete"
      @cancel="showDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from '@/components/ModalComponent.vue'

const props = defineProps<{
  itemId: number
}>()

const emit = defineEmits<{
  (e: 'confirm-cancel', id: number): void
}>()

const showDialog = ref(false)

function openDialog() {
  showDialog.value = true
}

function confirmDelete() {
  emit('confirm-cancel', props.itemId)
  showDialog.value = false
}
</script>
