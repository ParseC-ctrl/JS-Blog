import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false })
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasGetUserInfo = store.getters.user
  if (to.meta.auth) {
    if (hasGetUserInfo) {
      next()
    } else {
      const hasToken = localStorage.getItem('adminToken')
      if (hasToken) {
        try {
          await store.dispatch('user/getInfo')
          next();
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error('登陆过期，请重新登陆')
          next(`/login?redirect=${to.path}`)
        }
      } else {
        Message.error('不存在token，请重新登陆')
        next(`/login?redirect=${to.path}`)
      }
    }
  } else {
    if (to.path === '/login' && hasGetUserInfo) {
      next({ path: '/' })
    } else {
      next();
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
