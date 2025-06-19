const URL = 'http://147.93.114.138:8240/profile'

export default class ProfileService {

  static async getProfile() {
    const token = localStorage.getItem("token")
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  }

  static async updateProfile(data: FormData) {
    const token = localStorage.getItem("token")
    const response = await fetch(URL, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: data
    })
    return response.json()
  }
}
