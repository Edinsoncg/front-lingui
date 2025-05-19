<script setup lang="ts">
import LogoComponent from '../LogoComponent.vue'
import TopFooterComponent from '../TopFooterComponent.vue'
import UserComponent from '../UserComponent.vue'
</script>

<template>
  <v-app-bar
    app
    flat
    color="deep-purple-lighten-4"
    density="prominent"
  >  <!-- el density da el tamaño de header (prominent > default> comfortable > compact)-->

    <!-- Logo a la izquierda -->
    <LogoComponent class="logo mr-4" />

    <!-- Contenido centrado (si aplica) -->
    <TopFooterComponent class="d-none d-md-flex" />

    <!-- Usuario a la derecha -->
    <v-spacer />
    <UserComponent />
  </v-app-bar>
</template>

<style scoped>
.logo {
  height: 125px;
  width: auto;
  padding: 15px;
}
</style>
