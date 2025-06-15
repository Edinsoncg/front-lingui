<template>
  <v-row dense>
    <v-col cols="12" md="4">
      <v-text-field
        v-model="localFilters.code"
        label="Buscar por código"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field
        v-model="localFilters.name"
        label="Buscar por nombre"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
      />
    </v-col>
    <v-col cols="12" md="4" class="d-flex align-center">
      <v-btn color="primary" @click="emitSearch">Buscar</v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
const emit = defineEmits<{
  (e: 'search', payload: { code: string; name: string }): void
}>()

const props = defineProps<{
  modelValue: { code: string; name: string }
}>()

const localFilters = reactive({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
  Object.assign(localFilters, newVal)
})

function emitSearch() {
  emit('search', { ...localFilters })
}
</script>
