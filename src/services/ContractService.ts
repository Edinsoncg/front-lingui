const URL = 'http://147.93.114.138:8240/contract'

export default class ContractService {
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Error while loading levels')
      return await response.json()
  }
}
