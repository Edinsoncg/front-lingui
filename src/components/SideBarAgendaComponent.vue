<template>
  <v-navigation-drawer
    app
    class="bg-purple-lighten-4"
    theme="dark"
    permanent
  >
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-information" title="Información Clase" value="informacionclase"
        :active="currentSection === 'ClassInfoView'"
        @click="goTo('info')"
        class="text-black font-weight-bold"
      >
      </v-list-item>
      <v-list-item prepend-icon="mdi-account-group" title="Información Estudiantes" value="informacionestudiantes"
        :active="currentSection === 'ClassStudentsView'"
        @click="goTo('students')"
        class="text-black font-weight-bold">
      </v-list-item>
      <v-list-item prepend-icon="mdi-account-tie" title="Información Profesor" value="informacionprofesor"
        :active="currentSection === 'ClassTeacherView'"
        @click="goTo('teacher')"
        class="text-black font-weight-bold"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

// Función para navegar a la vista seleccionada en el sidebar
function goTo(section: 'info' | 'students' | 'teacher') {
  router.push({
    name: section === 'info' ? 'ClassInfoView' : section === 'students' ? 'ClassStudentsView' : 'ClassTeacherView',
    params: { id: route.params.id }
  })
}

// Computed para verificar la ruta activa
const currentSection = computed(() => {
  // Se compara el nombre de la ruta activa (con o sin rutas hijas)
  if (route.name) {
    if (route.name === 'ClassInfoView' || route.name === 'ClassStudentsView' || route.name === 'ClassTeacherView') {
      return route.name
    }
  }
  return ''
})
</script>

<style scoped>
.v-navigation-drawer {
  height: 100vh;
  width: 240px;
}
</style>
