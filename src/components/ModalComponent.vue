//src/components/ModalComponent.vue

<template>
  <v-dialog v-model="dialog" max-width="700" persistent>
    <v-card>
      <v-card-title class="text-h6">
        {{ titleMap[mode] }} {{ resourceNameCapitalized }}
      </v-card-title>

      <v-card-text>
        <component
          :is="currentComponent"
          v-if="shouldRender"
          :data="fetchedData"
          :mode="mode"
          @saved="handleSaved"
          @cancel="emit('close')"
        />
        <div v-else class="text-center py-6">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, defineAsyncComponent } from 'vue'
import SupportMaterialService from '@/services/SupportMaterialService'

const props = defineProps<{
  mode: 'create' | 'edit' | 'view',
  resource: string,
  id?: number | null
}>()

const emit = defineEmits(['close', 'saved'])

const dialog = ref(true)
const fetchedData = ref<any>(null)
const loading = ref(false)

const titleMap = {
  create: 'Crear',
  edit: 'Editar',
  view: 'Ver',
}

const resourceNameCapitalized = computed(() =>
  props.resource.charAt(0).toUpperCase() + props.resource.slice(1)
)

const currentComponent = computed(() => {
  const folder = `crud_${props.resource}`
  const fileName = `${props.mode}-${props.resource}-view.vue`
  const path = `@/views/${folder}/${fileName}`

  try {
    const filePath = `/src/views/crud_${props.resource}/${props.mode}-${props.resource}-view.vue`
    return defineAsyncComponent(() => import(/* @vite-ignore */
      `/src/views/crud_${props.resource}/${props.mode}-${props.resource}-view.vue`
    ))
  } catch (error) {
    console.error('Error importando el componente dinámico:', path, error)
    return null
  }
})


const shouldRender = computed(() =>
  props.mode === 'create' || (props.id && fetchedData.value)
)

watch(() => props.id, fetchDataIfNeeded, { immediate: true })
watch(() => props.mode, fetchDataIfNeeded, { immediate: true })

async function fetchDataIfNeeded() {
  if (props.mode === 'edit' || props.mode === 'view') {
    if (!props.id) return
    loading.value = true
    try {
      if (props.resource === 'material') {
        fetchedData.value = await SupportMaterialService.getById(props.id)
      }
    } catch (err) {
      console.error('Error al cargar los datos:', err)
    } finally {
      loading.value = false
    }
  } else {
    fetchedData.value = null
  }
}

function handleSaved() {
  emit('saved')
}
</script>
