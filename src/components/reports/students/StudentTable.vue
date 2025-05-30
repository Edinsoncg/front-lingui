<template>
  <v-data-table-server
    :headers="headers"
    :items="students"
    :items-length="total"
    :loading="loading"
    :page="internalPage"
    :items-per-page="internalItemsPerPage"
    item-value="codigo"
    @update:options="onUpdate"
    class="elevation-2"
  >
    <template #item.codigo="{ item }">
      <v-btn variant="text" @click="emit('view', item.codigo)">
        {{ item.codigo }}
      </v-btn>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'updateOptions', payload: any): void
  (e: 'view', codigo: string): void
  (e: 'update:page', value: number): void
  (e: 'update:itemsPerPage', value: number): void
}>()

const props = defineProps<{
  students: any[]
  total: number
  loading: boolean
  page: number
  itemsPerPage: number
}>()

const headers = [
  { title: 'Código', key: 'codigo' },
  { title: 'Nombres', key: 'nombre' },
  { title: 'Apellidos', key: 'apellido' },
  { title: 'Nivel actual', key: 'nivel' },
  { title: 'Idioma', key: 'idioma' },
  { title: 'Estado', key: 'estado' },
  { title: 'Tipo de contrato', key: 'tipo_contrato' },
]

const internalPage = ref(props.page)
const internalItemsPerPage = ref(props.itemsPerPage)

// Sincroniza props externas con valores internos
watch(() => props.page, (val) => internalPage.value = val)
watch(() => props.itemsPerPage, (val) => internalItemsPerPage.value = val)

function onUpdate(options: any) {
  emit('updateOptions', options)

  if (options.page !== undefined) {
    internalPage.value = options.page
    emit('update:page', options.page)
  }

  if (options.itemsPerPage !== undefined) {
    internalItemsPerPage.value = options.itemsPerPage
    emit('update:itemsPerPage', options.itemsPerPage)
  }
}
</script>
