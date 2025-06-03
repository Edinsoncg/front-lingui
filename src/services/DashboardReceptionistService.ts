const URL = 'http://localhost:3333/dashboard/receptionist'

export interface TodayClass {
  time: string
  classroom: string
  level: string
  teacher: string
}

export interface DashboardReceptionistResponse {
  resumen: {
    total_students: number
    total_teachers: number
    today_classes: number
  }
  graficos: {
    attendance_by_month: Record<string, number>
    students_by_level: Record<string, number>
  }
  clases_hoy: TodayClass[]
}

export default class DashboardReceptionistService {
  static async getDashboard(): Promise<DashboardReceptionistResponse> {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener los datos del dashboard del recepcionista')
    }

    return await response.json()
  }
}
