<template>
  <v-container
    class="fill-height d-flex justify-center align-center"
    fluid
  >
    <v-card flat class="pa-6 elevation-3" max-width="960" color="#f4eafd" rounded="lg">
      <v-row>
        <!-- Columna del avatar -->
        <v-col cols="12" md="5" class="text-center mt-6">
          <v-avatar size="200" class="mx-auto">
            <v-img
              :src="getImageUrl()"
              :key="imageKey"
              cover
              @error="onImageError"
            />
          </v-avatar>
          <v-file-input
            v-model="profilePicture"
            accept="image/*"
            prepend-icon="mdi-camera"
            hide-details
            density="compact"
            class="mt-3"
            @change="handleImagePreview"
          />
        </v-col>

        <!-- Columna del formulario -->
        <v-col cols="12" md="7" class="mt-5">
          <v-row>
            <!-- Campos -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.firstName"
                label="Nombre"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="compact"
                color="purple"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.middleName"
                label="Segundo Nombre"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="compact"
                color="purple"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.firstLastName"
                label="Apellido"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="compact"
                color="purple"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.secondLastName"
                label="Segundo Apellido"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="compact"
                color="purple"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.email"
                label="Correo Electrónico"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="compact"
                color="purple"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.phoneNumber"
                label="Teléfono"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                density="compact"
                color="purple"
              />
            </v-col>
            <v-col cols="12" class="text-right">
              <v-btn color="primary" @click="save" style="width: auto;">
                Guardar cambios
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Snackbar -->
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
import { ref, onMounted} from 'vue'
import ProfileService from '@/services/MyProfileService'

const profilePicture = ref<File | null>(null)
const defaultAvatar = '/default-avatar.png'
const previewUrl = ref<string | null>(null)
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333'
const imageKey = ref(Date.now())

interface UserProfile {
  firstName: string
  middleName: string
  firstLastName: string
  secondLastName: string
  email: string
  phoneNumber: string
  profilePicture: string | null
}

const profile = ref<UserProfile>({
  firstName: '',
  middleName: '',
  firstLastName: '',
  secondLastName: '',
  email: '',
  phoneNumber: '',
  profilePicture: null,
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

function handleImagePreview() {
  if (!profilePicture.value) {
    previewUrl.value = null
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    const target = event.target as FileReader
    previewUrl.value = target.result as string
  }
  reader.readAsDataURL(profilePicture.value)
}

function getImageUrl() {
  if (previewUrl.value) return previewUrl.value
  if (profile.value.profilePicture) return `${baseUrl}/${profile.value.profilePicture}?t=${imageKey.value}`
  return defaultAvatar
}

function onImageError() {
  previewUrl.value = null
  profile.value.profilePicture = null
  imageKey.value = Date.now()
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
    profilePicture: data.profilePicture || null,
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
    }

    const response = await ProfileService.updateProfile(form)

    if (response.user.profile_picture) {
      profile.value.profilePicture = response.user.profile_picture
      imageKey.value = Date.now()
    } else {
      previewUrl.value = null
    }

    profilePicture.value = null
    showSnackbar('Perfil actualizado con éxito')
  } catch (error) {
    console.error(error)
    showSnackbar('Error al actualizar perfil', 'error')
  }
}
</script>
