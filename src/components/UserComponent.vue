<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado reactivo para controlar la visibilidad del menú desplegable
const isDropdownVisible = ref(false)

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value
}

const logout = () => {
  console.log('Cerrando sesión...')
  router.push('/login')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToSettings = () => {
  router.push('/settings')
}

const userImage = ref('https://secrecyjewels.es/blog/wp-content/uploads/2022/10/esencia-de-una-persona.jpg') // Aquí puedes poner la imagen del usuario
</script>

<template>
  <div class="user-info">
    <!-- Avatar de usuario -->
    <div class="user-avatar" @click="toggleDropdown">
      <img :src="userImage" alt="User Avatar" />
    </div>
    <!-- Menú desplegable -->
    <div v-if="isDropdownVisible" class="dropdown-menu">
      <ul>
        <li @click="goToProfile">My Profile</li>
        <li @click="goToSettings">Settings</li>
        <li @click="logout">Log Out</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

const router = useRouter()

const goToProfile = () => {
  router.push('/profile')
}

const goToSettings = () => {
  router.push('/settings')
}

const logout = () => {
  console.log('Cerrando sesión...')
  router.push('/login')
}
</script>

<style scoped>

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.user-avatar span {
  font-size: 24px;
}

.dropdown-menu {
  position: absolute;
  top: 110px;
  right: 0;
  border-radius: 5px;
  min-width: 150px;
  z-index: 10;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  padding: 10px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f4f4f4;
}


</style>
