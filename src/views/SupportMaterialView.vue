//src/views/SupportMaterialView.vue

<template>
  <div class="pa-4">
    <!-- Botón reutilizable para crear -->
    <CreateButtonComponent
      resource="material"
      label="Material"
      @open="openCreateForm"
    />

    <transition name="fade">
      <component
        v-if="showForm"
        :is="MaterialForm"
        mode="create"
        @saved="onSaved"
        @cancel="showForm = false"
    />
    </transition>

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
    <template v-slot:tfoot>
      <tr>
        <td>
        <v-text-field
          v-model="searchName"
          class="ma-2"
          density="compact"
          placeholder="Buscar por nombre"
          hide-details
          color="purple"
        />
      </td>
    </tr>
      </template>

      <template #item.level="{ item }">
        {{ item.level?.name }}
      </template>

      <template #item.link="{ item }">
        <a :href="item.link" target="_blank">{{ item.link }}</a>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineAsyncComponent, } from 'vue'
import SupportMaterialService from '@/services/SupportMaterialService'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'

// FORMULARIO
const showForm = ref(false)

function openCreateForm(){
  showForm.value = true
}

const MaterialForm = defineAsyncComponent(() =>
  import('@/views/crud_material/create-material-view.vue')
)


//TABLA

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

function onSaved() {
  showForm.value = false
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
    console.error('An error has ocurred while loading the materials', error)
  } finally {
    loading.value = false
  }
}

// Buscar por nombre
watch(searchName, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})
</script>
