const URL = 'http://localhost:3333/settings/roles'

export default class RoleService {
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Error while loading roles')
    return await response.json()
  }

  static async getPaginated({
    page = 1,
    itemsPerPage = 10,
    sortBy = [] as { key: string; order: 'asc' | 'desc' }[],
    search = {} as { name?: string }
  }) {
    const token = localStorage.getItem('token')
    const sortKey = sortBy[0]?.key ?? 'name'
    const order = sortBy[0]?.order ?? 'asc'

    const params = new URLSearchParams({
      page: String(page),
      limit: String(itemsPerPage),
      sortBy: sortKey,
      order,
    })

    if (search.name) {
      params.append('name', search.name)
    }

    const response = await fetch(`${URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener los roles')
    }

    const result = await response.json()
    return {
      items: result.data,
      total: result.total,
    }
  }

  static async create(data: { name: string }) {
    const token = localStorage.getItem('token')
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  static async update(id: number, data: { name: string }) {
    const token = localStorage.getItem('token')
    const res = await fetch(`${URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  static async delete(id: number) {
    const token = localStorage.getItem('token')
    const res = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    return res.json()
  }
}
