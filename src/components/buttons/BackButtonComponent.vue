<template>
  <v-btn
    variant="text"
    prepend-icon="mdi-arrow-left"
    class="back-btn mb-4"
    @click="router.push(to)"
  >
    Volver
  </v-btn>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  to?: string
}>()
</script>

<style scoped>
.back-btn:hover {
  background-color: #f2e2f1 !important;
}
</style>
