<template>
  <div class="pa-4">
    <!-- Botón reutilizable para crear -->
    <CreateButtonComponent
      resource="material"
      label="Material"
      @open="openCreateModal"
    />

    <!-- Tabla paginada con búsqueda -->
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      item-value="id"
      @update:options="loadItems"
    >
      <template #top>
        <v-text-field
          v-model="searchName"
          label="Buscar por nombre"
          class="ma-2"
          clearable
          hide-details
        />
      </template>

      <template #item.level="{ item }">
        {{ item.level?.name }}
      </template>

      <template #item.link="{ item }">
        <a :href="item.link" target="_blank">{{ item.link }}</a>
      </template>
    </v-data-table-server>

    <!-- Modal para crear material -->
    <v-dialog v-model="showCreateModal" max-width="600px" persistent>
      <v-card>
        <v-card-title>Crear Material</v-card-title>
        <v-card-text>
          <CreateSupportMaterialView @saved="onSaved" @cancel="closeCreateModal" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SupportMaterialService from '@/services/SupportMaterialService'
import CreateSupportMaterialView from '@/views/crud_support_material/CreateSupportMaterialView.vue'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'

const itemsPerPage = ref(5)
const headers = ref([
  { title: 'Nombre', key: 'name' },
  { title: 'Nivel', key: 'level.name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Link', key: 'link' }
])

const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(false)

const searchName = ref('')
const lastOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })

// Modal
const showCreateModal = ref(false)
function openCreateModal() {
  showCreateModal.value = true
}
function closeCreateModal() {
  showCreateModal.value = false
}
function onSaved() {
  closeCreateModal()
  loadItems(lastOptions.value)
}

// Cargar items desde el servicio con filtros
async function loadItems(options: any) {
  loading.value = true
  lastOptions.value = options
  try {
    const { items, total } = await SupportMaterialService.getPaginated({
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      sortBy: options.sortBy ?? [],
      search: { name: searchName.value }
    })
    serverItems.value = items
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar materiales:', error)
  } finally {
    loading.value = false
  }
}

// Buscar por nombre
watch(searchName, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})
</script>
