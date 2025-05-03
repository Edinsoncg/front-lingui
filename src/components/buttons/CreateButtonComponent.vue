<script setup lang="ts">

import { defineComponent } from 'vue';

</script>

<template>
  <button>
    <Router-link to="/">CREATE</Router-link>
  </button>
</template>

<style scoped>
  button {
    padding: 10px;
    background-color: #632093;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    width: 150px;
    display: block;
    margin: 15px auto;
  }

  button:hover {
    background-color: #7e21c0;
  }
</style>
