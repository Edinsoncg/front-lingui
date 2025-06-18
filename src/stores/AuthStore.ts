import router from '@/router'
import { defineStore } from 'pinia'
import AuthService from '@/services/AuthService'

// Función para redirigir al dashboard según el rol principal del usuario
function getDashboardRouteByRole(role: string): string {
  switch (role.toUpperCase()) {
    case 'ADMINISTRATIVO':
      return '/dashboard/admin'
    case 'RECEPCIONISTA':
      return '/dashboard/receptionist'
    case 'PROFESOR':
      return '/dashboard/teacher'
    case 'ESTUDIANTE':
      return '/dashboard/student'
    default:
      return '/login' // fallback si no se encuentra un rol válido
  }
}

export const authSetStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(userData: { email: string; password: string }): Promise<void> {
      const auth = new AuthService()
      const login = await auth.login(userData.email, userData.password)

      if (login.errors?.[0]) {
        throw new Error(login.errors[0].message)
      } else {
        const token = login.token.token
        const user = login.user
        console.log('Usuario recibido:', user)

        this.token = token
        this.user = user

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)

        // Obtenemos el rol principal (asumimos que siempre hay al menos uno)
        const mainRole = user.roles?.[0] || 'ESTUDIANTE'
        const route = getDashboardRouteByRole(mainRole)
        router.push(route)
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.push('/login')
    },

    setUserImage(newUrl: string) {
      if (this.user) {
        this.user.profile_picture = newUrl
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    }
  }
})
