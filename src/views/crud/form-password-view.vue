<template>
  <v-card flat class="pa-4" color="#f4eafd">
    <v-text-field
      v-model="form.old_password"
      label="Contraseña Actual"
      type="password"
    />
    <v-text-field
      v-model="form.new_password"
      label="Nueva Contraseña"
      type="password"
    />
    <v-text-field
      v-model="form.confirm_password"
      label="Confirmar Contraseña"
      type="password"
    />
    <v-btn color="primary" @click="cambiarPassword">Actualizar Contraseña</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  old_password: '',
  new_password: '',
  confirm_password: '',
})

function cambiarPassword() {
  // Aquí irá el servicio cuando lo tengas listo
  if (form.value.new_password !== form.value.confirm_password) {
    alert('Las contraseñas no coinciden')
    return
  }
  alert('Contraseña actualizada (simulado)')
}
</script>
