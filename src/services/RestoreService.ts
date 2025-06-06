export async function sendRestoreLink(email: string) {
  const response = await fetch('http://localhost:3333/password/forgot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!response.ok) throw new Error('Error al enviar el link')
  return response.json()
}

export async function resetPassword(token: string, password: string) {
  const response = await fetch('http://localhost:3333/password/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  })
  if (!response.ok) throw new Error('Error al cambiar contraseña')
  return response.json()
}
