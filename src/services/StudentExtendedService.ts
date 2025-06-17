const BASE_URL = 'http://localhost:3333/student/extended'

export default class StudentExtendedService {
  /**
   * Obtener datos extendidos por ID de usuario
   */
  static async getByUserId(userId: number) {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${BASE_URL}/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al obtener datos del estudiante')
      }

      return await response.json()
    } catch (error) {
      console.error('Error en getByUserId:', error)
      throw error
    }
  }

  /**
   * Guardar o actualizar datos extendidos
   */
  static async saveByUserId(userId: number, data: any) {
    const token = localStorage.getItem('token')

    try {
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
    } catch (error) {
      console.error('Error en saveByUserId:', error)
      throw error
    }
  }
}
