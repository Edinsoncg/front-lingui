<script setup lang="ts">
import SidebarWireframeComponent from '@/components/wireframe/SidebarWireframeComponent.vue';
import HeaderWireframeComponent from '@/components/wireframe/HeaderWireframeComponent.vue';
</script>

<template>
  <v-app>
    <HeaderWireframeComponent />
    <SidebarWireframeComponent />

      <!-- Contenido principal -->
      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>

  </v-app>
</template>


