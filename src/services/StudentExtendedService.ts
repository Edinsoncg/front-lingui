const BASE_URL = 'http://localhost:3333/student/extended'

export default class StudentExtendedService {
  /**
   * Obtener datos extendidos por ID de usuario
   */
  static async getByUserId(userId: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener datos extendidos del estudiante')
    }

    return await response.json()
  }

  /**
   * Actualizar o crear datos extendidos
   */
  static async saveByUserId(userId: number, data: any) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al guardar los datos extendidos')
    }

    return await response.json()
  }
}
