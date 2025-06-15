<!-- src/views/auth/NewPasswordView.vue -->
<template>
  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <v-card
      class="pa-6 text-center"
      max-width="400"
      rounded="lg"
      style="background: linear-gradient(to right, #a18cd1, #fbc2eb);"
      elevation="10"
    >
      <h3 class="mb-6 font-weight-bold text-h6 text-primary">RESTORE YOUR PASSWORD</h3>

      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.new_password"
          label="New Password"
          type="password"
          variant="outlined"
          color="deep-purple"
          class="mb-4"
        />
        <v-text-field
          v-model="form.confirm_password"
          label="Confirm Password"
          type="password"
          variant="outlined"
          color="deep-purple"
        />

        <v-btn
          type="submit"
          color="deep-purple-darken-2"
          class="mt-6 mb-4"
          block
          rounded
          :loading="loading"
        >
          RESTORE
        </v-btn>
      </v-form>

      <div>
        <RouterLink to="/login" class="text-decoration-underline text-sm">Login</RouterLink> |
        <RouterLink to="/signup" class="text-decoration-underline text-sm">Sign up</RouterLink>
      </div>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const form = ref({
  new_password: '',
  confirm_password: '',
})
const token = ref('')
const loading = ref(false)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

onMounted(() => {
  const urlToken = route.query.token
  if (!urlToken || typeof urlToken !== 'string') {
    snackbar.value = {
      show: true,
      text: 'Token inválido o faltante.',
      color: 'error',
    }
    setTimeout(() => router.push('/login'), 3000)
  } else {
    token.value = urlToken
  }
})

async function handleSubmit() {
  if (form.value.new_password !== form.value.confirm_password) {
    snackbar.value = {
      show: true,
      text: 'Las contraseñas no coinciden.',
      color: 'error',
    }
    return
  }

  loading.value = true
  try {
    const response = await fetch('http://localhost:3333/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token.value,
        new_password: form.value.new_password,
        confirm_password: form.value.confirm_password,
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error')

    snackbar.value = {
      show: true,
      text: 'Contraseña actualizada exitosamente.',
      color: 'success',
    }
    setTimeout(() => router.push('/login'), 2000)
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: error.message || 'Error al actualizar la contraseña.',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}
</script>
