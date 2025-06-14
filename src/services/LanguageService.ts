const URL = 'http://localhost:3333/settings/languages'

export default class LanguageService {
  static async getAll() {
    const token = localStorage.getItem("token")
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }

  static async getById(id: number) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }

  static async create(data: { name: string; abbreviation: string }) {
    const token = localStorage.getItem("token")
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async update(id: number, data: Partial<{ name: string; abbreviation: string }>) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error actualizando idioma:', errorText)
    throw new Error('No se pudo actualizar el idioma')
  }

  return response.json()
}


  static async delete(id: number) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }

  static async getPaginated({
    page = 1,
    itemsPerPage = 10,
    sortBy = [] as { key: string; order: 'asc' | 'desc'}[],
    search = {} as { name?: string }
  }) {
    const token = localStorage.getItem("token")
    const sortKey = sortBy[0]?.key ?? 'name'
    const order = sortBy[0]?.order ?? 'asc'

    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      sortBy: sortKey,
      order,
    })

    if (search.name) {
      params.append('name', search.name)
    }

    const response = await fetch(`${URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener los idiomas')
    }

    const result = await response.json()
    return {
      items: result.data,
      total: result.total
    }
  }
}
