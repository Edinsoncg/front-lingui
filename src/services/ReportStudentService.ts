// src/services/ReportStudentService.ts
const URL = 'http://147.93.114.138:8240/report/student'

export default class ReportStudentService {
  static async getAll(params: {
    page: number
    limit: number
    code?: string
    name?: string
  }) {
    const token = localStorage.getItem('token')

    const query = new URLSearchParams(params as any).toString()
    const response = await fetch(`${URL}?${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) throw new Error('Error al obtener datos')
    return await response.json()
  }

    static async getByCode(code: string) {
      const token = localStorage.getItem('token')

      const response = await fetch(`${URL}/${code}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al obtener detalle del estudiante')
      }

      return await response.json()
  }
}
