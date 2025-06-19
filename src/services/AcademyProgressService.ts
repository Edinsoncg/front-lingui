const BASE_URL = 'http://localhost:3333/progress/academic'

export default class AcademyProgressService {
  /**
   * Consulta el progreso académico de un estudiante por código
   */
  static async getByStudentCode(studentCode: string) {
    const token = localStorage.getItem('token')
    const url = `${BASE_URL}?student_code=${encodeURIComponent(studentCode)}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('No se pudo obtener el progreso académico')
    }

    return await response.json()
  }

  /**
   * Marca un componente como completado
   */
  static async completeComponent({ student_id, unit_component_id }: { student_id: string; unit_component_id: string }) {
    const token = localStorage.getItem('token')
    await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ student_id, unit_component_id }),
    })
  }

  /**
   * Desmarca un componente como completado (via query string)
   */
  static async uncompleteComponent({ student_id, unit_component_id }: { student_id: string; unit_component_id: string }) {
    const token = localStorage.getItem('token')
    const url = `${BASE_URL}?student_id=${student_id}&unit_component_id=${unit_component_id}`

    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  }

    /**
   * Guarda todos los cambios del progreso (marcados y desmarcados)
   */
  static async saveChanges({ student_id, changes }: { student_id: string; changes: unknown }) {
    const token = localStorage.getItem('token')
    const url = `${BASE_URL}/save`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ student_id, changes }),
    })

    if (!response.ok) {
      throw new Error('Error al guardar los cambios de progreso')
    }

    return await response.json()
  }
}
