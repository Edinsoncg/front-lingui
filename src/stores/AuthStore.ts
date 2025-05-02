import router from '@/router';
import { defineStore } from 'pinia';
import AuthService from '@/services/authService';

export const authSetStore = defineStore( 'auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'), // toDo:Se puede reventar al proteger las rutas por el NULL porque no es un JSON string válido
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(userData: { email: string; password: string }): Promise<void> {

      const auth = new AuthService
      const login = await auth.login(userData.email, userData.password)

      debugger
      if (login.errors?.[0]) {
        alert(login.errors[0].message)
      } else {
        const token = login.token

        this.token = token

        localStorage.setItem('token', token)

        router.push('/dashboard')
      }
  },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  },
})


