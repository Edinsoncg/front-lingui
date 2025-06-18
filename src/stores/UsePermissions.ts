// src/stores/usePermissions.ts
import { ref } from 'vue'

const menuItems = ref<any[]>([])

export const fetchMenu = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch('http://localhost:3333/menu', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Error al cargar menú')
    menuItems.value = await response.json()
  } catch (error) {
    console.error('Error al cargar menú:', error)
    menuItems.value = []
  }
}

/**
 * Verifica si el usuario tiene un permiso sobre una ruta
 */
export const hasPermission = (path: string, permission: string) => {
  const item = menuItems.value.find((i) => i.item.url === path)
  return item?.permissions?.includes(permission) ?? false
}

/**
 * Devuelve el menú jerárquico agrupado por parent_id
 */
export const getMenu = () => {
  const grouped: Record<number, any> = {}

  for (const { item, permissions } of menuItems.value) {
    if (!permissions.includes('view')) continue

    // Convertir item a formato esperado por Vuetify
    let to = item.url
    if (item.url === '/dashboard') {
      const role = localStorage.getItem('role') || ''
      switch (role.toUpperCase()) {
        case 'ADMINISTRATIVO':
          to = '/dashboard/admin'
          break
        case 'RECEPCIONISTA':
          to = '/dashboard/receptionist'
          break
        case 'PROFESOR':
          to = '/dashboard/teacher'
          break
        case 'ESTUDIANTE':
          to = '/dashboard/student'
          break
      }
    }

    const formattedItem = {
      id: item.id,
      title: item.name,
      icon: item.icon,
      to,
      children: [],
    }

    if (!item.parent_id) {
      grouped[item.id] = formattedItem
    } else {
      // Asegurar que el padre exista antes de asignar hijos
      if (!grouped[item.parent_id]) {
        grouped[item.parent_id] = {
          id: item.parent_id,
          title: '',
          icon: '',
          to: '',
          children: [],
        }
      }
      grouped[item.parent_id].children.push(formattedItem)
    }
  }

  // Solo retornar elementos con title (padres con subitems o ítems principales)
  return Object.values(grouped).filter(item => item.title || item.children.length)
}

export const usePermissions = () => ({
  fetchMenu,
  hasPermission,
  getMenu,
  menuItems,
})
