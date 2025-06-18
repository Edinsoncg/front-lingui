const BASE_URL = 'http://localhost:3333/setting/inactive-user'

export default class InactiveUserService {
  static async getPaginated({
    page = 1,
    itemsPerPage = 10,
    sortBy = [] as { key: string; order: 'asc' | 'desc' }[],
    search = {} as { search?: string }
  }) {
    const token = localStorage.getItem('token')
    const sortKey = sortBy[0]?.key ?? 'first_name'
    const order = sortBy[0]?.order ?? 'asc'

    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      sortBy: sortKey,
      order,
    })

    if (search.search) {
      params.append('search', search.search)
    }

    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener usuarios inactivos')
    }

    const result = await response.json()
    return {
      items: result.data,
      total: result.total,
    }
  }

  static async restore(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/restore/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al restaurar usuario')
    }

    return response.json()
  }

  static async forceDelete(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/force/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al eliminar usuario permanentemente')
    }

    return response.json()
  }
}
