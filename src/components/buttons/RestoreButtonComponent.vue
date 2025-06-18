<template>
  <div>
    <v-btn icon size="small" color="success" @click="openDialog">
      <v-icon size="small">mdi-restore</v-icon>
    </v-btn>

    <ConfirmDialog
      v-model="showDialog"
      :title="`¿Restaurar ${resource}?`"
      :message="`¿Estás seguro de que deseas restaurar este ${resource}?`"
      @confirm="restore"
      @cancel="showDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from '@/components/ModalComponent.vue'

const props = defineProps<{
  item: { id: number }
  resource: string
}>()

const emit = defineEmits<{
  (e: 'confirm-restore', item: { id: number }): void
}>()

const showDialog = ref(false)

function openDialog() {
  showDialog.value = true
}

function restore() {
  emit('confirm-restore', props.item)
  showDialog.value = false
}
</script>
