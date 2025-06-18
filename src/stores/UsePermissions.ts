// src/stores/usePermissions.ts
import { ref } from 'vue'
import { authSetStore } from '@/stores/AuthStore'

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
 * Devuelve el menú jerárquico agrupado por parent_id y ordenado
 */
export const getMenu = () => {
  const grouped: Record<number, any> = {}

  for (const { item, permissions } of menuItems.value) {
    if (!permissions.includes('view')) continue

    // Obtener todos los roles del usuario en minúscula
    const auth = authSetStore()
    const roles = (auth.user?.roles || []).map((r: string) => r.toLowerCase())

    // Ajustar ruta del dashboard según el rol
    let to = item.url
    if (item.url === '/dashboard') {
      if (roles.includes('administrativo')) {
        to = '/dashboard/admin'
      } else if (roles.includes('recepcionista')) {
        to = '/dashboard/receptionist'
      } else if (roles.includes('profesor')) {
        to = '/dashboard/teacher'
      } else if (roles.includes('estudiante')) {
        to = '/dashboard/student'
      } else {
        to = '/unauthorized'
      }
    }

    const formattedItem = {
      id: item.id,
      title: item.name,
      icon: item.icon,
      to,
      children: [],
      permissions,
    }

    if (!item.parent_id) {
      grouped[item.id] = formattedItem
    } else {
      if (!grouped[item.parent_id]) {
        const parent = menuItems.value.find((i) => i.item.id === item.parent_id)?.item
        if (parent) {
          grouped[item.parent_id] = {
            id: parent.id,
            title: parent.name,
            icon: parent.icon,
            to: '',
            children: [],
            permissions: [],
          }
        }
      }
      grouped[item.parent_id]?.children.push(formattedItem)
    }
  }

  // Orden personalizado del menú principal
  const customOrder = [
    'Dashboard',
    'Agenda',
    'Mi Perfil',
    'Mi Seguimiento',
    'Material de Soporte',
    'Reportes',
    'Soporte',
    'Configuración',
  ]

  // Orden personalizado de hijos
  const customChildOrder: Record<string, string[]> = {
    'Mi Seguimiento': ['Académico', 'Contrato'],
    'Reportes': ['Estudiantes', 'Salones', 'Profesores'],
    'Configuración': ['Usuarios', 'Usuarios Inactivos', 'Permisos', 'Lenguaje y Notificaciones'],
  }

  for (const key in grouped) {
    const group = grouped[key]
    const childOrder = customChildOrder[group.title]
    if (group.children?.length && childOrder) {
      group.children.sort(
        (a, b) => childOrder.indexOf(a.title) - childOrder.indexOf(b.title)
      )
    }
  }

  return Object.values(grouped).sort(
    (a, b) => customOrder.indexOf(a.title) - customOrder.indexOf(b.title)
  )
}


export const usePermissions = () => ({
  fetchMenu,
  hasPermission,
  getMenu,
  menuItems,
})
