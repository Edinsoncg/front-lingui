const BASE_URL = 'http://localhost:3333/role-permission-item'

const token = localStorage.getItem('token') || ''

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
}

export default class PermissionAssignmentService {
  // 🔍 Obtener permisos actuales asignados para un rol y item
  static async show(roleId: number, itemId: number) {
    const response = await fetch(`${BASE_URL}/${roleId}/${itemId}`, {
      headers,
    })
    if (!response.ok) throw new Error('Error al obtener permisos asignados')
    return await response.json()
  }

  // 📋 Listar todas las asignaciones actuales (agrupadas)
  static async list(params: { role_id?: number; item_id?: number }) {
    const query = new URLSearchParams()
    if (params.role_id) query.append('role_id', String(params.role_id))
    if (params.item_id) query.append('item_id', String(params.item_id))

    const response = await fetch(`${BASE_URL}?${query}`, {
      headers,
    })
    if (!response.ok) throw new Error('Error al listar asignaciones')
    return await response.json()
  }

  // ✅ Asignar nuevos permisos
  static async assign(data: {
    role_id: number
    item_id: number
    permission_item_ids: number[]
  }) {
    const response = await fetch(`${BASE_URL}/assign`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Error al asignar permisos')
    return await response.json()
  }

  // ✏️ Actualizar todos los permisos asignados (reemplaza anteriores)
  static async update(data: {
    role_id: number
    item_id: number
    permission_item_ids: number[]
  }) {
    const response = await fetch(`${BASE_URL}/update`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Error al actualizar permisos')
    return await response.json()
  }

  // ❌ Eliminar permisos específicos
  static async remove(data: {
    role_id: number
    item_id: number
    permission_item_ids: number[]
  }) {
    const response = await fetch(`${BASE_URL}/remove`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Error al eliminar permisos')
    return await response.json()
  }
}
