<script setup lang="ts">
import SidebarWireframeComponent from '@/components/wireframe/SidebarWireframeComponent.vue'
import HeaderWireframeComponent from '@/components/wireframe/HeaderWireframeComponent.vue'
import { fetchMenu } from '@/stores/UsePermissions'
import { onMounted } from 'vue'

onMounted(() => {
  fetchMenu()
})
</script>

<template>
  <v-app>
    <HeaderWireframeComponent />
    <SidebarWireframeComponent />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
