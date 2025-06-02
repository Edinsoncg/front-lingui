// src/services/ReportTeacherService.ts
const BASE_URL = 'http://localhost:3333/report/teacher'

export default class ReportTeacherService {
  static async getAll({ page = 1, limit = 10, search = '' }) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener los profesores')
    }

    return response.json()
  }

  static async getById(id: number) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener detalle del profesor')
    }

    return response.json()
  }
}
