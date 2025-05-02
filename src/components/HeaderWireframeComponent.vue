<script setup lang="ts">
import LogoComponent from './LogoComponent.vue';
import TopFooterComponent from './TopFooterComponent.vue';
import UserComponent from './UserComponent.vue';
</script>

<template>
  <header class="header">
    <logo-component class="logo" />
    <TopFooterComponent />
    <UserComponent />
  </header>
</template>


<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  padding: 1.5rem;
}

.logo {
height: 100px;
width: 250px;
}


button {
  background: #e74c3c;
  border: none;
  padding: 8px 12px;
  color: black;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background: #c0392b;
}

</style>
