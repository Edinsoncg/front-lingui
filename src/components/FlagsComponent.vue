<script setup lang="ts">
  const props = defineProps<{
    imageUrl: string
  }>()
  const imageSrc = new URL(`../assets/${props.imageUrl}`, import.meta.url).href
</script>

<template>
  <img :src="imageSrc" alt="Flags Image" class="flags-image" />
</template>

<style scoped>
  .flags-image {
    width: 35px;
    height: 35px;
  }
</style>
