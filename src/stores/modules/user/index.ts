// 导入定义store的方法
import { defineStore } from 'pinia'
import { removeToken, setToken } from '@/utils/cookies'

// 定义用户store
export const useUserStore = defineStore({
    // 定义store的id
    id: 'user',
    // 定义store的state，用户信息初始值为null
    state: () => ({
        name: '',
        email: '',
        roleLevel: 1,
        avatar: '',
        token: '',
        roles: ''
    }),
    // 定义store的action，设置用户信息
    actions: {
        setEmail(email: string) {
            this.email = email
        },
        setName(name: string) {
            this.name = name
        },
        setToken(token: string) {
            this.token = token
        },
        setRoleLevel(roleLevel: number){
            this.roleLevel = roleLevel
        },
        setAvatar(avatar: string) {
            this.avatar = avatar
        }
    }
})