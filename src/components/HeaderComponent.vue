<script setup lang="ts">
  import FlagsComponent from './FlagsComponent.vue';
  import LogoComponent from './LogoComponent.vue';
</script>

<template>
<header>
  <LogoComponent />
  <div class="flags">
    <FlagsComponent imageUrl="reino-unido.png" />
    <FlagsComponent imageUrl="francia.png" />
    <FlagsComponent imageUrl="italia.png" />
    <FlagsComponent imageUrl="alemania.png" />
    <FlagsComponent imageUrl="brasil.png" />
  </div>
</header>
</template>

<style scoped>
header {
  margin: 0 auto;
  padding: 1.5rem;
}

.flags{
  display: flex;
  justify-content: space-between;
}
</style>
