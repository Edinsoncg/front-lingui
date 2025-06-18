<template>
  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <v-card class="pa-6" max-width="400" elevation="3" rounded="lg" style="background: linear-gradient(to right, #a18cd1, #fbc2eb)">
      <h1 class="text-h5 font-weight-bold mb-4 text-center">Find your account</h1>

      <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="email"
          label="Email address"
          :rules="[rules.required, rules.email]"
          variant="outlined"
          density="compact"
          hide-details="auto"
          required
        />

        <v-btn
          type="submit"
          color="primary"
          class="mt-4 mx-auto d-block"
          rounded
          :loading="loading"
          :disabled="loading"
        >
          Search
        </v-btn>
      </v-form>

      <div class="text-center mt-4">
        <RouterLink to="/login" class="text-decoration-underline" style="color: #632093;">
          Do you remember your password?
        </RouterLink>
      </div>

      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        timeout="3000"
        location="top end"
      >
        {{ snackbarText }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RestoreService from '@/services/RestoreService'

const email = ref('')
const loading = ref(false)

const formRef = ref()
const formIsValid = ref(false)

// Snackbar
const snackbar = ref(false)
const snackbarColor = ref('success')
const snackbarText = ref('')

// Reglas de validación
const rules = {
  required: (v: string) => !!v || 'This field is required.',
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await RestoreService.requestPasswordReset(email.value)
    snackbarText.value = 'Recovery email sent successfully. Check your inbox.'
    snackbarColor.value = 'success'
    email.value = ''
  } catch (error: any) {
    snackbarText.value =
      error?.response?.data?.message || 'Unable to send recovery email. Please try again.'
    snackbarColor.value = 'error'
  } finally {
    snackbar.value = true
    loading.value = false
  }
}
</script>
