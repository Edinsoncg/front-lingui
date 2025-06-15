// src/services/AgendaService.ts

const BASE_URL = 'http://localhost:3333/agenda'

export default class AgendaService {
  static async getAll(date: string) {
    if (!date) throw new Error('La fecha es obligatoria')
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Error al obtener sesiones')
    return response.json()
  }


  static async getById(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Sesión no encontrada')
    return response.json()
  }

  static async create(data: any) {
    const token = localStorage.getItem('token')
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Error al crear la sesión')
    return response.json()
  }

  static async update(id: number, data: any) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Error al actualizar la sesión')
    return response.json()
  }

  static async delete(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Error al eliminar la sesión')
    return response.json()
  }
}
