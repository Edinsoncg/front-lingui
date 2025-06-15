<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center text-center">
    <!-- Imagen de acceso denegado -->
    <img
      src="/src/assets/gui-ortensio.png"
      alt="Mascota acceso denegado"
      class="mb-6"
      style="max-width: 300px;"
    />

    <h1 class="text-h4 font-weight-bold mb-2">¡Acceso denegado!</h1>
    <p class="text-body-1 mb-4">
      Lo siento, no tienes permiso para ver esta sección.
    </p>

    <v-btn color="primary" @click="goBack">
      Volver atrás
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goBack() {
  router.back()
}
</script>

<style scoped>
.mb-6 {
  margin-bottom: 2rem;
}
</style>
