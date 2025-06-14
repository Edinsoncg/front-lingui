import { createRouter, createWebHistory } from 'vue-router'
import SignView from '@/views/auth/SignView.vue'
import RestoreView from '@/views/auth/RestoreView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SupportMaterialView from '@/views/SupportMaterialView.vue'
import AgendaView from '@/views/AgendaView.vue'
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
import ClassroomView from '@/views/settings/SettingClassroomView.vue'
import SettingHouseView from '@/views/settings/SettingHouseView.vue'
import SettingLanguageView from '@/views/settings/SettingLanguageView.vue'
import SettingRoleView from '@/views/settings/SettingRoleView.vue'
import SettingDocumentTypeView from '@/views/settings/SettingDocumentTypeView.vue'
import SettingStatusView from '@/views/settings/SettingStatusView.vue'

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
      path: '/agenda',
      name: 'agenda',
      component: AgendaView,
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
      path: '/setting/classrooms',
      name: 'classrooms',
      component: ClassroomView,
      meta: { layout: 'WireframeLayout' },
    },
    {
      path: '/setting/houses',
      name: 'houses',
      component: SettingHouseView,
      meta: { layout: 'WireframeLayout' },
    },
     {
      path: '/setting/languages',
      name: 'languages',
      component: SettingLanguageView,
      meta: { layout: 'WireframeLayout' },
    },
    {
      path: '/setting/role',
      name: 'setting-role',
      component: SettingRoleView,
      meta: { layout: 'WireframeLayout' },
    },
    {
      path: '/settings/document-types',
      name: 'SettingDocumentTypeView',
      component: SettingDocumentTypeView,
      meta: { layout: 'WireframeLayout' },
    },
    {
      path: '/setting/status',
      name: 'setting-status',
      component: SettingStatusView,
      meta: { layout: 'WireframeLayout' },
    },
  ],
})

export default router
