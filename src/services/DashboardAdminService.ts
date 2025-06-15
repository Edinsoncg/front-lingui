const API_URL = 'http://localhost:3333/dashboard/admin'

export interface UserData {
  firstName: string
  middleName: string | null
  firstLastName: string
  secondLastName: string
  profilePicture: string | null
  email: string
  phoneNumber: string
}

export interface StudentNotification {
  id: number
  userId: number
  studentCode: string
  statusId: number
  createdAt: string
  updatedAt: string
  user: UserData
}

export interface ContractNotification {
  id: number
  studentId: number
  contractId: number
  startDate: string
  endDate: string
  student: {
    id: number
    studentCode: string
    user: UserData
  }
  contract: {
    id: number
    name: string
    monthAmount: number
    hourAmountContract: number
    hourAmountWeek: number
  }
}

export interface DashboardResponse {
  resumen: {
    total_students: number
    total_teachers: number
    total_contracts: number
    today_classes: number
  }
  graficos: {
    attendance_by_month: Record<string, number>
    students_by_level: Record<string, number>
  }
  notificaciones: {
    newStudents: StudentNotification[]
    expiring_contracts: ContractNotification[]
  }
}

export default class DashboardAdminService {
  static async getDashboard(): Promise<DashboardResponse> {
    const token = localStorage.getItem('token')
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Error al cargar el dashboard')
    }

    return await res.json()
  }
}
