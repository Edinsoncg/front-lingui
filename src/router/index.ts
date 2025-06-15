import { createRouter, createWebHistory } from 'vue-router'
import { authSetStore } from '@/stores/AuthStore'
import SignView from '@/views/auth/SignView.vue'
import RestoreView from '@/views/auth/RestoreView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import SupportMaterialView from '@/views/SupportMaterialView.vue'
import AgendaView from '@/views/AgendaView.vue'
import NewPasswordView from '@/views/auth/NewPassword.vue'
import SettingUserView from '@/views/SettingUserView.vue'
import FollowAcademyView from '@/views/FollowAcademyView.vue'
import FollowContractView from '@/views/FollowContractView.vue'
import MyProfileView from '@/views/ProfileView.vue'
import StudentReportsView from '@/views/reports/students/StudentReportsView.vue'
import StudentReportDetailView from '@/views/reports/students/StudentReportDetailView.vue'
import ClassroomReportsView from '@/views/reports/classrooms/ClassroomReportsView.vue'
import ClassroomReportsDetailView from '@/views/reports/classrooms/ClassroomReportDetailView.vue'
import TeacherReportsView from '@/views/reports/teachers/TeacherReportsView.vue'
import TeacherReportDetailView from '@/views/reports/teachers/TeacherReportDetailView.vue'
import DashboardAdminView from '@/views/dashboard/DashboardAdminView.vue'
import DashboardReceptionistView from '@/views/dashboard/DashboardReceptionistView.vue'
import DashboardTeacherView from '@/views/dashboard/DashboardTeacherView.vue'
import DashboardStudentView from '@/views/dashboard/DashboardStudentView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'
import FormClassView from '@/views/crud/form-agenda-view.vue'
import ClassLayoutView from '@/layouts/ClassAgendaLayout.vue'
import ClassInformationView from '@/views/ClassInformationView.vue'
import ClassStudentsInformationView from '@/views/ClassStudentsInformationView.vue'
import ClassTeacherInformationView from '@/views/ClassTeacherInformationView.vue'

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
    path: '/newpassword',
    name: 'NewPassword',
    component: NewPasswordView,
    meta: {layout: 'AuthLayout'}
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {layout: 'AuthLayout'}
    },
    {
      path: '/dashboard/admin',
      name: 'DashboardAdmin',
      component: DashboardAdminView,
      meta: {layout: 'WireframeLayout', requiresAuth: true, roles: ['Administrativo'] }
    },
    {
      path: '/dashboard/receptionist',
      name: 'DashboardReceptionist',
      component: DashboardReceptionistView,
      meta: {layout: 'WireframeLayout', requiresAuth: true, roles: ['Recepcionista'] }
    },
    {
      path: '/dashboard/teacher',
      name: 'DashboardTeacher',
      component: DashboardTeacherView,
      meta: {layout: 'WireframeLayout', requiresAuth: true, roles: ['Profesor'] }
    },
    {
      path: '/dashboard/student',
      name: 'DashboardStudent',
      component: DashboardStudentView,
      meta: {layout: 'WireframeLayout', requiresAuth: true, roles: ['Estudiante'] }
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: AgendaView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/agenda/class-form',
      name: 'classroom-agenda',
      component: FormClassView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/progress/academic',
      name: 'progress-academic',
      component: FollowAcademyView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/progress/contract',
      name: 'progress-contract',
      component: FollowContractView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/profile',
      name: 'my-profile',
      component: MyProfileView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/support-material',
      name: 'support-material',
      component: SupportMaterialView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/report-student',
      name: 'report-student',
      component: StudentReportsView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/report/student/:code',
      name: 'report-student-detail',
      component: StudentReportDetailView,
      meta: {layout: 'WireframeLayout'},
      props: true
    },
    {
      path: '/report/classroom',
      name: 'report-classroom',
      component: ClassroomReportsView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/report/classroom/:id',
      name: 'report-classroom-detail',
      component: ClassroomReportsDetailView,
      meta: {layout: 'WireframeLayout'},
      props: true
    },
    {
      path: '/report/teacher',
      name: 'report-teacher',
      component: TeacherReportsView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/report/teacher/:id',
      name: 'report-teacher-detail',
      component: TeacherReportDetailView,
      meta: {layout: 'WireframeLayout'},
      props: true
    },
    {
      path: '/setting/user',
      name: 'setting-user',
      component: SettingUserView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
      meta: {layout: 'WireframeLayout'}
    },
    {
      path: '/clase/:id',
      component: ClassLayoutView,
      meta: {layout: 'WireframeLayout'},
      children: [
        {
          path: '',
          name: 'ClassInfoView',
          component: ClassInformationView,
        },
        {
          path: 'students',
          name: 'ClassStudentsView',
          component: ClassStudentsInformationView,
        },
        {
          path: 'teacher',
          name: 'ClassTeacherView',
          component: ClassTeacherInformationView,
        },
      ]
    },
  ],
})

  router.beforeEach((to, from, next) => {
    const auth = authSetStore()
    const isAuthenticated = !!auth.token
    const userRoles = auth.user?.roles || []

    // Requiere autenticación pero no hay token
    if (to.meta.requiresAuth && !isAuthenticated) {
      return next('/login')
    }

    // Requiere roles específicos
    if (to.meta.roles && isAuthenticated) {
      const allowedRoles = (to.meta.roles as string[]).map((r) => r.toUpperCase())
      const userRolesUpper = userRoles.map((r: string) => r.toUpperCase())

      const hasAccess = userRolesUpper.some((role) => allowedRoles.includes(role))
      if (!hasAccess) {
        return next('/unauthorized') // Redirige a página de acceso denegado
      }
    }

    next()
  })
export default router
