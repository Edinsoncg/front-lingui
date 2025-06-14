<template>
  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <v-card class="pa-6" max-width="400" elevation="3" color="#f4eafd" rounded="lg">
      <h1 class="text-h5 font-weight-bold mb-4 text-center">Find your account</h1>

      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="email"
          label="Email or mobile number"
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
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RestoreService from '@/services/RestoreService'

const email = ref('')
const loading = ref(false)

// Snackbar
const snackbar = ref(false)
const snackbarColor = ref('success')
const snackbarText = ref('')

async function handleSubmit() {
  loading.value = true
  try {
    await RestoreService.requestPasswordReset(email.value)
    snackbarText.value = 'Correo enviado exitosamente. Revisa tu bandeja de entrada.'
    snackbarColor.value = 'success'
    snackbar.value = true
    email.value = ''
  } catch (error: any) {
    snackbarText.value = error.message || 'No se pudo enviar el correo.'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}
</script>

