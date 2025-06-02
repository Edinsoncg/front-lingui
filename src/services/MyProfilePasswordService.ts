const URL = 'http://localhost:3333/profile/password'

export default class ProfilePasswordService {
  static async updatePassword(data: {
    current_password: string
    new_password: string
    confirm_password: string
  }) {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'PATCH', // puedes usar POST si prefieres
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al actualizar contraseña')
    }

    return response.json()
  }
}
