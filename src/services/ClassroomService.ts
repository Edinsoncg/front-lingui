// src/services/ClassroomService.ts

const URL = 'http://147.93.114.138:8240/classroom'

export default class ClassroomService {

  static async getAll() {
    const token = localStorage.getItem("token")
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
    return response.json()
  }
}
