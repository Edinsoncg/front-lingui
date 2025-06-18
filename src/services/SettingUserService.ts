const URL = 'http://localhost:3333/setting/user'

export default class UserService {
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  }

  static async getById(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  }

  static async create(data: {
    first_name: string
    middle_name?: string
    first_last_name: string
    second_last_name: string
    document_type_id: number
    document_number: string
    email: string
    password: string
    phone_number: string
    workday_id?: number | null
    role_ids: number[]
    language_ids: number[]
  }) {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async update(id: number, data: Partial<{
    first_name: string
    middle_name?: string
    first_last_name: string
    second_last_name: string
    document_type_id: number
    document_number: string
    email: string
    password?: string
    phone_number: string
    workday_id?: number | null
    role_ids: number[]
    language_ids: number[]
  }>) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async delete(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  }

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

    const response = await fetch(`${URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener los usuarios')
    }

    const result = await response.json()
    return {
      items: result.data,
      total: result.total,
    }
  }
}
