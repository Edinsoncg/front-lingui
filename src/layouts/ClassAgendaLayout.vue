<template>
  <v-app>
    <Header />
    <Sidebar />

      <!-- Contenido principal -->
      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>

  </v-app>
</template>

<script setup lang="ts">
import Sidebar from '@/components/SideBarAgendaComponent.vue'
import Header from '@/components/HeaderAgendaComponent.vue'
</script>
