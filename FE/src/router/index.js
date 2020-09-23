import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Trang chủ', icon: 'home' }
    }]
  },

  {
    path: '/statistic',
    component: Layout,
    meta: { title: 'Thống kê', icon: 'bar-chart' },
    children: [{
      path: 'statistic-user',
      name: 'Thống kê user',
      component: () => import('@/layout/components/statistic/StatisticByUser'),
      meta: { title: 'Theo người', icon: 'bar-chart' }
    },
    {
      path: 'statistic-dept',
      name: 'Thống kê dept',
      component: () => import('@/layout/components/statistic/StatisticByDept'),
      meta: { title: 'Theo đơn vị', icon: 'bar-chart' }
    }]
  },
  {
    path: '/notification',
    component: Layout,
    children: [{
      path: 'manage-noti',
      name: 'Manage Notification',
      component: () => import('@/layout/components/ManageNotification/ManageNoti'),
      meta: { title: 'Quản lý thông báo', icon: 'example' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/created-request',
    name: 'Quản lý chứng từ',
    alwaysShow: false,
    meta: { title: 'Quản lý chứng từ', icon: 'example', role: 'Creator' },
    children: [
      {
        path: 'created-request',
        name: 'Request',
        component: () => import('@/views/staff/S-Request'),
        meta: { title: 'Tạo yêu cầu', icon: 'form' }
      },
      {
        path: 'license-waiting',
        name: 'WaitApproval',
        component: () => import('@/views/staff/S-WaitApproval'),
        meta: { title: 'Đang xử lý', icon: 'stopwatch' }
      },
      {
        path: 'license-approved',
        name: 'Approved',
        component: () => import('@/views/staff/S-Approved'),
        meta: { title: 'Đã xử lý', icon: 'license-approved' }
      },
    ]
  },

  // approver
  {
    path: '/admin',
    component: Layout,
    name: "Quản trị",
    meta: { title: 'Quản trị', icon: 'example',role: 'Approver' },
    children: [
      {
        path: 'add-user',
        name: 'AddUser',
        component: () => import('@/views/admin/AddUser'),
        meta: { title: 'Thêm tài khoản', icon: 'add-user' }
      },
      {
        path: 'add-dept',
        name: 'AddDept',
        component: () => import('@/views/admin/AddDept'),
        meta: { title: 'Thêm đơn vị', icon: 'plus' }
      }
    ]
  },
  {
    path: '/director',
    component: Layout,
    name: 'Quản lý chứng từ',
    meta: {
      title: 'Quản lý chứng từ',
      icon: 'nested',
      role: 'Approver'
    },
    children: [
      {
        path: 'd-wait-approval',
        component: () => import('@/views/director/D-WaitApproval'),
        name: 'DwaitApproval',
        meta: { title: 'Đang chờ xử lý', icon: 'stopwatch' },
      },
      {
        path: 'd-approved',
        component: () => import('@/views/director/D-Approved'),
        meta: { title: 'Đã xử lý', icon: 'approved' }
      }
    ]
  },

  {
    path: '/accountant',
    component: Layout,
    name: 'Quản lý chứng từ',
    meta: {
      title: 'Quản lý thu chi',
      icon: 'nested',
      role: 'Accountant'
    },
    children: [
      {
        path: 'wait-spend',
        component: () => import('@/views/accountant/WaitSpend'),
        meta: { title: 'Chờ xử lý', icon: 'license' }
      },
      {
        path: 'spend-monney',
        component: () => import('@/views/accountant/SpendMonney'),
        name: 'DwaitApproval',
        meta: { title: 'Đã xử lý', icon: 'spending' },
      }
    ]
  },
]



const createRouter = () => {
  const vuex = JSON.parse(localStorage.getItem('vuex'))
  let routeByRole = []
  if (vuex) {
    const role = vuex.user.userInfos.role
    routeByRole = asyncRoutes.filter(route => route.meta.role === role)
  }
  const routes = [...constantRoutes, ...routeByRole]
  return new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
  })
}

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
