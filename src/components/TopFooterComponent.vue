<script setup lang="ts">
import { authSetStore } from '@/stores/AuthStore'

const authStore = authSetStore()
const userName = authStore.user?.name || 'Usuario'
</script>

<template>
  <footer class="top-footer">
    <div class="user-greeting">
      Bienvenid@, {{ userName }}
    </div>
  </footer>
</template>

<style scoped>
.top-footer {
  color: #000000;
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center
}

.user-greeting {
  font-size: 3.1rem;
  text-align: center;
  font-family: Roboto, sans-serif;
}
</style>
