// src/services/ClassroomService.ts

const URL = 'http://localhost:3333/classroom'

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
