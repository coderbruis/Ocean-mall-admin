import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

// progress加载的右侧小圆环
NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 白名单路由，不受权限控制
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// 每个路由调用前调用
router.beforeEach(async(to, from, next) => {
  // 加载进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // token从cookie中获取
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 已经登录成功，则直接跳转至首页
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 判断用户是否有角色，并判断角色长度
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          debugger
          // 获取角色信息，角色信息是一个数组对象，例如['admin']或者是['debeloper','editor']
          const { roles } = await store.dispatch('user/getInfo')
          debugger

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 每个路由调用后调用
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
