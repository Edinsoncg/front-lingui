<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from './layouts/AuthLayout.vue'
import WireframeLayout from './layouts/WireframeLayout.vue'

const route = useRoute()
const layouts = { AuthLayout, WireframeLayout }
const layout = computed(() => layouts[(route.meta.layout as keyof typeof layouts)] || AuthLayout)
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  width: 100%;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: flex;
  place-items: center;
  margin: 0 auto 2rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8e9f8;
  text-align: center;
  width: 100%;
}
</style>
