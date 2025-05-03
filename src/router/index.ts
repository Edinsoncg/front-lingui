import { createRouter, createWebHistory } from 'vue-router'
import SignView from '@/views/SignView.vue'
import RestoreView from '@/views/RestoreView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SupportMaterialView from '@/views/SupportMaterialView.vue'

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
      meta: {layout: 'AuthLayout'}
    },
    {
      path: '/restore',
      name: 'restore',
      component: RestoreView,
      meta: {layout: 'AuthLayout'}
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {layout: 'AuthLayout'}
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/support-material',
      name: 'support-material',
      component: SupportMaterialView,
      meta: {layout: 'WireframeLayout'}
    },

  ],
})

export default router
