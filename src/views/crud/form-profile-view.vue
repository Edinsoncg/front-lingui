<template>
  <v-card flat class="pa-6" color="#f4eafd">
    <v-row align="center">
      <!-- Avatar -->
      <v-col cols="12" md="3" class="text-center">
        <v-avatar size="120" class="mx-auto">
          <v-img :src="profile.profilePictureUrl || defaultAvatar" cover />
        </v-avatar>
        <v-file-input
          v-model="profilePicture"
          accept="image/*"
          prepend-icon="mdi-camera"
          hide-details
          density="compact"
          class="mt-2"
        />
      </v-col>

      <!-- Formulario -->
      <v-col cols="12" md="4">
        <v-text-field
          v-model="profile.firstName"
          label="Nombre"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          density="compact"
          color="purple"
        />
        <v-text-field
          v-model="profile.middleName"
          label="Segundo Nombre"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          density="compact"
          color="purple"
        />
        <v-text-field
          v-model="profile.firstLastName"
          label="Apellido"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          density="compact"
          color="purple"
        />
        <v-text-field
          v-model="profile.secondLastName"
          label="Segundo Apellido"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          density="compact"
          color="purple"
        />
        <v-text-field
          v-model="profile.email"
          label="Correo Electrónico"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          density="compact"
          color="purple"
        />
        <v-text-field
          v-model="profile.phoneNumber"
          label="Teléfono"
          prepend-inner-icon="mdi-phone"
          variant="outlined"
          density="compact"
          color="purple"
        />

        <v-btn color="primary" class="mt-3" style="width: auto" @click="save">
          Guardar cambios
        </v-btn>
      </v-col>
    </v-row>

    <!-- Snackbar personalizado -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top end">
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProfileService from '@/services/MyProfileService'

const profile = ref<any>({})
const profilePicture = ref<File | null>(null)
const defaultAvatar = '/default-avatar.png'

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

onMounted(async () => {
  const data = await ProfileService.getProfile()
  profile.value = {
    firstName: data.firstName || '',
    middleName: data.middleName || '',
    firstLastName: data.firstLastName || '',
    secondLastName: data.secondLastName || '',
    email: data.email || '',
    phoneNumber: data.phoneNumber || '',
    profilePictureUrl: data.profilePictureUrl || null,
  }
})

async function save() {
  try {
    const form = new FormData()
    form.append('first_name', profile.value.firstName)
    form.append('middle_name', profile.value.middleName || '')
    form.append('first_last_name', profile.value.firstLastName)
    form.append('second_last_name', profile.value.secondLastName || '')
    form.append('email', profile.value.email)
    form.append('phone_number', profile.value.phoneNumber)

    if (profilePicture.value) {
      form.append('profile_picture', profilePicture.value)
      const reader = new FileReader()
      reader.onload = (event: any) => {
        profile.value.profilePictureUrl = event.target.result
      }
      reader.readAsDataURL(profilePicture.value)
    }

    await ProfileService.updateProfile(form)
    showSnackbar('Perfil actualizado con éxito 🎉')
  } catch (error) {
    console.error(error)
    showSnackbar('Error al actualizar perfil', 'error')
  }
}
</script>
