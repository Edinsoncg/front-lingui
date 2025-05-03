//const BASE_URL = 'http://localhost:3333/support-material'

export default class SupportMaterialService {


  static async getAll() {
    debugger
    const token = localStorage.getItem("token")
    const response = await fetch('http://localhost:3333/support-material', {

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
    const response = await fetch('http://localhost:3333/support-material/:id', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }

  static async create(data: {
    name: string
    level_id: number
    description: string
    link: string
  }) {
    const token = localStorage.getItem("token")
    const response = await fetch('http://localhost:3333/support-material', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async update(id: number, data: Partial<{
    name: string
    level_id: number
    description: string
    link: string
  }>) {
    const token = localStorage.getItem("token")
    const response = await fetch('http://localhost:3333/support-material/:id', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async delete(id: number) {
    const token = localStorage.getItem("token")
    const response = await fetch('http://localhost:3333/support-material/:id', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }
}
