<template>
  <v-data-table-server
    :headers="headers"
    :items="classrooms"
    :items-length="total"
    :loading="loading"
    :page="internalPage"
    :items-per-page="internalItemsPerPage"
    item-value="id"
    @update:options="onUpdate"
    class="elevation-2"
  >
    <!-- Resaltado y clic por fila -->
    <template #item="{ item }">
      <tr class="hover-row" @click="emit('view', item.id)">
        <td>{{ item.nombre }}</td>
        <td>{{ item.capacidad }}</td>
        <td>{{ item.house }}</td>
        <td>{{ item.clases_realizadas }}</td>
        <td>{{ item.ultima_clase }}</td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'updateOptions', payload: any): void
  (e: 'view', id: number): void
  (e: 'update:page', value: number): void
  (e: 'update:itemsPerPage', value: number): void
}>()

const props = defineProps<{
  classrooms: any[]
  total: number
  loading: boolean
  page: number
  itemsPerPage: number
}>()

const headers = [
  { title: 'Nombre del salón', key: 'nombre' },
  { title: 'Capacidad', key: 'capacidad' },
  { title: 'House', key: 'house' },
  { title: 'Clases realizadas', key: 'clases_realizadas' },
  { title: 'Última clase', key: 'ultima_clase' },
]

const internalPage = ref(props.page)
const internalItemsPerPage = ref(props.itemsPerPage)

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

<style scoped>
tr.hover-row:hover {
  background-color: #f2e2f1;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
</style>
