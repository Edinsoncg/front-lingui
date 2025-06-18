<template>
  <div>
    <v-btn icon size="small" color="warning" @click="openDialog">
      <v-icon size="small">mdi-delete</v-icon>
    </v-btn>

    <ConfirmDialog
      v-model="showDialog"
      :title="`¿Inactivar ${resource}?`"
      :message="`¿Estás seguro de que deseas Inactivar este ${resource}?`"
      @confirm="inactivated"
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
  (e: 'confirm-inactive', item: { id: number }): void
}>()

const showDialog = ref(false)

function openDialog() {
  showDialog.value = true
}

function inactivated() {
  emit('confirm-inactive', props.item)
  showDialog.value = false
}
</script>
