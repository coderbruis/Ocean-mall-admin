import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/create',
    component: () => import('@/views/product/product'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * 根据权限加载的路由-菜单路由
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },

  {
    path: '/table',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: 'TableExample', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'demo1',
        name: 'TableDemo1',
        component: () => import('@/views/table/index'),
        meta: { title: 'TableDemo1', icon: 'table' }
      }
    ]
  },

  // 用户管理
  {
    path: '/user-privileage',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '权限管理', icon: 'warning'
    },
    children: [
      {
        path: 'user-mgr',
        name: '用户管理',
        component: () => import('@/views/user-privileage/user-mgr/index'),
        meta: {
          title: '用户管理',
          icon: 'user-admin'
        }
      },
      {
        path: 'role-mgr',
        name: '角色管理',
        component: () => import('@/views/user-privileage/role-mgr/index'),
        meta: {
          title: '角色管理',
          icon: 'ums-role'
        }
      }
    ]
  },

  {
    path: '/product',
    component: Layout,
    // redirect: '/product/create',
    name: '商品管理',
    redirect: 'noRedirect',
    meta: { title: '商品管理', icon: 'el-icon-warning' },
    children: [
      {
        path: 'create',
        component: () => import('@/views/product/product'),
        name: 'PageCreate',
        meta: { title: '商品创建', icon: 'edit', roles: ['admin'] }
      },
      {
        path: 'create2',
        component: () => import('@/views/product/product'),
        meta: { title: '商品创建', icon: 'edit', roles: ['admin'] }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
