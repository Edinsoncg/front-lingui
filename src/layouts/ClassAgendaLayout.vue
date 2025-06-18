<template>
  <v-responsive class="border rounded" max-height="89vh">
    <v-app >
      <Header />
      <Sidebar />

        <!-- Contenido principal -->
        <v-main>
          <v-container class="scrollable-main">
            <router-view />
          </v-container>
        </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import Sidebar from '@/components/SideBarAgendaComponent.vue'
import Header from '@/components/HeaderAgendaComponent.vue'
</script>

<style scoped>
.scrollable-main {
  overflow-y: auto;
  max-height: calc(85vh - 64px); /* Ajustar según altura del Header */
}
</style>
