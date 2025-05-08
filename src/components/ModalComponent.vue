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
import { computed, ref, watch, onMounted } from 'vue'
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

const currentComponent = computed(() =>
  `${props.resource}-${props.mode}-view`
)

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
