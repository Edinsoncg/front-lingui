<script setup lang="ts">
import { authSetStore } from '@/stores/AuthStore'

const authStore = authSetStore()
const userName = authStore.user?.name || 'Usuario'
</script>

<template>
  <footer class="top-footer">
    <div class="user-greeting">
      Hola {{ userName }}
    </div>
  </footer>
</template>

<style scoped>
.top-footer {
  color: #000000;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center
}

.user-greeting {
  font-size: 2.1rem;
  text-align: center;
  font-family: Roboto, sans-serif;
}
</style>
