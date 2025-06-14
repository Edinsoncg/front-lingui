const URL = 'http://localhost:3333/status'
const CRUD_URL = 'http://localhost:3333/settings/status'

export default class StatusService {
  // 🔹 Obtener todo (sin paginación)
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Error while loading levels')
    return await response.json()
  }

  // 🔹 Obtener con paginación simulada en frontend
  static async getPaginated({
    page = 1,
    itemsPerPage = 10,
    sortBy = [] as { key: string; order: 'asc' | 'desc' }[],
    search = {} as { name?: string }
  }) {
    const allItems = await this.getAll()

    // 🔍 Filtro
    let filtered = allItems
    if (search.name) {
      const searchTerm = search.name.toLowerCase()
      filtered = allItems.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm)
      )
    }

    // 🔃 Ordenamiento
    const sortKey = sortBy[0]?.key ?? 'name'
    const order = sortBy[0]?.order ?? 'asc'
    filtered.sort((a: any, b: any) => {
      const aVal = a[sortKey]?.toString().toLowerCase() ?? ''
      const bVal = b[sortKey]?.toString().toLowerCase() ?? ''
      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    })

    // 📄 Paginación
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedItems = filtered.slice(start, end)

    return {
      items: paginatedItems,
      total: filtered.length,
    }
  }

  // 🔹 Crear
  static async create(data: { name: string }) {
    const token = localStorage.getItem('token')
    const response = await fetch(CRUD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return await response.json()
  }

  // 🔹 Actualizar
  static async update(id: number, data: { name: string }) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${CRUD_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return await response.json()
  }

  // 🔹 Eliminar
  static async delete(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${CRUD_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    return await response.json()
  }
}
