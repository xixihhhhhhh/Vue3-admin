import { createPinia } from 'pinia'
import { useUserStore } from './modules/user'
import { useTagsStore } from './modules/tagsview'
import { useAppStore } from './modules/app'
import { usePermissionStore } from './modules/permission'
import { useSettingStore } from './modules/settings'

// 创建Pinia实例
const pinia = createPinia()

// 定义useStore函数，用于返回所有的store实例
export const useStore = () => {
    return {
        // 获取userStore实例
        user: useUserStore(pinia),
        // 获取appStore实例
        app: useAppStore(pinia),
        // 获取tagsStore实例
        tagsView: useTagsStore(pinia),
        // 获取permissionStore实例
        permission: usePermissionStore(pinia),
        // 获取permissionStore实例
        settings: useSettingStore(pinia)
        // 如果有其他的store modules，可以在这里添加
    }
}

// 导出Pinia实例和useStore函数
export default pinia