<script setup lang="ts">
import SidebarWireframeComponent from '@/components/wireframe/SidebarWireframeComponent.vue';
import HeaderWireframeComponent from '@/components/wireframe/HeaderWireframeComponent.vue';
</script>

<template>
  <div class="wireframe-container">
    <!-- El Header estará encima del Sidebar -->
    <HeaderWireframeComponent/>
    <div class="content-wrapper">
      <!-- El Sidebar estará al lado del router-view -->
      <SidebarWireframeComponent />
      <div class="main-content">
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wireframe-container {
  display: flex;
  flex-direction: column; /* Coloca el header en la parte superior */
  height: 100vh;
}

.content-wrapper {
  display: flex; /* Sidebar y contenido al mismo nivel */
  flex: 1;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 20px;
}

</style>
