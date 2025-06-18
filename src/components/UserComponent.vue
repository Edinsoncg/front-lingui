<script setup lang="ts">
import { useRouter } from 'vue-router'
import { authSetStore } from '@/stores/AuthStore'
import { computed } from 'vue'
import guiDefault from '@/assets/characters/GUI.png'

const router = useRouter()
const authStore = authSetStore()

const userImage = computed(() => {
  const image = authStore.user?.profile_picture
  return image
    ? `http://localhost:3333/${image}`
    : guiDefault
})

const goToProfile = () => router.push('/profile')
const handlerLogOut = () => authStore.logout()
</script>

<template>
  <v-menu
    offset-y
    location="bottom end"
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <div style="margin: 0 1rem 0 1rem;">
        <v-avatar
          v-bind="props"
          class="cursor-pointer"
          size="50"
          color="white"
        >
          <v-img :src="userImage" alt="Avatar" />
        </v-avatar>
      </div>
    </template>

    <v-list elevation="8" class="rounded-lg">
      <v-list-item @click="goToProfile" title="My Profile" prepend-icon="mdi-account" />
      <v-list-item @click="handlerLogOut" title="Log Out" prepend-icon="mdi-logout" />
    </v-list>
  </v-menu>
</template>
