// src/services/RestoreService.ts
const URL = 'http://localhost:3333/forgot-password'

export default class RestoreService {
  static async requestPasswordReset(email: string) {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error enviando el correo.')
    }

    return data
  }
}
