// src/services/DashboardStudentService.ts

const URL = 'http://147.93.114.138:8240/dashboard/student'

export default class DashboardStudentService {
  static async getDashboard() {
    const token = localStorage.getItem('token')

    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al cargar dashboard del estudiante')
    }

    return response.json()
  }
}
