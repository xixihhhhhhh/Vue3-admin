/*
 * @Description: 权限
 * @Author: ZY
 * @Date: 2020-12-28 09:12:46
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-27 19:36:01
 */

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { useI18n } from 'vue-i18n'
import router from '@/router'
import { useStore } from './stores'
import { ElMessage } from 'element-plus'
import whiteList from './config/default/whitelist'
// import settings from '@/config/default/setting.config'
NProgress.configure({ showSpinner: false })



router.beforeEach(async (to: RouteLocationNormalized, _: RouteLocationNormalized, next: any) => {

  NProgress.start()
  const store = useStore()

  if (useStore().user.token) {
    if (to.path === '/login') {

      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: RouteLocationNormalized) => {
  console.log(to)
  NProgress.done()

})
