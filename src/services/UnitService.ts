const URL = 'http://147.93.114.138:8240/unit'

export default class UnitService {
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Error while loading units')
      return await response.json()
  }
}
