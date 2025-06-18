// src/services/ItemService.ts
const URL = 'http://localhost:3333/items'

export default class ItemService {
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al cargar los items')
    }

    return await response.json()
  }
}
