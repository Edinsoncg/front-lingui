const BASE_URL = 'http://localhost:3333/progress/contract'

export default class ContractProgressService {
  static async list(codigo: string) {
    const token = localStorage.getItem('token')
    const url = `${BASE_URL}?student_code=${encodeURIComponent(codigo)}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('No se pudo cargar el progreso')
    }

    return await response.json()
  }

  static async update(payload: {
    student_id: number
    new_status_id: number | null
    new_start_date: string
    new_contract_id: number | null
  }) {
    const token = localStorage.getItem('token')

    const response = await fetch(BASE_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error('No se pudo actualizar la información')
    return await response.json()
  }
}
