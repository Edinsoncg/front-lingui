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
    <!-- Ilustraciones -->
    <img src="@/assets/characters/UK.png" class="character-img left-1" />
    <img src="@/assets/characters/FRANCE.png" class="character-img left-2" />
    <img src="@/assets/characters/ITALY.png" class="character-img right-2" />
    <img src="@/assets/characters/BRAZIL.png" class="character-img right-1" />
    <img src="@/assets/characters/GERMANY.png" class="character-img right-3" />

    <!-- Card de login -->
      <div class="login-background d-flex justify-center">
        <v-card class="pa-10 login-card" width="300" rounded="lg" color="deep-purple-lighten-4">
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
              Warning: After 3 consecutive failed login attempts, your account will be temporarily locked.
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

<style scoped>
.login-background {
  min-height: auto;
  position: relative;
  background: #f8e9f8;
  overflow: hidden;
  width: 100%;
}

.character-img {
  position: absolute;
  height: 500px;
  z-index: 1;
}

.left-1 { left: -4%; }
.left-2 { left: 10%; }
.right-1 { right: -10%; }
.right-2 { right: 1%; }
.right-3 { right: 16%; }

.login-card {
  z-index: 2;
  background-color: #f8e9f8;
}
</style>
