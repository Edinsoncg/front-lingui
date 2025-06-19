const URL = 'http://147.93.114.138:8240/dashboard/teacher'

export default class DashboardTeacherService {
  static async getDashboard() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al obtener el dashboard del profesor')
    }

    return response.json()
  }
}
