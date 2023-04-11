import { createPinia } from 'pinia'
import { useUserStore } from './modules/user'

// 创建Pinia实例
const pinia = createPinia()

// 定义useStore函数，用于返回所有的store实例
export const useStore = () => {
    return {
        // 获取userStore实例
        user: useUserStore(pinia)
        // 如果有其他的store modules，可以在这里添加
    }
}

// 导出Pinia实例和useStore函数
export default pinia