// src/services/StudentClassService.ts

const URL = 'http://147.93.114.138:8240/agenda/students'

export default class StudentAttendanceService {

  // Obtener todos los estudiantes de una clase
  static async getAll(classroom_session_id: number, page = 1, limit = 10, studentCode?: string) {
    const token = localStorage.getItem("token")
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (studentCode) {
      params.append('student_code', studentCode)  // Filtro por código de estudiante
    }

    const response = await fetch(`${URL}/${classroom_session_id}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }

  // Obtener un estudiante por su ID
  static async getById(classroom_session_id: number, student_id: number) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${URL}/${classroom_session_id}/${student_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }

  // Agregar un estudiante a la clase
  static async addStudentToClass(classroom_session_id: number, student_code: string) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${URL}/${classroom_session_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ student_code }),
    })

    const result = await response.json()

    if (!response.ok) {
      // Lanza error para que el frontend lo capture en el `catch`
      throw { response: { data: result } }
    }

    return result
  }

  // Eliminar un estudiante de la clase
  static async removeStudentFromClass(classroom_session_id: number, student_id: number) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${URL}/${classroom_session_id}/${student_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }

  // Obtener estudiantes con paginación, filtros y orden
  static async getPaginated(classroom_session_id: number, {
    page = 1,
    itemsPerPage = 10,
    search = {} as { student_code?: string },
  }) {
    const token = localStorage.getItem("token")

    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
    })

    if (search.student_code) {
      params.append('student_code', search.student_code)  // Filtro por código de estudiante
    }

    const response = await fetch(`${URL}/${classroom_session_id}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener los estudiantes de la clase')
    }

    const result = await response.json()
    return {
      items: result.data,
      total: result.total
    }
  }
}
