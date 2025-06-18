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

      <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.new_password"
          label="New Password"
          type="password"
          :rules="[rules.required, rules.password]"
          variant="outlined"
          color="deep-purple"
          class="mb-4"
        />
        <v-text-field
          v-model="form.confirm_password"
          label="Confirm Password"
          type="password"
          :rules="[rules.required, rules.match]"
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

// Validations
const formRef = ref()
const formIsValid = ref(false)

const rules = {
  required: (v: string) => !!v || 'This field is required.',
  password: (v: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[\S]{6,}$/.test(v) ||
    'Password must be at least 6 characters and include uppercase, lowercase, number, and special character.',
  match: (v: string) =>
    v === form.value.new_password || 'Passwords do not match.',
}

onMounted(() => {
  const urlToken = route.query.token
  if (!urlToken || typeof urlToken !== 'string') {
    snackbar.value = {
      show: true,
      text: 'Invalid or missing token.',
      color: 'error',
    }
    setTimeout(() => router.push('/login'), 3000)
  } else {
    token.value = urlToken
  }
})

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

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
      text: 'Password updated successfully.',
      color: 'success',
    }
    setTimeout(() => router.push('/login'), 2000)
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: error.message || 'Error updating password.',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}
</script>
