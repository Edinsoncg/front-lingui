<!-- src/views/auth/LoginView.vue -->
<script setup lang="ts">
import { authSetStore } from '@/stores/AuthStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = authSetStore()
const email = ref('')
const password = ref('')
const visible = ref(false)

const handlerLogin = () => {
  if (!email.value || !password.value) {
    alert('Todos los campos son obligatorios')
  } else {
    authStore.login({ email: email.value, password: password.value })
  }
}
</script>

<template>
  <div class="d-flex align-center justify-center" style="min-height: 100">
    <v-card class="pa-10" w-100 width="400" elevation="12" rounded="lg">

      <h2 class="text-center mb-6 font-weight-bold">Log in to Güi</h2>

      <form @submit.prevent="handlerLogin">
        <v-text-field
          v-model="email"
          label="Email"
          placeholder="Insert your email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="compact"
          class="mb-4"
        />

        <v-text-field
          v-model="password"
          :type="visible ? 'text' : 'password'"
          label="Password"
          placeholder="Insert your password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="visible = !visible"
          variant="outlined"
          density="compact"
          class="mb-2"
        />

          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
          </v-card-text>

        <v-btn type="submit" color="purple" block size="large" class="mb-2">
          Login
        </v-btn>

        <div class="text-center mt-4">
          <Router-link to="/restore" class="text-blue text-caption">Forgot Password?</Router-link>
        </div>
      </form>
    </v-card>
  </div>
</template>
