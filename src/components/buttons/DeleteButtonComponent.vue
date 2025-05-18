<!-- src/components/buttons/DeleteButtonComponent.vue -->
<template>
  <div>
    <v-btn icon size="small" color="error" @click="openDialog">
      <v-icon size="small">mdi-delete</v-icon>
    </v-btn>

    <ConfirmDialog
      v-model="showDialog"
      title="¿Eliminar material?"
      :message="`¿Estás seguro de que deseas eliminar el material '${item.name}'?`"
      @confirm="confirmDelete"
      @cancel="showDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from '@/components/ModalComponent.vue'
import SupportMaterialService from '@/services/SupportMaterialService'

const props = defineProps<{
  item: {
    id: number
    name: string
  }
}>()

const emit = defineEmits<{
  (e: 'deleted'): void
}>()

const showDialog = ref(false)

function openDialog() {
  showDialog.value = true
}

async function confirmDelete() {
  try {
    await SupportMaterialService.delete(props.item.id)
    emit('deleted')
  } catch (error) {
    console.error('Error al eliminar material:', error)
  } finally {
    showDialog.value = false
  }
}
</script>
