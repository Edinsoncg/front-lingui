<script setup lang="ts">
  const props = defineProps<{
    imageUrl: string
  }>()
  const imageSrc = new URL(`../assets/${props.imageUrl}`, import.meta.url).href
</script>

<template>
  <img :src="imageSrc" alt="Lingui logo" class="logo" />
</template>

<style scoped>
  .logo {
    width: 350px;
    height: 150px;
    display: flex;
    place-items: center;
  }
</style>
