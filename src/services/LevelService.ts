const URL = 'https://localhost:3333/levels'

export default class LevelService {
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Error while loading levels')
      return await response.json()
  }
}
