//src/components/buttons/CreateButtonComponent.vue

<template>
  <div>
    <v-btn color="primary" @click="openModal">
      Crear {{ label }}
    </v-btn>

    <ModalCrudComponent
      v-if="showModal"
      :mode="'create'"
      :resource="resource"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalCrudComponent from '@/components/ModalComponent.vue'

function handleSaved() {
  emit('saved')
  closeModal()
}

const props = defineProps<{
  resource: string
  label?: string
}>()

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const showModal = ref(false)

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}
</script>
