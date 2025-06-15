<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authSetStore } from '@/stores/AuthStore'

const router = useRouter()
const authStore = authSetStore()

const userImage = ref('https://secrecyjewels.es/blog/wp-content/uploads/2022/10/esencia-de-una-persona.jpg')

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
