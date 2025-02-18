import { createRouter, createWebHistory } from 'vue-router'
import SignView from '@/views/SignView.vue'
import RestoreView from '@/views/RestoreView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/sign',
      name: 'sign',
      component: SignView,
    },
    {
      path: '/restore',
      name: 'restore',
      component: RestoreView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
