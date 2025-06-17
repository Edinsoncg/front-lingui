<template>
  <div class="pa-6">
    <!-- Botones de navegación -->
    <div class="d-flex mb-4">
      <v-btn
        :color="currentForm === 'profile' ? 'primary' : 'secondary'"
        @click="currentForm = 'profile'"
        class="mr-2"
      >
        Profile
      </v-btn>
      <v-btn
        :color="currentForm === 'password' ? 'primary' : 'secondary'"
        @click="currentForm = 'password'"
      >
        Password
      </v-btn>
    </div>

    <!-- Formulario dinámico -->
    <component :is="currentComponent" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProfileForm from './crud/form-profile-view.vue'
import PasswordForm from './crud/form-password-view.vue'

const currentForm = ref('profile')

const currentComponent = computed(() => {
  return currentForm.value === 'profile' ? ProfileForm : PasswordForm
})
</script>

<style scoped>
.v-btn {
  border-radius: 20px;
  font-weight: bold;
  text-transform: none;
}

button{
  margin: 1rem auto;
}
</style>

