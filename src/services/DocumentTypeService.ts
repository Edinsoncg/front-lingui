const URL = 'http://localhost:3333/document-type'

export default class DocumentoTypeService {
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
