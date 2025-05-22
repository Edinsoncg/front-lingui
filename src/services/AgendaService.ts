// src/services/agendaService.ts

const URL = 'http://localhost:3333/agenda'

export default class AgendaService {

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

  static async create(data: {
    name: string
    capacity: number
    house_id: number
  }) {
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

  static async update(id: number, data: Partial<{
    name: string
    capacity: number
    house_id: number
  }>) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${URL}/${id}`, {
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
    const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }

}
