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

    <LogoComponent class="logo mr-4" />

    <TopFooterComponent class="d-none d-md-flex" />

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
