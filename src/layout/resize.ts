/*
 * @Description: 根绝大小变化重新布局
 * @Author: ZY
 * @Date: 2020-12-17 15:37:56
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-28 16:29:49
 */
// refer to Bootstrap's responsive design

import { useStore } from '@/stores'
import { DeviceType } from '@/stores/modules/app'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
const store = useStore()
const WIDTH = 992 // refer to Bootstrap's responsive design

export default function () {
  const device = computed(() => {
    return store.app.device
  })

  const sidebar = computed(() => {
    return store.app.sidebar
  })

  const currentRoute = useRoute()
  const watchRouter = watch(() => currentRoute.name, () => {
    if (store.app.device === DeviceType.Mobile && store.app.sidebar.opened) {
      store.app.setSidebar(false)
    }
  })

  const isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  const resizeMounted = () => {
    if (isMobile()) {
      store.app.setDevice(DeviceType.Mobile)
      store.app.setSidebar(true)
    }
  }

  const resizeHandler = () => {
    if (!document.hidden) {
      store.app.setDevice(isMobile() ? DeviceType.Mobile : DeviceType.Desktop)
      if (isMobile()) {
        store.app.setSidebar(true)
      }
    }
  }
  const addEventListenerOnResize = () => {
    window.addEventListener('resize', resizeHandler)
  }

  const removeEventListenerResize = () => {
    window.removeEventListener('resize', resizeHandler)
  }

  return {
    device,
    sidebar,
    resizeMounted,
    addEventListenerOnResize,
    removeEventListenerResize,
    watchRouter
  }
}
