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

const email = ref('')

function handleSubmit() {
  // Aquí se llamaría al servicio de AdonisJS para enviar el correo de recuperación
  console.log('Email submitted:', email.value)
}
</script>
