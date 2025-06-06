<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import FooterComponent from '@/components/FooterComponent.vue'
  import HeaderComponent from '@/components/HeaderComponent.vue';
</script>

<template>
  <div class="app-container">
    <HeaderComponent />

    <section class="main-content">
      <RouterView />
    </section>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  font-family: Arial, sans-serif;
  width: 100%;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: flex;
  place-items: center;
  margin: 0 auto 2rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8e9f8;
  text-align: center;
  width: 100%;
}
</style>
