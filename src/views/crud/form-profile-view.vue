<template>
  <v-container class="fill-height d-flex justify-center align-center" fluid>
    <v-card flat class="pa-6 elevation-3" max-width="960" color="#f4eafd" rounded="lg">
      <v-row>
        <!-- Columna del avatar -->
        <v-col cols="12" md="5" class="text-center mt-6">
          <v-avatar size="200" class="mx-auto" color="white">
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
          <v-form ref="formRef" v-model="formIsValid">
            <v-row>
              <!-- Campos -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.firstName"
                  label="Nombre"
                  :rules="[rules.required, rules.name]"
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
                  :rules="[rules.name]"
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
                  :rules="[rules.required, rules.name]"
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
                  :rules="[rules.required, rules.name]"
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
                  :rules="[rules.required, rules.email]"
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
                  :rules="[rules.required, rules.phone]"
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
          </v-form>
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
import { ref, onMounted } from 'vue'
import ProfileService from '@/services/MyProfileService'
import { authSetStore } from '@/stores/AuthStore'

const authStore = authSetStore()
const profilePicture = ref<File | null>(null)
const defaultAvatar = '/default-avatar.png'
const previewUrl = ref<string | null>(null)
const baseUrl = import.meta.env.VITE_API_URL || 'http://147.93.114.138:8240'
const imageKey = ref(Date.now())
const formRef = ref()
const formIsValid = ref(false)

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

// Validación frontend antes de enviar
async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) {
    showSnackbar('Revisa los campos del formulario', 'error')
    return
  }

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
    debugger
    console.log('🧪 user:', response.user)
    if (response.user.profilePicture) {
      const newUrl = response.user.profilePicture
      profile.value.profilePicture = newUrl
      authStore.setUserImage(newUrl) // 🔥 aquí actualiza el avatar
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

// Validation rules
const rules = {
  required: (v: string) => !!v || 'This field is required',
  name: (v: string) =>
    (!v || (v.length >= 3 && v.length <= 20)) ? true : 'Must be between 1 and 20 characters',
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Must be a valid email address',
  phone: (v: string) =>
    /^\d{10}$/.test(v) || 'Must be exactly 10 digits',
}

</script>
