// 导入定义store的方法
import { defineStore } from 'pinia'

// 获取token
const getToken = () => localStorage.getItem('token')

// 定义用户信息接口
interface User {
    name: string
    email: string
    token: string
    roleLevel: number
}

// 定义用户store
export const useUserStore = defineStore({
    // 定义store的id
    id: 'user',
    // 定义store的state，用户信息初始值为null
    state: (): { user: User | null } => ({
        user: {
            name: '',
            email: '',
            token: getToken() || '',
            roleLevel: 1,
        }
    }),
    // 定义store的action，设置用户信息
    actions: {
        setUser(user: User) {
            this.user = user
        }
    }
})