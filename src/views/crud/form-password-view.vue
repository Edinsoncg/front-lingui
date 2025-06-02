<template>
  <v-container class="d-flex justify-center" fluid>
    <v-card class="pa-6 elevation-3" max-width="600px" width="100%" color="#f4eafd" rounded="lg">
      <v-text-field
        v-model="form.old_password"
        label="Contraseña Actual"
        type="password"
        density="compact"
        prepend-inner-icon="mdi-lock"
      />
      <v-text-field
        v-model="form.new_password"
        label="Nueva Contraseña"
        type="password"
        density="compact"
        prepend-inner-icon="mdi-lock-outline"
      />
      <v-text-field
        v-model="form.confirm_password"
        label="Confirmar Contraseña"
        type="password"
        density="compact"
        prepend-inner-icon="mdi-lock-check"
      />
      <v-btn color="primary" class="d-flex mt-4" style="width: auto;" @click="cambiarPassword">
        Actualizar Contraseña
      </v-btn>

      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        location="top end"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfilePasswordService from '@/services/MyProfilePasswordService'

const form = ref({
  old_password: '',
  new_password: '',
  confirm_password: '',
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

function showSnackbar(message: string, color: string = 'success') {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

async function cambiarPassword() {
  if (!form.value.old_password || !form.value.new_password || !form.value.confirm_password) {
    showSnackbar('Todos los campos son obligatorios', 'error')
    return
  }

  try {
    await ProfilePasswordService.updatePassword({
      current_password: form.value.old_password,
      new_password: form.value.new_password,
      confirm_password: form.value.confirm_password,
    })

    showSnackbar('Contraseña actualizada con éxito')
    form.value.old_password = ''
    form.value.new_password = ''
    form.value.confirm_password = ''
  } catch (error: any) {
    showSnackbar(error.message, 'error')
  }
}
</script>
