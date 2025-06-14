<template>
  <v-avatar :size="size" class="mx-auto">
    <v-img
      :src="computedImageUrl"
      :key="imageKey"
      cover
      @error="handleImageError"
    />
  </v-avatar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  imagePath?: string | null
  size?: number | string
}>()

const defaultAvatar = '/default-avatar.png'
const imageKey = ref(Date.now())

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333'

const computedImageUrl = computed(() => {
  if (!props.imagePath) return defaultAvatar

  // Si ya es una URL absoluta (https://), no agregues baseUrl
  if (props.imagePath.startsWith('http')) return props.imagePath

  return `${baseUrl}/${props.imagePath}?t=${imageKey.value}`
})

function handleImageError() {
  imageKey.value = Date.now()
}
</script>
