<template>
  <v-container>
    <v-row class="mb-4" justify="center">
      <v-col cols="12" class="text-center">
        <AvatarComponent
          :image-path="teacherProfile"
          :size="300"
        />
      </v-col>
    </v-row>

    <v-row class="mb-4" align="stretch">
      <v-col
        v-for="(value, label) in teacherInfo"
        :key="label"
        cols="12"
        sm="4"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            :class="{ 'on-hover': isHovering }"
            :elevation="isHovering ? 12 : 2"
            v-bind="props"
            class="pa-4 text-center"
            color="purple-lighten-5"
          >
            <v-card-title class="text-uppercase font-weight-bold text-black">
              {{ label }}
            </v-card-title>
            <v-card-text class="text-h8 text-black">
              {{ value }}
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AgendaService from '@/services/AgendaService'
import AvatarComponent from '@/components/shared/AvatarComponent.vue'

const route = useRoute()
const classId = ref(Number(route.params.id))

const teacherInfo = ref<Record<string, string>>({})
const teacherProfile = ref<string | null>(null)

const fetchTeacherInfo = async () => {
  const data = await AgendaService.getById(classId.value)
  const classData = data[0]

  teacherProfile.value = classData.teacher?.user?.profilePicture ?? null

  teacherInfo.value = {
    Nombre: classData.teacher?.user?.firstName ?? 'Sin información',
    Apellido: classData.teacher?.user?.firstLastName ?? 'Sin información',
    'Número Celular': classData.teacher?.user?.phoneNumber ?? 'Sin información',
  }
}

onMounted(fetchTeacherInfo)
</script>
