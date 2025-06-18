<script setup lang="ts">
import { authSetStore } from '@/stores/AuthStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = authSetStore()

const email = ref('')
const password = ref('')
const visible = ref(false)
const formRef = ref()
const formIsValid = ref(false)

const rules = {
  required: (v: string) => !!v || 'This field is required.',
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
  password: (v: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[\S]{6,}$/.test(v) ||
    'Password must be at least 6 characters.',
}

const handlerLogin = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })
  } catch (error: any) {
    const msg = error?.response?.data?.message || 'Invalid user credentials. Try again.'
    showSnackbar(msg)
  }
}

const snackbar = ref({
  show: false,
  message: '',
  color: 'error',
})

function showSnackbar(message: string, color = 'error') {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}
</script>

<template>
  <!-- Ilustraciones -->
  <img src="@/assets/characters/UK.png" class="character-img left-1" />
  <img src="@/assets/characters/FRANCE.png" class="character-img left-2" />
  <img src="@/assets/characters/GUI.png" class="character-img-pet left-3" />
  <img src="@/assets/characters/ITALY.png" class="character-img right-2" />
  <img src="@/assets/characters/BRAZIL.png" class="character-img right-1" />
  <img src="@/assets/characters/GERMANY.png" class="character-img right-3" />

  <!-- Card de login -->
  <div class="login-background d-flex justify-center">
    <v-card class="pa-6 login-card" width="300" rounded="lg" style="background: linear-gradient(to right, #a18cd1, #fbc2eb)">
      <h2 class="text-center mb-6 font-weight-bold">Log in to Güi</h2>

      <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handlerLogin">
        <v-text-field
          v-model="email"
          label="Email"
          placeholder="Insert your email"
          :rules="[rules.required, rules.email]"
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
          :rules="[rules.required]"
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
      </v-form>
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        location="top end"
      >
        {{ snackbar.message }}
      </v-snackbar>

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

.character-img-pet {
  position: absolute;
  height: 200px;
  z-index: 1;
}

.left-1 { left: -4%; bottom: 5%; }
.left-2 { left: 10%; bottom: 5%; }
.left-3 { left: 25%; bottom: 5%; }
.right-1 { right: -10%; bottom: 5%; }
.right-2 { right: 1%; bottom: 5%; }
.right-3 { right: 16%; bottom: 5%; }

.login-card {
  z-index: 2;
  background-color: #f8e9f8;
}
</style>
