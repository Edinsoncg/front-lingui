<template>
  <v-container>
    <h2 class="text-h5 mb-4">Asignación de Permisos</h2>

    <v-row class="mb-4" dense>
      <v-col cols="12" sm="6">
        <v-select
          v-model="selectedRoleId"
          :items="roles"
          item-title="name"
          item-value="id"
          label="Seleccionar Rol"
          density="comfortable"
          :loading="loading"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-select
          v-model="selectedItemId"
          :items="items"
          item-title="name"
          item-value="id"
          label="Seleccionar Ítem"
          density="comfortable"
          :loading="loading"
        />
      </v-col>
    </v-row>

    <v-card v-if="permissions.length" class="pa-4 mb-4">
      <h3 class="text-h6 mb-2">Permisos disponibles:</h3>
      <v-checkbox
        v-for="perm in permissions"
        :key="perm.id"
        v-model="selectedPermissionItemIds"
        :label="`${perm.permission.label}`"
        :value="perm.id"
        :prepend-icon="perm.permission.icon"
        density="comfortable"
      />
    </v-card>

    <v-btn
      color="primary"
      @click="savePermissions"
      :disabled="!selectedRoleId || !selectedItemId || loading"
    >
      Guardar Permisos
    </v-btn>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :color="snackbarColor"
      location="top right"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RoleService from '@/services/RoleService'
import ItemService from '@/services/ItemService'
import PermissionAssignmentService from '@/services/PermissionAssignmentService'

// Estados principales
const loading = ref(false)
const roles = ref<any[]>([])
const items = ref<any[]>([])
const permissions = ref<any[]>([])
const selectedRoleId = ref<number | null>(null)
const selectedItemId = ref<number | null>(null)
const selectedPermissionItemIds = ref<number[]>([])

// Snackbar
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

function showSnackbar(message: string, color: string = 'success') {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

// Cargar roles e items
const fetchRolesAndItems = async () => {
  loading.value = true
  try {
    roles.value = await RoleService.getAll()
    items.value = await ItemService.getAll()
  } catch (error) {
    showSnackbar('Error al cargar roles e ítems', 'error')
  } finally {
    loading.value = false
  }
}

// Cargar permisos asignados al seleccionar rol + item
watch([selectedRoleId, selectedItemId], async () => {
  if (!selectedRoleId.value || !selectedItemId.value) return

  try {
    const res = await PermissionAssignmentService.show(
      selectedRoleId.value,
      selectedItemId.value
    )
    permissions.value = res.allPermissions ?? []
    selectedPermissionItemIds.value = (res.assignedPermissions ?? []).map((p: any) => p.id)
  } catch (error) {
    showSnackbar('Error al cargar permisos asignados', 'error')
  }
})

// Guardar cambios
const savePermissions = async () => {
  try {
    await PermissionAssignmentService.update({
      role_id: selectedRoleId.value!,
      item_id: selectedItemId.value!,
      permission_item_ids: selectedPermissionItemIds.value
    })
    showSnackbar('Permisos actualizados correctamente', 'success')
  } catch (error) {
    showSnackbar('Error al actualizar permisos', 'error')
  }
}

fetchRolesAndItems()
</script>
